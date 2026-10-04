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
import { JudgeQuestion, JudgeDifficulty } from '@/types';

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
        return 'bg-red-500/15 text-[#FF2D00] border-red-500/40';
      case 'High':
        return 'bg-[#FF4D00]/15 text-[#FF6A00] border-[#FF4D00]/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low':
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Header Banner */}
      <div className="studio-panel p-6 sm:p-8 rounded-xs border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card bg-grid-editorial relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        <div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF4D00]">
            STAGE 05 // INVESTOR SCRUTINY SIMULATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            JUDGE DEFENSE ROOM
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Anticipate the 10 most aggressive questions hackathon judges and investors will ask. Grounded strictly in your project context.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onProceedToPackage}
            className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5"
          >
            <span>VIEW PITCH PACKAGE</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-[#101010] p-2 rounded-xs border border-white/[0.06]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`text-xs font-mono px-3 py-1.5 rounded-xs transition-colors shrink-0 uppercase font-bold ${
            selectedCategory === 'all'
              ? 'bg-white text-black'
              : 'text-zinc-400 hover:text-white bg-[#141414]'
          }`}
        >
          ALL QUESTIONS ({questions.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-mono px-3 py-1.5 rounded-xs transition-colors shrink-0 uppercase font-bold ${
              selectedCategory === cat
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white bg-[#141414]'
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
              className={`rounded-xs border transition-all overflow-hidden ${
                isEvidenceNeeded
                  ? 'bg-[#120F0D] border-[#FF4D00]/40'
                  : 'bg-[#101010] border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              {/* Question Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-xs bg-[#161616] border border-white/[0.08] text-[#FF4D00] shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                        {q.category}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs border ${getDifficultyBadge(q.difficulty)}`}>
                        {q.difficulty} DIFFICULTY
                      </span>
                      {isEvidenceNeeded && (
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs bg-[#FF4D00]/15 text-[#FF6A00] border border-[#FF4D00]/30">
                          PROOF NEEDED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      &ldquo;{q.question}&rdquo;
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1">
                    <span>{isExpanded ? 'HIDE DEFENSE' : 'REVEAL DEFENSE'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Skeptical Angle & Suggested Answer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] space-y-3 bg-black/40">
                  <div className="p-3 rounded-xs bg-[#121212] border border-red-500/20">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#FF2D00] tracking-wider block mb-1">
                      SKEPTICAL ANGLE:
                    </span>
                    <p className="text-xs text-zinc-300 italic">
                      {q.skepticalAngle}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">
                      RECOMMENDED DEFENSE ANSWER (GROUNDED):
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal bg-[#121212] p-4 rounded-xs border border-white/[0.08]">
                      {q.suggestedAnswer}
                    </p>
                  </div>

                  {q.evidenceNeeded && (
                    <div className="p-3 rounded-xs bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-amber-200 text-xs font-mono flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF4D00]" />
                      <div>
                        <strong>EVIDENCE GAP:</strong> {q.evidenceNeeded}
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
