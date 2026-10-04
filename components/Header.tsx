'use client';

import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Download, 
  Flame, 
  ExternalLink,
  Zap,
  Play,
  Share2
} from 'lucide-react';
import { Project, PitchAnalysis, PitchDeck } from '@/types';

interface HeaderProps {
  project?: Project | null;
  analysis?: PitchAnalysis | null;
  deck?: PitchDeck | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewProject: () => void;
  onLoadDemo: () => void;
  onExportAll: () => void;
  onSendToMiro?: () => void;
  isAnalyzing?: boolean;
}

export function Header({
  project,
  analysis,
  deck,
  activeTab,
  setActiveTab,
  onOpenNewProject,
  onLoadDemo,
  onExportAll,
  onSendToMiro,
  isAnalyzing,
}: HeaderProps) {
  const readiness = analysis?.pitchReadinessScore ?? 0;
  const [isMiroConnected, setIsMiroConnected] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    fetch('/api/miro/status')
      .then((res) => res.json())
      .then((data) => setIsMiroConnected(Boolean(data.connected)))
      .catch(() => setIsMiroConnected(false));
  }, []);

  const navItems = [
    { id: 'overview', label: 'BOARD' },
    { id: 'analysis', label: 'ANALYZE' },
    { id: 'attack', label: 'ATTACK WAR ROOM' },
    { id: 'presentation', label: 'PITCH' },
    { id: 'summary', label: 'EXPORT' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-white/[0.08] bg-[#080808]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
      {/* Brand & Studio Identity */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-2.5 text-left focus:outline-none group"
        >
          <div className="h-7 w-7 rounded-sm bg-[#111111] border border-[#FF4D00]/50 flex items-center justify-center shadow-flame-sm group-hover:border-[#FF4D00] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-extrabold text-sm sm:text-base tracking-widest text-white uppercase group-hover:text-zinc-200 transition-colors font-mono">
              PITCHFORGE
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-xs font-mono font-bold tracking-widest uppercase bg-[#FF4D00]/10 text-[#FF6A00] border border-[#FF4D00]/30">
              AI WAR ROOM
            </span>
          </div>
        </button>

        {project && (
          <div className="hidden xl:flex items-center space-x-2 text-xs">
            <span className="text-zinc-600">/</span>
            <span className="font-mono text-[11px] text-zinc-400 bg-[#121212] px-2 py-0.5 rounded border border-white/[0.05] max-w-[160px] truncate">
              {project.name}
            </span>
          </div>
        )}
      </div>

      {/* Minimal Studio Navigation */}
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3.5 py-1.5 text-[11px] font-mono tracking-widest uppercase transition-all ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent shadow-flame" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Miro Status & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Miro Connection Status */}
        {isMiroConnected !== null && (
          isMiroConnected ? (
            <div 
              className="text-[11px] font-mono tracking-wider text-emerald-400 bg-[#101010] border border-emerald-500/30 px-2.5 py-1 rounded-sm flex items-center space-x-1.5 shadow-sm"
              title="Miro OAuth Session Active"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">🟢 MIRO CONNECTED</span>
              <span className="sm:hidden">MIRO 🟢</span>
            </div>
          ) : (
            <button
              onClick={onSendToMiro}
              className="text-[11px] font-mono tracking-wider text-[#FF6A00] hover:text-[#FF4D00] bg-[#FF4D00]/10 hover:bg-[#FF4D00]/20 border border-[#FF4D00]/30 px-2.5 py-1 rounded-sm flex items-center space-x-1.5 transition-all"
              title="Connect Miro"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
              <span className="hidden sm:inline">CONNECT MIRO</span>
              <span className="sm:hidden">MIRO</span>
            </button>
          )
        )}

        <button
          onClick={onLoadDemo}
          className="text-xs font-mono font-medium text-zinc-400 hover:text-white bg-[#121212] hover:bg-[#181818] border border-white/[0.08] px-3 py-1.5 rounded-sm flex items-center space-x-1.5 transition-all"
          title="Instant 1-Click Demo Pitch Package"
        >
          <Play className="w-3 h-3 text-[#FF6A00] fill-[#FF6A00]" />
          <span className="hidden sm:inline">DEMO</span>
        </button>

        <button
          onClick={onOpenNewProject}
          className="text-xs font-mono font-medium text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1C1C1C] border border-white/[0.1] px-3 py-1.5 rounded-sm flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3 h-3 text-zinc-400" />
          <span className="hidden sm:inline">+ NEW</span>
        </button>

        {analysis && onSendToMiro && (
          <button
            onClick={onSendToMiro}
            className="text-xs font-extrabold text-black bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-[#FF2D00] px-3.5 py-1.5 rounded-sm flex items-center space-x-1.5 shadow-flame hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Create real structured pitch workspace on Miro board"
          >
            <span>✦ SEND TO MIRO</span>
          </button>
        )}

        {deck && (
          <button
            onClick={onExportAll}
            className="text-xs font-mono text-zinc-400 hover:text-white bg-[#101010] hover:bg-[#161616] border border-white/[0.08] px-2.5 py-1.5 rounded-sm flex items-center space-x-1"
            title="Export Presentation Deck"
          >
            <Download className="w-3 h-3" />
          </button>
        )}
      </div>
    </header>
  );
}
