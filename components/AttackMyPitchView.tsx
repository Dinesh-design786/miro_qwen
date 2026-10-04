'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PitchAttackReport, PitchAttackItem, AttackSeverity } from '@/types';

interface AttackMyPitchViewProps {
  attackReport: PitchAttackReport;
  onAddressAttack: (attackId: string, defenseNote: string) => void;
  onProceedToPitch: () => void;
}

export function AttackMyPitchView({
  attackReport,
  onAddressAttack,
  onProceedToPitch,
}: AttackMyPitchViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [defenseDrafts, setDefenseDrafts] = useState<Record<string, string>>({});

  const addressedCount = attackReport.attacks.filter(a => a.status === 'addressed').length;
  const currentSurvivalScore = Math.min(
    100,
    attackReport.initialSurvivalScore + addressedCount * 8
  );

  const getSeverityBadge = (severity: AttackSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL THREAT',
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          indicator: 'bg-rose-500 animate-ping',
        };
      case 'high':
        return {
          label: 'HIGH VULNERABILITY',
          classes: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          indicator: 'bg-orange-500',
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          indicator: 'bg-amber-400',
        };
      case 'low':
      default:
        return {
          label: 'POLISH ISSUE',
          classes: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
          indicator: 'bg-slate-400',
        };
    }
  };

  const handleSaveDefense = (item: PitchAttackItem) => {
    const text = defenseDrafts[item.id] || item.recommendedFix;
    onAddressAttack(item.id, text);
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Signature Attack Mode Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/80 via-[#18080C] to-slate-950 border border-rose-600/40 shadow-2xl attack-glow">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[90px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Skeptical Judge Stress Test</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              ATTACK MY PITCH
            </h1>
            <p className="text-sm sm:text-base text-rose-200/80 mt-1 max-w-xl font-medium">
              &ldquo;Let&apos;s find every reason a skeptical judge or VC could reject this idea.&rdquo;
            </p>
          </div>

          {/* Survival Score Badge */}
          <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/30 flex items-center space-x-4 shrink-0 shadow-lg">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">
                PITCH SURVIVAL SCORE
              </span>
              <div className="flex items-baseline justify-end space-x-1 mt-0.5">
                <span className="text-3xl font-black text-white font-mono">
                  {currentSurvivalScore}
                </span>
                <span className="text-sm font-semibold text-rose-400/80">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {addressedCount > 0 ? `+${addressedCount * 8} pts recovered` : 'High vulnerability'}
              </span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Priorities Alert */}
        <div className="mt-6 pt-4 border-t border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-rose-200 font-semibold flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Fix these {attackReport.attacks.filter(a => a.severity === 'critical').length || 3} critical issues before facing judges.</span>
          </span>
          <button
            onClick={onProceedToPitch}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all self-end sm:self-auto"
          >
            <span>Proceed to Presentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Attacks List */}
      <div className="space-y-4">
        {attackReport.attacks.map((atk) => {
          const badge = getSeverityBadge(atk.severity);
          const isAddressed = atk.status === 'addressed';
          const isExpanded = expandedId === atk.id;
          const userText = defenseDrafts[atk.id] !== undefined ? defenseDrafts[atk.id] : atk.recommendedFix;

          return (
            <div
              key={atk.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isAddressed 
                  ? 'bg-slate-900/80 border-emerald-500/40' 
                  : atk.severity === 'critical'
                  ? 'bg-[#150D13] border-rose-500/40 hover:border-rose-500/60'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full block ${badge.indicator}`} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badge.classes}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {atk.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 tracking-tight">
                      &ldquo;{atk.issue}&rdquo;
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  {isAddressed ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Addressed in Defense</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : atk.id)}
                      className="text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Defense' : 'Arm Defense'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Explanations Body */}
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-slate-800/80 pt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                    Why A Judge Will Attack This
                  </span>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    {atk.whyItMatters}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Recommended Defense & Remedy
                  </span>
                  <p className="mt-1 text-slate-300 leading-relaxed font-medium">
                    {atk.recommendedFix}
                  </p>
                </div>
              </div>

              {/* Expandable Defense Form */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-black/40 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Tailor your spoken defense to the judges:
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={userText}
                    onChange={(e) => setDefenseDrafts(prev => ({ ...prev, [atk.id]: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="Enter the specific evidence or counterargument you will present..."
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveDefense(atk)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-900/30 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lock In Defense (+8 pts)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
