'use client';

import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Users,
  Target,
  FileSearch,
  Scale
} from 'lucide-react';
import { PitchAnalysis, EvidenceClassification } from '@/types';

interface AnalysisDashboardProps {
  analysis: PitchAnalysis;
  onNavigateTab: (tab: string) => void;
  onAttackMode: () => void;
  onImprovePitch: () => void;
  onGeneratePitch: () => void;
}

export function AnalysisDashboard({
  analysis,
  onNavigateTab,
  onAttackMode,
  onImprovePitch,
  onGeneratePitch,
}: AnalysisDashboardProps) {
  const readiness = analysis.pitchReadinessScore;
  const breakdown = analysis.readinessBreakdown;

  const getEvidenceBadge = (type: EvidenceClassification) => {
    switch (type) {
      case 'verified-evidence':
        return {
          label: 'Verified Evidence',
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'unverified-claim':
        return {
          label: 'Unverified Claim',
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400 animate-pulse',
        };
      case 'assumption':
        return {
          label: 'Assumption',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'evidence-needed':
        return {
          label: 'Evidence Needed',
          classes: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
          dot: 'bg-pink-400',
        };
      case 'ai-inference':
        return {
          label: 'AI Inference',
          classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
        };
      case 'user-provided':
      default:
        return {
          label: 'User Provided',
          classes: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
          dot: 'bg-slate-400',
        };
    }
  };

  const readinessItems = [
    { key: 'problemClarity', label: 'Problem Clarity', data: breakdown.problemClarity },
    { key: 'solutionClarity', label: 'Solution Clarity', data: breakdown.solutionClarity },
    { key: 'targetUserClarity', label: 'Target User Clarity', data: breakdown.targetUserClarity },
    { key: 'differentiation', label: 'Differentiation', data: breakdown.differentiation },
    { key: 'evidence', label: 'Empirical Evidence', data: breakdown.evidence },
    { key: 'technicalFeasibility', label: 'Technical Feasibility', data: breakdown.technicalFeasibility },
    { key: 'businessPotential', label: 'Business Potential', data: breakdown.businessPotential },
    { key: 'storytelling', label: 'Storytelling & Hook', data: breakdown.storytelling },
  ];

  return (
    <div className="space-y-6">
      {/* Actionable Next Step Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Next Recommended Action
          </span>
          <p className="text-sm font-semibold text-white mt-0.5">
            {analysis.nextActionPrompt?.text || `Your pitch is ${readiness}% ready. Audit critical claims before generating slides.`}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onImprovePitch}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Improve Weak Sections
          </button>
          <button
            onClick={onAttackMode}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-900/30 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Attack My Pitch</span>
          </button>
          <button
            onClick={onGeneratePitch}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Pitch Deck</span>
          </button>
        </div>
      </div>

      {/* Pitch Readiness Score & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Readiness Gauge Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                PITCH READINESS SCORE
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                readiness >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                readiness >= 65 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {readiness >= 80 ? 'Battle Ready' : readiness >= 65 ? 'Needs Hardening' : 'High Vulnerability'}
              </span>
            </div>

            <div className="mt-6 flex items-baseline space-x-2">
              <span className="text-5xl font-black tracking-tight text-white font-mono">
                {readiness}
              </span>
              <span className="text-lg text-slate-500 font-semibold">/ 100</span>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Calculated from Qwen deep reasoning across 8 core dimensions. We strictly penalize unbacked statistics to guarantee judge survival.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Technical Feasibility:</span>
              <span className="font-semibold text-emerald-400">{analysis.technicalFeasibility.score}/100</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Claims Audited:</span>
              <span className="font-semibold text-slate-200">{analysis.claimAudits.length} Statements</span>
            </div>
          </div>
        </div>

        {/* 8-Criteria Breakdown Progress Bars */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Readiness Breakdown & Explanations
            </h3>
            <span className="text-[11px] text-slate-500">Every score is strictly grounded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readinessItems.map(({ key, label, data }) => {
              if (!data) return null;
              const isEvidenceNeeded = data.evidenceNeeded;
              const score = data.score;

              return (
                <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{label}</span>
                    <div className="flex items-center space-x-2">
                      {isEvidenceNeeded && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30 uppercase">
                          Evidence needed
                        </span>
                      )}
                      <span className="font-mono font-bold text-slate-300">{score}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 80 ? 'bg-indigo-500' :
                        score >= 65 ? 'bg-amber-400' :
                        'bg-rose-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {data.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Claim Audit & Evidence Integrity Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <FileSearch className="w-4 h-4 text-indigo-400" />
              <span>Evidence Audit & Fact Classification</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              PitchForge enforces epistemic honesty: AI inferences and user claims are never confused with verified proof.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.claimAudits.map((item, idx) => {
            const badge = getEvidenceBadge(item.classification);
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center space-x-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">
                    &ldquo;{item.claim}&rdquo;
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1.5 italic">
                    Context: {item.context}
                  </p>
                </div>

                {item.recommendation && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 font-medium">
                    ↳ Action: {item.recommendation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pain Points */}
        <div className="glass-panel p-5 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Identified Pain Points</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {analysis.painPoints.map((p, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400/80 font-mono text-[10px] mt-0.5">✕</span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitors & Differentiation */}
        <div className="glass-panel p-5 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2 mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Competitive Defense</span>
          </h4>
          <div className="space-y-2.5">
            {analysis.competitors.slice(0, 2).map((c, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-semibold text-slate-200">{c.name}:</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{c.comparison}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions & Gaps */}
        <div className="glass-panel p-5 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assumptions Under Scrutiny</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {analysis.assumptions.slice(0, 3).map((a, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 font-mono text-[10px] mt-0.5">?</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
