import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings, STORAGE_DIR, UPLOAD_DIR, SYNTH_DIR, SAMPLE_DIR
from app.database import init_db
from app.api.detection import router as detection_router
from app.api.simulation import router as simulation_router
from app.api.history import router as history_router
from app.api.insights import router as insights_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    await init_db()
    print(f"[*] VoxShield AI Backend initialized. Database ready at {STORAGE_DIR}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title="VoxShield AI — API",
    description="Multilingual AI Voice Clone Detection & Impersonation Prevention System (SIH26104)",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(detection_router)
app.include_router(simulation_router)
app.include_router(history_router)
app.include_router(insights_router)

# Audio File Streaming Endpoints
@app.get("/api/audio/files/{filename}")
async def get_audio_file(filename: str):
    """
    Serves audio files from uploads, synthesized, or sample directories.
    """
    safe_filename = os.path.basename(filename)
    
    # Check sample files
    sample_path = SAMPLE_DIR / safe_filename
    if sample_path.exists():
        return FileResponse(str(sample_path), media_type="audio/wav")
        
    # Check synthesized files
    synth_path = SYNTH_DIR / safe_filename
    if synth_path.exists():
        return FileResponse(str(synth_path), media_type="audio/wav")

    # Check upload files
    upload_path = UPLOAD_DIR / safe_filename
    if upload_path.exists():
        return FileResponse(str(upload_path), media_type="audio/wav")

    raise HTTPException(status_code=404, detail="Audio file not found.")

@app.get("/api/audio/sample/{filename}")
async def get_sample_audio(filename: str):
    safe_filename = os.path.basename(filename)
    path = SAMPLE_DIR / safe_filename
    if path.exists():
        return FileResponse(str(path), media_type="audio/wav")
    raise HTTPException(status_code=404, detail="Sample audio not found.")

@app.get("/api/audio/uploads/{filename}")
async def get_uploaded_audio(filename: str):
    safe_filename = os.path.basename(filename)
    path = UPLOAD_DIR / safe_filename
    if path.exists():
        return FileResponse(str(path), media_type="audio/wav")
    raise HTTPException(status_code=404, detail="Uploaded audio not found.")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "sih_problem": settings.SIH_PROBLEM_STATEMENT,
        "mode": "PRODUCTION_BASELINE_ENFORCE"
    }
