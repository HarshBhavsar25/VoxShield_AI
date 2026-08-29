import React, { useState } from 'react';
import { 
  FlaskConical, 
  ShieldAlert, 
  Sparkles, 
  Radio, 
  Languages, 
  Play, 
  Upload, 
  Mic, 
  FileAudio, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Cpu, 
  FileText,
  RefreshCw,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import { SimulationResult, NavigationTab } from '../types';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';

interface AttackSimulatorPageProps {
  onAnalyzeGenerated: (audioUrl: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const AttackSimulatorPage: React.FC<AttackSimulatorPageProps> = ({
  onAnalyzeGenerated,
  onNavigate
}) => {
  // Step 1: Voice Sample
  const [sampleMode, setSampleMode] = useState<'preset' | 'upload' | 'record'>('preset');
  const [selectedVoiceFile, setSelectedVoiceFile] = useState<File | null>(null);
  const [recordedVoiceBlob, setRecordedVoiceBlob] = useState<Blob | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string>('/api/audio/sample/marathi_authentic_human.wav');

  // Step 2: Language
  const [selectedLanguage, setSelectedLanguage] = useState('Marathi');

  // Step 3: Script & Scenario
  const [scenarioType, setScenarioType] = useState('urgent_financial');
  const [scriptText, setScriptText] = useState(
    'नमस्कार, मी बँकेतून बोलत आहे. तुमच्या खात्यामध्ये तात्काळ संशयास्पद व्यवहार आढळला आहे. खाते सुरक्षित ठेवण्यासाठी त्वरित ५०,००० रुपये व्हेरिफिकेशन खात्यावर ट्रान्सफर करा.'
  );
  const [translationText, setTranslationText] = useState(
    'Hello, I am calling from the bank. Suspicious activity was detected on your account. Transfer ₹50,000 to the verification account immediately to avoid blockage.'
  );

  // Step 4: Output Synthesis
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate Demonstration Script from Preset Scenarios
  const handleGenerateScript = async (type: string) => {
    setScenarioType(type);
    try {
      const res = await apiService.generateScript(selectedLanguage, type);
      setScriptText(res.script);
      setTranslationText(res.english_translation);
    } catch (e) {
      console.error("Script generation error:", e);
    }
  };

  // Run Synthesis
  const handleSimulateAttack = async () => {
    if (!scriptText.trim()) {
      setError("Please enter or generate a demonstration script.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await apiService.simulateVoice({
        language: selectedLanguage,
        script: scriptText,
        source_voice: selectedVoiceFile || recordedVoiceBlob || undefined
      });
      setSimulationResult(res);
    } catch (err: unknown) {
      const e = err as Error;
      console.error("Simulation failed:", e);
      setError(e.message || "Failed to generate demonstration clone.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header & Safety Notice */}
      <div className="border-b border-gray-800 pb-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Attack Simulation Lab
                </h1>
                <span className="rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-xs font-mono">
                  Module A
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Demonstrate how a voice-cloning attack is created using an authorized voice sample.
              </p>
            </div>
          </div>

          <div className="rounded-full border border-purple-500/30 bg-purple-950/20 px-3 py-1 text-xs text-purple-300 font-mono">
            Safety Guardrails Enforced
          </div>
        </div>

        {/* Mandatory Safety Warning Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3.5 text-xs text-amber-200/90 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Controlled Demonstration Environment:</strong> This feature is for controlled security demonstrations and authorized voice samples only. Generated audio is synthetic, strictly labeled as <strong>AI-GENERATED</strong>, and must not be represented as a real person's statement.
          </p>
        </div>
      </div>

      {/* 4-Step Wizard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Attack Configuration Wizard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Voice Sample */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs uppercase tracking-wider">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyber-cyan text-[10px]">1</span>
                <span>Authorized Voice Sample (Target: ~10s)</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">Status: Ready</span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-cyber-darkest p-1 rounded-lg border border-gray-800 text-xs">
              <button
                onClick={() => {
                  setSampleMode('preset');
                  setOriginalAudioUrl('/api/audio/sample/marathi_authentic_human.wav');
                }}
                className={`py-1.5 rounded font-medium transition-all ${
                  sampleMode === 'preset' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Sample Preset
              </button>
              <button
                onClick={() => setSampleMode('upload')}
                className={`py-1.5 rounded font-medium transition-all ${
                  sampleMode === 'upload' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setSampleMode('record')}
                className={`py-1.5 rounded font-medium transition-all ${
                  sampleMode === 'record' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Record Mic
              </button>
            </div>

            {sampleMode === 'upload' && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4 bg-cyber-darkest cursor-pointer hover:border-purple-500/50 transition-all">
                <Upload className="h-5 w-5 text-purple-400" />
                <span className="text-xs text-gray-300 mt-2">
                  {selectedVoiceFile ? selectedVoiceFile.name : 'Upload target reference WAV/MP3'}
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const f = e.target.files[0];
                      setSelectedVoiceFile(f);
                      setOriginalAudioUrl(URL.createObjectURL(f));
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}

            {sampleMode === 'record' && (
              <AudioRecorder
                onRecordingComplete={(blob) => {
                  setRecordedVoiceBlob(blob);
                  setOriginalAudioUrl(URL.createObjectURL(blob));
                }}
                maxDuration={10}
              />
            )}

            {originalAudioUrl && (
              <div className="pt-2">
                <AudioPlayer
                  src={originalAudioUrl}
                  title="Source Reference Voice Sample"
                  isAiGenerated={false}
                />
              </div>
            )}
          </div>

          {/* Step 2: Language Selection */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs uppercase tracking-wider">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyber-cyan text-[10px]">2</span>
              <span>Target Synthesis Language</span>
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const lang = e.target.value;
                setSelectedLanguage(lang);
                handleGenerateScript(scenarioType);
              }}
              className="w-full bg-cyber-darkest border border-gray-700 text-white rounded-xl p-3 text-xs outline-none focus:border-purple-400"
            >
              <option value="Marathi">Marathi (मराठी) - SIH Primary Focus</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="English">English (Indian Accent)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          {/* Step 3: Script Generator */}
          <div className="rounded-xl border border-cyber-border bg-cyber-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs uppercase tracking-wider">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyber-cyan text-[10px]">3</span>
                <span>Phishing Pretext Script</span>
              </div>

              {/* Scenario Presets */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => handleGenerateScript('urgent_financial')}
                  className={`px-2.5 py-1 rounded-md border ${
                    scenarioType === 'urgent_financial' ? 'bg-red-950/60 text-red-400 border-red-500/40 font-bold' : 'border-gray-800 text-gray-400'
                  }`}
                >
                  Bank Fraud
                </button>
                <button
                  onClick={() => handleGenerateScript('family_emergency')}
                  className={`px-2.5 py-1 rounded-md border ${
                    scenarioType === 'family_emergency' ? 'bg-amber-950/60 text-amber-400 border-amber-500/40 font-bold' : 'border-gray-800 text-gray-400'
                  }`}
                >
                  Family Distress
                </button>
                <button
                  onClick={() => handleGenerateScript('general_demo')}
                  className={`px-2.5 py-1 rounded-md border ${
                    scenarioType === 'general_demo' ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40 font-bold' : 'border-gray-800 text-gray-400'
                  }`}
                >
                  General Demo
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Enter regional demonstration text..."
              className="w-full bg-cyber-darkest border border-gray-700 text-white rounded-xl p-3 text-xs outline-none focus:border-purple-400 font-sans"
            />

            {translationText && (
              <div className="rounded-lg bg-gray-900/80 p-2.5 border border-gray-800 text-[11px] text-gray-400">
                <strong className="text-gray-300">English Translation: </strong>
                {translationText}
              </div>
            )}
          </div>

          {/* Step 4: Action Button */}
          <button
            onClick={handleSimulateAttack}
            disabled={isGenerating}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="h-4 w-4" />
            <span>{isGenerating ? 'Synthesizing Demonstration Clone...' : 'Generate Synthetic Clone (Module A)'}</span>
          </button>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-3 rounded-xl">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Simulation Result & Detection Bridge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border border-red-500/40 bg-cyber-card p-6 shadow-cyber-crimson space-y-5">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Controlled Attack Result
              </span>
              <span className="rounded bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono font-bold animate-pulse">
                AI-GENERATED
              </span>
            </div>

            {simulationResult ? (
              <div className="space-y-4 animate-in fade-in">
                
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Generated Voice Clone ({simulationResult.language}):
                  </span>
                  <AudioPlayer
                    src={simulationResult.audio_url}
                    title={`Synthetic ${simulationResult.language} Phishing Clone`}
                    isAiGenerated={true}
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyber-darkest border border-gray-800 space-y-1.5 text-xs text-gray-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Duration:</span>
                    <span className="text-white">{simulationResult.duration.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Tag:</span>
                    <span className="text-red-400 font-bold">{simulationResult.status}</span>
                  </div>
                </div>

                {/* SIH Core Flow CTA: Analyze Generated Voice */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onAnalyzeGenerated(simulationResult.audio_url)}
                    className="w-full btn-cyber-primary py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Radio className="h-4 w-4" />
                    <span>Analyze Generated Voice in Detector →</span>
                  </button>
                  <p className="text-[11px] text-center text-gray-400">
                    Sends this cloned stream directly to the VoxShield AI detection engine.
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <FlaskConical className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Complete steps 1–3 on the left and click "Generate Synthetic Clone" to produce demonstration audio.
                </p>
              </div>
            )}

          </div>

          {/* Demonstration Architecture Explainer */}
          <div className="rounded-xl border border-gray-800 bg-cyber-darker p-4 space-y-2 text-xs text-gray-400">
            <span className="font-bold text-gray-300 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              SIH26104 Defense Loop
            </span>
            <p className="text-[11px] leading-relaxed">
              <strong>Real Voice</strong> → <strong>Voice Cloning Simulation</strong> → <strong>AI-Generated Voice</strong> → <strong>VoxShield Detector</strong> → <strong>Acoustic Flags &amp; Risk Mitigation</strong>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
