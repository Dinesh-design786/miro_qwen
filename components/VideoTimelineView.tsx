'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Film, 
  Clock, 
  Layers, 
  Sliders, 
  Download, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipForward,
  SkipBack,
  MonitorPlay,
  Share2,
  Maximize2
} from 'lucide-react';
import { PitchDeck, Slide } from '@/types';
import { videoRenderer } from '@/services/video/videoRenderer';
import { getSlideImageUrl, getFallbackSlideImageUrl } from '@/services/media/imageGenerator';
import { formatDuration } from '@/lib/utils';

interface VideoTimelineViewProps {
  deck: PitchDeck;
  onProceedToJudge: () => void;
}

export function VideoTimelineView({ deck, onProceedToJudge }: VideoTimelineViewProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderedFilename, setRenderedFilename] = useState<string>('');
  const [renderResolution, setRenderResolution] = useState<'1080p' | '720p'>('1080p');
  const [exportMode, setExportMode] = useState<'fast' | 'full'>('fast');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const tracks = videoRenderer.generateTimeline(deck);
  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0];
  const totalDeckSeconds = deck.totalDurationSeconds || deck.slides.reduce((acc, s) => acc + (s.durationSeconds || 20), 0);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Playback timer & auto-advance
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      // Trigger voice narration for current slide
      if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentSlide.speakerScript);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }

      const slideDuration = Math.max(4, currentSlide.durationSeconds || 15);
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      const slideAdvanceTimeout = setTimeout(() => {
        if (activeSlideIndex < deck.slides.length - 1) {
          setActiveSlideIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setActiveSlideIndex(0);
          setElapsedSeconds(0);
        }
      }, slideDuration * 1000);

      return () => {
        if (timer) clearInterval(timer);
        clearTimeout(slideAdvanceTimeout);
      };
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isPlaying, activeSlideIndex, isMuted, currentSlide, deck.slides.length]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex(prev => (prev + 1) % deck.slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex(prev => (prev - 1 + deck.slides.length) % deck.slides.length);
  };

  const handleStartRender = async () => {
    setIsRendering(true);
    setRenderProgress(10);
    setRenderStatus('Compiling 10-slide synchronized video with FFmpeg...');

    try {
      // 1. Try real server-side FFmpeg pipeline first
      const res = await fetch('/api/export/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: deck }),
      });

      setRenderProgress(70);
      setRenderStatus('Processing video stream & narration audio...');

      const data = await res.json();

      if (res.ok && data.success && data.videoUrl) {
        setRenderProgress(100);
        setRenderStatus('Video Render Complete!');
        setRenderedVideoUrl(data.videoUrl);
        setRenderedFilename(data.fileName);

        // Auto trigger download
        const a = document.createElement('a');
        a.href = `${data.videoUrl}?download=1`;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // 2. Client-side fallback if server pipeline encountered an issue
      setRenderStatus('Running browser client-side canvas renderer fallback...');
      const result = await videoRenderer.renderDeckToVideo(
        deck,
        {
          resolution: renderResolution,
          secondsPerSlide: exportMode === 'fast' ? 3.0 : 8.0,
          includeAudio: true,
        },
        (prog, status) => {
          setRenderProgress(prog);
          setRenderStatus(status);
        }
      );

      setRenderedVideoUrl(result.url);
      setRenderedFilename(result.filename);
      videoRenderer.downloadBlob(result.blob, result.filename);
    } catch (err: any) {
      console.error('Video generation failed:', err);
      setRenderStatus(`Render notice: ${err.message || 'Error compiling video stream'}`);
    } finally {
      setIsRendering(false);
    }
  };

  const slideImageUrl = currentSlide.imageUrl || getSlideImageUrl(currentSlide, deck.title);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Top Editorial Control Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
            VIDEO RENDER STUDIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
            SYNCHRONIZED PITCH VIDEO
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            MULTI-TRACK COMPOSITION • 1080P HD • VOICE NARRATION & LOWER-THIRDS
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsRenderModalOpen(true)}
            className="btn-flame px-4 py-2 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-2"
          >
            <Video className="w-3.5 h-3.5" />
            <span>GENERATE & DOWNLOAD VIDEO</span>
          </button>

          <button
            onClick={onProceedToJudge}
            className="px-3.5 py-2 rounded-xs text-xs font-mono font-medium text-zinc-300 hover:text-white bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] transition-all"
          >
            <span>PROCEED TO JUDGE PREP →</span>
          </button>
        </div>
      </div>

      {/* 16:9 CINEMATIC VIDEO PLAYER CANVAS */}
      <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto rounded-xs bg-[#080808] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col justify-between group">
        {/* Top Flame Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent z-30" />

        {/* Dynamic Ken-Burns Visual Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={slideImageUrl}
            alt=""
            className={`w-full h-full object-cover opacity-35 filter brightness-75 transition-all duration-1000 ${
              isPlaying ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/40" />
        </div>

        {/* Top Video Header HUD */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-[#FF4D00] bg-black/80 px-2.5 py-1 rounded-xs border border-white/10 uppercase tracking-widest backdrop-blur-md">
              1080P HD • 16:9 • TIMECODE: {formatDuration(elapsedSeconds)}
            </span>
            {isPlaying && (
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-xs bg-red-950/80 border border-red-500/40 text-[10px] font-mono font-bold text-red-400 uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>REC / PLAYING</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-1.5 rounded-xs bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-white/10 text-xs transition-colors"
              title={isMuted ? 'Unmute narration' : 'Mute narration'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF4D00]" />}
            </button>
            <span className="text-xs font-mono font-bold text-zinc-400 bg-black/70 px-2.5 py-1 rounded-xs border border-white/10">
              SLIDE {activeSlideIndex + 1} / {deck.slides.length}
            </span>
          </div>
        </div>

        {/* Center Stage Presentation Composition */}
        <div className="relative z-10 px-6 sm:px-14 my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Visual Image Panel with Glassmorphism */}
          <div className="md:col-span-5 hidden sm:block">
            <div className="relative aspect-[16/9] w-full rounded-xs overflow-hidden border border-[#FF4D00]/40 shadow-flame-sm bg-black/50">
              <img
                src={slideImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[9px] font-mono uppercase font-bold text-[#FF6A00] tracking-wider block">
                  SYNCHRONIZED VISUAL
                </span>
                <p className="text-[10px] font-mono text-zinc-300 truncate">
                  {currentSlide.visualSuggestion}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Title & Key Bullet Points */}
          <div className="md:col-span-7 space-y-3">
            <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6A00] px-2 py-0.5 rounded-xs bg-[#FF4D00]/10 border border-[#FF4D00]/30">
              {currentSlide.objective}
            </span>

            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              &ldquo;{currentSlide.title}&rdquo;
            </h2>

            <div className="space-y-1.5 pt-1">
              {currentSlide.keyPoints.slice(0, 3).map((kp, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] mt-1.5 shrink-0 shadow-flame-sm" />
                  <span>{kp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Third Captions & Interactive Video Transport Bar */}
        <div className="relative z-10 p-4 sm:p-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
          {/* Synchronized Subtitles Box */}
          <div className="bg-[#0C0C0C]/90 border border-white/10 p-3 sm:p-4 rounded-xs text-center backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase font-mono font-bold text-[#FF4D00] tracking-widest">
                SYNCHRONIZED SPEAKER NARRATION
              </span>
              {/* Equalizer Waveform animation */}
              <div className="flex items-center space-x-0.5">
                {[12, 18, 8, 22, 14, 20, 10, 16].map((h, b) => (
                  <span
                    key={b}
                    className="w-1 bg-[#FF4D00] rounded-xs transition-all duration-150"
                    style={{
                      height: isPlaying ? `${Math.max(4, (h * (b % 2 === 0 ? 1.2 : 0.8)))}px` : '4px',
                      opacity: isPlaying ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-100 font-serif italic leading-relaxed line-clamp-2">
              &ldquo;{currentSlide.speakerScript}&rdquo;
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevSlide}
                className="p-2 rounded-xs bg-[#141414] hover:bg-[#1E1E1E] text-white border border-white/10 transition-colors"
                title="Previous Slide"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                className="px-4 py-2 rounded-xs bg-[#FF4D00] hover:bg-[#FF6A00] text-black font-mono font-black text-xs flex items-center space-x-1.5 transition-all shadow-flame-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY PRESENTATION'}</span>
              </button>

              <button
                onClick={handleNextSlide}
                className="p-2 rounded-xs bg-[#141414] hover:bg-[#1E1E1E] text-white border border-white/10 transition-colors"
                title="Next Slide"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setElapsedSeconds(0);
                  setActiveSlideIndex(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xs bg-[#141414] hover:bg-[#1E1E1E] text-zinc-400 hover:text-white border border-white/10 transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Timeline */}
            <div className="flex-1 max-w-md hidden sm:flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <span>{formatDuration(elapsedSeconds)}</span>
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const targetIdx = Math.min(deck.slides.length - 1, Math.floor(ratio * deck.slides.length));
                  setActiveSlideIndex(targetIdx);
                }}
                className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden relative cursor-pointer group"
              >
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FF4D00] transition-all"
                  style={{ width: `${((activeSlideIndex + 1) / deck.slides.length) * 100}%` }}
                />
              </div>
              <span>{formatDuration(totalDeckSeconds)}</span>
            </div>

            <button
              onClick={() => setIsRenderModalOpen(true)}
              className="px-3 py-1.5 rounded-xs text-xs font-mono font-bold text-white bg-[#141414] hover:bg-[#1E1E1E] border border-white/10 flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span className="hidden sm:inline">EXPORT VIDEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* MULTI-TRACK TIMELINE VISUALIZER */}
      <div className="rounded-xs border border-white/[0.1] bg-[#0A0A0A] p-6 space-y-4">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2 font-mono font-bold text-white uppercase tracking-wider">
            <Film className="w-4 h-4 text-[#FF4D00]" />
            <span>MULTI-TRACK VIDEO TIMELINE</span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px]">
            Total Estimated Runtime: {formatDuration(totalDeckSeconds)}
          </span>
        </div>

        {/* Timeline Tracks */}
        <div className="space-y-4 pt-1">
          {tracks.map((track) => (
            <div key={track.id} className="space-y-1.5">
              <div className="text-[11px] font-mono font-bold text-zinc-400 flex items-center justify-between">
                <span className="uppercase tracking-wider">{track.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{track.items.length} cues</span>
              </div>

              {/* Track Segment Blocks */}
              <div className="flex space-x-1.5 overflow-x-auto py-1 no-scrollbar">
                {track.items.map((item, idx) => {
                  const isCurrent = idx === activeSlideIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSlideIndex(idx % deck.slides.length);
                        setIsPlaying(false);
                      }}
                      className={`h-10 px-3.5 rounded-xs border text-[11px] font-mono font-bold whitespace-nowrap shrink-0 transition-all flex items-center space-x-2 ${
                        isCurrent
                          ? 'bg-[#1A1A1A] border-[#FF4D00] text-white shadow-flame-sm ring-1 ring-[#FF4D00]/50'
                          : 'bg-[#101010] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.2]'
                      }`}
                    >
                      <span className={isCurrent ? 'text-[#FF4D00]' : 'text-zinc-500'}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{item.title}</span>
                      <span className="text-[9px] font-mono text-zinc-500">({item.durationSeconds}s)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RENDER & DOWNLOAD MODAL */}
      {isRenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0D0D0D] border border-white/[0.15] rounded-xs p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xs bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-[#FF4D00] flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">VIDEO RENDER STUDIO</h3>
                  <p className="text-xs font-mono text-zinc-400">Generate 1080p MP4/WebM Presentation Package</p>
                </div>
              </div>
            </div>

            {/* Video Preview if already rendered */}
            {renderedVideoUrl && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Video Rendered Successfully!</span>
                </span>
                <div className="aspect-[16/9] w-full rounded-xs overflow-hidden border border-white/20 bg-black">
                  <video src={renderedVideoUrl} controls autoPlay className="w-full h-full" />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = renderedVideoUrl;
                      a.download = renderedFilename || 'PitchForge_Video.webm';
                      a.click();
                    }}
                    className="btn-flame px-3.5 py-1.5 text-xs font-mono font-extrabold flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Video File</span>
                  </button>
                </div>
              </div>
            )}

            {/* Configuration Options */}
            {!renderedVideoUrl && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase">Export Mode</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setExportMode('fast')}
                      className={`p-3 rounded-xs border text-left text-xs font-mono ${
                        exportMode === 'fast'
                          ? 'bg-[#181818] border-[#FF4D00] text-white'
                          : 'bg-[#111111] border-white/10 text-zinc-400'
                      }`}
                    >
                      <strong className="block text-white">Fast Teaser (30s)</strong>
                      <span className="text-[11px] text-zinc-500">3s per slide, rapid export</span>
                    </button>

                    <button
                      onClick={() => setExportMode('full')}
                      className={`p-3 rounded-xs border text-left text-xs font-mono ${
                        exportMode === 'full'
                          ? 'bg-[#181818] border-[#FF4D00] text-white'
                          : 'bg-[#111111] border-white/10 text-zinc-400'
                      }`}
                    >
                      <strong className="block text-white">Full Presentation</strong>
                      <span className="text-[11px] text-zinc-500">8s per slide with narration</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase">Resolution</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRenderResolution('1080p')}
                      className={`p-2.5 rounded-xs border text-center text-xs font-mono ${
                        renderResolution === '1080p'
                          ? 'bg-[#181818] border-[#FF4D00] text-white font-bold'
                          : 'bg-[#111111] border-white/10 text-zinc-400'
                      }`}
                    >
                      1080p (Full HD 1920x1080)
                    </button>

                    <button
                      onClick={() => setRenderResolution('720p')}
                      className={`p-2.5 rounded-xs border text-center text-xs font-mono ${
                        renderResolution === '720p'
                          ? 'bg-[#181818] border-[#FF4D00] text-white font-bold'
                          : 'bg-[#111111] border-white/10 text-zinc-400'
                      }`}
                    >
                      720p (HD 1280x720)
                    </button>
                  </div>
                </div>

                {/* Progress bar during rendering */}
                {isRendering && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300 font-bold">{renderStatus}</span>
                      <span className="text-[#FF4D00] font-black">{renderProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#1A1A1A] rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FF4D00] transition-all duration-200"
                        style={{ width: `${renderProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setIsRenderModalOpen(false);
                  setIsRendering(false);
                }}
                className="px-4 py-2 text-xs font-mono font-medium text-zinc-400 hover:text-white bg-[#141414] rounded-xs border border-white/10"
              >
                Close
              </button>

              {!renderedVideoUrl && (
                <button
                  onClick={handleStartRender}
                  disabled={isRendering}
                  className="btn-flame px-4 py-2 text-xs font-mono font-extrabold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRendering ? 'RENDERING...' : 'START VIDEO RENDER'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
