export interface AudioPlaybackStatus {
  isPlaying: boolean;
  isPaused: boolean;
  currentSlideNumber: number;
  progressPercent: number;
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  speed: number;
}

export class TTSService {
  private provider: string;
  private apiKey?: string;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    this.provider = process.env.TTS_PROVIDER || 'web-speech';
    this.apiKey = process.env.TTS_API_KEY;
  }

  public isBrowserSpeechAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string, 
    options?: { 
      rate?: number; 
      pitch?: number;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ): void {
    if (!this.isBrowserSpeechAvailable()) return;

    this.stop();
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;

    // Pick a natural sounding English voice if available
    const voices = synth.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }

    this.currentUtterance = utterance;
    synth.speak(utterance);
  }

  public pause(): void {
    if (this.isBrowserSpeechAvailable()) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.isBrowserSpeechAvailable()) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (this.isBrowserSpeechAvailable()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const ttsService = new TTSService();
