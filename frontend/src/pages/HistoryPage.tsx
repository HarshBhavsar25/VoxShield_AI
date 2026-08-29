import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  FileText, 
  Download, 
  Filter, 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  X,
  Languages
} from 'lucide-react';
import { apiService, getAudioUrl } from '../services/api';
import { HistoryItem, DetectionResult } from '../types';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { AcousticChart } from '../components/AcousticChart';
import { AudioPlayer } from '../components/AudioPlayer';

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<DetectionResult | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchHistory = async (filter: string = filterBy) => {
    setLoading(true);
    try {
      const data = await apiService.getHistory(filter);
      setHistoryItems(data);
    } catch (e) {
      console.error("Error fetching history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(filterBy);
  }, [filterBy]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this biometric audit record?")) {
      try {
        await apiService.deleteHistory(id);
        setHistoryItems(prev => prev.filter(item => item.id !== id));
        if (selectedReport?.id === id) {
          setSelectedReport(null);
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleOpenReport = async (id: string) => {
    setReportLoading(true);
    try {
      const report = await apiService.getReport(id);
      setSelectedReport(report);
    } catch (err) {
      console.error("Report fetch error:", err);
    } finally {
      setReportLoading(false);
    }
  };

  const exportAllHistory = () => {
    const blob = new Blob([JSON.stringify(historyItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoxShield_History_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-6 w-6 text-cyber-cyan" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Detection Audit History
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete forensic log of analyzed audio streams, acoustic indicators, and risk evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchHistory(filterBy)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-cyber-card px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {historyItems.length > 0 && (
            <button
              onClick={exportAllHistory}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyber-card px-3 py-2 text-xs font-semibold text-cyber-cyan hover:bg-cyan-500/10 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 mr-2">
          <Filter className="h-3.5 w-3.5" />
          Filter:
        </span>

        {[
          { id: 'all', label: 'All Records' },
          { id: 'human', label: 'Human Voices' },
          { id: 'ai', label: 'AI Clones' },
          { id: 'uncertain', label: 'Uncertain' },
          { id: 'high_risk', label: 'High Risk Alerts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterBy(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterBy === tab.id
                ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/40 shadow-cyber-cyan/10'
                : 'bg-cyber-card text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-cyber-border bg-cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-cyber-darkest text-gray-400 border-b border-gray-800 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Audio Stream</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">AI Probability</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Recorded Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {historyItems.length > 0 ? (
                historyItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenReport(item.id)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-white flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-gray-500" />
                      <span className="truncate max-w-[160px]">{item.filename}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-300">{item.language}</td>
                    <td className="py-3.5 px-4">
                      {item.result === 'AI_GENERATED' ? (
                        <span className="rounded border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                          AI_GENERATED
                        </span>
                      ) : item.result === 'HUMAN' ? (
                        <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          HUMAN
                        </span>
                      ) : (
                        <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          UNCERTAIN
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={item.ai_probability > 0.65 ? 'text-red-400' : 'text-emerald-400'}>
                        {(item.ai_probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.risk_level === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' :
                        item.risk_level === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">
                      {(item.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                      {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReport(item.id);
                          }}
                          className="p-1 rounded text-cyan-400 hover:bg-cyan-950/50"
                          title="View Full Report"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/30"
                          title="Delete Record (GDPR / Privacy)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    {loading ? 'Loading audit records...' : 'No detection history found for the selected filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Report Modal / Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-cyber-card p-6 shadow-cyber-card space-y-6">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-gray-800 pb-4">
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                FORENSIC AUDIT RECORD • {selectedReport.id}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedReport.filename}
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 font-mono">
                <span>Language: <strong className="text-white">{selectedReport.language}</strong></span>
                <span>•</span>
                <span>Date: {new Date(selectedReport.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Audio Playback */}
            {selectedReport.audio_url && (
              <AudioPlayer
                src={selectedReport.audio_url}
                title={selectedReport.filename}
                isAiGenerated={selectedReport.result === 'AI_GENERATED'}
              />
            )}

            {/* Confidence Gauge */}
            <div className="p-4 rounded-xl bg-cyber-darkest border border-gray-800">
              <ConfidenceMeter
                aiProbability={selectedReport.ai_probability}
                humanProbability={selectedReport.human_probability}
                confidence={selectedReport.confidence}
                result={selectedReport.result}
                riskLevel={selectedReport.risk_level}
                size={140}
              />
            </div>

            {/* Detected Indicators */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Forensic Indicators
              </h4>
              <div className="space-y-1.5">
                {selectedReport.indicators.map((ind, i) => (
                  <div key={i} className="text-xs text-gray-200 bg-cyber-darkest p-2.5 rounded-lg border border-gray-800">
                    • {ind}
                  </div>
                ))}
              </div>
            </div>

            {/* Acoustic Chart */}
            <AcousticChart
              features={selectedReport.acoustic_features}
              technicalDetails={selectedReport.technical_details}
            />

          </div>
        </div>
      )}

    </div>
  );
};
