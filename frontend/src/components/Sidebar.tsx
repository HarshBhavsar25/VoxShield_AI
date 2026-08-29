import React from 'react';
import { 
  LayoutDashboard, 
  AudioWaveform, 
  FlaskConical, 
  History, 
  LineChart, 
  BookOpen, 
  Settings, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'analyze' as NavigationTab,
      label: 'Voice Analysis',
      icon: AudioWaveform,
      badge: 'Core'
    },
    {
      id: 'simulate' as NavigationTab,
      label: 'Attack Simulator',
      icon: FlaskConical,
      badge: 'Module A'
    },
    {
      id: 'history' as NavigationTab,
      label: 'Detection History',
      icon: History,
      badge: undefined
    },
    {
      id: 'insights' as NavigationTab,
      label: 'Model Insights',
      icon: LineChart,
      badge: 'Metrics'
    },
    {
      id: 'how-it-works' as NavigationTab,
      label: 'How It Works',
      icon: BookOpen,
      badge: undefined
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings & Privacy',
      icon: Settings,
      badge: undefined
    }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-cyber-border bg-cyber-darker/60 backdrop-blur-md p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Cyber Defense Console
          </p>
          <nav className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyber-cyan border border-cyan-500/30 shadow-cyber-cyan/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-card/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyber-cyan' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIH Challenge Mini Card */}
        <div className="rounded-xl border border-cyber-border bg-cyber-card/50 p-3.5 text-xs text-gray-400 space-y-2">
          <div className="flex items-center gap-2 text-cyber-cyan font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>SIH26104 Focus</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-300">
            Real-time acoustic fraud mitigation for Indian regional voice calls.
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-gray-800 text-[10px] text-gray-500">
            <span>Accuracy: 94.8%</span>
            <span className="text-emerald-400">Ensemble Active</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-between">
        <span>VoxShield v1.0</span>
        <span className="font-mono text-cyan-500/70">8 Languages</span>
      </div>
    </aside>
  );
};
