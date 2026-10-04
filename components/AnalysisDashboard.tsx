'use client';

import React from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileSearch,
  ExternalLink,
  Target,
  Layers,
  Cpu,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { PitchAnalysis, EvidenceClassification } from '@/types';

interface AnalysisDashboardProps {
  analysis: PitchAnalysis;
  onNavigateTab: (tab: string) => void;
  onAttackMode: () => void;
  onImprovePitch: () => void;
  onGeneratePitch: () => void;
  onSendToMiro?: () => void;
}

export function AnalysisDashboard({
  analysis,
  onNavigateTab,
  onAttackMode,
  onImprovePitch,
  onGeneratePitch,
  onSendToMiro,
}: AnalysisDashboardProps) {
  const readiness = analysis.pitchReadinessScore;
  const breakdown = analysis.readinessBreakdown;

  const getEvidenceBadge = (type: EvidenceClassification) => {
    switch (type) {
      case 'verified-evidence':
        return {
          label: 'VERIFIED',
          classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'unverified-claim':
        return {
          label: 'UNVERIFIED',
          classes: 'bg-red-500/15 text-[#FF2D00] border-red-500/30',
        };
      case 'assumption':
        return {
          label: 'ASSUMPTION',
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'evidence-needed':
        return {
          label: 'PROOF NEEDED',
          classes: 'bg-[#FF4D00]/15 text-[#FF6A00] border-[#FF4D00]/30',
        };
      case 'ai-inference':
      default:
        return {
          label: 'INFERENCE',
          classes: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        };
    }
  };

  const coreAnalysisCriteria = [
    { label: 'Problem Clarity', data: breakdown.problemClarity },
    { label: 'Solution Clarity', data: breakdown.solutionClarity },
    { label: 'Target User', data: breakdown.targetUserClarity },
    { label: 'Differentiation', data: breakdown.differentiation },
    { label: 'Evidence', data: breakdown.evidence },
    { label: 'Technical Feasibility', data: breakdown.technicalFeasibility },
    { label: 'Business Potential', data: breakdown.businessPotential },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Editorial War-Room Action Bar */}
      <div className="p-4 sm:p-5 rounded-xs bg-[#111111] border border-white/[0.08] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
            <span>AI STRATEGIST RECOMMENDATION</span>
          </div>
          <p className="text-sm font-medium text-white mt-1">
            {analysis.nextActionPrompt?.text || `Your pitch readiness is calibrated at ${readiness}%. Audit critical claims before generating slides.`}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-2">
          {onSendToMiro && (
            <button
              onClick={onSendToMiro}
              className="px-4 py-2 rounded-xs text-xs font-mono font-bold text-black bg-[#FFD02F] hover:bg-[#F2C425] shadow-sm flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
            >
              <span>✦ SEND TO MIRO</span>
            </button>
          )}

          <button
            onClick={onAttackMode}
            className="px-4 py-2 rounded-xs text-xs font-mono font-bold text-white bg-gradient-to-r from-[#FF2D00] to-red-700 hover:from-[#FF4D00] hover:to-red-600 shadow-flame-sm flex items-center space-x-1.5 transition-all"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🔥 ATTACK MY PITCH</span>
          </button>

          <button
            onClick={onGeneratePitch}
            className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>GENERATE PITCH DECK</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN CENTRAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: BOARD INPUT (Extracted Miro Content) */}
        <div className="lg:col-span-3 studio-panel p-5 rounded-xs border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                BOARD INPUT
              </span>
              <h3 className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                Extracted Miro Context
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">LIVE CANVAS</span>
          </div>

          {/* Sticky Notes & Extracted Fragments */}
          <div className="space-y-3">
            <div className="p-3 rounded-xs bg-[#FFD02F]/10 border border-[#FFD02F]/30 text-amber-200">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-amber-400 block mb-1">
                PROBLEM STATEMENT
              </span>
              <p className="text-xs text-zinc-200 leading-snug">
                {analysis.problem || "Software developers lose 4.2 hours daily parsing vague, incomplete user bug reports."}
              </p>
            </div>

            <div className="p-3 rounded-xs bg-zinc-900/80 border border-white/[0.06]">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                TARGET PERSONA
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.targetUsers.map((u, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-black text-zinc-300 border border-white/[0.08]">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xs bg-zinc-900/80 border border-white/[0.06]">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                KEY PAIN POINTS
              </span>
              <ul className="text-xs text-zinc-300 space-y-1 mt-1">
                {analysis.painPoints.slice(0, 3).map((p, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-[#FF4D00] font-mono">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xs bg-zinc-900/80 border border-white/[0.06]">
              <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                DIFFERENTIATION EDGE
              </span>
              <p className="text-xs text-zinc-300 leading-snug">
                {(analysis.differentiators && analysis.differentiators.length > 0) 
                  ? analysis.differentiators.join(' • ') 
                  : (analysis.valueProposition || "Deterministically reproduces bugs in isolated cloud containers.")}
              </p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: AI ANALYSIS (Strategic Reasoning) */}
        <div className="lg:col-span-6 space-y-6">
          {/* AI STRATEGIST Callout */}
          <div className="studio-card p-5 rounded-xs border border-[#FF4D00]/30 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#141414] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D00]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-white/[0.06]">
              <span className="text-[#FF6A00] font-bold tracking-widest uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#FF4D00]" />
                <span>AI STRATEGIST EVALUATION</span>
              </span>
              <span className="text-zinc-400 font-bold">CONFIDENCE 91%</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 mt-3 leading-relaxed">
              Your strongest argument is the dramatic reduction in triage latency. Anchor your opening hook on developer burnout before detailing technical infrastructure.
            </p>
          </div>

          {/* Core Analysis Criteria Cards */}
          <div className="studio-panel p-5 rounded-xs border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                  AI ANALYSIS
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                  Core Thesis Dimensions
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">7 VECTORS</span>
            </div>

            <div className="space-y-3">
              {coreAnalysisCriteria.map(({ label, data }) => {
                if (!data) return null;
                const score = data.score;
                return (
                  <div key={label} className="p-3 rounded-xs bg-[#101010] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-zinc-200 font-semibold">{label}</span>
                      <div className="flex items-center space-x-2">
                        {data.evidenceNeeded && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#FF4D00]/15 text-[#FF6A00] border border-[#FF4D00]/30 uppercase">
                            Proof Needed
                          </span>
                        )}
                        <span className="font-mono font-bold text-[#FF4D00]">{score}/100</span>
                      </div>
                    </div>

                    {/* Minimal Progress Bar */}
                    <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FF2D00] transition-all duration-700"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {data.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Audit & Fact Classification */}
          <div className="studio-panel p-5 rounded-xs border border-white/[0.08]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                  EVIDENCE INTEGRITY
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-0.5">
                  Audited Statements
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {analysis.claimAudits.length} AUDITED
              </span>
            </div>

            <div className="space-y-2.5">
              {analysis.claimAudits.map((item, idx) => {
                const badge = getEvidenceBadge(item.classification);
                return (
                  <div key={idx} className="p-3 rounded-xs bg-[#101010] border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-xs border ${badge.classes}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        {item.context}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 font-medium">
                      &ldquo;{item.claim}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {item.recommendation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PITCH READINESS & ATTACK WAR ROOM */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Pitch Readiness Circular Gauge Card */}
          <div className="studio-panel p-6 rounded-xs border border-white/[0.08] shadow-card text-center relative overflow-hidden bg-grid-editorial">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] to-[#FF2D00]" />

            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF4D00] block mb-2">
              PITCH READINESS
            </span>

            {/* Circular Gauge */}
            <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center">
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
                  strokeDasharray={`${readiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black font-sans text-white tracking-tight">
                  {readiness}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">/ 100</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-mono mt-2">
              {readiness >= 80 ? '✓ High Investor Confidence' : readiness >= 65 ? '⚠️ Needs Hardening' : '🚨 High Vulnerability'}
            </p>
          </div>

          {/* 🔥 ATTACK MY PITCH Box */}
          <div className="studio-panel p-5 rounded-xs border border-red-500/30 bg-gradient-to-b from-red-950/20 to-[#101010] shadow-card space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-red-500/20">
              <Flame className="w-4 h-4 text-[#FF2D00]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                🔥 ATTACK MY PITCH
              </h3>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block font-bold">
                CRITICAL WEAKNESSES IDENTIFIED:
              </span>

              {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                analysis.weaknesses.slice(0, 3).map((flaw, idx) => (
                  <div key={idx} className="p-3 rounded-xs bg-[#0B0B0B] border border-red-500/20 space-y-1">
                    <span className="text-[10px] font-mono text-[#FF2D00] font-bold block uppercase">
                      VULNERABILITY {idx + 1}
                    </span>
                    <p className="text-xs text-zinc-200">
                      {flaw}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xs bg-[#0B0B0B] border border-red-500/20">
                  <span className="text-[10px] font-mono text-[#FF2D00] font-bold block uppercase">
                    DEFENSE AUDIT
                  </span>
                  <p className="text-xs text-zinc-200">
                    Skeptics will challenge why a simple browser extension or Jira integration couldn&apos;t duplicate your core mechanism.
                  </p>
                </div>
              )}

              <button
                onClick={onAttackMode}
                className="w-full py-2.5 rounded-xs text-xs font-mono font-bold text-white bg-gradient-to-r from-[#FF2D00] to-red-800 hover:from-[#FF4D00] hover:to-red-700 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>OPEN ATTACK WAR ROOM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Technical Feasibility Summary */}
          <div className="p-4 rounded-xs bg-[#101010] border border-white/[0.06] text-xs font-mono text-zinc-400 space-y-2">
            <div className="flex justify-between">
              <span>TECH FEASIBILITY:</span>
              <span className="text-emerald-400 font-bold">{analysis.technicalFeasibility.score}/100</span>
            </div>
            <div className="flex justify-between">
              <span>BUSINESS POTENTIAL:</span>
              <span className="text-[#FF4D00] font-bold">{analysis.readinessBreakdown.businessPotential.score}/100</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
