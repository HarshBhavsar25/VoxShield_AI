export type NavigationTab = 
  | 'landing' 
  | 'dashboard' 
  | 'analyze' 
  | 'simulate' 
  | 'history' 
  | 'insights' 
  | 'how-it-works' 
  | 'settings';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ClassificationResult = 'HUMAN' | 'AI_GENERATED' | 'UNCERTAIN';

export interface AcousticFeatures {
  mfcc_mean: number[];
  mfcc_var: number[];
  spectral_centroid: number;
  spectral_rolloff: number;
  spectral_flatness: number;
  spectral_contrast_mean: number;
  zero_crossing_rate: number;
  pitch_mean: number;
  pitch_std: number;
  jitter: number;
  shimmer: number;
  hnr: number;
  high_freq_ratio: number;
  energy_entropy: number;
  pause_ratio: number;
  speaking_rate_est: number;
}

export interface TechnicalDetails {
  spectral_irregularity_score: number;
  prosodic_inconsistency_score: number;
  phase_discontinuity_index: number;
  high_freq_harmonic_drop: number;
  model_architecture: string;
  model_mode: string;
}

export interface DetectionResult {
  id: string;
  filename: string;
  audio_url?: string;
  duration: number;
  file_size: number;
  language: string;
  language_code: string;
  language_confidence: number;
  result: ClassificationResult;
  ai_probability: number;
  human_probability: number;
  confidence: number;
  risk_level: RiskLevel;
  indicators: string[];
  explanation: string;
  technical_details: TechnicalDetails;
  acoustic_features: AcousticFeatures;
  created_at: string;
}

export interface SampleVoice {
  id: string;
  name: string;
  language: string;
  language_code: string;
  type: 'human' | 'ai';
  filename: string;
  audio_url: string;
  description: string;
}

export interface SimulationResult {
  id: string;
  source_voice_filename?: string;
  generated_voice_filename: string;
  audio_url: string;
  language: string;
  language_code: string;
  script_text: string;
  duration: number;
  status: string;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  filename: string;
  audio_url?: string;
  language: string;
  language_code: string;
  result: ClassificationResult;
  ai_probability: number;
  human_probability: number;
  risk_level: RiskLevel;
  confidence: number;
  duration: number;
  created_at: string;
}

export interface DashboardStats {
  total_analyses: number;
  ai_voices_detected: number;
  human_voices: number;
  uncertain_count: number;
  high_risk_alerts: number;
  language_distribution: Record<string, number>;
  recent_activity: Array<{
    id: string;
    filename: string;
    language: string;
    result: ClassificationResult;
    ai_probability: number;
    human_probability: number;
    risk_level: RiskLevel;
    confidence: number;
    date: string;
  }>;
}

export interface LanguageBreakdown {
  language: string;
  samples: number;
  accuracy: number;
  f1_score: number;
  auc: number;
}

export interface UnseenGeneratorEvaluation {
  generator: string;
  type: string;
  samples_tested: number;
  detection_rate: number;
  primary_artifact: string;
  status: string;
}

export interface ModelInsightsData {
  dataset_name: string;
  total_samples: number;
  languages_supported: string[];
  train_test_split: string;
  overall_accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  false_positive_rate: number;
  false_negative_rate: number;
  language_breakdown: LanguageBreakdown[];
  unseen_generators_evaluation: UnseenGeneratorEvaluation[];
  confusion_matrix: {
    true_human_pred_human: number;
    true_human_pred_ai: number;
    true_ai_pred_ai: number;
    true_ai_pred_human: number;
  };
}

export interface ScriptScenarioResponse {
  language: string;
  language_code: string;
  scenario: string;
  script: string;
  english_translation: string;
}
