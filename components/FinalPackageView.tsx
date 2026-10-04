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
  Layers,
  Play,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  X
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
  // PPTX export state
  const [pptState, setPptState] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [pptFileName, setPptFileName] = useState<string>('');

  // Video export state
  const [videoState, setVideoState] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Script copy state
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);

  const handleGenerateOrDownloadPptx = async () => {
    if (!deck) return;
    setPptState('generating');
    try {
      const res = await fetch('/api/export/pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: deck }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.downloadUrl) {
        setPptUrl(data.downloadUrl);
        setPptFileName(data.fileName);
        setPptState('success');

        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Fallback
        const blob = await exportPitchDeckToPPTX(deck);
        if (blob) {
          const fn = `${deck.title.replace(/\s+/g, '_')}_Deck.pptx`;
          downloadBlob(blob, fn);
          setPptState('success');
          setPptFileName(fn);
        } else {
          setPptState('error');
        }
      }
    } catch (e) {
      console.error('PPTX export error:', e);
      setPptState('error');
    }
  };

  const handleGenerateOrDownloadVideo = async () => {
    if (!deck) return;
    setVideoState('generating');
    try {
      const res = await fetch('/api/export/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: deck }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setVideoFileName(data.fileName);
        setVideoState('success');

        // Trigger download
        const a = document.createElement('a');
        a.href = `${data.videoUrl}?download=1`;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setVideoState('error');
      }
    } catch (e) {
      console.error('Video export error:', e);
      setVideoState('error');
    }
  };

  const handleCopyScript = () => {
    if (!deck) return;
    const fullScript = deck.slides.map(s => 
      `--- SLIDE ${s.slideNumber}: ${s.title.toUpperCase()} ---\n${s.speakerScript}\n`
    ).join('\n');

    navigator.clipboard.writeText(fullScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* SECTION 19: REDESIGNED EXPORT YOUR PITCH SECTION */}
      <div className="studio-panel p-6 sm:p-10 rounded-xs border border-white/[0.1] bg-[#0A0A0A] shadow-card relative overflow-hidden">
        {/* Top Flame Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
              FINAL EXPORT STUDIO
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
              EXPORT YOUR PITCH
            </h1>
            <p className="text-sm font-mono text-zinc-400 mt-1">
              Your pitch is ready.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {onSendToMiro && (
              <button
                onClick={onSendToMiro}
                className="px-5 py-2.5 rounded-xs text-xs font-mono font-bold text-black bg-[#FFD02F] hover:bg-[#F2C425] shadow-sm flex items-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>✦ SEND PITCH TO MIRO</span>
              </button>
            )}
            <button
              onClick={handleDownloadCompleteBundle}
              disabled={isDownloadingBundle}
              className="px-4 py-2.5 rounded-xs text-xs font-mono font-bold text-white bg-[#141414] hover:bg-[#1C1C1C] border border-white/[0.1] flex items-center space-x-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isDownloadingBundle ? 'PACKAGING...' : 'DOWNLOAD FULL BUNDLE'}</span>
            </button>
          </div>
        </div>

        {/* 3 Major Deliverables: Deck, Video, Script */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* 1. Pitch Deck Card */}
          <div className="studio-card p-6 rounded-xs border border-white/[0.08] bg-[#111111] flex flex-col justify-between relative group hover:border-[#FF4D00]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>✓ Pitch Deck</span>
              </div>
              <h3 className="text-lg font-bold text-white font-sans">
                PowerPoint presentation
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                10 widescreen 16:9 slides formatted in PitchForge dark editorial aesthetic with speaker notes and visual hierarchy.
              </p>
            </div>

            <div className="pt-6">
              {pptState === 'idle' && (
                <button
                  onClick={handleGenerateOrDownloadPptx}
                  className="btn-flame w-full py-2.5 rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PPTX</span>
                </button>
              )}

              {pptState === 'generating' && (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xs text-xs font-mono font-bold text-white bg-zinc-800 border border-[#FF4D00]/40 flex items-center justify-center space-x-2 cursor-wait animate-pulse"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF4D00]" />
                  <span>Generating Pitch Deck...</span>
                </button>
              )}

              {pptState === 'success' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center space-x-1 justify-center">
                    <Check className="w-3.5 h-3.5" />
                    <span>✓ Pitch Deck Generated</span>
                  </div>
                  <a
                    href={pptUrl || '#'}
                    download={pptFileName || `${deck?.title || 'PitchForge'}_Pitch.pptx`}
                    onClick={() => {
                      if (!pptUrl) handleGenerateOrDownloadPptx();
                    }}
                    className="btn-flame w-full py-2 rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PPTX</span>
                  </a>
                </div>
              )}

              {pptState === 'error' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-red-400 font-bold flex items-center space-x-1 justify-center">
                    <span>⚠ Failed to generate pitch deck</span>
                  </div>
                  <button
                    onClick={handleGenerateOrDownloadPptx}
                    className="w-full py-2 rounded-xs text-xs font-mono font-bold text-white bg-red-950/80 hover:bg-red-900 border border-red-500/40 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Pitch Video Card */}
          <div className="studio-card p-6 rounded-xs border border-white/[0.08] bg-[#111111] flex flex-col justify-between relative group hover:border-[#FF4D00]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>✓ Pitch Video</span>
              </div>
              <h3 className="text-lg font-bold text-white font-sans">
                Narrated presentation
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Full 1080p MP4 with synchronized slide scenes, voiceover narration, subtitle bars, and PitchForge branding.
              </p>
            </div>

            <div className="pt-6">
              {videoState === 'idle' && (
                <button
                  onClick={handleGenerateOrDownloadVideo}
                  className="btn-flame w-full py-2.5 rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Generate & Download MP4</span>
                </button>
              )}

              {videoState === 'generating' && (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xs text-xs font-mono font-bold text-white bg-zinc-800 border border-[#FF4D00]/40 flex items-center justify-center space-x-2 cursor-wait animate-pulse"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF4D00]" />
                  <span>Rendering 10-Slide Video...</span>
                </button>
              )}

              {videoState === 'success' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center space-x-1 justify-center">
                    <Check className="w-3.5 h-3.5" />
                    <span>✓ Pitch Video Generated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="flex-1 py-2 rounded-xs text-xs font-mono font-bold text-white bg-[#1A1A1A] hover:bg-[#252525] border border-white/[0.1] flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-[#FF6A00]" />
                      <span>▶ Preview Video</span>
                    </button>
                    <a
                      href={`${videoUrl}?download=1`}
                      download={videoFileName || `${deck?.title || 'PitchForge'}_Pitch.mp4`}
                      className="btn-flame flex-1 py-2 rounded-xs text-xs font-mono font-bold flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </a>
                  </div>
                </div>
              )}

              {videoState === 'error' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-red-400 font-bold flex items-center space-x-1 justify-center">
                    <span>⚠ Video generation failed</span>
                  </div>
                  <button
                    onClick={handleGenerateOrDownloadVideo}
                    className="w-full py-2 rounded-xs text-xs font-mono font-bold text-white bg-red-950/80 hover:bg-red-900 border border-red-500/40 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Speaker Script Card */}
          <div className="studio-card p-6 rounded-xs border border-white/[0.08] bg-[#111111] flex flex-col justify-between relative group hover:border-[#FF4D00]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>✓ Speaker Script</span>
              </div>
              <h3 className="text-lg font-bold text-white font-sans">
                Presentation narration
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Complete slide-by-slide spoken narrative with pause codes, tone directions, and rehearsal timecodes.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={handleCopyScript}
                className="w-full py-2.5 rounded-xs text-xs font-mono font-bold text-white bg-[#1A1A1A] hover:bg-[#222222] border border-white/[0.1] hover:border-[#FF4D00]/50 flex items-center justify-center space-x-2 transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">✓ Script Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FF6A00]" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HTML5 VIDEO PREVIEW MODAL */}
      {isVideoModalOpen && videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0E0E0E] border border-white/[0.15] rounded-xs max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#141414]">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-[#FF4D00]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  PITCH VIDEO PREVIEW  •  1080P MP4
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full max-h-[540px] rounded-xs border border-white/[0.08] shadow-lg"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="p-4 bg-[#141414] border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                {videoFileName || 'pitchforge-pitch.mp4'}
              </span>
              <a
                href={`${videoUrl}?download=1`}
                download={videoFileName || 'pitchforge-pitch.mp4'}
                className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-bold flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </a>
            </div>
          </div>
        </div>
      )}

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
