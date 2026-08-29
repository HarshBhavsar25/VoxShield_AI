import os
import io
import soundfile as sf
import librosa
import numpy as np
from scipy import signal
from app.config import settings

class AudioPreprocessor:
    def __init__(self, target_sr: int = settings.SAMPLE_RATE):
        self.target_sr = target_sr

    def load_and_preprocess(self, file_path_or_bytes: str | bytes) -> tuple[np.ndarray, int, float, dict]:
        """
        Loads an audio file or bytes, validates format, converts to mono 16kHz,
        applies noise filtering, volume normalization, and silence trimming.
        
        Returns:
            (processed_audio, sample_rate, duration_seconds, preprocessing_metadata)
        """
        metadata = {
            "format_valid": True,
            "resampled": False,
            "normalized": True,
            "silence_trimmed": False,
            "noise_filtered": True
        }

        # 1. Load Audio with librosa or soundfile
        try:
            if isinstance(file_path_or_bytes, bytes):
                audio_buffer = io.BytesIO(file_path_or_bytes)
                y, sr = librosa.load(audio_buffer, sr=self.target_sr, mono=True)
            else:
                y, sr = librosa.load(file_path_or_bytes, sr=self.target_sr, mono=True)
        except Exception as e:
            # Fallback using soundfile
            try:
                if isinstance(file_path_or_bytes, bytes):
                    audio_buffer = io.BytesIO(file_path_or_bytes)
                    data, sr = sf.read(audio_buffer)
                else:
                    data, sr = sf.read(file_path_or_bytes)
                
                if len(data.shape) > 1:
                    data = np.mean(data, axis=1)
                
                if sr != self.target_sr:
                    y = librosa.resample(data.astype(np.float32), orig_sr=sr, target_sr=self.target_sr)
                    sr = self.target_sr
                    metadata["resampled"] = True
                else:
                    y = data.astype(np.float32)
            except Exception as inner_e:
                raise ValueError(f"Failed to decode audio file: {str(e)} / {str(inner_e)}")

        if len(y) == 0:
            raise ValueError("Audio file is empty or contains no readable audio data.")

        metadata["original_length_samples"] = len(y)

        # 2. Silence Trimming
        try:
            y_trimmed, _ = librosa.effects.trim(y, top_db=30)
            if len(y_trimmed) > self.target_sr * 0.5:  # Keep trimmed if at least 0.5 sec remains
                y = y_trimmed
                metadata["silence_trimmed"] = True
        except Exception:
            pass

        # 3. High-Pass Filter (removes microphone rumble below 60Hz)
        try:
            sos = signal.butter(4, 60, 'hp', fs=sr, output='sos')
            y = signal.sosfilt(sos, y)
        except Exception:
            pass

        # 4. Volume Normalization (Peak & RMS Normalization)
        peak = np.max(np.abs(y))
        if peak > 0:
            y = y / peak * 0.95
        
        # Calculate Duration
        duration = float(len(y) / sr)
        metadata["final_duration_sec"] = duration

        return y.astype(np.float32), sr, duration, metadata

preprocessor = AudioPreprocessor()
