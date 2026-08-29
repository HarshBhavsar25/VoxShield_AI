import React from 'react';
import { Shield, AlertTriangle, HelpCircle } from 'lucide-react';
import { ClassificationResult, RiskLevel } from '../types';

interface ConfidenceMeterProps {
  aiProbability: number;
  humanProbability: number;
  confidence: number;
  result: ClassificationResult;
  riskLevel: RiskLevel;
  size?: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  aiProbability,
  humanProbability,
  confidence,
  result,
  riskLevel,
  size = 180
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percentage for main display is AI probability or Human probability depending on focus
  const percentage = Math.round(aiProbability * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#10B981'; // green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let resultTitle = 'AUTHENTIC HUMAN VOICE';
  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

  if (result === 'AI_GENERATED') {
    strokeColor = '#EF4444'; // red
    glowColor = 'rgba(239, 68, 68, 0.5)';
    resultTitle = 'AI-GENERATED VOICE SUSPECTED';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/40';
  } else if (result === 'UNCERTAIN') {
    strokeColor = '#F59E0B'; // amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    resultTitle = 'UNCERTAIN SPEECH PATTERN';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* SVG Radial Meter */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Gradient Meter Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 10px ${glowColor})`
            }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            AI Probability
          </span>
        </div>
      </div>

      {/* Main Status Headline */}
      <div className="mt-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {result === 'AI_GENERATED' ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : result === 'HUMAN' ? (
            <Shield className="h-5 w-5 text-emerald-400" />
          ) : (
            <HelpCircle className="h-5 w-5 text-amber-400" />
          )}
          <span className="text-base font-bold tracking-wide text-white">
            {resultTitle}
          </span>
        </div>

        {/* Risk & Confidence Badges */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className={`rounded-full border px-3 py-0.5 text-xs font-bold tracking-wider ${badgeColor}`}>
            RISK: {riskLevel}
          </span>
          <span className="rounded-full border border-gray-700 bg-gray-800/80 px-3 py-0.5 text-xs font-mono text-gray-300">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Dual Probabilities Bar */}
      <div className="w-full mt-5 pt-4 border-t border-gray-800/80 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-gray-900/60 p-2 border border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Human Probability</span>
          <p className="text-sm font-mono font-bold text-emerald-400">{(humanProbability * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-gray-900/60 p-2 border border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">AI Probability</span>
          <p className="text-sm font-mono font-bold text-red-400">{(aiProbability * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
