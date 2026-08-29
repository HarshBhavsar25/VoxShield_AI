from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AcousticFeatures(BaseModel):
    mfcc_mean: List[float] = Field(default_factory=list)
    mfcc_var: List[float] = Field(default_factory=list)
    spectral_centroid: float = 0.0
    spectral_rolloff: float = 0.0
    spectral_flatness: float = 0.0
    spectral_contrast_mean: float = 0.0
    zero_crossing_rate: float = 0.0
    pitch_mean: float = 0.0
    pitch_std: float = 0.0
    jitter: float = 0.0
    shimmer: float = 0.0
    hnr: float = 0.0
    high_freq_ratio: float = 0.0
    energy_entropy: float = 0.0
    pause_ratio: float = 0.0
    speaking_rate_est: float = 0.0

class TechnicalDetails(BaseModel):
    spectral_irregularity_score: float = 0.0
    prosodic_inconsistency_score: float = 0.0
    phase_discontinuity_index: float = 0.0
    high_freq_harmonic_drop: float = 0.0
    model_architecture: str = "Ensemble Acoustic Feature Classifier (SIH26104 Multi-tier)"
    model_mode: str = "PRODUCTION_BASELINE"

class DetectionResponse(BaseModel):
    id: str
    filename: str
    audio_url: Optional[str] = None
    duration: float
    file_size: int
    language: str
    language_code: str
    language_confidence: float
    result: str  # HUMAN, AI_GENERATED, UNCERTAIN
    ai_probability: float
    human_probability: float
    confidence: float
    risk_level: str  # LOW, MEDIUM, HIGH
    indicators: List[str]
    explanation: str
    technical_details: TechnicalDetails
    acoustic_features: AcousticFeatures
    created_at: datetime

class SimulationRequest(BaseModel):
    language: str = "Marathi"
    script: str
    source_audio_path: Optional[str] = None

class SimulationResponse(BaseModel):
    id: str
    source_voice_filename: Optional[str] = None
    generated_voice_filename: str
    audio_url: str
    language: str
    language_code: str
    script_text: str
    duration: float
    status: str
    created_at: datetime

class ScriptGenerateRequest(BaseModel):
    language: str = "Marathi"
    scenario_type: str = "urgent_financial"

class ScriptGenerateResponse(BaseModel):
    language: str
    language_code: str
    scenario: str
    script: str
    english_translation: str

class HistoryItemResponse(BaseModel):
    id: str
    filename: str
    audio_url: Optional[str] = None
    language: str
    language_code: str
    result: str
    ai_probability: float
    human_probability: float
    risk_level: str
    confidence: float
    duration: float
    created_at: datetime

class ModelInsightsResponse(BaseModel):
    dataset_name: str
    total_samples: int
    languages_supported: List[str]
    train_test_split: str
    overall_accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    false_positive_rate: float
    false_negative_rate: float
    language_breakdown: List[Dict[str, Any]]
    unseen_generators_evaluation: List[Dict[str, Any]]
    confusion_matrix: Dict[str, int]
