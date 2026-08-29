import {
  DetectionResult,
  SampleVoice,
  SimulationResult,
  HistoryItem,
  DashboardStats,
  ModelInsightsData,
  ScriptScenarioResponse
} from '../types';

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
if (rawApiUrl && !rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://')) {
  rawApiUrl = `https://${rawApiUrl}`;
}
const API_BASE_URL = rawApiUrl.replace(/\/$/, '');

export const getAudioUrl = (urlPath: string | undefined): string => {
  if (!urlPath) return '';
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://') || urlPath.startsWith('blob:')) {
    return urlPath;
  }
  return `${API_BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
};

export const apiService = {
  async getSampleVoices(): Promise<SampleVoice[]> {
    const res = await fetch(`${API_BASE_URL}/api/sample-voices`);
    if (!res.ok) throw new Error('Failed to fetch sample voices');
    return res.json();
  },

  async uploadAudio(fileOrBlob: File | Blob, filename: string = 'recording.wav'): Promise<{
    file_id: string;
    filename: string;
    audio_url: string;
    duration: number;
    file_size: number;
  }> {
    const formData = new FormData();
    formData.append('file', fileOrBlob, filename);

    const res = await fetch(`${API_BASE_URL}/api/audio/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Failed to upload audio');
    }
    return res.json();
  },

  async analyzeAudio(params: {
    file?: File | Blob;
    file_id?: string;
    sample_id?: string;
    language?: string;
    is_simulation?: boolean;
    filename?: string;
  }): Promise<DetectionResult> {
    const formData = new FormData();
    if (params.file) {
      formData.append('file', params.file, params.filename || 'input_voice.wav');
    }
    if (params.file_id) {
      formData.append('file_id', params.file_id);
    }
    if (params.sample_id) {
      formData.append('sample_id', params.sample_id);
    }
    if (params.language) {
      formData.append('language', params.language);
    }
    if (params.is_simulation) {
      formData.append('is_simulation', 'true');
    }

    const res = await fetch(`${API_BASE_URL}/api/audio/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Voice analysis failed');
    }
    return res.json();
  },

  async generateScript(language: string = 'Marathi', scenarioType: string = 'urgent_financial'): Promise<ScriptScenarioResponse> {
    const res = await fetch(`${API_BASE_URL}/api/script/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, scenario_type: scenarioType }),
    });

    if (!res.ok) throw new Error('Failed to generate demonstration script');
    return res.json();
  },

  async simulateVoice(params: {
    language: string;
    script: string;
    source_voice?: File | Blob;
    source_voice_id?: string;
  }): Promise<SimulationResult> {
    const formData = new FormData();
    formData.append('language', params.language);
    formData.append('script', params.script);
    if (params.source_voice) {
      formData.append('source_voice', params.source_voice, 'source_voice.wav');
    }
    if (params.source_voice_id) {
      formData.append('source_voice_id', params.source_voice_id);
    }

    const res = await fetch(`${API_BASE_URL}/api/voice/simulate`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Voice simulation failed' }));
      throw new Error(err.detail || 'Simulation synthesis failed');
    }
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/api/history/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getHistory(filterBy: string = 'all'): Promise<HistoryItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/history?filter_by=${encodeURIComponent(filterBy)}`);
    if (!res.ok) throw new Error('Failed to fetch history logs');
    return res.json();
  },

  async getReport(id: string): Promise<DetectionResult> {
    const res = await fetch(`${API_BASE_URL}/api/report/${id}`);
    if (!res.ok) throw new Error('Failed to fetch detection report');
    return res.json();
  },

  async deleteHistory(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete history item');
    return res.json();
  },

  async getModelInsights(): Promise<ModelInsightsData> {
    const res = await fetch(`${API_BASE_URL}/api/insights/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model insights');
    return res.json();
  }
};
