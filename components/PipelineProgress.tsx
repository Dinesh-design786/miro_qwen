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
  CheckCircle2,
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
    { id: 'overview', label: 'Idea Context', icon: Lightbulb, ready: true },
    { id: 'miro', label: 'Miro Board', icon: LayoutDashboard, ready: true },
    { id: 'analysis', label: 'Qwen Analysis', icon: BrainCircuit, ready: hasAnalysis },
    { id: 'improve', label: 'Improve Pitch', icon: BarChart3, ready: hasAnalysis },
    { id: 'attack', label: 'Attack Mode', icon: Flame, ready: hasAnalysis, highlight: true },
    { id: 'presentation', label: 'Presentation', icon: Presentation, ready: hasDeck },
    { id: 'script', label: 'Speaker Coach', icon: Mic2, ready: hasDeck },
    { id: 'judge', label: 'AI Judge', icon: ShieldAlert, ready: hasAnalysis },
    { id: 'package', label: 'Pitch Package', icon: PackageCheck, ready: hasDeck },
  ];

  return (
    <div className="w-full bg-[#0B101E] border-b border-slate-800/80 px-4 py-2.5 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] space-x-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;
          const isAttack = step.id === 'attack';

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveTab(step.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? isAttack 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-900/30'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : isAttack
                    ? 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
                    : step.ready
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive 
                    ? 'text-white' 
                    : isAttack 
                    ? 'text-rose-400' 
                    : step.ready 
                    ? 'text-indigo-400' 
                    : 'text-slate-600'
                }`} />
                <span className="whitespace-nowrap">{step.label}</span>
                {step.ready && step.id !== 'overview' && step.id !== 'miro' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                )}
              </button>

              {index < steps.length - 1 && (
                <div className="h-[1px] w-4 bg-slate-800 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
