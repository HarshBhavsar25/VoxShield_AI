import os
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings, UPLOAD_DIR
from app.database import get_db
from app.models.detection import SimulationRecord
from app.schemas.detection import (
    SimulationRequest,
    SimulationResponse,
    ScriptGenerateRequest,
    ScriptGenerateResponse
)
from app.core.synthesizer import voice_synthesizer

router = APIRouter(prefix="/api", tags=["Attack Simulation"])

@router.post("/script/generate", response_model=ScriptGenerateResponse)
async def generate_simulation_script(payload: ScriptGenerateRequest):
    """
    Generates a controlled demonstration scenario and script in the selected Indian language.
    """
    res = voice_synthesizer.generate_script(
        language=payload.language,
        scenario_type=payload.scenario_type
    )
    return ScriptGenerateResponse(
        language=res["language"],
        language_code=res["language_code"],
        scenario=res["scenario"],
        script=res["script"],
        english_translation=res["english_translation"]
    )

@router.post("/voice/simulate", response_model=SimulationResponse)
async def simulate_voice_cloning(
    language: str = Form("Marathi"),
    script: str = Form(...),
    source_voice: UploadFile = File(None),
    source_voice_id: str = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Module A: Controlled Attack Simulation Lab.
    Demonstrates how voice impersonation attacks operate by generating synthetic speech
    from an authorized sample and script, clearly tagged as AI-GENERATED.
    """
    if not script.strip():
        raise HTTPException(status_code=400, detail="Script text cannot be empty.")

    source_path = None
    source_filename = None

    if source_voice:
        ext = source_voice.filename.split(".")[-1].lower() if "." in source_voice.filename else "wav"
        unique_id = uuid.uuid4().hex[:10]
        source_filename = f"source_{unique_id}.{ext}"
        source_path = str(UPLOAD_DIR / source_filename)
        contents = await source_voice.read()
        with open(source_path, "wb") as f:
            f.write(contents)
    elif source_voice_id:
        candidates = list(UPLOAD_DIR.glob(f"*{source_voice_id}*"))
        if candidates:
            source_path = str(candidates[0])
            source_filename = candidates[0].name

    # Synthesize Synthetic Cloned Voice
    try:
        wav_path, wav_filename, duration = voice_synthesizer.synthesize_voice(
            script=script,
            language=language,
            source_audio_path=source_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice synthesis simulation failed: {str(e)}")

    audio_url = f"/api/audio/files/{wav_filename}"
    
    # Save Simulation Record in Database
    rec_id = str(uuid.uuid4())
    record = SimulationRecord(
        id=rec_id,
        source_voice_filename=source_filename,
        generated_voice_filename=wav_filename,
        generated_audio_path=wav_path,
        audio_url=audio_url,
        language=language,
        language_code=settings.SUPPORTED_LANGUAGES.get(language.lower(), {}).get("code", "mr"),
        script_text=script,
        duration=round(duration, 2),
        status="AI-GENERATED DEMONSTRATION AUDIO"
    )
    
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return SimulationResponse(
        id=rec_id,
        source_voice_filename=source_filename,
        generated_voice_filename=wav_filename,
        audio_url=audio_url,
        language=language,
        language_code=record.language_code,
        script_text=script,
        duration=round(duration, 2),
        status=record.status,
        created_at=record.created_at
    )
