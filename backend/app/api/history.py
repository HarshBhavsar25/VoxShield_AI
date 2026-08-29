import os
import json
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete

from app.database import get_db
from app.models.detection import AnalysisRecord
from app.schemas.detection import DetectionResponse, HistoryItemResponse, AcousticFeatures, TechnicalDetails

router = APIRouter(prefix="/api", tags=["History & Reports"])

@router.get("/history/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """
    Returns aggregated dashboard telemetry: total analyses, AI voices detected,
    human voices, and high-risk alerts.
    """
    result = await db.execute(select(AnalysisRecord).order_by(desc(AnalysisRecord.created_at)))
    records = result.scalars().all()

    total = len(records)
    ai_count = sum(1 for r in records if r.result == "AI_GENERATED")
    human_count = sum(1 for r in records if r.result == "HUMAN")
    uncertain_count = sum(1 for r in records if r.result == "UNCERTAIN")
    high_risk_count = sum(1 for r in records if r.risk_level == "HIGH")

    # Group by language
    lang_dist = {}
    for r in records:
        lang_dist[r.language] = lang_dist.get(r.language, 0) + 1

    # Recent activity items
    recent_activity = []
    for r in records[:8]:
        recent_activity.append({
            "id": r.id,
            "filename": r.filename,
            "language": r.language,
            "result": r.result,
            "ai_probability": r.ai_probability,
            "human_probability": r.human_probability,
            "risk_level": r.risk_level,
            "confidence": r.confidence,
            "date": r.created_at.isoformat() if r.created_at else ""
        })

    return {
        "total_analyses": total,
        "ai_voices_detected": ai_count,
        "human_voices": human_count,
        "uncertain_count": uncertain_count,
        "high_risk_alerts": high_risk_count,
        "language_distribution": lang_dist,
        "recent_activity": recent_activity
    }

@router.get("/history", response_model=List[HistoryItemResponse])
async def get_history(
    filter_by: Optional[str] = Query("all", pattern="^(all|human|ai|uncertain|high_risk)$"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves detection logs with optional filtering.
    """
    query = select(AnalysisRecord).order_by(desc(AnalysisRecord.created_at))
    
    if filter_by == "human":
        query = query.where(AnalysisRecord.result == "HUMAN")
    elif filter_by == "ai":
        query = query.where(AnalysisRecord.result == "AI_GENERATED")
    elif filter_by == "uncertain":
        query = query.where(AnalysisRecord.result == "UNCERTAIN")
    elif filter_by == "high_risk":
        query = query.where(AnalysisRecord.risk_level == "HIGH")

    result = await db.execute(query)
    records = result.scalars().all()

    return [
        HistoryItemResponse(
            id=r.id,
            filename=r.filename,
            audio_url=r.audio_url,
            language=r.language,
            language_code=r.language_code,
            result=r.result,
            ai_probability=r.ai_probability,
            human_probability=r.human_probability,
            risk_level=r.risk_level,
            confidence=r.confidence,
            duration=r.duration,
            created_at=r.created_at
        )
        for r in records
    ]

@router.get("/report/{id}", response_model=DetectionResponse)
async def get_detection_report(id: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieves a complete detection audit report by ID.
    """
    result = await db.execute(select(AnalysisRecord).where(AnalysisRecord.id == id))
    r = result.scalar_one_or_none()
    
    if not r:
        raise HTTPException(status_code=404, detail="Detection record not found.")

    indicators = json.loads(r.indicators) if r.indicators else []
    raw_acoustic = json.loads(r.acoustic_features) if r.acoustic_features else {}
    acoustic_features = AcousticFeatures(**raw_acoustic)
    
    raw_tech = json.loads(r.technical_details) if r.technical_details else {}
    technical_details = TechnicalDetails(**raw_tech)

    return DetectionResponse(
        id=r.id,
        filename=r.filename,
        audio_url=r.audio_url,
        duration=r.duration,
        file_size=r.file_size,
        language=r.language,
        language_code=r.language_code,
        language_confidence=r.language_confidence,
        result=r.result,
        ai_probability=r.ai_probability,
        human_probability=r.human_probability,
        confidence=r.confidence,
        risk_level=r.risk_level,
        indicators=indicators,
        explanation=r.explanation or "",
        technical_details=technical_details,
        acoustic_features=acoustic_features,
        created_at=r.created_at
    )

@router.delete("/history/{id}")
async def delete_history_record(id: str, db: AsyncSession = Depends(get_db)):
    """
    Privacy & Biometric Data Compliance: Permanently deletes detection record and audio sample.
    """
    result = await db.execute(select(AnalysisRecord).where(AnalysisRecord.id == id))
    r = result.scalar_one_or_none()
    
    if not r:
        raise HTTPException(status_code=404, detail="Record not found.")

    # Delete local file if it exists in uploads/synthesized
    if r.file_path and os.path.exists(r.file_path) and "sample_data" not in r.file_path:
        try:
            os.remove(r.file_path)
        except Exception:
            pass

    await db.delete(r)
    await db.commit()
    return {"message": "Biometric record and associated audio successfully deleted.", "id": id}
