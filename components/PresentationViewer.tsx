'use client';

import React, { useState } from 'react';
import { 
  Presentation, 
  Download, 
  RotateCcw, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Maximize2, 
  Mic2,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { PitchDeck, Slide } from '@/types';
import { exportPitchDeckToPPTX, downloadBlob } from '@/services/export/pptxExport';

interface PresentationViewerProps {
  deck: PitchDeck;
  onUpdateSlide: (updatedSlide: Slide) => void;
  onRegenerateEntirePitch: () => void;
  onNavigateToScript: () => void;
}

export function PresentationViewer({
  deck,
  onUpdateSlide,
  onRegenerateEntirePitch,
  onNavigateToScript,
}: PresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedKeyPoints, setEditedKeyPoints] = useState('');

  const currentSlide = deck.slides[currentSlideIndex] || deck.slides[0];

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

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              16:9 SLIDE GENERATOR
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-medium">
              Slide {currentSlideIndex + 1} of {deck.slides.length}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            {deck.title}
          </h2>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-2">
          <button
            onClick={onNavigateToScript}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Mic2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Speaker Coach</span>
          </button>

          <button
            onClick={onRegenerateEntirePitch}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Pitch</span>
          </button>

          <button
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PPTX...' : 'Export PPTX'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage & Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Thumbnails Sidebar */}
        <div className="lg:col-span-1 glass-panel p-4 rounded-2xl max-h-[580px] overflow-y-auto space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Slides</span>
            <span>{deck.slides.length} Total</span>
          </div>

          <div className="space-y-2 pt-1">
            {deck.slides.map((s, idx) => {
              const isSelected = idx === currentSlideIndex;
              return (
                <button
                  key={s.slideNumber}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md text-white'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-400">
                      #{s.slideNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {s.durationSeconds}s
                    </span>
                  </div>
                  <span className="font-semibold truncate block">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 16:9 Presentation Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-[#0D121F] via-[#10172A] to-[#0A0E18] border border-slate-700/80 p-8 sm:p-12 shadow-2xl flex flex-col justify-between overflow-hidden group">
            {/* Slide Header & Objective */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  SLIDE {currentSlide.slideNumber} • {currentSlide.objective}
                </span>

                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>~{currentSlide.durationSeconds}s speaking time</span>
                </div>
              </div>

              {/* Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-black text-white bg-slate-800/90 border border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentSlide.title}
                </h3>
              )}
            </div>

            {/* Split Content: Key Points & Visual Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
              {/* Left: Key Points */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Key Takeaways
                </span>

                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editedKeyPoints}
                    onChange={(e) => setEditedKeyPoints(e.target.value)}
                    className="w-full text-xs text-slate-200 bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <ul className="space-y-2.5">
                    {currentSlide.keyPoints.map((kp, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                        <span className="leading-relaxed">{kp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right: Visual Recommendation Container */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Visual Recommendation</span>
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{currentSlide.visualSuggestion}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>PitchForge Layout Engine</span>
                  <span className="font-mono">16:9 Standard</span>
                </div>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center space-x-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Edits</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Slide</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentSlideIndex === 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {currentSlideIndex + 1} / {deck.slides.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentSlideIndex === deck.slides.length - 1}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Script Collapsible Callout under slide */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Mic2 className="w-3.5 h-3.5" />
                <span>Slide Speaker Script</span>
              </span>
              {currentSlide.deliveryNotes && (
                <span className="text-[11px] text-slate-400">
                  Delivery: <strong className="text-white">{currentSlide.deliveryNotes.tone}</strong> (Energy: {currentSlide.deliveryNotes.energy})
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
              &ldquo;{currentSlide.speakerScript}&rdquo;
            </p>

            {currentSlide.deliveryNotes?.pauseAfter && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-amber-300/90 font-mono">
                <span>⏱ Coach tip:</span>
                <span>Pause after &ldquo;{currentSlide.deliveryNotes.pauseAfter}&rdquo;</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
