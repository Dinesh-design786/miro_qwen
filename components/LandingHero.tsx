'use client';

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  BrainCircuit, 
  Flame, 
  BarChart3, 
  Presentation, 
  ShieldAlert, 
  ExternalLink,
  Layers,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ALL_SAMPLE_IDEAS, SampleIdea } from '@/data/sampleProjects';

interface LandingHeroProps {
  onStartBuilding: () => void;
  onSeeDemo: () => void;
  onSelectSampleIdea?: (sample: SampleIdea) => void;
}

export function LandingHero({ onStartBuilding, onSeeDemo, onSelectSampleIdea }: LandingHeroProps) {
  const pipeline = [
    { num: '01', title: 'MIRO CANVAS', subtitle: 'Sticky Notes & Visual Context' },
    { num: '02', title: 'BOARD INTELLIGENCE', subtitle: 'AST & Topology Normalization' },
    { num: '03', title: 'QWEN REASONING', subtitle: 'Deductive Thesis & Proof Audit' },
    { num: '04', title: 'ATTACK MODE', subtitle: 'Skeptical Vulnerability Scan' },
    { num: '05', title: 'PITCH DECK', subtitle: '10-Slide Investor Deck' },
    { num: '06', title: 'JUDGE DEFENSE', subtitle: 'Anticipated Hostile Q&A' },
  ];

  return (
    <div className="relative overflow-hidden pt-10 sm:pt-16 pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Subtle Orange/Red Atmospheric Glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#FF4D00]/12 via-[#FF2D00]/05 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-48 right-[-100px] w-[500px] h-[500px] bg-gradient-to-bl from-[#FF6A00]/10 via-[#FF4D00]/03 to-transparent blur-[110px] pointer-events-none -z-10" />

      {/* Hero Badge */}
      <div className="flex items-center space-x-3 mb-8">
        <span className="inline-flex items-center space-x-2 bg-[#111111] border border-white/[0.08] px-3.5 py-1.5 rounded-xs text-[11px] font-mono tracking-widest text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-ping" />
          <span className="text-white font-bold">PITCHFORGE</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[#FF6A00]">AI PITCH WAR ROOM</span>
        </span>
        <span className="hidden sm:inline text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
          [ MIRO CANVASES → INVESTOR-READY PACKAGES ]
        </span>
      </div>

      {/* Asymmetric Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Oversized Editorial Typography */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tightest text-white leading-[0.92] uppercase font-sans">
            TURN<br />
            IDEAS<br />
            INTO<br />
            <span className="gradient-text-flame">PITCHES.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed pt-2">
            Turn your Miro board into a pitch that can survive the room.
            Qwen audits your problem, attacks weak assumptions, and builds the complete pitch deck, speaker script, and hostile judge defense.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onStartBuilding}
              className="btn-flame px-7 py-3.5 rounded-xs text-xs sm:text-sm font-extrabold tracking-wider uppercase flex items-center space-x-2"
            >
              <span>✦ Generate Pitch</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSeeDemo}
              className="px-6 py-3.5 rounded-xs text-xs sm:text-sm font-mono font-medium text-white bg-[#121212] hover:bg-[#181818] border border-white/[0.1] hover:border-[#FF4D00]/40 flex items-center space-x-2 transition-all shadow-card"
            >
              <Play className="w-3.5 h-3.5 text-[#FF6A00] fill-[#FF6A00]" />
              <span>See Demo (AI Bug Triage)</span>
            </button>

            <a
              href="https://miro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-xs text-xs sm:text-sm font-mono text-zinc-400 hover:text-white bg-transparent hover:bg-white/[0.04] border border-white/[0.06] flex items-center space-x-1.5 transition-colors"
            >
              <span>↗ Open Miro</span>
            </a>
          </div>

          {/* Micro Meta */}
          <div className="pt-2 flex items-center space-x-4 text-[11px] font-mono text-zinc-500">
            <span>• 10-Slide Deck</span>
            <span>• 1080p Pitch Video</span>
            <span>• Defense Q&A</span>
            <span>• Real Miro Write-Back</span>
          </div>
        </div>

        {/* Right Column: Layered Editorial War-Room Preview */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Background Studio Grid Panel */}
            <div className="studio-panel p-6 rounded-xs border border-white/[0.08] shadow-card relative overflow-hidden bg-grid-editorial">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-bold">
                    PITCH READINESS AUDIT
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">LIVE FEED</span>
              </div>

              {/* Pitch Readiness Circular Gauge */}
              <div className="py-5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Total Readiness
                  </div>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black font-sans text-white tracking-tight">
                      86
                    </span>
                    <span className="text-sm font-mono text-[#FF4D00] font-bold">
                      /100
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">
                    ✓ Defensible in Room
                  </div>
                </div>

                {/* Circular Gauge Graphic */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FF4D00]"
                      strokeDasharray="86, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-white">86%</span>
                </div>
              </div>

              {/* AI Strategist Card */}
              <div className="p-3.5 rounded-xs bg-[#0A0A0A] border border-white/[0.08] space-y-2 mt-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#FF6A00] font-bold tracking-wider uppercase">
                    AI STRATEGIST
                  </span>
                  <span className="text-zinc-400">CONFIDENCE 91%</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  &ldquo;Your strongest argument is the 4.2h triage reduction. Anchor your opening hook on engineering burnout before presenting architecture.&rdquo;
                </p>
              </div>

              {/* Attack Weakness Fragment */}
              <div className="mt-3 p-3 rounded-xs bg-red-950/20 border border-red-500/20 flex items-start space-x-2.5">
                <Flame className="w-4 h-4 text-[#FF2D00] shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-300">
                  <span className="text-[#FF2D00] font-bold font-mono">ATTACK AUDIT:</span> What prevents Jira or Linear from copying this in 6 months?
                </div>
              </div>
            </div>

            {/* Floating Miro Sticky Note Fragment */}
            <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-[#FFD02F] text-[#050038] p-3.5 rounded-xs shadow-2xl max-w-[200px] border border-yellow-300/40 rotate-[-3deg] hidden sm:block">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider opacity-75 block mb-1">
                MIRO STICKY NOTE
              </span>
              <p className="text-xs font-bold leading-tight">
                &ldquo;Engineering teams waste 4.2h triaging bug reports.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SAMPLE DEMO IDEAS SHOWCASE (NEW) */}
      <div className="mt-20 pt-10 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-6 gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF4D00] uppercase">
              INSTANT DEMO SHOWCASE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5 font-sans">
              EXPLORE CURATED SAMPLE IDEAS
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Select any startup idea to instantly test PitchForge with pre-audited pitch decks and judge defenses.
            </p>
          </div>
          <span className="text-xs font-mono text-[#FF6A00] font-bold">
            5 DIVERSE VERTICALS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_SAMPLE_IDEAS.map((sample) => (
            <div
              key={sample.id}
              className="studio-card p-5 rounded-xs border border-white/[0.08] bg-[#0E0E0E] hover:border-[#FF4D00]/50 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-[#FF4D00] uppercase tracking-wider">
                    {sample.category}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white/[0.04] text-emerald-400 border border-emerald-500/20">
                    READINESS {sample.readinessScore}/100
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#FF6A00] transition-colors font-sans">
                  {sample.name}
                </h3>

                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                  {sample.tagline}
                </p>

                <div className="mt-3 p-2.5 rounded-xs bg-[#141414] border border-white/[0.04] text-[11px] text-zinc-400 line-clamp-2">
                  <strong className="text-zinc-300 font-mono">Problem:</strong> {sample.project.problemStatement}
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center justify-between border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-zinc-500">
                  10 SLIDES • SCRIPT • DEFENSE
                </span>

                <button
                  onClick={() => {
                    if (onSelectSampleIdea) {
                      onSelectSampleIdea(sample);
                    } else {
                      onSeeDemo();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xs text-[11px] font-mono font-bold text-white bg-[#1A1A1A] hover:bg-[#FF4D00] hover:text-black border border-white/[0.1] hover:border-[#FF4D00] flex items-center space-x-1.5 transition-all"
                >
                  <Zap className="w-3 h-3 text-[#FF6A00] group-hover:text-black" />
                  <span>Launch Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Orchestration Pipeline */}
      <div className="mt-20 pt-10 border-t border-white/[0.06]">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#FF4D00] uppercase">
              ORCHESTRATION PIPELINE
            </h2>
            <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
              From Raw Miro Board to War-Room Defense
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:block">
            6 STAGE PROTOCOL
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((item) => (
            <div
              key={item.num}
              className="studio-card p-4 rounded-xs border border-white/[0.06] flex flex-col justify-between group hover:border-[#FF4D00]/40 transition-colors"
            >
              <div>
                <span className="text-xs font-mono font-black text-[#FF4D00]">
                  {item.num}
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-2 tracking-wide">
                  {item.title}
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 leading-snug">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
