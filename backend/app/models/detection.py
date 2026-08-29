import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    audio_url = Column(String(512), nullable=True)
    duration = Column(Float, nullable=False, default=0.0)
    file_size = Column(Integer, nullable=False, default=0)
    
    language = Column(String(50), nullable=False, default="English")
    language_code = Column(String(10), nullable=False, default="en")
    language_confidence = Column(Float, nullable=False, default=0.95)
    
    result = Column(String(50), nullable=False)  # HUMAN, AI_GENERATED, UNCERTAIN
    ai_probability = Column(Float, nullable=False)
    human_probability = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH
    
    indicators = Column(Text, nullable=False, default="[]")  # JSON array
    acoustic_features = Column(Text, nullable=False, default="{}")  # JSON object
    explanation = Column(Text, nullable=True)
    technical_details = Column(Text, nullable=True)  # JSON object
    
    is_synthetic_simulation = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SimulationRecord(Base):
    __tablename__ = "simulation_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_voice_filename = Column(String(255), nullable=True)
    generated_voice_filename = Column(String(255), nullable=False)
    generated_audio_path = Column(String(512), nullable=False)
    audio_url = Column(String(512), nullable=True)
    
    language = Column(String(50), nullable=False, default="Marathi")
    language_code = Column(String(10), nullable=False, default="mr")
    script_text = Column(Text, nullable=False)
    duration = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), default="AI-GENERATED DEMONSTRATION AUDIO")
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
