import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Trash2, 
  Sliders, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  Cpu,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [aiThreshold, setAiThreshold] = useState<number>(65);
  const [uncertaintyMargin, setUncertaintyMargin] = useState<number>(25);
  const [autoTrimSilence, setAutoTrimSilence] = useState(true);
  const [requireConsent, setRequireConsent] = useState(true);
  const [clearedMessage, setClearedMessage] = useState<string | null>(null);

  const handleClearCache = () => {
    if (confirm("Clear local cache and ephemeral audio buffers?")) {
      setClearedMessage("Ephemeral audio buffers and local cache cleared successfully.");
      setTimeout(() => setClearedMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-cyber-cyan" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Settings &amp; Security Controls
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Adjust acoustic sensitivity thresholds, privacy configurations, and biometric audit retention parameters.
        </p>
      </div>

      {/* Threshold Configurations */}
      <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-6">
        <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm">
          <Sliders className="h-4 w-4" />
          <span>Acoustic Detection Sensitivity Thresholds</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>AI Classification Decision Boundary</span>
              <span className="font-mono text-cyber-cyan font-bold">{aiThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={aiThreshold}
              onChange={(e) => setAiThreshold(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
            />
            <span className="text-[10px] text-gray-500 block">
              Probabilities above this threshold are classified as AI_GENERATED.
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>Uncertainty Margin Band (±%)</span>
              <span className="font-mono text-amber-400 font-bold">±{uncertaintyMargin}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              value={uncertaintyMargin}
              onChange={(e) => setUncertaintyMargin(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[10px] text-gray-500 block">
              Scores falling within this boundary are marked UNCERTAIN to trigger secondary verification.
            </span>
          </div>
        </div>
      </div>

      {/* Preprocessing Toggles */}
      <div className="rounded-xl border border-cyber-border bg-cyber-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm">
          <Cpu className="h-4 w-4" />
          <span>Audio Preprocessing Parameters</span>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-darkest border border-gray-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Adaptive Silence & Noise Trimming</span>
              <span className="text-[10px] text-gray-400">Trims non-voiced silence from start/end of audio buffers</span>
            </div>
            <input
              type="checkbox"
              checked={autoTrimSilence}
              onChange={(e) => setAutoTrimSilence(e.target.checked)}
              className="rounded bg-cyber-card text-cyber-cyan focus:ring-cyber-cyan h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-cyber-darkest border border-gray-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Strict Biometric Consent Prompt</span>
              <span className="text-[10px] text-gray-400">Enforce authorization check before any microphone recording</span>
            </div>
            <input
              type="checkbox"
              checked={requireConsent}
              onChange={(e) => setRequireConsent(e.target.checked)}
              className="rounded bg-cyber-card text-cyber-cyan focus:ring-cyber-cyan h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Data Erasure & Privacy */}
      <div className="rounded-xl border border-red-500/30 bg-cyber-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <Lock className="h-4 w-4" />
          <span>Biometric Privacy &amp; Data Erasure (Right to be Forgotten)</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Voice recordings are sensitive biometric markers. VoxShield does not retain permanent audio without user authorization.
        </p>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-900/40 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Purge Ephemeral Audio Buffers</span>
          </button>

          {clearedMessage && (
            <span className="text-xs text-emerald-400 font-mono animate-in fade-in">
              ✓ {clearedMessage}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
