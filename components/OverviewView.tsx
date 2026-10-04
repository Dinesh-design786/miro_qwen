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
  Flame,
  CheckCircle2
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
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Studio Project Header */}
      <div className="studio-panel p-6 sm:p-8 rounded-xs border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card bg-grid-editorial relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase font-bold text-[#FF4D00]">
            <span>ACTIVE WORKSPACE</span>
            {project.isDemo && (
              <span className="text-[9px] font-mono font-bold bg-white/[0.06] text-zinc-300 border border-white/[0.1] px-2 py-0.5 rounded-xs">
                DEMO PROJECT
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            {project.name}
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            INITIALIZED: {new Date(project.createdAt).toLocaleDateString()} • MIRO CANVAS + QWEN STRATEGY LAB
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('miro')}
            className="px-3.5 py-2 rounded-xs text-xs font-mono text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1A1A1A] border border-white/[0.08] flex items-center space-x-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>INSPECT MIRO CANVAS</span>
          </button>

          {!analysis ? (
            <button
              onClick={onAnalyzeIdea}
              className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>REASON WITH QWEN</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('attack')}
              className="px-4 py-2 rounded-xs text-xs font-mono font-bold text-white bg-gradient-to-r from-[#FF2D00] to-red-700 hover:from-[#FF4D00] hover:to-red-600 shadow-flame-sm flex items-center space-x-1.5 transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>ATTACK MY PITCH</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement Card */}
        <div className="studio-card p-6 rounded-xs space-y-2 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF4D00]">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>THE PROBLEM STATEMENT</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-normal pt-1">
            {project.problemStatement}
          </p>
        </div>

        {/* Target Audience Card */}
        <div className="studio-card p-6 rounded-xs space-y-2 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
            <Users className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>TARGET CUSTOMER & PERSONA</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-normal pt-1">
            {project.targetAudience}
          </p>
        </div>

        {/* Proposed Solution Card */}
        <div className="studio-card p-6 rounded-xs space-y-2 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>PROPOSED SOLUTION & SECRET SAUCE</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed pt-1">
            {project.solutionDescription || 'Autonomous AI orchestration agent that turns unstructured data into verified execution.'}
          </p>
        </div>

        {/* Connected Miro Workspace Card */}
        <div className="studio-card p-6 rounded-xs space-y-3 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF6A00]">
            <Layers className="w-3.5 h-3.5" />
            <span>CONNECTED MIRO WORKSPACE</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-zinc-300 pt-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">BOARD TITLE:</span>
              <span className="font-bold text-white">{boardContext.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">CANVAS ITEMS:</span>
              <span className="text-zinc-300">{boardContext.items.length} sticky notes & frames</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">CANVAS SYNC:</span>
              <span className="text-emerald-400 font-bold">✓ Active & Normalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Workflow Navigation */}
      <div className="studio-panel p-6 rounded-xs border border-white/[0.08] space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          STUDIO PROTOCOL SEQUENCE
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('miro')}
            className="p-3.5 rounded-xs bg-[#101010] hover:bg-[#161616] text-left border border-white/[0.06] hover:border-[#FF4D00]/40 transition-all"
          >
            <span className="text-[10px] font-mono text-[#FF4D00] font-bold uppercase block">STAGE 01</span>
            <span className="text-xs font-mono font-bold text-white mt-1 block">MIRO WORKSPACE</span>
          </button>

          <button
            onClick={() => onNavigateTab('analysis')}
            className="p-3.5 rounded-xs bg-[#101010] hover:bg-[#161616] text-left border border-white/[0.06] hover:border-[#FF4D00]/40 transition-all"
          >
            <span className="text-[10px] font-mono text-[#FF6A00] font-bold uppercase block">STAGE 02</span>
            <span className="text-xs font-mono font-bold text-white mt-1 block">AI REASONING</span>
          </button>

          <button
            onClick={() => onNavigateTab('attack')}
            className="p-3.5 rounded-xs bg-[#150A0A] hover:bg-[#1C0E0E] text-left border border-red-500/30 hover:border-red-500/60 transition-all"
          >
            <span className="text-[10px] font-mono text-[#FF2D00] font-bold uppercase block">STAGE 03</span>
            <span className="text-xs font-mono font-bold text-white mt-1 block">ATTACK WAR ROOM</span>
          </button>

          <button
            onClick={() => onNavigateTab('presentation')}
            className="p-3.5 rounded-xs bg-[#101010] hover:bg-[#161616] text-left border border-white/[0.06] hover:border-[#FF4D00]/40 transition-all"
          >
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">STAGE 04</span>
            <span className="text-xs font-mono font-bold text-white mt-1 block">10-SLIDE PITCH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
