import React, { useState } from 'react';
import { BarChart3, Activity, Waves, Cpu, Info } from 'lucide-react';
import { AcousticFeatures, TechnicalDetails } from '../types';

interface AcousticChartProps {
  features: AcousticFeatures;
  technicalDetails: TechnicalDetails;
}

export const AcousticChart: React.FC<AcousticChartProps> = ({ features, technicalDetails }) => {
  const [activeTab, setActiveTab] = useState<'spectral' | 'prosody' | 'mfcc' | 'telemetry'>('spectral');

  const mfccData = features.mfcc_mean.length > 0 ? features.mfcc_mean.slice(0, 13) : [-250, 80, 20, 15, -10, 5, -2, 8, -4, 2, -1, 3, 0];

  return (
    <div className="rounded-xl border border-cyber-border bg-cyber-card/70 p-5 space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyber-cyan" />
          <span className="text-sm font-bold text-white">Explainable Acoustic Biomarkers</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-cyber-darkest p-1 rounded-lg border border-gray-800 text-xs">
          <button
            onClick={() => setActiveTab('spectral')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'spectral' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Spectral Analysis
          </button>
          <button
            onClick={() => setActiveTab('prosody')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'prosody' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Prosody & Pitch
          </button>
          <button
            onClick={() => setActiveTab('mfcc')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'mfcc' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            MFCCs
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeTab === 'telemetry' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Vocoder Artifacts
          </button>
        </div>
      </div>

      {/* Tab 1: Spectral Analysis */}
      {activeTab === 'spectral' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-300">
            Acoustic frequency distribution and high-frequency harmonic energy cutoff measurements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">Spectral Centroid</span>
              <p className="text-base font-mono font-bold text-cyber-cyan mt-1">
                {Math.round(features.spectral_centroid)} Hz
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Typical human: 1800 - 3200 Hz
              </span>
            </div>

            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">Spectral Rolloff (85%)</span>
              <p className="text-base font-mono font-bold text-cyber-cyan mt-1">
                {Math.round(features.spectral_rolloff)} Hz
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Upper harmonic boundary
              </span>
            </div>

            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">High-Freq Power Ratio (&gt;3.5kHz)</span>
              <p className="text-base font-mono font-bold text-cyber-cyan mt-1">
                {(features.high_freq_ratio * 100).toFixed(1)}%
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Neural TTS drops sharply (&lt;8%)
              </span>
            </div>
          </div>

          {/* Visual Spectrum Bar Indicator */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Spectral Irregularity Index</span>
              <span className="font-mono text-cyan-300">
                {(technicalDetails.spectral_irregularity_score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  technicalDetails.spectral_irregularity_score > 0.4 ? 'bg-red-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, technicalDetails.spectral_irregularity_score * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prosody & Pitch */}
      {activeTab === 'prosody' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-300">
            Biological vocal tract tremor metrics: Jitter (pitch perturbation) and Shimmer (amplitude variation).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">Mean Fundamental Pitch (F0)</span>
              <p className="text-base font-mono font-bold text-emerald-400 mt-1">
                {features.pitch_mean ? `${Math.round(features.pitch_mean)} Hz` : '142 Hz'}
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Std Dev: {Math.round(features.pitch_std)} Hz
              </span>
            </div>

            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">Pitch Jitter (Micro-tremor)</span>
              <p className={`text-base font-mono font-bold mt-1 ${
                features.jitter < 0.010 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {(features.jitter * 100).toFixed(2)}%
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                {features.jitter < 0.010 ? 'Unnatural robotic stability' : 'Natural biological tremor'}
              </span>
            </div>

            <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800">
              <span className="text-[11px] text-gray-400">Amplitude Shimmer</span>
              <p className="text-base font-mono font-bold text-cyber-cyan mt-1">
                {(features.shimmer * 100).toFixed(2)}%
              </p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                Phoneme energy fluctuation
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MFCCs */}
      {activeTab === 'mfcc' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-300">
            Mel-Frequency Cepstral Coefficients (c1 to c13) representing acoustic spectral envelope timbre.
          </p>

          <div className="h-32 flex items-end gap-2 bg-cyber-darkest p-4 rounded-xl border border-gray-800">
            {mfccData.map((val, idx) => {
              // Normalize value for visual bar height (-300 to +100 range)
              const height = Math.max(10, Math.min(100, ((val + 200) / 300) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t group-hover:from-cyan-400 group-hover:to-white transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] font-mono text-gray-500">c{idx+1}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-gray-900 border border-gray-700 text-[10px] font-mono text-white px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {val.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Vocoder Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-3">
          <div className="rounded-lg bg-cyber-darkest p-3 border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Architecture Pipeline</span>
              <span className="font-mono text-cyan-300">{technicalDetails.model_architecture}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Phase Discontinuity Index</span>
              <span className="font-mono text-emerald-400">{technicalDetails.phase_discontinuity_index.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Prosodic Inconsistency Score</span>
              <span className="font-mono text-amber-400">{(technicalDetails.prosodic_inconsistency_score * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Harmonic-to-Noise Ratio (HNR)</span>
              <span className="font-mono text-cyber-cyan">{features.hnr.toFixed(1)} dB</span>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
        <Info className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
        <p>
          AI voice detection is probabilistic. Detection indicators reflect acoustic differences between physiological speech mechanics and synthetic neural vocoders.
        </p>
      </div>
    </div>
  );
};
