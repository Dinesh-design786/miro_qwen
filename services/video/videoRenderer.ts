import { PitchDeck, Slide } from '@/types';

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
}

export interface VideoRenderConfig {
  resolution: '1080p' | '720p' | '4k';
  aspectRatio: '16:9';
  fps: 30 | 60;
  includeCaptions: boolean;
  slideTransition: 'crossfade' | 'slide-left' | 'none';
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
      const duration = slide.durationSeconds;

      slideItems.push({
        id: `slide-track-${slide.slideNumber}`,
        title: `Slide ${slide.slideNumber}: ${slide.title}`,
        startSecond: start,
        durationSeconds: duration,
        content: slide.title,
        visualNote: slide.visualSuggestion,
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
        content: slide.speakerScript.slice(0, 80) + '...',
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
}

export const videoRenderer = new VideoRenderer();
