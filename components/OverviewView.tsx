'use client';

import React from 'react';
import { 
  Lightbulb, 
  Users, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Cpu, 
  BarChart3, 
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Project, BoardContext, PitchAnalysis } from '@/types';

interface OverviewViewProps {
  project: Project;
  boardContext: BoardContext;
  analysis?: PitchAnalysis | null;
  onNavigateTab: (tab: string) => void;
  onAnalyzeIdea: () => void;
}

export function OverviewView({
  project,
  boardContext,
  analysis,
  onNavigateTab,
  onAnalyzeIdea,
}: OverviewViewProps) {
  return (
    <div className="space-y-6">
      {/* Project Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              ACTIVE WORKSPACE
            </span>
            {project.isDemo && (
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Demo Project (AI Bug Triage Agent)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            {project.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Created: {new Date(project.createdAt).toLocaleDateString()} • Orchestrating Miro + Qwen Studio
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('miro')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Inspect Miro Canvas</span>
          </button>

          {!analysis ? (
            <button
              onClick={onAnalyzeIdea}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze with Qwen</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('attack')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-900/30 flex items-center space-x-1.5 transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Attack My Pitch</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement Card */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">The Problem Statement</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {project.problemStatement}
          </p>
        </div>

        {/* Target Audience Card */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Target Customer & Persona</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {project.targetAudience}
          </p>
        </div>

        {/* Proposed Solution Card */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Proposed Solution</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {project.solutionDescription || 'Autonomous AI orchestration agent that turns unstructured data into verified execution.'}
          </p>
        </div>

        {/* Connected Miro Workspace */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Connected Miro Workspace</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Board Title:</span>
              <span className="font-semibold text-white">{boardContext.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Extracted Canvas Items:</span>
              <span className="font-semibold text-slate-200">{boardContext.items.length} sticky notes & frames</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sync Status:</span>
              <span className="text-emerald-400 font-semibold">Active & Normalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Pipeline Links */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Studio Workflow Navigation
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('miro')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-left border border-slate-700/60 transition-all hover:scale-[1.01]"
          >
            <span className="text-[10px] text-amber-400 font-bold uppercase block">1. Visualize</span>
            <span className="text-xs font-bold text-white mt-0.5 block">Miro Workspace</span>
          </button>

          <button
            onClick={() => onNavigateTab('analysis')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-left border border-slate-700/60 transition-all hover:scale-[1.01]"
          >
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">2. Reason</span>
            <span className="text-xs font-bold text-white mt-0.5 block">Qwen Analysis</span>
          </button>

          <button
            onClick={() => onNavigateTab('attack')}
            className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 text-left border border-rose-500/30 transition-all hover:scale-[1.01]"
          >
            <span className="text-[10px] text-rose-400 font-bold uppercase block">3. Stress-Test</span>
            <span className="text-xs font-bold text-white mt-0.5 block">Attack My Pitch</span>
          </button>

          <button
            onClick={() => onNavigateTab('presentation')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-left border border-slate-700/60 transition-all hover:scale-[1.01]"
          >
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">4. Pitch & PPT</span>
            <span className="text-xs font-bold text-white mt-0.5 block">Presentation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
