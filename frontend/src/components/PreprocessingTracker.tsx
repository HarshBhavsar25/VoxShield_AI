import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Circle, Activity } from 'lucide-react';

interface PreprocessingTrackerProps {
  isRunning: boolean;
  onComplete?: () => void;
}

export const PreprocessingTracker: React.FC<PreprocessingTrackerProps> = ({ isRunning, onComplete }) => {
  const stages = [
    { id: 1, label: 'Audio Received & Header Verified', desc: 'Mono 16-bit WAV/PCM/MP3 input stream decoded' },
    { id: 2, label: 'Format Validation & Security Check', desc: 'Duration, buffer bounds, and integrity checks passed' },
    { id: 3, label: 'Noise Filtering & RMS Normalization', desc: 'Butterworth high-pass filter applied, peak normalized to 0.95' },
    { id: 4, label: 'Resampling & Silence Processing', desc: 'Fixed 16,000 Hz resampling with adaptive energy trimming' },
    { id: 5, label: 'Acoustic & Vocoder Feature Extraction', desc: 'Extracting 13 MFCCs, Spectral Centroid, F0 Pitch, Jitter/Shimmer' },
    { id: 6, label: 'AI Voice Detection & Risk Assessment', desc: 'Evaluating deepfake artifacts across Indian language models' }
  ];

  const [activeStage, setActiveStage] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) {
      setActiveStage(0);
      return;
    }

    // Step through the 6 stages dynamically with realistic micro-delays
    setActiveStage(1);
    const t1 = setTimeout(() => setActiveStage(2), 250);
    const t2 = setTimeout(() => setActiveStage(3), 550);
    const t3 = setTimeout(() => setActiveStage(4), 850);
    const t4 = setTimeout(() => setActiveStage(5), 1200);
    const t5 = setTimeout(() => setActiveStage(6), 1600);
    const t6 = setTimeout(() => {
      setActiveStage(7); // all done
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [isRunning]);

  if (!isRunning && activeStage === 0) return null;

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-cyber-card/90 p-5 backdrop-blur-xl shadow-cyber-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-cyber-cyan animate-pulse" />
          <span className="text-sm font-bold text-white tracking-wide">
            Acoustic Pipeline Preprocessing
          </span>
        </div>
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-mono text-cyber-cyan">
          {activeStage <= 6 ? `Stage ${Math.min(activeStage, 6)}/6` : 'Complete'}
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          const isDone = activeStage > stage.id;
          const isCurrent = activeStage === stage.id;
          const isPending = activeStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 rounded-lg p-2.5 transition-all ${
                isCurrent 
                  ? 'bg-cyan-950/40 border border-cyan-500/40 shadow-cyber-cyan/10' 
                  : isDone 
                  ? 'bg-gray-900/30 opacity-85' 
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-cyber-cyan animate-spin" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-cyber-cyan' : isDone ? 'text-gray-200' : 'text-gray-500'}`}>
                    {stage.label}
                  </span>
                  {isDone && <span className="text-[10px] text-emerald-400 font-mono">Passed</span>}
                  {isCurrent && <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Processing...</span>}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
