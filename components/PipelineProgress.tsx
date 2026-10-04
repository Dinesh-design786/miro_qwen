'use client';

import React from 'react';
import { 
  Lightbulb, 
  LayoutDashboard, 
  BrainCircuit, 
  BarChart3, 
  Presentation, 
  Mic2, 
  ShieldAlert, 
  Flame,
  PackageCheck
} from 'lucide-react';

interface PipelineProgressProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasAnalysis: boolean;
  hasDeck: boolean;
  hasAttack: boolean;
  hasAudio: boolean;
}

export function PipelineProgress({
  activeTab,
  setActiveTab,
  hasAnalysis,
  hasDeck,
  hasAttack,
  hasAudio,
}: PipelineProgressProps) {
  const steps = [
    { id: 'overview', label: 'THESIS', icon: Lightbulb, ready: true },
    { id: 'miro', label: 'MIRO CANVAS', icon: LayoutDashboard, ready: true },
    { id: 'analysis', label: 'AI REASONING', icon: BrainCircuit, ready: hasAnalysis },
    { id: 'improve', label: 'HARDEN', icon: BarChart3, ready: hasAnalysis },
    { id: 'attack', label: 'ATTACK MODE', icon: Flame, ready: hasAnalysis, highlight: true },
    { id: 'presentation', label: 'PITCH DECK', icon: Presentation, ready: hasDeck },
    { id: 'script', label: 'COACH', icon: Mic2, ready: hasDeck },
    { id: 'judge', label: 'JUDGE ROOM', icon: ShieldAlert, ready: hasAnalysis },
    { id: 'package', label: 'DELIVERABLES', icon: PackageCheck, ready: hasDeck },
  ];

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-white/[0.06] px-4 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] space-x-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;
          const isAttack = step.id === 'attack';

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveTab(step.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xs text-[11px] font-mono tracking-wider transition-all uppercase ${
                  isActive
                    ? isAttack 
                      ? 'bg-[#FF2D00]/20 text-[#FF4D00] border border-[#FF2D00]/50 shadow-flame-sm font-bold'
                      : 'bg-white text-black font-extrabold shadow-sm'
                    : isAttack
                    ? 'text-[#FF4D00]/80 hover:text-[#FF4D00] hover:bg-[#FF4D00]/10 font-bold'
                    : step.ready
                    ? 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    : 'text-zinc-600 hover:text-zinc-400 opacity-60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive 
                    ? isAttack ? 'text-[#FF2D00]' : 'text-black' 
                    : isAttack 
                    ? 'text-[#FF4D00]' 
                    : step.ready 
                    ? 'text-[#FF6A00]' 
                    : 'text-zinc-600'
                }`} />
                <span className="whitespace-nowrap">{step.label}</span>
                {step.ready && step.id !== 'overview' && step.id !== 'miro' && (
                  <span className="w-1 h-1 rounded-full bg-[#FF4D00] ml-0.5" />
                )}
              </button>

              {index < steps.length - 1 && (
                <span className="text-zinc-700 text-xs font-mono select-none px-1">/</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
