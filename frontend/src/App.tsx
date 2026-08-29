import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SIHDemoModal } from './components/SIHDemoModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VoiceAnalysisPage } from './pages/VoiceAnalysisPage';
import { AttackSimulatorPage } from './pages/AttackSimulatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [isSIHDemoOpen, setIsSIHDemoOpen] = useState(false);
  const [transferredAudioUrl, setTransferredAudioUrl] = useState<string | undefined>(undefined);
  const [transferredIsSimulation, setTransferredIsSimulation] = useState(false);

  // Transition from Attack Simulator directly to Detector
  const handleAnalyzeGenerated = (audioUrl: string) => {
    setTransferredAudioUrl(audioUrl);
    setTransferredIsSimulation(true);
    setCurrentTab('analyze');
  };

  return (
    <div className="min-h-screen bg-cyber-darkest text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onStartSIHDemo={() => setIsSIHDemoOpen(true)}
      />

      {/* Main Body Layout */}
      {currentTab === 'landing' ? (
        // Full width Landing Page
        <main className="flex-1 w-full">
          <LandingPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onStartSIHDemo={() => setIsSIHDemoOpen(true)}
          />
        </main>
      ) : (
        // Console / Dashboard Layout with Sidebar
        <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />

          <main className="flex-1 min-w-0 p-2 sm:p-4 lg:p-6 overflow-y-auto">
            {currentTab === 'dashboard' && (
              <DashboardPage
                onNavigate={(tab) => setCurrentTab(tab)}
                onStartSIHDemo={() => setIsSIHDemoOpen(true)}
              />
            )}

            {currentTab === 'analyze' && (
              <VoiceAnalysisPage
                initialAudioUrl={transferredAudioUrl}
                initialIsSimulation={transferredIsSimulation}
              />
            )}

            {currentTab === 'simulate' && (
              <AttackSimulatorPage
                onAnalyzeGenerated={handleAnalyzeGenerated}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'history' && (
              <HistoryPage />
            )}

            {currentTab === 'insights' && (
              <ModelInsightsPage />
            )}

            {currentTab === 'how-it-works' && (
              <HowItWorksPage
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage />
            )}
          </main>
        </div>
      )}

      {/* SIH 11-Step Interactive Guided Demo Walkthrough */}
      <SIHDemoModal
        isOpen={isSIHDemoOpen}
        onClose={() => setIsSIHDemoOpen(false)}
        onNavigateToAnalyze={() => {
          setIsSIHDemoOpen(false);
          setCurrentTab('analyze');
        }}
      />

      {/* Global Cyber Defense Watermark Footer */}
      <footer className="w-full border-t border-gray-900 bg-cyber-darkest py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-300">VoxShield AI</span>
            <span>•</span>
            <span>Smart India Hackathon SIH26104</span>
          </div>
          <p className="text-[11px] text-gray-500">
            Acoustic Deepfake Forensics &amp; Regional Voice Impersonation Prevention
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={() => setCurrentTab('how-it-works')} className="hover:text-cyber-cyan">Architecture</button>
            <button onClick={() => setCurrentTab('insights')} className="hover:text-cyber-cyan">Benchmarks</button>
            <button onClick={() => setCurrentTab('settings')} className="hover:text-cyber-cyan">Privacy</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
