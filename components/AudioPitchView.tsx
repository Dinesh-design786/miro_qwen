'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Download, 
  Sparkles, 
  Clock, 
  FastForward,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PitchDeck } from '@/types';
import { ttsService } from '@/services/tts/ttsService';
import { formatDuration } from '@/lib/utils';

interface AudioPitchViewProps {
  deck: PitchDeck;
  onProceedToVideo: () => void;
}

export function AudioPitchView({ deck, onProceedToVideo }: AudioPitchViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [progressPercent, setProgressPercent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = deck.totalDurationSeconds;
  const currentSlide = deck.slides[currentSlideIndex] || deck.slides[0];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      ttsService.pause();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      playSlideAudio(currentSlideIndex);
    }
  };

  const playSlideAudio = (index: number) => {
    if (index >= deck.slides.length) {
      setIsPlaying(false);
      setProgressPercent(100);
      return;
    }

    setCurrentSlideIndex(index);
    const slide = deck.slides[index];

    ttsService.speak(slide.speakerScript, {
      rate: playbackSpeed,
      onEnd: () => {
        if (index + 1 < deck.slides.length) {
          playSlideAudio(index + 1);
        } else {
          setIsPlaying(false);
          setProgressPercent(100);
        }
      },
    });
  };

  const handleRestart = () => {
    ttsService.stop();
    setCurrentSlideIndex(0);
    setProgressPercent(0);
    setIsPlaying(false);
  };

  const handleDownloadScriptAudio = () => {
    // Generate text blob for narration export
    const fullScript = deck.slides
      .map(s => `[SLIDE ${s.slideNumber}: ${s.title}]\n${s.speakerScript}\n`)
      .join('\n');
    const blob = new Blob([fullScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, '_')}_Audio_Script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            TTS AUDIO STUDIO
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            Synchronized Audio Pitch Narration
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Listen to an AI narrator deliver your pitch deck in real time, with automatic slide synchronization and rhythm control.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onProceedToVideo}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <span>Proceed to Pitch Video</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Audio Player Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        {/* Waveform / Visual Equalizer Bar Animation */}
        <div className="flex items-center justify-center space-x-1.5 h-16 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          {Array.from({ length: 48 }).map((_, i) => {
            const height = isPlaying 
              ? `${Math.max(15, Math.sin((i + currentSlideIndex * 4) * 0.4) * 45 + 50)}%` 
              : '20%';
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying ? 'bg-gradient-to-t from-indigo-500 to-amber-400' : 'bg-slate-700'
                }`}
                style={{ height }}
              />
            );
          })}
        </div>

        {/* Current Active Slide Track Info */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Now Narrating • Slide {currentSlide.slideNumber} of {deck.slides.length}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {currentSlide.title}
          </h3>
          <p className="text-xs text-slate-400 italic max-w-lg mx-auto truncate">
            &ldquo;{currentSlide.speakerScript}&rdquo;
          </p>
        </div>

        {/* Controls Console */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRestart}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Restart from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <div className="text-xs font-mono text-slate-400">
              <span className="text-white font-bold">Slide {currentSlideIndex + 1}</span> / {deck.slides.length}
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Speed:</span>
            {[0.9, 1.0, 1.2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadScriptAudio}
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Narration Script</span>
          </button>
        </div>
      </div>

      {/* Slide Navigation List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Slide Narration Index
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deck.slides.map((s, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <div
                key={s.slideNumber}
                onClick={() => playSlideAudio(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    #{s.slideNumber}
                  </span>
                  <div className="truncate max-w-[220px]">
                    <span className="text-xs font-semibold block text-slate-200 truncate">
                      {s.title}
                    </span>
                    <span className="text-[11px] text-slate-400 italic block truncate">
                      {s.speakerScript}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                  <span>{s.durationSeconds}s</span>
                  {isCurrent && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
