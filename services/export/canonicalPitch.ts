import { PitchDeck, Slide } from '@/types';
import { getSlideImageUrl, getFallbackSlideImageUrl } from '@/services/media/imageGenerator';

export const CANONICAL_CATEGORIES = [
  { index: 1, tag: '01 — PROBLEM', name: 'PROBLEM', defaultObjective: 'Identify the chronic pain & friction' },
  { index: 2, tag: '02 — INSIGHT', name: 'INSIGHT', defaultObjective: 'Why current approaches fail & the core insight' },
  { index: 3, tag: '03 — SOLUTION', name: 'SOLUTION', defaultObjective: 'The hero reveal and value proposition' },
  { index: 4, tag: '04 — PRODUCT', name: 'PRODUCT', defaultObjective: 'How it works and core workflow' },
  { index: 5, tag: '05 — MARKET', name: 'MARKET', defaultObjective: 'Target customer persona and expansion wedge' },
  { index: 6, tag: '06 — BUSINESS MODEL', name: 'BUSINESS MODEL', defaultObjective: 'Unit economics and monetization model' },
  { index: 7, tag: '07 — COMPETITION', name: 'COMPETITION', defaultObjective: 'Defensible moat and competitive differentiation' },
  { index: 8, tag: '08 — TECHNOLOGY', name: 'TECHNOLOGY', defaultObjective: 'Architecture, safety gates and deep reasoning' },
  { index: 9, tag: '09 — TRACTION', name: 'TRACTION', defaultObjective: 'Empirical benchmarks and pilot validation' },
  { index: 10, tag: '10 — ASK', name: 'ASK', defaultObjective: 'Next milestone, resource ask and call to action' },
] as const;

export interface CanonicalSlide {
  index: number; // 1 - 10
  numberFormatted: string; // '01' - '10'
  canonicalLabel: string; // '01 — PROBLEM'
  category: string; // 'PROBLEM'
  title: string;
  subtitle: string;
  keyPoints: string[];
  evidence?: string;
  visualSuggestion: string;
  speakerScript: string;
  durationSeconds: number;
  imageUrl: string;
}

export interface CanonicalPitchDeck {
  title: string;
  tagline: string;
  slides: CanonicalSlide[];
  totalDurationSeconds: number;
  slideCount: 10;
}

/**
 * Validates and normalizes any pitch input into exactly 10 canonical slides.
 * Single source of truth for both PPTX generator and Video generator.
 */
export function validateAndNormalizePitch(rawPitch: any): CanonicalPitchDeck {
  if (!rawPitch || typeof rawPitch !== 'object') {
    throw new Error('Invalid pitch input: pitch object is required');
  }

  const title: string = rawPitch.title || rawPitch.projectName || 'PitchForge Startup Pitch';
  const tagline: string = rawPitch.tagline || 'AI-Powered Innovation Studio';

  const canonicalSlides: CanonicalSlide[] = [];

  // Case A: Input already has a slides array (e.g. PitchDeck)
  if (Array.isArray(rawPitch.slides) && rawPitch.slides.length > 0) {
    for (let i = 0; i < 10; i++) {
      const cat = CANONICAL_CATEGORIES[i];
      const sourceSlide = rawPitch.slides[i] || rawPitch.slides[rawPitch.slides.length - 1];

      const keyPoints = Array.isArray(sourceSlide?.keyPoints) && sourceSlide.keyPoints.length > 0
        ? sourceSlide.keyPoints.map((p: any) => String(p).trim()).filter(Boolean)
        : [
            `${cat.name} overview for ${title}`,
            'Engineered for maximum stakeholder clarity',
            'Backed by empirical benchmarks and architectural validation'
          ];

      const slideTitle = sourceSlide?.title?.trim() || `${cat.name}: Strategic Overview`;
      const subtitle = sourceSlide?.objective?.trim() || cat.defaultObjective;
      const speakerScript = sourceSlide?.speakerScript?.trim() || 
        `Let us examine slide ${cat.index}: ${cat.name}. ${keyPoints.join('. ')}. This ensures our foundation is resilient.`;
      const durationSeconds = Math.max(5, Math.min(60, Number(sourceSlide?.durationSeconds) || 20));

      const imageUrl = sourceSlide?.imageUrl || 
        getSlideImageUrl(sourceSlide || { slideNumber: cat.index, title: slideTitle, objective: subtitle, keyPoints, visualSuggestion: '', speakerScript, durationSeconds }, title) ||
        getFallbackSlideImageUrl(cat.index);

      canonicalSlides.push({
        index: cat.index,
        numberFormatted: String(cat.index).padStart(2, '0'),
        canonicalLabel: cat.tag,
        category: cat.name,
        title: slideTitle,
        subtitle,
        keyPoints: keyPoints.slice(0, 5),
        evidence: sourceSlide?.evidence || (keyPoints.length > 1 ? keyPoints[keyPoints.length - 1] : undefined),
        visualSuggestion: sourceSlide?.visualSuggestion || `High-impact cinematic visualization representing ${cat.name}`,
        speakerScript,
        durationSeconds,
        imageUrl,
      });
    }
  } 
  // Case B: Input is structured object with { problem, insight, solution, product, market, businessModel, competition, technology, traction, ask }
  else {
    const sectionKeys: Record<string, string[]> = {
      PROBLEM: ['problem', 'problemStatement', 'painPoints'],
      INSIGHT: ['insight', 'rootCause', 'whyNow'],
      SOLUTION: ['solution', 'proposedSolution', 'valueProp', 'valueProposition'],
      PRODUCT: ['product', 'howItWorks', 'workflow'],
      MARKET: ['market', 'targetAudience', 'targetUsers', 'tam'],
      'BUSINESS MODEL': ['businessModel', 'monetization', 'pricing'],
      COMPETITION: ['competition', 'competitors', 'differentiators', 'moat'],
      TECHNOLOGY: ['technology', 'architecture', 'technicalFeasibility'],
      TRACTION: ['traction', 'metrics', 'benchmarks', 'validation'],
      ASK: ['ask', 'milestones', 'nextSteps', 'cta', 'nextMilestone']
    };

    for (let i = 0; i < 10; i++) {
      const cat = CANONICAL_CATEGORIES[i];
      const matchingKeys = sectionKeys[cat.name] || [];
      let sectionData: any = null;

      for (const k of matchingKeys) {
        if (rawPitch[k]) {
          sectionData = rawPitch[k];
          break;
        }
      }

      let slideTitle = `${cat.name}`;
      let subtitle = cat.defaultObjective;
      let points: string[] = [];
      let script = '';

      if (typeof sectionData === 'string') {
        points = [sectionData];
        script = sectionData;
      } else if (sectionData && typeof sectionData === 'object') {
        slideTitle = sectionData.title || `${cat.name}: Strategic Overview`;
        subtitle = sectionData.subtitle || sectionData.summary || cat.defaultObjective;
        if (Array.isArray(sectionData.points)) {
          points = sectionData.points.map((p: any) => String(p));
        } else if (Array.isArray(sectionData.keyPoints)) {
          points = sectionData.keyPoints.map((p: any) => String(p));
        } else if (sectionData.description) {
          points = [sectionData.description];
        }
        script = sectionData.speakerScript || sectionData.script || '';
      }

      if (points.length === 0) {
        points = [
          `Key strategic pillar for ${cat.name}`,
          'Validated through automated reasoning and feedback loops',
          'Accelerates core development velocity'
        ];
      }

      if (!script) {
        script = `Slide ${cat.index}: ${cat.name}. ${points.join('. ')}.`;
      }

      const dummySlide: Slide = {
        slideNumber: cat.index,
        title: slideTitle,
        objective: subtitle,
        keyPoints: points,
        visualSuggestion: `Cinematic depiction of ${cat.name}`,
        speakerScript: script,
        durationSeconds: 20
      };

      const imageUrl = getSlideImageUrl(dummySlide, title) || getFallbackSlideImageUrl(cat.index);

      canonicalSlides.push({
        index: cat.index,
        numberFormatted: String(cat.index).padStart(2, '0'),
        canonicalLabel: cat.tag,
        category: cat.name,
        title: slideTitle,
        subtitle,
        keyPoints: points.slice(0, 5),
        visualSuggestion: dummySlide.visualSuggestion,
        speakerScript: script,
        durationSeconds: 20,
        imageUrl,
      });
    }
  }

  const totalDurationSeconds = canonicalSlides.reduce((acc, s) => acc + s.durationSeconds, 0);

  return {
    title,
    tagline,
    slides: canonicalSlides,
    totalDurationSeconds,
    slideCount: 10,
  };
}
