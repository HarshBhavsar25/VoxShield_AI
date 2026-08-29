import React from 'react';
import { Shield, Radio, Play, Sparkles, Activity, Lock } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onStartSIHDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onStartSIHDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-darkest/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyber-cyan transition-all group-hover:scale-105">
            <Shield className="h-6 w-6 text-cyber-darkest" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-cyber-darkest">
              <Activity className="h-2.5 w-2.5 text-cyber-darkest" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Outfit'] text-xl font-bold tracking-tight text-white group-hover:text-cyber-cyan transition-colors">
                VoxShield <span className="text-cyber-cyan">AI</span>
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyber-cyan tracking-wider">
                SIH26104
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Detect. Verify. Defend Against AI Voice Impersonation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Status Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Acoustic Defense Active</span>
          </div>

          {/* Quick Nav to Primary Workspace */}
          {currentTab === 'landing' ? (
            <button
              onClick={() => onSelectTab('analyze')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyber-card px-3.5 py-1.5 text-xs font-semibold text-gray-200 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
            >
              <Radio className="h-3.5 w-3.5 text-cyber-cyan" />
              Open Workspace
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('landing')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-cyber-card px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-all"
            >
              Home View
            </button>
          )}

          {/* SIH DEMO MODE CTA BUTTON */}
          <button
            onClick={onStartSIHDemo}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:shadow-orange-500/40 active:scale-95"
            title="Interactive 11-step walkthrough for hackathon judges"
          >
            <Sparkles className="h-4 w-4 animate-spin text-amber-200" style={{ animationDuration: '3s' }} />
            <span>START SIH DEMO</span>
          </button>
        </div>

      </div>
    </header>
  );
};
