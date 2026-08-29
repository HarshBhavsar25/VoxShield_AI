import React from 'react';
import { 
  Shield, 
  Radio, 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Languages, 
  Cpu, 
  Lock, 
  FileCheck,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { NavigationTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartSIHDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onStartSIHDemo }) => {
  return (
    <div className="space-y-24 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyber-cyan tracking-wide">
            <Shield className="h-3.5 w-3.5" />
            <span>Smart India Hackathon • Problem SIH26104</span>
          </div>

          <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Detect. Verify. Defend Against <br />
            <span className="text-gradient-cyan">AI Voice Impersonation.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
            AI-powered multilingual voice authenticity analysis designed to identify synthetic speech, neural vocoder artifacts, and help prevent voice cloning fraud across Indian regional languages.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => onNavigate('analyze')}
              className="btn-cyber-primary flex items-center gap-2 text-sm"
            >
              <Radio className="h-4 w-4" />
              <span>Analyze Voice</span>
            </button>

            <button
              onClick={() => onNavigate('simulate')}
              className="btn-cyber-outline flex items-center gap-2 text-sm"
            >
              <FlaskConical className="h-4 w-4 text-cyan-400" />
              <span>Attack Simulation Lab</span>
            </button>

            <button
              onClick={onStartSIHDemo}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:scale-105 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-200" />
              <span>How It Works (Demo)</span>
            </button>
          </div>

          {/* Verification Metrics Summary */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/80 text-left">
            <div>
              <span className="font-mono text-2xl font-bold text-white">94.8%</span>
              <p className="text-xs text-gray-400">Benchmark Accuracy</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-cyber-cyan">8</span>
              <p className="text-xs text-gray-400">Indian Languages</p>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-emerald-400">&lt; 1.5s</span>
              <p className="text-xs text-gray-400">Analysis Latency</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Card: Animated Shield + Waveform Flow */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md rounded-2xl border border-cyan-500/40 bg-cyber-card/80 p-6 shadow-cyber-cyan backdrop-blur-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-xs font-mono font-bold text-gray-300">VOXSHIELD DEFENSE RADAR</span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyber-cyan px-2 py-0.5 rounded border border-cyan-500/30">
                ACTIVE
              </span>
            </div>

            {/* Simplified Pipeline Flow Visual */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-darkest border border-gray-800">
                <span className="text-gray-400">VOICE INPUT</span>
                <span className="text-cyber-cyan font-bold">16kHz PCM</span>
              </div>
              <div className="text-center text-gray-600 text-xs">↓</div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-darkest border border-cyan-500/30 shadow-cyber-cyan/10">
                <span className="text-gray-300">AI ACOUSTIC ANALYSIS</span>
                <span className="text-cyan-400 font-bold">13 MFCCs + Jitter</span>
              </div>
              <div className="text-center text-gray-600 text-xs">↓</div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-darkest border border-gray-800">
                <span className="text-gray-400">AUTHENTICITY SCORE</span>
                <span className="text-amber-400 font-bold">94.2% AI Prob</span>
              </div>
              <div className="text-center text-gray-600 text-xs">↓</div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-950/40 border border-red-500/40">
                <span className="text-red-300 font-bold">RISK ASSESSMENT</span>
                <span className="text-red-400 font-extrabold">HIGH RISK</span>
              </div>
              <div className="text-center text-gray-600 text-xs">↓</div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 font-bold">
                <span>VERIFICATION GUIDANCE</span>
                <span>Active Protocol</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate('analyze')}
                className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyber-cyan border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all"
              >
                Launch Acoustic Inspection →
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* 2. THE THREAT SECTION */}
      <section className="rounded-2xl border border-red-500/30 bg-cyber-darker/60 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              The Emerging Cyber Threat
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why AI Voice Cloning Demands Dedicated Defense
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
          Generative AI models and neural vocoders now require as little as <strong>3 to 10 seconds</strong> of audio to clone a person's voice. In India, voice impersonation scams target banking customers, enterprise executives, and vulnerable citizens across regional languages like Marathi, Hindi, and Bengali.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-cyber-card border border-gray-800 space-y-2">
            <span className="text-red-400 font-bold text-sm">Emergency Pretext Fraud</span>
            <p className="text-xs text-gray-400">
              Scammers clone family members' voices claiming urgent medical or legal distress to extract immediate ransom.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyber-card border border-gray-800 space-y-2">
            <span className="text-red-400 font-bold text-sm">Banking & OTP Impersonation</span>
            <p className="text-xs text-gray-400">
              Synthetic voices simulate regional bank managers demanding urgent fund transfers to prevent account freeze.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyber-card border border-gray-800 space-y-2">
            <span className="text-red-400 font-bold text-sm">Executive Voice Phishing (Vishing)</span>
            <p className="text-xs text-gray-400">
              Cloned executive voices authorize unauthorized wire transfers and sensitive credential releases.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MULTILINGUAL SUPPORT SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyber-cyan">
            <Languages className="h-3.5 w-3.5" />
            <span>Inclusive Regional Security</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Multilingual Detection Coverage</h2>
          <p className="text-sm text-gray-400">
            VoxShield AI is calibrated to evaluate vocal tracts, formant transitions, and phoneme acoustics across 8 major Indian languages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Marathi', native: 'मराठी', code: 'mr', status: 'Primary SIH Testbed' },
            { name: 'Hindi', native: 'हिन्दी', code: 'hi', status: 'Full Calibration' },
            { name: 'English', native: 'English (Indian)', code: 'en', status: 'Full Calibration' },
            { name: 'Bengali', native: 'বাংলা', code: 'bn', status: 'Active Model' },
            { name: 'Tamil', native: 'தமிழ்', code: 'ta', status: 'Active Model' },
            { name: 'Telugu', native: 'తెలుగు', code: 'te', status: 'Active Model' },
            { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu', status: 'Active Model' },
            { name: 'Kannada', native: 'ಕನ್ನಡ', code: 'kn', status: 'Active Model' }
          ].map((lang) => (
            <div
              key={lang.code}
              className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyber-cyan font-bold">{lang.code.toUpperCase()}</span>
                <span className="text-[10px] text-gray-400 bg-cyber-darkest px-2 py-0.5 rounded border border-gray-800">
                  {lang.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyber-cyan transition-colors">{lang.name}</h3>
              <p className="text-xs text-gray-400 font-sans">{lang.native}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLAINABLE AI & ARCHITECTURE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>Explainable AI (XAI)</span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Transparent Forensic Explanations, Not Black-Box Guesses.
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed">
            VoxShield breaks down synthetic audio into measurable physical biomarkers:
          </p>

          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
              <span><strong>Spectral Rolloff & Harmonic Attenuation:</strong> Identifies steep high-frequency cuts above 3.8kHz typical of neural vocoders.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
              <span><strong>Pitch Micro-Tremors (Jitter & Shimmer):</strong> Detects artificial vocal cord stability that lacks human biological tremors.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
              <span><strong>STFT Phase Discontinuities:</strong> Tracks frame-to-frame vocoder phase reconstruction errors.</span>
            </li>
          </ul>

          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-2 text-xs font-bold text-cyber-cyan hover:underline pt-2"
          >
            <span>Explore Model Insights & Generalization Benchmarks</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-darker border border-cyber-border space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyber-cyan" />
            Privacy & Biometric Data Compliance
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Voice samples contain sensitive biometric data. VoxShield AI implements strict security controls:
          </p>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="p-3 rounded-lg bg-cyber-card border border-gray-800">
              ✓ <strong>Zero Public Exposure:</strong> Voice recordings are processed in ephemeral local buffers.
            </div>
            <div className="p-3 rounded-lg bg-cyber-card border border-gray-800">
              ✓ <strong>Right to Erasure:</strong> One-click permanent deletion of forensic audio records.
            </div>
            <div className="p-3 rounded-lg bg-cyber-card border border-gray-800">
              ✓ <strong>Explicit Consent Enforcement:</strong> Required confirmation before any recording or analysis.
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <section className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-cyber-darkest border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ready to Test the Defense System?
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Experience the live SIH26104 full-stack prototype: record your voice, test sample clones, or simulate a controlled attack in Marathi.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('analyze')}
            className="btn-cyber-primary text-sm flex items-center gap-2"
          >
            <Radio className="h-4 w-4" />
            <span>Launch Detection Workspace</span>
          </button>
          <button
            onClick={onStartSIHDemo}
            className="btn-cyber-outline text-sm flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start SIH Demo Tour</span>
          </button>
        </div>
      </section>

    </div>
  );
};
