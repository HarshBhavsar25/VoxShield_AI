import os
from pathlib import Path
from typing import List, Union, Dict, Set
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
SYNTH_DIR = STORAGE_DIR / "synthesized"
SAMPLE_DIR = BASE_DIR / "app" / "sample_data" / "files"

for directory in [STORAGE_DIR, UPLOAD_DIR, SYNTH_DIR, SAMPLE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra="ignore",
        env_file=".env",
        env_file_encoding="utf-8"
    )

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
    
    # ML Classification Thresholds
    AI_THRESHOLD: float = 0.65
    UNCERTAIN_LOW: float = 0.40
    UNCERTAIN_HIGH: float = 0.65
    
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    ALLOWED_EXTENSIONS: Set[str] = {"wav", "mp3", "m4a", "ogg", "flac", "webm"}

    # Supported Languages for SIH26104
    SUPPORTED_LANGUAGES: Dict[str, Dict[str, str]] = {
        "en": {"name": "English", "native": "English", "code": "en"},
        "hi": {"name": "Hindi", "native": "हिन्दी", "code": "hi"},
        "mr": {"name": "Marathi", "native": "मराठी", "code": "mr"},
        "bn": {"name": "Bengali", "native": "বাংলা", "code": "bn"},
        "ta": {"name": "Tamil", "native": "தமிழ்", "code": "ta"},
        "te": {"name": "Telugu", "native": "తెలుగు", "code": "te"},
        "gu": {"name": "Gujarati", "native": "ગુજરાતી", "code": "gu"},
        "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "code": "kn"}
    }

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            if not v.startswith("["):
                return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

settings = Settings()
