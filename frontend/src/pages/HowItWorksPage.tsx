import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Activity, 
  Waves, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Sliders,
  Layers,
  Lock
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HowItWorksPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-cyber-cyan" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            How VoxShield AI Works
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Deep-dive technical explanation of acoustic digital signal processing (DSP), neural vocoder artifact detection, and multi-factor risk assessment.
        </p>
      </div>

      {/* 6-Stage Engineering Pipeline */}
      <div className="space-y-6">
        
        {/* Stage 1 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyber-cyan font-mono font-bold text-xs">
              01
            </span>
            <h3 className="text-base font-bold text-white">Audio Ingestion, Sanitization & Resampling</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pl-10">
            Incoming audio (WAV, MP3, M4A, WebM) is decoded, normalized to mono, resampled to standard 16,000 Hz, and passed through a 4th-order Butterworth high-pass filter (cutoff 60 Hz) to eliminate low-frequency microphone vibration noise. Peak and RMS volume normalization ensures uniform dynamic range across different phone microphones.
          </p>
        </div>

        {/* Stage 2 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyber-cyan font-mono font-bold text-xs">
              02
            </span>
            <h3 className="text-base font-bold text-white">Acoustic & Cepstral Feature Extraction</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pl-10">
            VoxShield converts the speech wave into a multidimensional acoustic feature matrix. It calculates:
          </p>
          <ul className="text-xs text-gray-400 pl-14 space-y-1.5 list-disc">
            <li><strong>13 Mel-Frequency Cepstral Coefficients (MFCCs):</strong> Captures vocal tract shape and phonetic timbre.</li>
            <li><strong>Spectral Centroid & Rolloff (85%):</strong> Evaluates frequency center of mass and high-frequency boundaries.</li>
            <li><strong>Spectral Flatness & Contrast:</strong> Differentiates between tonal phonemes and vocoder synthesis noise.</li>
          </ul>
        </div>

        {/* Stage 3 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyber-cyan font-mono font-bold text-xs">
              03
            </span>
            <h3 className="text-base font-bold text-white">Biological Vocal Tract Biomarkers</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pl-10">
            Human vocal folds vibrate with natural, continuous physiological perturbations called <strong>micro-jitter</strong> (frequency variations ~1.5–4.0%) and <strong>shimmer</strong> (amplitude variations). Synthetic neural text-to-speech models, in contrast, frequently produce unnaturally regular pitch trajectories or step-like robotic transitions between phonemes.
          </p>
        </div>

        {/* Stage 4 */}
        <div className="rounded-xl border border-red-500/30 bg-cyber-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-mono font-bold text-xs">
              04
            </span>
            <h3 className="text-base font-bold text-white">Neural Vocoder Phase & Harmonic Discontinuity</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pl-10">
            Modern voice cloning frameworks (e.g. HiFi-GAN, WaveGlow, XTTS, Tacotron) generate waveform from mel-spectrograms. This reconstruction process leaves measurable artifacts: steep high-frequency harmonic attenuation (&gt;3.8 kHz) and unwrap phase variance across Short-Time Fourier Transform (STFT) frames.
          </p>
        </div>

        {/* Stage 5 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyber-cyan font-mono font-bold text-xs">
              05
            </span>
            <h3 className="text-base font-bold text-white">Multi-Tier Ensemble Classification & Risk Engine</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pl-10">
            The mathematical feature vectors are evaluated by our calibrated statistical ensemble model, mapping to calibrated probabilities (Human vs AI-Generated) and categorizing threat levels into <strong>LOW</strong>, <strong>MEDIUM</strong>, or <strong>HIGH</strong> risk.
          </p>
        </div>

      </div>

      {/* CTA Button */}
      <div className="pt-4 text-center">
        <button
          onClick={() => onNavigate('analyze')}
          className="btn-cyber-primary text-sm inline-flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          <span>Test the Acoustic Pipeline in Voice Analysis</span>
        </button>
      </div>

    </div>
  );
};
