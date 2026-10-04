'use client';

import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Layers,
  Check,
  Mic2
} from 'lucide-react';
import { PitchDeck, Slide } from '@/types';
import { exportPitchDeckToPPTX, downloadBlob } from '@/services/export/pptxExport';

interface PresentationViewerProps {
  deck: PitchDeck;
  onUpdateSlide: (updatedSlide: Slide) => void;
  onRegenerateEntirePitch: () => void;
  onNavigateToScript: () => void;
  onSendToMiro?: () => void;
}

export function PresentationViewer({
  deck,
  onUpdateSlide,
  onRegenerateEntirePitch,
  onNavigateToScript,
  onSendToMiro,
}: PresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedKeyPoints, setEditedKeyPoints] = useState('');

  const currentSlide = deck.slides[currentSlideIndex] || deck.slides[0];

  // Map 10 canonical editorial titles
  const canonicalSlideNames = [
    '01 PROBLEM',
    '02 INSIGHT',
    '03 SOLUTION',
    '04 PRODUCT',
    '05 MARKET',
    '06 BUSINESS MODEL',
    '07 COMPETITION',
    '08 TECHNOLOGY',
    '09 TRACTION',
    '10 ASK',
  ];

  const handlePrev = () => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
    setIsEditing(false);
  };

  const handleNext = () => {
    setCurrentSlideIndex(prev => Math.min(deck.slides.length - 1, prev + 1));
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditedTitle(currentSlide.title);
    setEditedKeyPoints(currentSlide.keyPoints.join('\n'));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updated: Slide = {
      ...currentSlide,
      title: editedTitle.trim() || currentSlide.title,
      keyPoints: editedKeyPoints.split('\n').filter(p => p.trim().length > 0),
    };
    onUpdateSlide(updated);
    setIsEditing(false);
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPitchDeckToPPTX(deck);
      if (blob) {
        const cleanName = deck.title.replace(/[^a-zA-Z0-9_-]/g, '_');
        downloadBlob(blob, `${cleanName}_PitchForge.pptx`);
      }
    } catch (e) {
      console.error('PPTX export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const slideNumberFormatted = String(currentSlideIndex + 1).padStart(2, '0');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Top Editorial Control Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
            PRESENTATION STUDIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            YOUR PITCH
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {deck.title} • 10-SLIDE EDITORIAL DECK • AUDITED FOR DEFENSE
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-2">
          {onSendToMiro && (
            <button
              onClick={onSendToMiro}
              className="px-4 py-2 rounded-xs text-xs font-mono font-bold text-black bg-[#FFD02F] hover:bg-[#F2C425] shadow-sm flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
            >
              <span>✦ SEND TO MIRO</span>
            </button>
          )}

          <button
            onClick={onNavigateToScript}
            className="px-3.5 py-2 rounded-xs text-xs font-mono font-medium text-zinc-300 hover:text-white bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] flex items-center space-x-1.5 transition-all"
          >
            <Mic2 className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>SPEAKER SCRIPT</span>
          </button>

          <button
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'EXPORTING...' : 'EXPORT PPTX'}</span>
          </button>
        </div>
      </div>

      {/* CINEMATIC PRESENTATION STAGE */}
      <div className="relative rounded-xs border border-white/[0.1] bg-[#0A0A0A] shadow-card overflow-hidden">
        {/* Top Flame Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        <div className="p-6 sm:p-12 min-h-[480px] flex flex-col justify-between relative bg-grid-editorial">
          {/* Slide Top Meta */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-4xl sm:text-6xl font-black font-sans text-white/20 select-none tracking-tight block">
                {slideNumberFormatted}
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF4D00] uppercase block">
                {canonicalSlideNames[currentSlideIndex] || `SLIDE ${slideNumberFormatted}`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-zinc-500 bg-[#121212] px-2.5 py-1 rounded-xs border border-white/[0.06] flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>~{currentSlide.durationSeconds || 30}s</span>
              </span>

              <button
                onClick={isEditing ? handleSaveEdit : handleStartEdit}
                className="text-xs font-mono text-zinc-400 hover:text-white bg-[#141414] hover:bg-[#1A1A1A] border border-white/[0.08] px-2.5 py-1 rounded-xs flex items-center space-x-1 transition-colors"
              >
                {isEditing ? <Check className="w-3 h-3 text-emerald-400" /> : <Edit3 className="w-3 h-3" />}
                <span>{isEditing ? 'DONE' : 'EDIT'}</span>
              </button>
            </div>
          </div>

          {/* Slide Center Hero Editorial Typography */}
          <div className="my-8 max-w-3xl">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-[#FF4D00]/50 rounded-xs px-4 py-2.5 text-lg font-bold text-white focus:outline-none"
                />
                <textarea
                  value={editedKeyPoints}
                  onChange={(e) => setEditedKeyPoints(e.target.value)}
                  rows={4}
                  className="w-full bg-[#121212] border border-white/[0.1] rounded-xs p-3 text-xs text-zinc-200 font-mono focus:outline-none"
                  placeholder="Bullet points (one per line)"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  &ldquo;{currentSlide.title}&rdquo;
                </h2>

                <div className="space-y-3">
                  {currentSlide.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] mt-2 shrink-0 shadow-flame-sm" />
                      <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide Bottom Bar with Speaker Notes Snippet & Navigation */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-500 block mb-1">
                SPEAKER SCRIPT SNIPPET:
              </span>
              <p className="text-xs text-zinc-400 italic line-clamp-2">
                &ldquo;{currentSlide.speakerScript}&rdquo;
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-xs bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-white px-2">
                {currentSlideIndex + 1} / {deck.slides.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === deck.slides.length - 1}
                className="p-2 rounded-xs bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10-SLIDE EDITORIAL THUMBNAIL DECK SELECTOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold tracking-widest text-zinc-400">
            ALL 10 PITCH CARDS
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            CLICK CARD TO JUMP
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {deck.slides.map((s, idx) => {
            const isSelected = idx === currentSlideIndex;
            const num = String(idx + 1).padStart(2, '0');
            const canonicalLabel = canonicalSlideNames[idx] || `SLIDE ${num}`;

            return (
              <button
                key={s.slideNumber || idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setIsEditing(false);
                }}
                className={`p-3.5 rounded-xs text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 border ${
                  isSelected 
                    ? 'bg-[#141414] border-[#FF4D00] shadow-flame-sm' 
                    : 'bg-[#101010] border-white/[0.06] hover:border-white/[0.15] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-mono font-black ${isSelected ? 'text-[#FF4D00]' : 'text-zinc-500'}`}>
                    {num}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-ping" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-400 block truncate">
                    {canonicalLabel.replace(/^\d+\s*/, '')}
                  </span>
                  <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                    {s.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
