'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
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
          classes: 'bg-red-500/15 text-[#FF2D00] border-red-500/40',
          indicator: 'bg-[#FF2D00] animate-ping',
        };
      case 'high':
        return {
          label: 'HIGH VULNERABILITY',
          classes: 'bg-[#FF4D00]/15 text-[#FF6A00] border-[#FF4D00]/40',
          indicator: 'bg-[#FF4D00]',
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          indicator: 'bg-amber-400',
        };
      case 'low':
      default:
        return {
          label: 'POLISH ISSUE',
          classes: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          indicator: 'bg-zinc-400',
        };
    }
  };

  const handleSaveDefense = (item: PitchAttackItem) => {
    const text = defenseDrafts[item.id] || item.recommendedFix;
    onAddressAttack(item.id, text);
    setExpandedId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Editorial War-Room Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-xs bg-[#0C0808] border border-red-500/30 shadow-card">
        {/* Flame Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2D00]/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xs bg-[#FF2D00]/15 border border-[#FF2D00]/40 text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5 text-[#FF2D00]" />
              <span>SKEPTICAL INVESTOR STRESS TEST</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
              ATTACK MY PITCH
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl font-normal leading-relaxed">
              Exposing unsupported assumptions, market risks, and structural vulnerabilities before facing real judges.
            </p>
          </div>

          {/* Survival Score Badge */}
          <div className="p-5 rounded-xs bg-[#111111] border border-white/[0.08] flex items-center space-x-5 shrink-0 shadow-flame-sm">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider block">
                SURVIVAL CALIBRATION
              </span>
              <div className="flex items-baseline justify-end space-x-1 mt-0.5">
                <span className="text-4xl font-black text-white font-mono">
                  {currentSurvivalScore}
                </span>
                <span className="text-xs font-mono text-[#FF4D00] font-bold">/ 100</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                {addressedCount > 0 ? `+${addressedCount * 8} PTS RECOVERED` : 'HIGH VULNERABILITY'}
              </span>
            </div>

            <div className="w-12 h-12 rounded-xs bg-gradient-to-tr from-[#FF2D00] to-[#FF6A00] flex items-center justify-center text-black font-black shadow-flame-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Priority Action */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
          <span className="text-zinc-300 flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-[#FF2D00] shrink-0" />
            <span>Fix these {attackReport.attacks.filter(a => a.severity === 'critical').length || 3} critical issues before entering the room.</span>
          </span>
          <button
            onClick={onProceedToPitch}
            className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5 self-end sm:self-auto"
          >
            <span>PROCEED TO PITCH</span>
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
              className={`rounded-xs border transition-all overflow-hidden ${
                isAddressed 
                  ? 'bg-[#0E120E] border-emerald-500/40' 
                  : atk.severity === 'critical'
                  ? 'bg-[#100A0A] border-red-500/30 hover:border-red-500/60'
                  : 'bg-[#101010] border-white/[0.08] hover:border-[#FF4D00]/40'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full block ${badge.indicator}`} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-xs border ${badge.classes}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                        {atk.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      &ldquo;{atk.issue}&rdquo;
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  {isAddressed ? (
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xs flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ARMED IN DEFENSE</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : atk.id)}
                      className="text-xs font-mono font-bold text-white bg-[#1A1A1A] hover:bg-[#222222] border border-white/[0.1] px-3.5 py-1.5 rounded-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Zap className="w-3 h-3 text-[#FF4D00]" />
                      <span>{isExpanded ? 'HIDE DEFENSE' : 'ARM DEFENSE'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Explanations Body */}
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-white/[0.06] pt-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#FF2D00] tracking-wider block mb-1">
                    WHY JUDGES WILL ATTACK THIS:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {atk.whyItMatters}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                    COUNTER-STRATEGY & REMEDY:
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    {atk.recommendedFix}
                  </p>
                </div>
              </div>

              {/* Expandable Defense Form */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 bg-black/60 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide">
                      Tailor your spoken counterargument for the room:
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={userText}
                    onChange={(e) => setDefenseDrafts(prev => ({ ...prev, [atk.id]: e.target.value }))}
                    className="w-full bg-[#121212] border border-white/[0.1] rounded-xs p-3 text-xs text-white font-mono focus:outline-none focus:border-[#FF4D00]"
                    placeholder="Enter the specific proof or defense point you will deliver..."
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-3 py-1.5 text-xs font-mono text-zinc-500 hover:text-white"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={() => handleSaveDefense(atk)}
                      className="btn-flame px-4 py-1.5 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>LOCK IN DEFENSE (+8 PTS)</span>
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
