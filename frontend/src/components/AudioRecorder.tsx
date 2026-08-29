import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  maxDuration?: number; // default 10 seconds
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 10
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasConsent, setHasConsent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const drawLiveWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(11, 15, 25, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00F2FE';
      ctx.shadowColor = '#00F2FE';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    if (!hasConsent) {
      setError("Please acknowledge the recording consent before proceeding.");
      return;
    }

    setError(null);
    setRecordedBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio Context for Live Visualizer
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      drawLiveWaveform();

      // MediaRecorder Setup
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);
        onRecordingComplete(blob, recordingTime || 1);

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      // Timer
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 0.1;
        setRecordingTime(Math.round(elapsed * 10) / 10);

        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 100);

    } catch (err) {
      setError("Microphone access denied. Please grant microphone permission to record.");
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Consent & Safety Warning */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-200/90 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">Biometric Permission Notice: </span>
          Only analyze voice recordings you have permission to use. Voice samples contain sensitive biometric characteristics.
        </div>
      </div>

      {/* Canvas for Live Audio Waveform */}
      <div className="relative overflow-hidden rounded-xl border border-cyber-border bg-cyber-darkest p-2">
        <canvas
          ref={canvasRef}
          width={500}
          height={80}
          className="w-full h-20 rounded-lg bg-cyber-darker"
        />

        {/* Live Recording Overlay */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-crimson-500/20 border border-red-500/40 px-3 py-1 text-xs font-mono text-red-400 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span>REC {recordingTime.toFixed(1)}s / {maxDuration}s</span>
          </div>
        )}

        {!isRecording && !recordedBlob && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 pointer-events-none">
            Microphone waveform will appear here during recording
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-cyber-darkest shadow-cyber-cyan hover:scale-105 active:scale-95 transition-all"
            >
              <Mic className="h-4 w-4" />
              <span>{recordedBlob ? 'Re-record Sample' : 'Start Recording'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-crimson-600 px-5 py-2.5 text-sm font-bold text-white shadow-cyber-crimson hover:scale-105 active:scale-95 transition-all animate-pulse"
            >
              <Square className="h-4 w-4" />
              <span>Stop Recording ({recordingTime.toFixed(1)}s)</span>
            </button>
          )}

          {recordedBlob && !isRecording && (
            <button
              onClick={resetRecording}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {recordedBlob && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>Voice Sample Ready ({recordingTime.toFixed(1)}s)</span>
          </div>
        )}
      </div>

      {/* Consent Checkbox */}
      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={hasConsent}
          onChange={(e) => setHasConsent(e.target.checked)}
          className="rounded border-gray-700 bg-cyber-card text-cyber-cyan focus:ring-cyber-cyan h-3.5 w-3.5"
        />
        <span>I confirm this is my voice or an authorized demonstration sample.</span>
      </label>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
