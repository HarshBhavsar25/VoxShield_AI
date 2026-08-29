# VoxShield AI

## Multilingual AI Voice Clone Detection & Impersonation Prevention System
### *Detect. Verify. Defend Against AI Voice Impersonation.*

**Smart India Hackathon Problem Statement**: **SIH26104**  
**Category**: Cybersecurity, Artificial Intelligence, Digital Signal Processing (DSP)  
**Supported Languages**: Marathi (मराठी), Hindi (हिन्दी), English (Indian), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ)

---

## 1. Executive Summary

**VoxShield AI** is an end-to-end cybersecurity defense platform engineered to detect synthetic AI-generated voice clones, mitigate regional voice phishing (*vishing*) attacks, and provide explainable acoustic evidence to protect citizens, enterprises, and financial institutions.

> **Crucial Positioning**: VoxShield AI is an **AI Voice Detection & Prevention Platform**. The **Controlled Attack Simulation Lab** exists exclusively as a demonstration module to educate stakeholders and generate test data for defensive verification.

```
+-------------------------------------------------------------------------+
|                               VOXSHIELD AI                              |
|                                                                         |
|   +--------------------------+          +---------------------------+   |
|   |        MODULE A          |          |         MODULE B          |   |
|   | Controlled Attack Lab    |          |  Acoustic Voice Detector  |   |
|   |  (Regional Cloning Demo) | -------> |   (Forensics & Risk XAI)  |   |
|   +--------------------------+          +---------------------------+   |
|                                                      |                  |
|                                                      v                  |
|                                         +---------------------------+   |
|                                         | Active Prevention Engine  |   |
|                                         |  (Checklists & Out-of-Band|   |
|                                         |    Verification Protocol) |   |
|                                         +---------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 2. Key Capabilities & Technical Innovation

1. **6-Stage Acoustic Preprocessing Pipeline**:
   - Audio decoding (WAV, MP3, M4A, OGG, WebM)
   - 4th-order Butterworth high-pass filtering (>60Hz) to eliminate microphone rumble
   - 16,000 Hz resampling and peak/RMS volume normalization
   - Non-voiced silence trimming
2. **Explainable Forensic Biomarkers**:
   - **13 MFCCs**: Timbre and vocal tract shape envelope
   - **Pitch Trajectory & Micro-Tremor ($F_0$, Jitter, Shimmer)**: Differentiates biological vocal cord vibrations from artificial TTS flatness
   - **High-Frequency Harmonic Decay**: Detects steep cutoff above 3.8 kHz typical of neural vocoders
   - **STFT Phase Discontinuity Index**: Measures frame-to-frame vocoder phase reconstruction variance
3. **Multilingual Regional Context**:
   - Calibrated for 8 Indian languages, with primary testbeds in **Marathi** and **Hindi**.
4. **Interactive 11-Step SIH Judge Guided Demo Tour**:
   - 2-minute end-to-end interactive workflow built into the header with one-click presets.
5. **Zero-Shot Generalization Benchmarking**:
   - Evaluated against unseen voice generators: ElevenLabs v2, Coqui XTTS v2, Meta Voicebox, Bark, OpenAI TTS-HD.
6. **Biometric Privacy & Right to Erasure**:
   - Ephemeral processing, strict recording consent prompts, and one-click data deletion.

---

## 3. Project Structure

```
VoxShield_AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── detection.py        # /api/audio/analyze, /api/audio/upload, /api/sample-voices
│   │   │   ├── simulation.py       # /api/voice/simulate, /api/script/generate
│   │   │   ├── history.py          # /api/history, /api/report/{id}, /api/history/stats
│   │   │   └── insights.py         # /api/insights/metrics
│   │   ├── core/
│   │   │   ├── preprocessor.py     # Resampling, filtering, normalization
│   │   │   ├── feature_extractor.py# 13 MFCCs, Spectral, Pitch, Jitter/Shimmer, Phase
│   │   │   ├── detector.py         # BaseVoiceDetector & EnsembleVoiceDetector
│   │   │   ├── risk_engine.py      # LOW, MEDIUM, HIGH multi-factor risk assessment
│   │   │   ├── explainability.py   # Human-readable rationales & acoustic indicators
│   │   │   ├── language_detector.py# Multilingual mapping & confidence estimation
│   │   │   └── synthesizer.py      # Regional TTS adapter (Module A)
│   │   ├── models/                 # SQLAlchemy DB models (AnalysisRecord, SimulationRecord)
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── sample_data/files/      # Preloaded authentic & cloned voices (Marathi, Hindi, English)
│   │   ├── config.py               # Application configuration & thresholds
│   │   ├── database.py             # SQLite async DB connection
│   │   └── main.py                 # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_api.py             # Automated API integration test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Brand bar + SIH badge + SIH Demo CTA
│   │   │   ├── Sidebar.tsx         # Cybersecurity console navigation
│   │   │   ├── AudioRecorder.tsx   # Live mic recording with Canvas visualizer
│   │   │   ├── AudioPlayer.tsx     # Custom waveform audio player
│   │   │   ├── PreprocessingTracker.tsx # 6-stage live pipeline tracker
│   │   │   ├── ConfidenceMeter.tsx # Radial circular SVG confidence gauge
│   │   │   ├── AcousticChart.tsx   # Interactive MFCC & Spectral charts
│   │   │   ├── PreventionModal.tsx # Incident response & caller checklist
│   │   │   └── SIHDemoModal.tsx    # 11-step interactive judge walkthrough
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx     # Modern cyber landing page
│   │   │   ├── DashboardPage.tsx   # Threat telemetry & recent detection feed
│   │   │   ├── VoiceAnalysisPage.tsx # Core detection workspace
│   │   │   ├── AttackSimulatorPage.tsx # Module A Controlled Simulation Lab
│   │   │   ├── HistoryPage.tsx     # Filterable forensic logs & reports
│   │   │   ├── ModelInsightsPage.tsx # Accuracy, ROC-AUC, unseen generator benchmark
│   │   │   ├── HowItWorksPage.tsx  # DSP engineering deep dive
│   │   │   └── SettingsPage.tsx    # Thresholds, silence trimming, data wipe
│   │   ├── services/api.ts         # Frontend API client
│   │   ├── types/index.ts          # TypeScript interfaces
│   │   ├── App.tsx                 # Root application state & router
│   │   └── index.css               # Tailwind + Cyber glassmorphism styling
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── README.md
├── .env.example
└── start.bat                       # One-click Windows launch script
```

---

## 4. Setup & Installation Instructions

### Prerequisites
- **Python**: 3.10+ (Tested on Python 3.14)
- **Node.js**: 18+ (Tested on Node v24.18)
- **npm**: 9+

### Step 1: Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python tests/test_api.py   # Run automated verification suite
```

Start the FastAPI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at `http://localhost:8000/docs`.

### Step 2: Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 5. SIH Demonstration Quick-Start

1. Open `http://localhost:5173`.
2. Click **"START SIH DEMO"** in the top navigation bar.
3. Follow the 11-step guided tour:
   - **Step 1**: Target Voice Reference (Marathi authentic voice)
   - **Step 2**: Select Marathi language
   - **Step 3**: Review banking phishing pretext script
   - **Step 4**: Synthesize cloned demonstration voice
   - **Step 5 & 6**: Compare authentic vs synthetic speech
   - **Step 7 & 8**: Run acoustic DSP preprocessing and feature extraction
   - **Step 9 & 10**: Observe Authenticity Score ($94.2\%$ AI Probability) and **HIGH RISK** alert
   - **Step 11**: Review Active Prevention Guidelines and out-of-band verification checklist.

---

## 6. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status and problem statement ID |
| `GET` | `/api/sample-voices` | Returns preloaded authentic & cloned voice samples |
| `POST` | `/api/audio/upload` | Uploads and validates an audio stream |
| `POST` | `/api/audio/analyze` | Executes 6-stage acoustic detection pipeline |
| `POST` | `/api/script/generate` | Generates regional phishing simulation scripts |
| `POST` | `/api/voice/simulate` | Synthesizes controlled demonstration audio |
| `GET` | `/api/history` | Retrieves detection logs with optional filtering |
| `GET` | `/api/report/{id}` | Fetches complete forensic audit report |
| `DELETE` | `/api/history/{id}` | Purges audit record and deletes audio (privacy) |
| `GET` | `/api/history/stats` | Aggregated dashboard telemetry metrics |
| `GET` | `/api/insights/metrics` | Model evaluation & cross-generator benchmarks |

---

## 7. Security & Compliance

- **Non-Accusatory Classification**: Labels audio as *"Possible AI-generated voice"* rather than assigning definitive criminal accusations.
- **Controlled Generation**: Synthetic samples are explicitly watermarked and tagged as `AI-GENERATED DEMONSTRATION AUDIO`.
- **Zero API Key Exposure**: All processing and synthesis adapters are executed on the backend.
