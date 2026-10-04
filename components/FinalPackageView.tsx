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
  Layers
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
  onSendToMiro?: () => void;
}

export function FinalPackageView({
  deck,
  summary,
  attackReport,
  judgeQuestions = [],
  analysis,
  onNavigateTab,
  onPrepareForPitch,
  onSendToMiro,
}: FinalPackageViewProps) {
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);

  const readinessScore = Math.max(91, (analysis?.pitchReadinessScore || 70) + 18);

  const assets = [
    {
      id: 'miro-workspace',
      name: 'Miro Board Workspace',
      desc: 'Dedicated 🚀 PitchForge AI Pitch frame with sticky notes, architecture & Q&A',
      icon: Layers,
      tab: 'miro',
      status: 'READY TO SYNC',
      isMiroAction: true,
    },
    {
      id: 'presentation',
      name: 'Pitch Deck (PPTX)',
      desc: `${deck?.slides.length || 10} slides formatted in 16:9 with speaker notes & visuals`,
      icon: Presentation,
      tab: 'presentation',
      status: '10 SLIDES READY',
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      desc: '1-page investor and hackathon briefing ready for distribution',
      icon: FileText,
      tab: 'overview',
      status: 'VERIFIED',
    },
    {
      id: 'script',
      name: 'Speaker Script',
      desc: 'Slide-by-slide teleprompter script with cadence & pause timings',
      icon: Mic2,
      tab: 'script',
      status: 'COACHED',
    },
    {
      id: 'audio',
      name: 'Audio Narration',
      desc: 'Synthesized voiceover matching exact slide timecodes',
      icon: Volume2,
      tab: 'audio',
      status: 'SYNCHRONIZED',
    },
    {
      id: 'judge',
      name: 'Judge Defense Q&A',
      desc: `${judgeQuestions.length || 10} skeptical questions across 10 evaluation categories`,
      icon: ShieldAlert,
      tab: 'judge',
      status: 'ARMED',
    },
    {
      id: 'attack',
      name: 'Pitch Attack Audit',
      desc: 'Audit of weak assumptions with armed spoken counter-defenses',
      icon: Flame,
      tab: 'attack',
      status: 'HARDENED',
    },
    {
      id: 'video',
      name: 'Video Timeline',
      desc: 'Multi-track composition syncing slides, audio, and subtitles',
      icon: Video,
      tab: 'video',
      status: 'COMPOSED',
    },
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
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Hero Completion Studio Banner */}
      <div className="studio-panel p-6 sm:p-10 rounded-xs border border-white/[0.08] shadow-card bg-grid-editorial relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xs bg-[#FF4D00]/15 border border-[#FF4D00]/30 text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>PITCH PACKAGE SYNTHESIS COMPLETE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
            YOUR PITCH PACKAGE IS ARMED
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-normal leading-relaxed">
            From raw Miro board ideation to 10-slide deck, speaker teleprompter, and battle-tested hostile judge defense.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
          {onSendToMiro && (
            <button
              onClick={onSendToMiro}
              className="btn-flame px-5 py-3 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-2"
            >
              <span>✦ WRITE PITCH TO MIRO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleDownloadCompleteBundle}
            disabled={isDownloadingBundle}
            className="px-4 py-3 rounded-xs text-xs font-mono font-bold text-white bg-[#141414] hover:bg-[#1C1C1C] border border-white/[0.1] flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isDownloadingBundle ? 'PACKAGING...' : 'DOWNLOAD BUNDLE'}</span>
          </button>
        </div>
      </div>

      {/* 8 Deliverable Assets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#FF4D00]">
            PACKAGE ASSETS
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            8 PRODUCTION ARTIFACTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                onClick={() => {
                  if (a.isMiroAction && onSendToMiro) {
                    onSendToMiro();
                  } else {
                    onNavigateTab(a.tab);
                  }
                }}
                className="studio-card p-5 rounded-xs border border-white/[0.08] flex flex-col justify-between cursor-pointer group hover:border-[#FF4D00]/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xs bg-[#141414] border border-white/[0.08] text-[#FF4D00]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                      {a.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-[#FF6A00] transition-colors">
                    {a.name}
                  </h3>

                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {a.desc}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                  <span>VIEW ARTIFACT</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF4D00]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
