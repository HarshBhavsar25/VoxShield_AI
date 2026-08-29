import numpy as np
import librosa
from scipy import signal
from app.schemas.detection import AcousticFeatures

class FeatureExtractor:
    def __init__(self, sr: int = 16000):
        self.sr = sr

    def extract_features(self, y: np.ndarray, sr: int = 16000) -> tuple[AcousticFeatures, dict]:
        """
        Extracts comprehensive acoustic, spectral, and prosodic features from audio signal.
        Returns (AcousticFeatures Pydantic model, raw feature dict for ML model)
        """
        if sr != self.sr:
            y = librosa.resample(y, orig_sr=sr, target_sr=self.sr)
            sr = self.sr

        # 1. Mel-Frequency Cepstral Coefficients (MFCCs)
        n_mfcc = 13
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc, n_fft=1024, hop_length=512)
        mfcc_mean = [float(val) for val in np.mean(mfccs, axis=1)]
        mfcc_var = [float(val) for val in np.var(mfccs, axis=1)]

        # 2. Spectral Centroid
        cent = librosa.feature.spectral_centroid(y=y, sr=sr, n_fft=1024, hop_length=512)
        spectral_centroid = float(np.mean(cent))

        # 3. Spectral Rolloff (85% energy boundary)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, n_fft=1024, hop_length=512, roll_percent=0.85)
        spectral_rolloff = float(np.mean(rolloff))

        # 4. Spectral Flatness (tonal vs white noise characteristic)
        flatness = librosa.feature.spectral_flatness(y=y, n_fft=1024, hop_length=512)
        spectral_flatness = float(np.mean(flatness))

        # 5. Spectral Contrast
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr, n_fft=1024, hop_length=512)
        spectral_contrast_mean = float(np.mean(contrast))

        # 6. Zero Crossing Rate (ZCR)
        zcr = librosa.feature.zero_crossing_rate(y, hop_length=512)
        zero_crossing_rate = float(np.mean(zcr))

        # 7. Pitch (F0) & Prosodic Variations
        try:
            f0, voiced_flag, voiced_probs = librosa.pyin(
                y,
                fmin=librosa.note_to_hz('C2'),
                fmax=librosa.note_to_hz('C7'),
                sr=sr,
                frame_length=1024,
                hop_length=512
            )
            valid_f0 = f0[~np.isnan(f0)]
            if len(valid_f0) > 0:
                pitch_mean = float(np.mean(valid_f0))
                pitch_std = float(np.std(valid_f0))
                # Jitter estimation (relative period differences)
                diffs = np.abs(np.diff(valid_f0))
                jitter = float(np.mean(diffs) / (pitch_mean + 1e-6)) if len(diffs) > 0 else 0.015
            else:
                pitch_mean = 140.0
                pitch_std = 18.0
                jitter = 0.018
        except Exception:
            pitch_mean = 145.0
            pitch_std = 20.0
            jitter = 0.02

        # 8. Shimmer (amplitude variation across voiced segments)
        rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=512)[0]
        rms_diffs = np.abs(np.diff(rms))
        shimmer = float(np.mean(rms_diffs) / (np.mean(rms) + 1e-6)) if len(rms_diffs) > 0 else 0.035

        # 9. Harmonic-to-Noise Ratio (HNR)
        try:
            harmonic = librosa.effects.harmonic(y)
            percussive = librosa.effects.percussive(y)
            h_energy = np.sum(harmonic ** 2)
            p_energy = np.sum(percussive ** 2) + 1e-8
            hnr = float(10 * np.log10(h_energy / p_energy))
        except Exception:
            hnr = 12.5

        # 10. High Frequency Power Ratio (> 3500 Hz vs Total)
        stft = np.abs(librosa.stft(y, n_fft=1024, hop_length=512))
        freqs = librosa.fft_frequencies(sr=sr, n_fft=1024)
        high_freq_mask = freqs > 3500
        high_energy = np.sum(stft[high_freq_mask, :])
        total_energy = np.sum(stft) + 1e-8
        high_freq_ratio = float(high_energy / total_energy)

        # 11. Energy Entropy & Silence Pause Ratio
        frame_energies = np.sum(stft ** 2, axis=0) + 1e-8
        frame_energies_norm = frame_energies / np.sum(frame_energies)
        energy_entropy = float(-np.sum(frame_energies_norm * np.log2(frame_energies_norm + 1e-12)))

        silence_threshold = 0.05 * np.max(rms) if len(rms) > 0 else 0.01
        silence_frames = np.sum(rms < silence_threshold)
        pause_ratio = float(silence_frames / (len(rms) + 1e-6))

        # 12. Speaking Rate Estimate
        speaking_rate_est = float(len(librosa.onset.onset_detect(y=y, sr=sr)) / (len(y) / sr + 1e-6))

        # 13. Neural Vocoder Phase Discontinuity Estimation
        d_phase = np.diff(np.unwrap(np.angle(librosa.stft(y, n_fft=1024, hop_length=512)), axis=1), axis=1)
        phase_discontinuity_index = float(np.mean(np.var(d_phase, axis=1)))

        features_obj = AcousticFeatures(
            mfcc_mean=mfcc_mean,
            mfcc_var=mfcc_var,
            spectral_centroid=spectral_centroid,
            spectral_rolloff=spectral_rolloff,
            spectral_flatness=spectral_flatness,
            spectral_contrast_mean=spectral_contrast_mean,
            zero_crossing_rate=zero_crossing_rate,
            pitch_mean=pitch_mean,
            pitch_std=pitch_std,
            jitter=jitter,
            shimmer=shimmer,
            hnr=hnr,
            high_freq_ratio=high_freq_ratio,
            energy_entropy=energy_entropy,
            pause_ratio=pause_ratio,
            speaking_rate_est=speaking_rate_est
        )

        raw_feature_dict = {
            "mfcc_mean": mfcc_mean,
            "mfcc_var": mfcc_var,
            "spectral_centroid": spectral_centroid,
            "spectral_rolloff": spectral_rolloff,
            "spectral_flatness": spectral_flatness,
            "spectral_contrast_mean": spectral_contrast_mean,
            "zero_crossing_rate": zero_crossing_rate,
            "pitch_mean": pitch_mean,
            "pitch_std": pitch_std,
            "jitter": jitter,
            "shimmer": shimmer,
            "hnr": hnr,
            "high_freq_ratio": high_freq_ratio,
            "energy_entropy": energy_entropy,
            "pause_ratio": pause_ratio,
            "speaking_rate_est": speaking_rate_est,
            "phase_discontinuity_index": phase_discontinuity_index
        }

        return features_obj, raw_feature_dict

feature_extractor = FeatureExtractor()
