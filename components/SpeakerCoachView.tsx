'use client';

import React, { useState } from 'react';
import { 
  Mic2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Clock, 
  Gauge, 
  Sparkles, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { PitchDeck, Slide } from '@/types';
import { ttsService } from '@/services/tts/ttsService';
import { formatDuration, calculateWPM } from '@/lib/utils';

interface SpeakerCoachViewProps {
  deck: PitchDeck;
  onProceedToJudge: () => void;
}

export function SpeakerCoachView({
  deck,
  onProceedToJudge,
}: SpeakerCoachViewProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  const totalWords = deck.slides.reduce((acc, s) => acc + s.speakerScript.split(/\s+/).length, 0);
  const averageWpm = calculateWPM(totalWords, deck.totalDurationSeconds);

  // Compute slide time bounds
  let accumulatedTime = 0;
  const slideIntervals = deck.slides.map(s => {
    const start = accumulatedTime;
    accumulatedTime += s.durationSeconds;
    return {
      start,
      end: accumulatedTime,
      label: `${formatDuration(start)} – ${formatDuration(accumulatedTime)}`,
    };
  });

  const handlePlaySlideAudio = (index: number) => {
    const slide = deck.slides[index];
    if (!slide) return;

    setActiveSlideIndex(index);
    setIsPlayingAudio(true);

    ttsService.speak(slide.speakerScript, {
      rate: speechRate,
      onEnd: () => {
        setIsPlayingAudio(false);
      },
    });
  };

  const handleStopAudio = () => {
    ttsService.stop();
    setIsPlayingAudio(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Metric Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            SPEAKER COACH & TELEPROMPTER
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            Master your stage delivery & cadence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Qwen timed each slide for natural human pacing, critical dramatic pauses, and smooth transitions.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onProceedToJudge}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <span>Practice AI Judge Q&A</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speed & Duration Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Duration</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-white font-mono">
              {formatDuration(deck.totalDurationSeconds)}
            </span>
            <span className="text-xs text-slate-400">mins</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Speaking Pace</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ~{averageWpm}
            </span>
            <span className="text-xs text-slate-400">words/min</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Script Size</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-white font-mono">
              {totalWords}
            </span>
            <span className="text-xs text-slate-400">words</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Coach Rehearsal</span>
          <div className="flex items-center space-x-2 mt-1">
            {isPlayingAudio ? (
              <button
                onClick={handleStopAudio}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center space-x-1"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlaySlideAudio(activeSlideIndex)}
                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Hear Voice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Script Dividers Slide by Slide */}
      <div className="space-y-4">
        {deck.slides.map((slide, idx) => {
          const interval = slideIntervals[idx];
          const isSelected = activeSlideIndex === idx;
          const delivery = slide.deliveryNotes;

          return (
            <div
              key={slide.slideNumber}
              onClick={() => setActiveSlideIndex(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 shadow-xl shadow-indigo-950/20'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    SLIDE {slide.slideNumber}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {slide.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {interval.label}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlayingAudio && activeSlideIndex === idx) {
                        handleStopAudio();
                      } else {
                        handlePlaySlideAudio(idx);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Listen to slide script"
                  >
                    {isPlayingAudio && activeSlideIndex === idx ? (
                      <Pause className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Script Text Body */}
              <div className="my-4">
                <p className="text-sm sm:text-base text-slate-100 font-serif leading-relaxed italic">
                  &ldquo;{slide.speakerScript}&rdquo;
                </p>
              </div>

              {/* Delivery Coach Notes */}
              {delivery && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Mood</span>
                    <p className="font-semibold text-indigo-300 mt-0.5">
                      {delivery.tone} ({delivery.energy} Energy)
                    </p>
                  </div>

                  {delivery.pauseAfter && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400">Suggested Pause</span>
                      <p className="text-slate-300 mt-0.5 italic">
                        After: &ldquo;{delivery.pauseAfter}&rdquo;
                      </p>
                    </div>
                  )}

                  {delivery.transition && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Transition Cue</span>
                      <p className="text-slate-300 mt-0.5 italic truncate" title={delivery.transition}>
                        &ldquo;{delivery.transition}&rdquo;
                      </p>
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
