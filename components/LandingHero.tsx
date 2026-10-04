'use client';

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  BrainCircuit, 
  Layers, 
  ShieldAlert, 
  Mic2, 
  Presentation, 
  Flame, 
  BarChart3, 
  FileText,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface LandingHeroProps {
  onStartBuilding: () => void;
  onSeeDemo: () => void;
}

export function LandingHero({ onStartBuilding, onSeeDemo }: LandingHeroProps) {
  const pipeline = [
    { title: 'YOUR IDEA', subtitle: 'Raw Problem', color: 'from-amber-400 to-amber-600' },
    { title: 'MIRO BOARD', subtitle: 'Visual Context', color: 'from-yellow-400 to-amber-500' },
    { title: 'QWEN REASONING', subtitle: 'Multi-turn Audit', color: 'from-purple-500 to-indigo-600' },
    { title: 'PITCH ANALYSIS', subtitle: 'Readiness & Flaws', color: 'from-blue-500 to-cyan-500' },
    { title: 'PRESENTATION', subtitle: '10-Slide Deck', color: 'from-indigo-500 to-violet-500' },
    { title: 'SCRIPT + AUDIO', subtitle: 'Speaker Coach', color: 'from-emerald-500 to-teal-600' },
    { title: 'JUDGE Q&A', subtitle: 'Aggressive Defense', color: 'from-rose-500 to-red-600' },
  ];

  const features = [
    {
      title: 'AI Idea Analysis',
      desc: 'Qwen extracts pain points, assumptions, and risks directly from your Miro canvas.',
      icon: BrainCircuit,
      color: 'text-indigo-400',
      badge: 'Reasoning Engine',
    },
    {
      title: 'Pitch Readiness Score',
      desc: '0–100 calibrated score auditing problem clarity, differentiation, and empirical proof.',
      icon: BarChart3,
      color: 'text-emerald-400',
      badge: 'Grounded Metrics',
    },
    {
      title: 'Attack My Pitch',
      desc: 'Aggressive skeptic mode hunting unsupported claims, platform risks, and weak assumptions.',
      icon: Flame,
      color: 'text-rose-400',
      badge: 'Signature Feature',
    },
    {
      title: 'Slide & PPTX Generator',
      desc: 'Production-ready 10-slide decks with visuals, objectives, and instant PPTX export.',
      icon: Presentation,
      color: 'text-amber-400',
      badge: 'Slide Studio',
    },
    {
      title: 'Speaker Coach',
      desc: 'Slide-by-slide teleprompter scripts with delivery tone, energy, pauses, and WPM.',
      icon: Mic2,
      color: 'text-cyan-400',
      badge: 'Rehearsal Mode',
    },
    {
      title: 'AI Judge Room',
      desc: 'Simulate skeptical hackathon judges across 10 dimensions with grounded answers.',
      icon: ShieldAlert,
      color: 'text-purple-400',
      badge: 'Q&A Prep',
    },
    {
      title: 'Audio Pitch Narration',
      desc: 'Synchronized text-to-speech rehearsal matching spoken slide timing and rhythm.',
      icon: Sparkles,
      color: 'text-pink-400',
      badge: 'Audio Studio',
    },
    {
      title: 'Executive Summary',
      desc: '1-page investor and hackathon briefing ready for 1-click clipboard or markdown export.',
      icon: FileText,
      color: 'text-teal-400',
      badge: '1-Page Brief',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-500/10 blur-[100px] pointer-events-none -z-10" />

      {/* Hero Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-900/90 to-indigo-950/70 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs text-indigo-300 shadow-lg shadow-indigo-950/40">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold text-white">Miro + Qwen Orchestration</span>
          <span className="text-slate-400">•</span>
          <span>From Sticky Notes to Investor Defense</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Turn your idea into a pitch that{' '}
          <span className="gradient-text-qwen">survives the questions.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Connect your Miro workspace, let Qwen challenge your idea, expose weak assumptions, and generate your complete battle-tested pitch package.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartBuilding}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Building</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onSeeDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 flex items-center justify-center space-x-2.5 text-base transition-all hover:border-amber-500/50 hover:text-white"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>See Demo (AI Bug Triage Agent)</span>
          </button>
        </div>

        <p className="mt-3.5 text-xs text-slate-400">
          Works instantly out-of-the-box in demo mode • No API keys required to experience the full flow
        </p>
      </div>

      {/* Visual Pipeline Section */}
      <div className="mt-16 sm:mt-20">
        <div className="text-center mb-6">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400">
            The PitchForge Orchestration Pipeline
          </h3>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {pipeline.map((item, idx) => (
              <div
                key={item.title}
                className="relative bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex flex-col items-center text-center group hover:border-slate-700 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center text-xs font-bold text-white mb-2 shadow-md`}>
                  {idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Everything your team needs to face the judges
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            PitchForge doesn&apos;t just write a script. It tests your thesis against skeptical counterarguments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-card p-5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
