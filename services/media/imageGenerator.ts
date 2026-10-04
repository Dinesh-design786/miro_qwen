import { Slide, PitchDeck } from '@/types';

// Curated high-resolution fallback visuals for startup slides if external generation is unavailable
const FALLBACK_THEME_VISUALS: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&h=720&q=80', // Problem / Data chaos
  2: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80', // Global network / Status quo
  3: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&h=720&q=80', // Modern abstract product reveal
  4: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&h=720&q=80', // Digital pipeline / code / technology
  5: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1280&h=720&q=80', // Market opportunity / growth
  6: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1280&h=720&q=80', // Business model / value
  7: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1280&h=720&q=80', // Competitive moat / strategy
  8: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&h=720&q=80', // Tech architecture / servers / cloud
  9: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1280&h=720&q=80', // Traction / rocket launch / metrics
  10: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&h=720&q=80', // Team / closing / call to action
};

export function generateSlideVisualPrompt(slide: Slide, projectName = 'Startup'): string {
  const cleanTitle = slide.title.replace(/[^\w\s-]/g, '').trim();
  const cleanNote = (slide.visualSuggestion || slide.objective || '').replace(/[^\w\s-]/g, '').trim();
  
  return `Cinematic 3D presentation slide visual for ${projectName}: "${cleanTitle}". Concept: ${cleanNote}. Dark charcoal aesthetic, vivid orange and crimson accent lighting, high-tech minimalism, sleek glassmorphism, octane render, 8k resolution.`;
}

export function getSlideImageUrl(slide: Slide, projectName = 'Startup', seedOffset = 0): string {
  if (slide.imageUrl && slide.imageUrl.startsWith('http')) {
    return slide.imageUrl;
  }

  const prompt = generateSlideVisualPrompt(slide, projectName);
  const seed = (slide.slideNumber * 1337 + seedOffset * 997 + projectName.length) % 100000;
  
  // Fast, reliable 16:9 AI image generation with Flux model via Pollinations
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;
  
  return pollinationsUrl;
}

export function getFallbackSlideImageUrl(slideNumber: number): string {
  const norm = ((slideNumber - 1) % 10) + 1;
  return FALLBACK_THEME_VISUALS[norm] || FALLBACK_THEME_VISUALS[1];
}

export function populateDeckWithImages(deck: PitchDeck, projectName?: string): PitchDeck {
  const name = projectName || deck.title || 'PitchForge';
  const updatedSlides = deck.slides.map((s, idx) => {
    if (!s.imageUrl) {
      const prompt = generateSlideVisualPrompt(s, name);
      const url = getSlideImageUrl(s, name);
      return {
        ...s,
        visualPrompt: prompt,
        imageUrl: url,
      };
    }
    return s;
  });

  return {
    ...deck,
    slides: updatedSlides,
  };
}
