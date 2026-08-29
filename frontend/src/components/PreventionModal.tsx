import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Download, 
  PhoneCall, 
  FileText, 
  X, 
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DetectionResult } from '../types';

interface PreventionModalProps {
  result: DetectionResult;
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeAnother: () => void;
}

export const PreventionModal: React.FC<PreventionModalProps> = ({
  result,
  isOpen,
  onClose,
  onAnalyzeAnother
}) => {
  const [checklist, setChecklist] = useState({
    outOfBand: false,
    directCallback: false,
    holdFinancials: false,
    preserveAudio: false
  });

  if (!isOpen) return null;

  const exportReport = () => {
    const reportData = {
      title: "VoxShield AI — Voice Authenticity & Threat Audit Report",
      incident_id: result.id,
      timestamp: result.created_at,
      language: result.language,
      classification: result.result,
      ai_probability: `${(result.ai_probability * 100).toFixed(1)}%`,
      human_probability: `${(result.human_probability * 100).toFixed(1)}%`,
      confidence: `${(result.confidence * 100).toFixed(1)}%`,
      risk_level: result.risk_level,
      indicators: result.indicators,
      explanation: result.explanation,
      technical_details: result.technical_details,
      prevention_guidelines: [
        "Perform out-of-band identity challenge.",
        "Hang up and dial known official bank/family number.",
        "Refuse voice-authorized funds transfer."
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoxShield_Audit_${result.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isHighRisk = result.risk_level === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-red-500/40 bg-cyber-card p-6 shadow-cyber-crimson space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              Active Prevention Protocol
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {isHighRisk ? 'Possible AI Voice Impersonation Detected' : 'Suspicious Voice Communication Notice'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Language: <span className="text-white font-medium">{result.language}</span> | AI Probability: <span className="font-mono text-red-400 font-bold">{(result.ai_probability * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>

        {/* Immediate Recommended Safeguards */}
        <div className="space-y-3 rounded-xl bg-cyber-darkest p-4 border border-gray-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-cyber-cyan" />
            Recommended Verification Steps
          </h4>

          <div className="space-y-2.5">
            <label className="flex items-start gap-3 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.outOfBand}
                onChange={(e) => setChecklist(prev => ({ ...prev, outOfBand: e.target.checked }))}
                className="rounded border-gray-700 bg-cyber-card text-red-500 focus:ring-red-500 mt-0.5 h-4 w-4"
              />
              <span><strong>Verify caller via alternative channel:</strong> Send a direct message or secure WhatsApp / Signal ping.</span>
            </label>

            <label className="flex items-start gap-3 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.directCallback}
                onChange={(e) => setChecklist(prev => ({ ...prev, directCallback: e.target.checked }))}
                className="rounded border-gray-700 bg-cyber-card text-red-500 focus:ring-red-500 mt-0.5 h-4 w-4"
              />
              <span><strong>Call back directly:</strong> Hang up and dial the official known/saved contact number.</span>
            </label>

            <label className="flex items-start gap-3 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.holdFinancials}
                onChange={(e) => setChecklist(prev => ({ ...prev, holdFinancials: e.target.checked }))}
                className="rounded border-gray-700 bg-cyber-card text-red-500 focus:ring-red-500 mt-0.5 h-4 w-4"
              />
              <span><strong>Halt urgent financial transfers:</strong> Do not authorize money or share OTPs based purely on voice instructions.</span>
            </label>

            <label className="flex items-start gap-3 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.preserveAudio}
                onChange={(e) => setChecklist(prev => ({ ...prev, preserveAudio: e.target.checked }))}
                className="rounded border-gray-700 bg-cyber-card text-red-500 focus:ring-red-500 mt-0.5 h-4 w-4"
              />
              <span><strong>Preserve audit evidence:</strong> Export this forensic report for cyber defense / law enforcement if required.</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={exportReport}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-semibold text-cyber-cyan hover:bg-cyan-900/40 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Save Forensic Audit (.JSON)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAnalyzeAnother();
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-crimson-600 px-4 py-2 text-xs font-bold text-white shadow-cyber-crimson hover:scale-105 transition-all"
            >
              <span>Analyze Another Voice</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
