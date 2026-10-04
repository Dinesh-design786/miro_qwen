'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { JudgeQuestion, JudgeCategory, JudgeDifficulty } from '@/types';

interface JudgeModeViewProps {
  questions: JudgeQuestion[];
  onProceedToPackage: () => void;
}

export function JudgeModeView({ questions, onProceedToPackage }: JudgeModeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(questions.map(q => q.category)));

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  const getDifficultyBadge = (difficulty: JudgeDifficulty) => {
    switch (difficulty) {
      case 'Brutal':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Low':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            SKEPTICAL VC & HACKATHON JUDGE ROOM
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            Survive the 10 Critical Judge Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Answers are strictly grounded in your project context. If evidence is lacking, Qwen warns you before judges expose the hole.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onProceedToPackage}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <span>View Pitch Package</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-800'
          }`}
        >
          All Questions ({questions.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          const isEvidenceNeeded = q.evidenceStatus === 'evidence-needed';

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isEvidenceNeeded
                  ? 'bg-slate-900/90 border-amber-500/40'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/60 text-indigo-400 shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        {q.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getDifficultyBadge(q.difficulty)}`}>
                        {q.difficulty} Difficulty
                      </span>
                      {isEvidenceNeeded && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30">
                          Evidence needed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      &ldquo;{q.question}&rdquo;
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
                    <span>{isExpanded ? 'Hide Answer' : 'Reveal Answer'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Skeptical Angle & Suggested Answer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-3 bg-black/30">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block mb-1">
                      Skeptical Judge Angle:
                    </span>
                    <p className="text-xs text-slate-300 italic">
                      {q.skepticalAngle}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">
                      Recommended Spoken Answer (Grounded in context):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      {q.suggestedAnswer}
                    </p>
                  </div>

                  {q.evidenceNeeded && (
                    <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-pink-400" />
                      <div>
                        <strong className="font-semibold">Evidence Needed:</strong> {q.evidenceNeeded}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
