import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, AlertTriangle } from 'lucide-react';
import { getAudioUrl } from '../services/api';

interface AudioPlayerProps {
  src: string | Blob | undefined;
  title?: string;
  isAiGenerated?: boolean;
  onRestart?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = "Audio Playback",
  isAiGenerated = false,
  onRestart,
  className = ""
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>('');

  useEffect(() => {
    if (!src) {
      setAudioSrc('');
      return;
    }

    if (src instanceof Blob) {
      const objUrl = URL.createObjectURL(src);
      setAudioSrc(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    } else {
      setAudioSrc(getAudioUrl(src));
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback error:", e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    }
    if (onRestart) onRestart();
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!src) return null;

  return (
    <div className={`rounded-xl border ${isAiGenerated ? 'border-red-500/30 bg-red-950/20' : 'border-cyber-border bg-cyber-card/80'} p-4 ${className}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Header with AI or Human Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isAiGenerated ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : (
            <Shield className="h-4 w-4 text-emerald-400" />
          )}
          <span className="text-xs font-semibold text-gray-200 truncate">{title}</span>
        </div>

        {isAiGenerated ? (
          <span className="rounded border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 tracking-wider animate-pulse">
            AI-GENERATED SYNTHETIC
          </span>
        ) : (
          <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 tracking-wider">
            AUTHENTIC VOICE
          </span>
        )}
      </div>

      {/* Waveform Bar Simulation */}
      <div className="flex items-center gap-1 h-6 my-2 px-1">
        {Array.from({ length: 32 }).map((_, i) => {
          const progress = duration > 0 ? currentTime / duration : 0;
          const isPassed = (i / 32) <= progress;
          // Calculate dynamic height pattern
          const heights = [35, 60, 45, 90, 75, 40, 65, 80, 50, 100, 70, 45, 85, 95, 60, 30, 70, 85, 40, 65, 90, 50, 75, 60, 40, 80, 55, 35, 60, 45, 70, 30];
          const h = heights[i % heights.length];
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all ${
                isPassed 
                  ? (isAiGenerated ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,242,254,0.6)]') 
                  : 'bg-gray-800'
              }`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      {/* Scrub Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
        />
        <div className="flex justify-between text-[10px] font-mono text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              isAiGenerated 
                ? 'bg-red-500 text-white shadow-cyber-crimson hover:bg-red-600' 
                : 'bg-cyber-cyan text-cyber-darkest shadow-cyber-cyan hover:bg-cyan-300'
            } transition-all active:scale-95`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-cyber-card text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
            title="Restart playback"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-cyber-card text-gray-400 hover:text-gray-200 transition-all"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};
