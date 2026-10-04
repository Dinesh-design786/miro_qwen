'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  AlertTriangle, 
  Check, 
  TrendingUp,
  Flame,
  Presentation
} from 'lucide-react';
import { PitchImprovementItem, PitchAnalysis } from '@/types';

interface ImprovementViewProps {
  improvements: PitchImprovementItem[];
  onApplyImprovement: (id: string, userFixText: string) => void;
  onApplyAll: () => void;
  onProceedToDeck: () => void;
  onLaunchAttack: () => void;
  currentScore: number;
}

export function ImprovementView({
  improvements,
  onApplyImprovement,
  onApplyAll,
  onProceedToDeck,
  onLaunchAttack,
  currentScore,
}: ImprovementViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customDrafts, setCustomDrafts] = useState<Record<string, string>>({});

  const appliedCount = improvements.filter(i => i.isApplied).length;
  const allApplied = appliedCount === improvements.length && improvements.length > 0;

  const handleTextChange = (id: string, text: string) => {
    setCustomDrafts(prev => ({ ...prev, [id]: text }));
  };

  const handleApplySingle = (item: PitchImprovementItem) => {
    const textToApply = customDrafts[item.id] !== undefined ? customDrafts[item.id] : item.suggestedImprovement;
    onApplyImprovement(item.id, textToApply);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            AI REFINEMENT ENGINE
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            3 things hurting your pitch right now
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Qwen isolated the 3 highest-leverage vulnerabilities. Fix or customize them below to raise your Pitch Readiness score.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {!allApplied && (
            <button
              onClick={onApplyAll}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accept All Recommendations</span>
            </button>
          )}

          <button
            onClick={onProceedToDeck}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30 flex items-center space-x-1.5 transition-all"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Generate Pitch Deck</span>
          </button>
        </div>
      </div>

      {/* Progress & Readiness Projection */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-1">
            {improvements.map((item, idx) => (
              <div
                key={item.id}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 ${
                  item.isApplied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {item.isApplied ? '✓' : idx + 1}
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-300">
            {appliedCount} of {improvements.length} improvements incorporated
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Current Score:</span>
          <span className="font-bold font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {currentScore}/100
          </span>
          {appliedCount > 0 && (
            <span className="text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{appliedCount * 7} pts
            </span>
          )}
        </div>
      </div>

      {/* 3 Improvement Cards */}
      <div className="space-y-4">
        {improvements.map((item) => {
          const isApplied = item.isApplied;
          const isEditing = editingId === item.id;
          const currentText = customDrafts[item.id] ?? item.suggestedImprovement;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                isApplied
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <span className="font-mono text-2xl font-black text-indigo-400 shrink-0">
                    {item.number}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      {item.category && (
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isApplied ? (
                  <span className="shrink-0 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied to Pitch</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplySingle(item)}
                    className="shrink-0 text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Fix</span>
                  </button>
                )}
              </div>

              {/* Explanations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="font-semibold text-rose-400 uppercase tracking-wider text-[10px]">
                    Why It Matters
                  </span>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    {item.whyItMatters}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">
                    What Information Is Missing
                  </span>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    {item.whatIsMissing}
                  </p>
                </div>
              </div>

              {/* Suggested Improvement & Interactive User Input */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Suggested Improvement (Click edit to tailor)</span>
                  </span>
                  <button
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditing ? 'Collapse' : 'Customize'}</span>
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      rows={3}
                      value={currentText}
                      onChange={(e) => handleTextChange(item.id, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleApplySingle(item)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-md shadow-sm"
                      >
                        Save & Apply
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
                    &ldquo;{item.userFix || item.suggestedImprovement}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
