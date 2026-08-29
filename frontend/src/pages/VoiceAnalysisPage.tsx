import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Upload, 
  Mic, 
  Play, 
  FileAudio, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Languages, 
  Trash2, 
  RotateCcw, 
  Download, 
  Shield, 
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { apiService, getAudioUrl } from '../services/api';
import { DetectionResult, SampleVoice } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { PreprocessingTracker } from '../components/PreprocessingTracker';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { AcousticChart } from '../components/AcousticChart';
import { PreventionModal } from '../components/PreventionModal';

interface VoiceAnalysisPageProps {
  initialAudioUrl?: string;
  initialIsSimulation?: boolean;
}

export const VoiceAnalysisPage: React.FC<VoiceAnalysisPageProps> = ({
  initialAudioUrl,
  initialIsSimulation = false
}) => {
  // Input Modes
  const [inputMode, setInputMode] = useState<'upload' | 'record' | 'preset'>('upload');
  
  // Selected Audio State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleVoice | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | undefined>(initialAudioUrl);
  
  // Metadata & Config
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Auto');
  const [sampleVoices, setSampleVoices] = useState<SampleVoice[]>([]);
  
  // Pipeline State
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreventionOpen, setIsPreventionOpen] = useState(false);

  // Load sample voices on mount
  useEffect(() => {
    apiService.getSampleVoices()
      .then(samples => setSampleVoices(samples))
      .catch(err => console.error("Failed to load sample voices:", err));
  }, []);

  // If initialAudioUrl was passed (e.g. from Attack Simulator)
  useEffect(() => {
    if (initialAudioUrl) {
      setAudioPreviewUrl(initialAudioUrl);
      setInputMode('upload');
    }
  }, [initialAudioUrl]);

  // Handle File Upload Drop / Select
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setRecordedBlob(null);
      setSelectedSample(null);
      setAudioPreviewUrl(URL.createObjectURL(file));
      setDetectionResult(null);
      setError(null);
    }
  };

  // Handle Microphone Recording
  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setRecordedBlob(blob);
    setSelectedFile(null);
    setSelectedSample(null);
    setAudioPreviewUrl(URL.createObjectURL(blob));
    setDetectionResult(null);
    setError(null);
  };

  // Handle Preset Sample Selection
  const handleSelectPreset = (sample: SampleVoice) => {
    setSelectedSample(sample);
    setSelectedFile(null);
    setRecordedBlob(null);
    setSelectedLanguage(sample.language);
    setAudioPreviewUrl(getAudioUrl(sample.audio_url));
    setDetectionResult(null);
    setError(null);
  };

  // Reset/Clear workspace
  const handleClear = () => {
    setSelectedFile(null);
    setRecordedBlob(null);
    setSelectedSample(null);
    setAudioPreviewUrl(undefined);
    setDetectionResult(null);
    setError(null);
  };

  // Run Full Acoustic Analysis Pipeline
  const handleAnalyze = async () => {
    if (!selectedFile && !recordedBlob && !selectedSample && !audioPreviewUrl) {
      setError("Please record audio, upload a file, or select a preset sample first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setDetectionResult(null);

    try {
      let res: DetectionResult;

      if (selectedSample) {
        res = await apiService.analyzeAudio({
          sample_id: selectedSample.id,
          language: selectedLanguage === 'Auto' ? selectedSample.language : selectedLanguage,
          is_simulation: selectedSample.type === 'ai'
        });
      } else if (recordedBlob) {
        res = await apiService.analyzeAudio({
          file: recordedBlob,
          filename: 'mic_recording.wav',
          language: selectedLanguage,
          is_simulation: initialIsSimulation
        });
      } else if (selectedFile) {
        res = await apiService.analyzeAudio({
          file: selectedFile,
          filename: selectedFile.name,
          language: selectedLanguage,
          is_simulation: initialIsSimulation
        });
      } else if (audioPreviewUrl) {
        // Filename from preview url
        const filename = audioPreviewUrl.split('/').pop() || 'analyzed_audio.wav';
        res = await apiService.analyzeAudio({
          sample_id: filename.replace('.wav', ''),
          language: selectedLanguage,
          is_simulation: initialIsSimulation
        });
      } else {
        throw new Error("No valid audio source found.");
      }

      setDetectionResult(res);

    } catch (err: unknown) {
      const e = err as Error;
      console.error("Analysis failed:", e);
      setError(e.message || "Failed to complete audio analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-cyber-cyan" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Voice Authenticity Analysis
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Extract biological vocal cord biomarkers and neural vocoder artifacts to verify speech authenticity.
          </p>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-xl p-1.5 text-xs">
          <Languages className="h-4 w-4 text-cyber-cyan ml-2" />
          <span className="text-gray-400 font-medium">Language Context:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-cyber-darkest border border-gray-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-cyber-cyan"
          >
            <option value="Auto">Auto-Detect Language</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="English">English (Indian)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Input Workspace & Results Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Audio Ingestion & Player (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 shadow-cyber-card space-y-5">
            
            {/* Input Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-cyber-darkest p-1.5 rounded-xl border border-gray-800 text-xs font-semibold">
              <button
                onClick={() => setInputMode('upload')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  inputMode === 'upload' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => setInputMode('record')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  inputMode === 'record' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Record</span>
              </button>

              <button
                onClick={() => setInputMode('preset')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  inputMode === 'preset' ? 'bg-cyan-500/20 text-cyber-cyan border border-cyan-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Presets</span>
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {inputMode === 'upload' && (
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-cyan-500/50 rounded-xl p-6 bg-cyber-darkest/60 cursor-pointer transition-all group">
                  <div className="p-3 rounded-full bg-cyan-500/10 text-cyber-cyan group-hover:scale-110 transition-transform">
                    <FileAudio className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-white mt-3">
                    {selectedFile ? selectedFile.name : 'Choose Audio File or Drag & Drop'}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1">
                    Supports WAV, MP3, M4A, OGG (Max 25MB, up to 60s)
                  </span>
                  <input
                    type="file"
                    accept="audio/*,.wav,.mp3,.m4a,.ogg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Mode 2: Live Recording */}
            {inputMode === 'record' && (
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                maxDuration={10}
              />
            )}

            {/* Mode 3: Curated Presets for Judges & Testing */}
            {inputMode === 'preset' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  Select a pre-loaded sample recording to test authentic vs cloned speech instantly:
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {sampleVoices.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectPreset(sample)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedSample?.id === sample.id
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-cyber-cyan/10'
                          : 'border-gray-800 bg-cyber-darkest hover:border-gray-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{sample.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            sample.type === 'ai' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {sample.type === 'ai' ? 'AI CLONE' : 'HUMAN'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{sample.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Playback & Metadata Card */}
            {audioPreviewUrl && (
              <div className="space-y-3 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">Active Audio Sample:</span>
                  <button
                    onClick={handleClear}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear Audio</span>
                  </button>
                </div>

                <AudioPlayer
                  src={audioPreviewUrl}
                  title={selectedFile?.name || selectedSample?.name || 'Voice Stream'}
                  isAiGenerated={selectedSample?.type === 'ai' || initialIsSimulation}
                />

                {/* Primary Action Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isProcessing}
                  className="w-full btn-cyber-primary flex items-center justify-center gap-2 text-sm mt-4 py-3"
                >
                  <Radio className="h-4 w-4" />
                  <span>{isProcessing ? 'Analyzing Acoustic Features...' : 'Run Authenticity Analysis'}</span>
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-3 rounded-xl">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

          </div>

          {/* Live Preprocessing Tracker */}
          <PreprocessingTracker
            isRunning={isProcessing}
          />

        </div>

        {/* Right Column: Forensic Results & Explainability (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {detectionResult ? (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Primary Detection Result Banner */}
              <div className={`rounded-2xl border ${
                detectionResult.risk_level === 'HIGH' 
                  ? 'glass-panel-danger' 
                  : detectionResult.risk_level === 'LOW' 
                  ? 'glass-panel-success' 
                  : 'glass-panel-glow'
              } p-6 space-y-6`}>
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      detectionResult.result === 'AI_GENERATED' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {detectionResult.result === 'AI_GENERATED' ? (
                        <ShieldAlert className="h-6 w-6" />
                      ) : (
                        <ShieldCheck className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                        AUDIT ID: {detectionResult.id.slice(0, 8)}
                      </span>
                      <h2 className="text-xl font-bold text-white">
                        {detectionResult.result === 'AI_GENERATED' ? 'AI Voice Clone Suspected' : 'Authentic Human Voice Verified'}
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block font-mono">
                      Language: <strong className="text-white">{detectionResult.language}</strong> ({(detectionResult.language_confidence * 100).toFixed(0)}%)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Duration: {detectionResult.duration.toFixed(1)}s | 16kHz
                    </span>
                  </div>
                </div>

                {/* Circular Confidence Meter */}
                <ConfidenceMeter
                  aiProbability={detectionResult.ai_probability}
                  humanProbability={detectionResult.human_probability}
                  confidence={detectionResult.confidence}
                  result={detectionResult.result}
                  riskLevel={detectionResult.risk_level}
                />

                {/* Detection Indicators */}
                <div className="rounded-xl bg-cyber-darkest p-4 border border-gray-800 space-y-3">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                    Observed Acoustic Indicators
                  </span>
                  <div className="space-y-2">
                    {detectionResult.indicators.map((ind, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-200">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                          detectionResult.result === 'AI_GENERATED' ? 'text-red-400' : 'text-emerald-400'
                        }`} />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explainable AI Rationale */}
                <div className="rounded-xl bg-gray-900/60 p-4 border border-gray-800 space-y-2">
                  <span className="text-xs font-bold text-cyber-cyan uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Why was this audio classified as {detectionResult.result}?
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {detectionResult.explanation}
                  </p>
                </div>

                {/* Prevention CTA Button */}
                {detectionResult.risk_level === 'HIGH' && (
                  <button
                    onClick={() => setIsPreventionOpen(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-crimson-600 text-white font-bold text-xs shadow-cyber-crimson flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>View Prevention Protocol & Verification Checklist</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

              </div>

              {/* Explainable Forensic Acoustic Charts */}
              <AcousticChart
                features={detectionResult.acoustic_features}
                technicalDetails={detectionResult.technical_details}
              />

              {/* Prevention Modal */}
              <PreventionModal
                result={detectionResult}
                isOpen={isPreventionOpen}
                onClose={() => setIsPreventionOpen(false)}
                onAnalyzeAnother={handleClear}
              />

            </div>
          ) : (
            /* Empty State Guide */
            <div className="rounded-2xl border border-gray-800 bg-cyber-card/40 p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20">
                <Radio className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Awaiting Voice Stream Input</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Provide an audio sample on the left panel (upload, record 10s voice, or select a preset Marathi/Hindi voice clone) to generate acoustic deepfake biomarkers and risk assessments.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleSelectPreset(sampleVoices[1] || { id: 'marathi_ai_clone', name: 'Marathi AI Cloned Voice', language: 'Marathi', language_code: 'mr', type: 'ai', filename: 'marathi_ai_clone.wav', audio_url: '/api/audio/sample/marathi_ai_clone.wav', description: 'Banking phishing clone' })}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyber-cyan hover:bg-cyan-500/20 transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Test Instant Marathi Deepfake Preset</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
