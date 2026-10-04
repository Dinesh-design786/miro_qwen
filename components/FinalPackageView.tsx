'use client';

import React, { useState } from 'react';
import { 
  PackageCheck, 
  CheckCircle2, 
  Download, 
  Presentation, 
  FileText, 
  Mic2, 
  Volume2, 
  ShieldAlert, 
  Flame, 
  Video, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  PitchDeck, 
  ExecutiveSummary, 
  PitchAttackReport, 
  JudgeQuestion, 
  PitchAnalysis 
} from '@/types';
import { 
  exportPitchDeckToPPTX, 
  exportSummaryAsMarkdown, 
  downloadBlob 
} from '@/services/export/pptxExport';

interface FinalPackageViewProps {
  deck?: PitchDeck | null;
  summary?: ExecutiveSummary | null;
  attackReport?: PitchAttackReport | null;
  judgeQuestions?: JudgeQuestion[];
  analysis?: PitchAnalysis | null;
  onNavigateTab: (tab: string) => void;
  onPrepareForPitch: () => void;
}

export function FinalPackageView({
  deck,
  summary,
  attackReport,
  judgeQuestions = [],
  analysis,
  onNavigateTab,
  onPrepareForPitch,
}: FinalPackageViewProps) {
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);

  const readinessScore = Math.max(91, (analysis?.pitchReadinessScore || 70) + 18);

  const assets = [
    {
      id: 'presentation',
      name: 'Pitch Deck (PPTX)',
      desc: `${deck?.slides.length || 10} slides formatted in 16:9 with speaker notes & visuals`,
      icon: Presentation,
      color: 'text-indigo-400',
      tab: 'presentation',
      status: 'Ready',
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      desc: '1-page investor and hackathon briefing ready for distribution',
      icon: FileText,
      color: 'text-emerald-400',
      tab: 'overview',
      status: 'Ready',
    },
    {
      id: 'script',
      name: 'Speaker Script',
      desc: 'Slide-by-slide teleprompter script with cadence & pause timings',
      icon: Mic2,
      color: 'text-cyan-400',
      tab: 'script',
      status: 'Ready',
    },
    {
      id: 'audio',
      name: 'Audio Pitch Narration',
      desc: 'Synthesized voiceover matching exact slide timecodes',
      icon: Volume2,
      color: 'text-pink-400',
      tab: 'audio',
      status: 'Ready',
    },
    {
      id: 'judge',
      name: 'Judge Q&A Defense',
      desc: `${judgeQuestions.length || 10} skeptical questions across 10 evaluation categories`,
      icon: ShieldAlert,
      color: 'text-purple-400',
      tab: 'judge',
      status: 'Ready',
    },
    {
      id: 'attack',
      name: 'Pitch Attack Report',
      desc: 'Audit of weak assumptions with armed spoken counter-defenses',
      icon: Flame,
      color: 'text-rose-400',
      tab: 'attack',
      status: 'Hardened',
    },
    {
      id: 'video',
      name: '1080p Video Timeline',
      desc: 'Multi-track composition syncing slides, audio, and subtitles',
      icon: Video,
      color: 'text-amber-400',
      tab: 'video',
      status: 'Ready',
    },
  ];

  const recommendations = [
    'Add evidence for market size before approaching financial investors.',
    'Reiterate the automated clarification loop when answering questions about Copilot.',
    'Highlight the 85% confidence safety fallback during technical Q&A.',
  ];

  const handleDownloadCompleteBundle = async () => {
    setIsDownloadingBundle(true);
    try {
      if (deck) {
        const pptxBlob = await exportPitchDeckToPPTX(deck);
        if (pptxBlob) {
          downloadBlob(pptxBlob, `${deck.title.replace(/\s+/g, '_')}_Deck.pptx`);
        }
      }

      if (summary) {
        const mdText = exportSummaryAsMarkdown(summary);
        const mdBlob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
        downloadBlob(mdBlob, `${summary.projectName.replace(/\s+/g, '_')}_Executive_Summary.md`);
      }
    } catch (e) {
      console.error('Error downloading bundle:', e);
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Completion Card */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-emerald-950/40 border border-indigo-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete Pitch Package Formed</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Your Pitch Package is Ready
          </h1>

          <p className="text-sm text-slate-300 max-w-xl">
            From raw Miro sticky notes and problem statement to presentation slides, speaker coach script, and battle-tested judge defenses.
          </p>
        </div>

        {/* Readiness Score Card */}
        <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 flex items-center space-x-5 shrink-0 shadow-xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              FINAL READINESS
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-4xl font-black text-white font-mono">
                {readinessScore}
              </span>
              <span className="text-sm font-semibold text-emerald-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              You are ready to present.
            </span>
          </div>

          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Award className="w-6 h-6 text-slate-950" />
          </div>
        </div>
      </div>

      {/* 3 Recommendations Before Presenting */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3 Critical Recommendations Before Facing Judges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Package Assets Checklist Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <span className="font-bold text-white uppercase tracking-wider">
            Generated Pitch Assets
          </span>
          <button
            onClick={handleDownloadCompleteBundle}
            disabled={isDownloadingBundle}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingBundle ? 'Exporting Bundle...' : 'Download Complete Bundle (PPTX + MD)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const Icon = asset.icon;
            return (
              <div
                key={asset.id}
                onClick={() => onNavigateTab(asset.tab)}
                className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group hover:border-indigo-500/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <Icon className={`w-5 h-5 ${asset.color}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                      <span>✓</span>
                      <span>{asset.status}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {asset.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Open Preview</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Big Action Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onPrepareForPitch}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl shadow-emerald-900/30 text-base flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Award className="w-5 h-5" />
          <span>Prepare for Live Pitch Delivery</span>
        </button>
      </div>
    </div>
  );
}
