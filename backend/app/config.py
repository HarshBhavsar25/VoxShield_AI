import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
SYNTH_DIR = STORAGE_DIR / "synthesized"
SAMPLE_DIR = BASE_DIR / "app" / "sample_data" / "files"

for directory in [STORAGE_DIR, UPLOAD_DIR, SYNTH_DIR, SAMPLE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    APP_NAME: str = "VoxShield AI"
    APP_VERSION: str = "1.0.0"
    SIH_PROBLEM_STATEMENT: str = "SIH26104"
    TAGLINE: str = "Detect. Verify. Defend Against AI Voice Impersonation."
    
    DATABASE_URL: str = f"sqlite+aiosqlite:///{STORAGE_DIR / 'voxshield.db'}"
    SYNC_DATABASE_URL: str = f"sqlite:///{STORAGE_DIR / 'voxshield.db'}"
    
    # Audio Processing Config
    SAMPLE_RATE: int = 16000
    MAX_AUDIO_DURATION_SEC: float = 60.0
    MAX_FILE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS: set = {"wav", "mp3", "m4a", "ogg", "flac", "webm"}
    
    # ML Classification Thresholds
    AI_THRESHOLD: float = 0.65
    UNCERTAIN_LOW: float = 0.40
    UNCERTAIN_HIGH: float = 0.65
    
    # Supported Languages for SIH26104
    SUPPORTED_LANGUAGES: dict = {
        "en": {"name": "English", "native": "English", "code": "en"},
        "hi": {"name": "Hindi", "native": "हिन्दी", "code": "hi"},
        "mr": {"name": "Marathi", "native": "मराठी", "code": "mr"},
        "bn": {"name": "Bengali", "native": "বাংলা", "code": "bn"},
        "ta": {"name": "Tamil", "native": "தமிழ்", "code": "ta"},
        "te": {"name": "Telugu", "native": "తెలుగు", "code": "te"},
        "gu": {"name": "Gujarati", "native": "ગુજરાતી", "code": "gu"},
        "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "code": "kn"}
    }

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
