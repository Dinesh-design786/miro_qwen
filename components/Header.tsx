'use client';

import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Download, 
  Flame, 
  ShieldAlert, 
  ExternalLink,
  RotateCcw,
  Zap,
  Play
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
  isAnalyzing,
}: HeaderProps) {
  const readiness = analysis?.pitchReadinessScore ?? 0;

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-800 bg-[#090D17]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Project Info */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button 
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-2 text-left focus:outline-none group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="h-full w-full rounded-xl bg-[#0F172A] flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                PitchForge
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                MIRO + QWEN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              AI Pitch Studio
            </p>
          </div>
        </button>

        {project && (
          <div className="h-5 w-[1px] bg-slate-800 hidden md:block" />
        )}

        {project && (
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs text-slate-400">Project:</span>
            <span className="text-xs font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 max-w-[200px] truncate">
              {project.name}
            </span>
            {project.isDemo && (
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Demo Mode
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center Status / Readiness Metric */}
      {analysis && (
        <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full">
          <span className="text-xs font-medium text-slate-400">Pitch Readiness:</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  readiness >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                  readiness >= 65 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
                style={{ width: `${readiness}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white font-mono">{readiness}/100</span>
          </div>

          <button
            onClick={() => setActiveTab('attack')}
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1 transition-colors ${
              activeTab === 'attack' 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Attack Mode</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onLoadDemo}
          className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
          title="Instant 1-click end-to-end demo"
        >
          <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline">Try Demo Flow</span>
          <span className="sm:hidden">Demo</span>
        </button>

        <button
          onClick={onOpenNewProject}
          className="text-xs font-medium text-indigo-200 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>

        {deck && (
          <button
            onClick={onExportAll}
            className="text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        )}
      </div>
    </header>
  );
}
