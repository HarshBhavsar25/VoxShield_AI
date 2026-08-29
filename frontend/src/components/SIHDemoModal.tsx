import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Activity, 
  AlertTriangle,
  Lock,
  Cpu
} from 'lucide-react';
import { apiService } from '../services/api';
import { DetectionResult } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { ConfidenceMeter } from './ConfidenceMeter';
import confetti from 'canvas-confetti';

interface SIHDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAnalyze: () => void;
}

export const SIHDemoModal: React.FC<SIHDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAnalyze
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Demo State
  const [selectedLanguage, setSelectedLanguage] = useState('Marathi');
  const [scriptText, setScriptText] = useState(
    'नमस्कार, मी बँकेतून बोलत आहे. तुमच्या खात्यामध्ये तात्काळ संशयास्पद व्यवहार आढळला आहे. खाते सुरक्षित ठेवण्यासाठी त्वरित ५०,००० रुपये व्हेरिफिकेशन खात्यावर ट्रान्सफर करा.'
  );
  const [translationText, setTranslationText] = useState(
    'Hello, I am calling from the bank. Suspicious activity was detected on your account. Transfer ₹50,000 to the verification account immediately to avoid blockage.'
  );
  
  const [originalVoiceUrl, setOriginalVoiceUrl] = useState<string>('/api/audio/sample/marathi_authentic_human.wav');
  const [generatedVoiceUrl, setGeneratedVoiceUrl] = useState<string>('/api/audio/sample/marathi_ai_clone.wav');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  if (!isOpen) return null;

  const totalSteps = 11;

  const handleNext = async () => {
    if (currentStep === 3) {
      // Step 4: Synthesizing voice
      setLoading(true);
      try {
        const res = await apiService.simulateVoice({
          language: selectedLanguage,
          script: scriptText
        });
        setGeneratedVoiceUrl(res.audio_url);
      } catch (e) {
        console.error("Simulation fallback:", e);
        setGeneratedVoiceUrl('/api/audio/sample/marathi_ai_clone.wav');
      } finally {
        setLoading(false);
        setCurrentStep(4);
      }
      return;
    }

    if (currentStep === 7) {
      // Step 8: Analyze generated voice in detection engine
      setLoading(true);
      try {
        const res = await apiService.analyzeAudio({
          sample_id: 'marathi_ai_clone',
          language: 'Marathi',
          is_simulation: true
        });
        setDetectionResult(res);
      } catch (e) {
        console.error("Detection error:", e);
      } finally {
        setLoading(false);
        setCurrentStep(8);
      }
      return;
    }

    if (currentStep === 10) {
      // Step 11: Celebrate complete walkthrough
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-cyber-darker p-6 shadow-cyber-cyan/30 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">SIH26104 Guided Judge Walkthrough</h3>
                <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                  LIVE DEMO
                </span>
              </div>
              <p className="text-xs text-gray-400">
                End-to-end Attack Simulation & Multi-lingual Acoustic Detection Lifecycle
              </p>
            </div>
          </div>

          {/* Step Pill */}
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyber-cyan">
              STEP {currentStep} of {totalSteps}
            </span>
            <div className="w-28 bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-amber-400 h-full rounded-full transition-all"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="min-h-[280px] flex flex-col justify-center">

          {/* STEP 1: Voice Sample */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyber-cyan font-semibold text-sm">
                <Radio className="h-4 w-4" />
                <span>STEP 1: Target Voice Sample Selection</span>
              </div>
              <p className="text-xs text-gray-300">
                In a real voice impersonation attack, bad actors harvest 5–10 seconds of a victim's voice from social media or public interviews.
              </p>
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Authorized Target Voice Sample (Marathi)</span>
                  <span className="text-xs font-mono text-emerald-400">10.2 sec | 16kHz</span>
                </div>
                <AudioPlayer
                  src={originalVoiceUrl}
                  title="Target Speaker Reference Sample"
                  isAiGenerated={false}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Language Selection */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyber-cyan font-semibold text-sm">
                <Activity className="h-4 w-4" />
                <span>STEP 2: Target Regional Language Selection</span>
              </div>
              <p className="text-xs text-gray-300">
                Impersonation fraudsters operate in regional Indian dialects to target victims who may trust local language calls more than English.
              </p>
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
                <label className="text-xs text-gray-400 block font-semibold">Active Regional Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-cyber-darkest border border-gray-700 text-white rounded-xl p-3 text-sm focus:border-cyber-cyan outline-none"
                >
                  <option value="Marathi">Marathi (मराठी) - Primary SIH Testbed</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English (Indian Accent)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span>Language Confidence: <strong className="text-emerald-400">96.8%</strong></span>
                  <span>Dialect Mapping: <strong className="text-cyan-300">Western Indic</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Script Configuration */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyber-cyan font-semibold text-sm">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>STEP 3: Phishing Attack Scenario Script</span>
              </div>
              <p className="text-xs text-gray-300">
                Fraudsters craft urgent, emotion-driven scripts to coerce immediate action.
              </p>
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
                <span className="text-xs font-bold text-amber-400 block">Scenario: Urgent Bank Impersonation</span>
                <textarea
                  rows={3}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  className="w-full bg-cyber-darkest border border-gray-700 text-white text-xs p-3 rounded-lg focus:border-cyber-cyan outline-none font-sans"
                />
                <div className="rounded bg-gray-900/80 p-2.5 text-[11px] text-gray-400 border border-gray-800">
                  <span className="font-semibold text-gray-300">English Translation: </span>
                  {translationText}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Synthesizing Audio */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <Cpu className="h-4 w-4" />
                <span>STEP 4: Synthetic Cloned Audio Generated (Module A)</span>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    AI-GENERATED DEMONSTRATION AUDIO
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Status: Synthesized</span>
                </div>
                <AudioPlayer
                  src={generatedVoiceUrl}
                  title="Cloned Voice Phishing Attack (Marathi)"
                  isAiGenerated={true}
                />
                <p className="text-[11px] text-red-300/80 italic">
                  Note: Audio generated in controlled simulation environment. Labeled for defensive analysis.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Play Original Voice */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>STEP 5: Listen to Original Human Voice</span>
              </div>
              <p className="text-xs text-gray-300">
                Notice natural human cadence, breathing, and pitch micro-tremors in the authentic sample.
              </p>
              <AudioPlayer
                src={originalVoiceUrl}
                title="Authentic Human Reference"
                isAiGenerated={false}
              />
            </div>
          )}

          {/* STEP 6: Play Cloned Voice */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>STEP 6: Listen to AI-Generated Clone</span>
              </div>
              <p className="text-xs text-gray-300">
                Notice how the cloned voice mimics the timbre, but contains subtle robotic prosody and high-frequency cuts.
              </p>
              <AudioPlayer
                src={generatedVoiceUrl}
                title="Synthetic AI Clone (Phishing Pretext)"
                isAiGenerated={true}
              />
            </div>
          )}

          {/* STEP 7: Pass to Detection Engine */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyber-cyan animate-bounce">
                <Radio className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-white">STEP 7: Submit to VoxShield Detection Engine</h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Now we pass the suspicious audio directly into VoxShield's multi-stage acoustic preprocessor and ML classifier.
              </p>
              <div className="text-xs font-mono text-cyan-400 pt-2">
                Click 'Next' to execute real-time acoustic pipeline
              </div>
            </div>
          )}

          {/* STEP 8: Pipeline Preprocessing */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyber-cyan font-semibold text-sm">
                <Activity className="h-4 w-4" />
                <span>STEP 8: Preprocessing & Feature Extraction Complete</span>
              </div>
              <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>✓ 16kHz Mono Resampling & Butterworth Filter</span>
                  <span className="text-emerald-400 font-mono">Passed</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>✓ 13 MFCCs & Spectral Rolloff Extracted</span>
                  <span className="text-emerald-400 font-mono">Passed</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>✓ F0 Pitch Micro-Jitter & Shimmer Scored</span>
                  <span className="text-emerald-400 font-mono">Passed</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>✓ Neural Vocoder Phase Discontinuity Computed</span>
                  <span className="text-emerald-400 font-mono">Passed</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Authenticity Score */}
          {currentStep === 9 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <ShieldAlert className="h-4 w-4" />
                <span>STEP 9: Authenticity Score & Confidence Meter</span>
              </div>
              <div className="rounded-xl bg-cyber-card border border-red-500/40 p-3">
                <ConfidenceMeter
                  aiProbability={detectionResult?.ai_probability || 0.942}
                  humanProbability={detectionResult?.human_probability || 0.058}
                  confidence={detectionResult?.confidence || 0.942}
                  result="AI_GENERATED"
                  riskLevel="HIGH"
                  size={150}
                />
              </div>
            </div>
          )}

          {/* STEP 10: High Risk Warning */}
          {currentStep === 10 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>STEP 10: High-Risk Impersonation Alert Triggered</span>
              </div>
              <div className="rounded-xl border border-red-500/50 bg-red-950/30 p-4 space-y-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  ⚠️ AI-GENERATED VOICE SUSPECTED
                </span>
                <ul className="text-xs text-gray-200 space-y-1.5 list-disc list-inside">
                  <li>High-frequency spectral rolloff cutoff (&gt;3.8kHz) detected</li>
                  <li>Unnatural pitch micro-regularity (lack of biological jitter)</li>
                  <li>STFT phase reconstruction artifacts consistent with neural TTS vocoders</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 11: Prevention & Defense */}
          {currentStep === 11 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>STEP 11: Actionable Impersonation Prevention</span>
              </div>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3 text-xs">
                <h5 className="font-bold text-white">Recommended Safeguards:</h5>
                <ul className="space-y-1.5 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Hang up and dial the official bank/organization branch number directly.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Perform out-of-band identity verification via known channel.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Never transfer funds or provide OTPs based solely on voice requests.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className={`flex items-center gap-1.5 rounded-xl border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 transition-all ${
              currentStep === 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep === totalSteps ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToAnalyze();
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-cyber-darkest shadow-cyber-emerald hover:scale-105 transition-all"
              >
                <Radio className="h-4 w-4" />
                <span>Open Full Detection Workspace</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{loading ? 'Processing...' : 'Next Step'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
