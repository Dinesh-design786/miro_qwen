import { PitchDeck, Slide } from '@/types';
import { getSlideImageUrl, getFallbackSlideImageUrl } from '@/services/media/imageGenerator';

export interface VideoTimelineTrack {
  id: string;
  name: string;
  type: 'slides' | 'audio' | 'captions' | 'transitions';
  items: VideoTimelineItem[];
}

export interface VideoTimelineItem {
  id: string;
  title: string;
  startSecond: number;
  durationSeconds: number;
  content: string;
  visualNote?: string;
  imageUrl?: string;
}

export interface VideoRenderOptions {
  resolution?: '1080p' | '720p';
  secondsPerSlide?: number; // fast preview mode (e.g. 3-4s per slide) or full duration
  includeAudio?: boolean;
}

export class VideoRenderer {
  public generateTimeline(deck: PitchDeck): VideoTimelineTrack[] {
    let currentStart = 0;
    const slideItems: VideoTimelineItem[] = [];
    const audioItems: VideoTimelineItem[] = [];
    const captionItems: VideoTimelineItem[] = [];
    const transitionItems: VideoTimelineItem[] = [];

    deck.slides.forEach((slide, idx) => {
      const start = currentStart;
      const duration = slide.durationSeconds || 20;
      const img = slide.imageUrl || getSlideImageUrl(slide, deck.title);

      slideItems.push({
        id: `slide-track-${slide.slideNumber}`,
        title: `Slide ${slide.slideNumber}: ${slide.title}`,
        startSecond: start,
        durationSeconds: duration,
        content: slide.title,
        visualNote: slide.visualSuggestion,
        imageUrl: img,
      });

      audioItems.push({
        id: `audio-track-${slide.slideNumber}`,
        title: `Narration #${slide.slideNumber}`,
        startSecond: start,
        durationSeconds: duration,
        content: slide.speakerScript,
      });

      captionItems.push({
        id: `caption-track-${slide.slideNumber}`,
        title: `Captions #${slide.slideNumber}`,
        startSecond: start,
        durationSeconds: duration,
        content: (slide.speakerScript || '').slice(0, 80) + '...',
      });

      if (idx < deck.slides.length - 1) {
        transitionItems.push({
          id: `trans-${idx}`,
          title: 'Crossfade',
          startSecond: start + duration - 0.5,
          durationSeconds: 1.0,
          content: 'Smooth 0.5s Dissolve',
        });
      }

      currentStart += duration;
    });

    return [
      { id: 'track-slides', name: 'Slide Frames (1080p)', type: 'slides', items: slideItems },
      { id: 'track-audio', name: 'Voice Narration (Qwen TTS)', type: 'audio', items: audioItems },
      { id: 'track-captions', name: 'Synchronized Captions', type: 'captions', items: captionItems },
      { id: 'track-transitions', name: 'Visual Transitions', type: 'transitions', items: transitionItems },
    ];
  }

  /**
   * Preloads an image into an HTMLImageElement with CORS enabled and fallback.
   */
  public async preloadImage(url: string, fallbackUrl?: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (fallbackUrl && fallbackUrl !== url) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
          fallbackImg.src = fallbackUrl;
        } else {
          resolve(null);
        }
      };
      img.src = url;
    });
  }

  /**
   * Client-side canvas video recorder rendering all deck slides with animations,
   * visual images, typography, subtitles, waveforms, and downloading MP4/WebM.
   */
  public async renderDeckToVideo(
    deck: PitchDeck,
    options: VideoRenderOptions = {},
    onProgress?: (progress: number, status: string) => void
  ): Promise<{ blob: Blob; url: string; filename: string }> {
    if (typeof window === 'undefined') {
      throw new Error('Video rendering is only supported in browser environments.');
    }

    const width = options.resolution === '720p' ? 1280 : 1920;
    const height = options.resolution === '720p' ? 720 : 1080;
    const secondsPerSlide = options.secondsPerSlide || 3.5;
    const fps = 30;
    const framesPerSlide = Math.round(secondsPerSlide * fps);

    // Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not initialize 2D canvas context.');
    }

    onProgress?.(5, 'Pre-loading slide visuals and typography...');

    // Preload all slide images
    const loadedImages: (HTMLImageElement | null)[] = [];
    for (let i = 0; i < deck.slides.length; i++) {
      const s = deck.slides[i];
      const imgUrl = s.imageUrl || getSlideImageUrl(s, deck.title);
      const fallback = getFallbackSlideImageUrl(s.slideNumber);
      const img = await this.preloadImage(imgUrl, fallback);
      loadedImages.push(img);
    }

    // Set up Audio Context and synthetic synthesizer track
    let audioContext: AudioContext | null = null;
    let audioStream: MediaStream | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        gain.gain.value = 0.001; // subtle audible carrier for mediarecorder compliance
        osc.connect(gain);
        const dest = audioContext.createMediaStreamDestination();
        gain.connect(dest);
        osc.start();
        audioStream = dest.stream;
      }
    } catch (e) {
      console.warn('AudioContext not available for video track:', e);
    }

    // Initialize MediaStream from Canvas
    const canvasStream = canvas.captureStream(fps);
    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
    }

    // Determine supported mimeType
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }
    }

    const recordedChunks: Blob[] = [];
    const recorder = mimeType ? new MediaRecorder(canvasStream, { mimeType }) : new MediaRecorder(canvasStream);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.start(100);

    const totalSlides = deck.slides.length;
    const totalFrames = totalSlides * framesPerSlide;
    let globalFrame = 0;

    // Helper to wrap text cleanly onto canvas
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 4) => {
      const words = text.split(' ');
      let line = '';
      let lineCount = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
          lineCount++;
          if (lineCount >= maxLines - 1) {
            context.fillText(line + '...', x, y);
            return;
          }
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    };

    // Render loop slide by slide
    for (let slideIdx = 0; slideIdx < totalSlides; slideIdx++) {
      const slide = deck.slides[slideIdx];
      const slideImg = loadedImages[slideIdx];
      const slideTitle = slide.title;
      const slideNumberStr = String(slideIdx + 1).padStart(2, '0');

      for (let f = 0; f < framesPerSlide; f++) {
        globalFrame++;
        const framePercent = Math.round((globalFrame / totalFrames) * 90) + 5;
        const progressInSlide = f / framesPerSlide;

        if (f % 5 === 0) {
          onProgress?.(framePercent, `Rendering Slide ${slideIdx + 1} of ${totalSlides}: "${slideTitle.slice(0, 25)}..."`);
        }

        // 1. Background: Dark Charcoal & Radial Glow
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, width, height);

        // Subtle gradient lighting
        const radGrad = ctx.createRadialGradient(width * 0.3, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
        radGrad.addColorStop(0, 'rgba(255, 77, 0, 0.12)');
        radGrad.addColorStop(0.5, 'rgba(20, 20, 20, 0.6)');
        radGrad.addColorStop(1, '#060606');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);

        // Top Accent Line
        const accentGrad = ctx.createLinearGradient(0, 0, width, 0);
        accentGrad.addColorStop(0, '#FF6A00');
        accentGrad.addColorStop(0.5, '#FF4D00');
        accentGrad.addColorStop(1, '#B91C1C');
        ctx.fillStyle = accentGrad;
        ctx.fillRect(0, 0, width, 4);

        // 2. Top Header Bar
        ctx.fillStyle = '#FF4D00';
        ctx.font = `bold ${Math.round(height * 0.02)}px "Courier New", monospace`;
        ctx.fillText(`PITCHFORGE • AI PITCH STUDIO`, width * 0.05, height * 0.07);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = `${Math.round(height * 0.018)}px "Courier New", monospace`;
        ctx.fillText(`SLIDE ${slideNumberStr} / ${String(totalSlides).padStart(2, '0')}`, width * 0.85, height * 0.07);

        // 3. Left Side: Visual Image Panel (with Ken Burns subtle zoom)
        const imgX = width * 0.05;
        const imgY = height * 0.13;
        const imgW = width * 0.46;
        const imgH = height * 0.65;

        // Image container card
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 16);
        ctx.clip();

        if (slideImg) {
          // Slow zoom effect
          const scale = 1.0 + progressInSlide * 0.08;
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const drawX = imgX - (drawW - imgW) / 2;
          const drawY = imgY - (drawH - imgH) / 2;
          ctx.drawImage(slideImg, drawX, drawY, drawW, drawH);

          // Subtle gradient overlay on image bottom
          const imgOverlay = ctx.createLinearGradient(0, imgY + imgH * 0.5, 0, imgY + imgH);
          imgOverlay.addColorStop(0, 'transparent');
          imgOverlay.addColorStop(1, 'rgba(0,0,0,0.8)');
          ctx.fillStyle = imgOverlay;
          ctx.fillRect(imgX, imgY, imgW, imgH);
        } else {
          // Generative abstract placeholder card if image fails
          ctx.fillStyle = '#141414';
          ctx.fillRect(imgX, imgY, imgW, imgH);

          ctx.fillStyle = '#FF4D00';
          ctx.font = `bold ${Math.round(height * 0.025)}px sans-serif`;
          ctx.fillText(`✦ AI VISUAL CONCEPT`, imgX + 30, imgY + imgH * 0.45);

          ctx.fillStyle = '#94A3B8';
          ctx.font = `${Math.round(height * 0.018)}px sans-serif`;
          wrapText(ctx, slide.visualSuggestion || slide.objective, imgX + 30, imgY + imgH * 0.55, imgW - 60, 26, 3);
        }
        ctx.restore();

        // Border around image card
        ctx.strokeStyle = 'rgba(255, 77, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 16);
        ctx.stroke();

        // 4. Right Side: Slide Editorial Typography & Key Points
        const textX = width * 0.55;
        let textY = height * 0.18;

        // Objective Badge
        ctx.fillStyle = 'rgba(255, 77, 0, 0.15)';
        const badgeW = Math.min(width * 0.38, ctx.measureText(slide.objective.toUpperCase()).width + 30);
        ctx.beginPath();
        ctx.roundRect(textX, textY - 24, badgeW, 32, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 77, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#FF6A00';
        ctx.font = `bold ${Math.round(height * 0.016)}px "Courier New", monospace`;
        ctx.fillText(slide.objective.toUpperCase(), textX + 15, textY - 3);

        textY += height * 0.08;

        // Slide Main Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `900 ${Math.round(height * 0.045)}px sans-serif`;
        wrapText(ctx, `"${slide.title}"`, textX, textY, width * 0.4, Math.round(height * 0.055), 2);

        textY += height * 0.14;

        // Bullet Points
        const points = slide.keyPoints.slice(0, 3);
        points.forEach((pt, pIdx) => {
          // Orange bullet dot
          ctx.fillStyle = '#FF4D00';
          ctx.beginPath();
          ctx.arc(textX + 8, textY + pIdx * (height * 0.07) - 6, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#D4D4D8';
          ctx.font = `${Math.round(height * 0.022)}px sans-serif`;
          wrapText(ctx, pt, textX + 28, textY + pIdx * (height * 0.07), width * 0.38, Math.round(height * 0.028), 2);
        });

        // 5. Lower Third: Synchronized Speaker Subtitle Bar
        const subX = width * 0.05;
        const subY = height * 0.81;
        const subW = width * 0.9;
        const subH = height * 0.13;

        ctx.fillStyle = 'rgba(12, 12, 12, 0.9)';
        ctx.beginPath();
        ctx.roundRect(subX, subY, subW, subH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Caption label
        ctx.fillStyle = '#FF6A00';
        ctx.font = `bold ${Math.round(height * 0.014)}px "Courier New", monospace`;
        ctx.fillText(`SPEAKER NARRATION:`, subX + 24, subY + 28);

        // Subtitle text
        ctx.fillStyle = '#F4F4F5';
        ctx.font = `italic ${Math.round(height * 0.02)}px sans-serif`;
        wrapText(ctx, `“${slide.speakerScript}”`, subX + 24, subY + 58, subW - 140, Math.round(height * 0.028), 2);

        // Animated audio waveform equalizer bars in bottom right of subtitle bar
        const waveX = subX + subW - 100;
        const waveY = subY + 60;
        ctx.fillStyle = '#FF4D00';
        for (let b = 0; b < 6; b++) {
          const barHeight = 8 + Math.sin(globalFrame * 0.3 + b * 1.2) * 16 + (b % 2) * 6;
          ctx.fillRect(waveX + b * 12, waveY - barHeight, 6, barHeight);
        }

        // 6. Timeline Progress Bar at very bottom
        const progressX = (globalFrame / totalFrames) * width;
        ctx.fillStyle = '#FF4D00';
        ctx.fillRect(0, height - 6, progressX, 6);

        // Yield to browser event loop
        if (f % 15 === 0) {
          await new Promise(r => setTimeout(r, 0));
        }
      }
    }

    onProgress?.(98, 'Packaging high-definition video container...');

    // Stop recording and compile final Blob
    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        try {
          if (audioContext) {
            audioContext.close();
          }
          const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
          const url = URL.createObjectURL(blob);
          const cleanName = (deck.title || 'PitchForge').replace(/[^a-zA-Z0-9_-]/g, '_');
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const filename = `${cleanName}_Pitch_Video.${ext}`;

          onProgress?.(100, 'Video generated successfully!');
          resolve({ blob, url, filename });
        } catch (err) {
          reject(err);
        }
      };

      recorder.stop();
    });
  }

  /**
   * Helper to trigger instant download in browser
   */
  public downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

export const videoRenderer = new VideoRenderer();
