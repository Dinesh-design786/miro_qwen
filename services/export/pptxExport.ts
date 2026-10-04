import { PitchDeck, ExecutiveSummary, PitchAttackReport, JudgeQuestion } from '@/types';

export async function exportPitchDeckToPPTX(deck: PitchDeck): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  try {
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'PitchForge AI Studio';
    pptx.company = 'PitchForge powered by Miro & Qwen';
    pptx.title = deck.title;

    // Define Master Slide Theme: Modern Dark Theme
    const BG_COLOR = '0B0F19';
    const CARD_BG = '161F30';
    const PRIMARY_ACCENT = '6366F1';
    const TEXT_LIGHT = 'F8FAFC';
    const TEXT_MUTED = '94A3B8';
    const BORDER_COLOR = '2D3748';

    // Slide 1: Cover Slide
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: BG_COLOR };

    coverSlide.addText('PITCHFORGE • AI PITCH STUDIO', {
      x: 0.8,
      y: 1.2,
      w: 8.5,
      h: 0.4,
      fontSize: 12,
      color: PRIMARY_ACCENT,
      bold: true,
      charSpacing: 2,
    });

    coverSlide.addText(deck.title, {
      x: 0.8,
      y: 1.8,
      w: 8.5,
      h: 1.6,
      fontSize: 32,
      color: TEXT_LIGHT,
      bold: true,
    });

    coverSlide.addText(deck.tagline, {
      x: 0.8,
      y: 3.5,
      w: 8.5,
      h: 0.8,
      fontSize: 16,
      color: TEXT_MUTED,
    });

    coverSlide.addText(`Duration: ~${Math.ceil(deck.totalDurationSeconds / 60)} Minutes | ${deck.slideCount} Slides`, {
      x: 0.8,
      y: 5.5,
      w: 8.5,
      h: 0.5,
      fontSize: 11,
      color: '64748B',
    });

    // Content Slides
    for (const slide of deck.slides) {
      const pSlide = pptx.addSlide();
      pSlide.background = { color: BG_COLOR };

      // Slide Number & Objective Header
      pSlide.addText(`SLIDE ${slide.slideNumber} OF ${deck.slides.length} • ${slide.objective.toUpperCase()}`, {
        x: 0.8,
        y: 0.6,
        w: 8.5,
        h: 0.3,
        fontSize: 10,
        color: PRIMARY_ACCENT,
        bold: true,
      });

      // Slide Title
      pSlide.addText(slide.title, {
        x: 0.8,
        y: 1.0,
        w: 8.5,
        h: 0.8,
        fontSize: 24,
        color: TEXT_LIGHT,
        bold: true,
      });

      // Left Box: Key Points
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 2.0,
        w: 5.5,
        h: 4.2,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      pSlide.addText('KEY POINTS', {
        x: 1.1,
        y: 2.2,
        w: 5.0,
        h: 0.3,
        fontSize: 10,
        color: TEXT_MUTED,
        bold: true,
      });

      const bulletItems = slide.keyPoints.map(kp => ({
        text: `${kp}\n`,
        options: {
          fontSize: 13,
          color: TEXT_LIGHT,
          bullet: true,
          spaceAfter: 12,
        },
      }));

      pSlide.addText(bulletItems, {
        x: 1.1,
        y: 2.6,
        w: 4.9,
        h: 3.4,
      });

      // Right Box: Visual Recommendation
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 6.6,
        y: 2.0,
        w: 2.7,
        h: 4.2,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
      });

      pSlide.addText('VISUAL DIRECTION', {
        x: 6.8,
        y: 2.2,
        w: 2.3,
        h: 0.3,
        fontSize: 10,
        color: 'E2E8F0',
        bold: true,
      });

      pSlide.addText(slide.visualSuggestion, {
        x: 6.8,
        y: 2.6,
        w: 2.3,
        h: 2.2,
        fontSize: 11,
        color: TEXT_MUTED,
        italic: true,
      });

      // Speaking time badge on right
      pSlide.addText(`Speaking Time: ~${slide.durationSeconds}s`, {
        x: 6.8,
        y: 5.4,
        w: 2.3,
        h: 0.4,
        fontSize: 10,
        color: PRIMARY_ACCENT,
        bold: true,
      });

      // Speaker Notes
      const notesText = [
        `SPEAKER SCRIPT:`,
        slide.speakerScript,
        '',
        slide.deliveryNotes ? `DELIVERY NOTES: Tone: ${slide.deliveryNotes.tone} | Energy: ${slide.deliveryNotes.energy}` : '',
        slide.deliveryNotes?.pauseAfter ? `PAUSE AFTER: "${slide.deliveryNotes.pauseAfter}"` : '',
        slide.deliveryNotes?.emphasis ? `EMPHASIS: "${slide.deliveryNotes.emphasis}"` : '',
      ].filter(Boolean).join('\n');

      pSlide.addNotes(notesText);
    }

    const blob = await pptx.write({ outputType: 'blob' }) as Blob;
    return blob;
  } catch (error) {
    console.error('Failed to export PPTX:', error);
    return null;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSummaryAsMarkdown(summary: ExecutiveSummary): string {
  return `# ${summary.projectName} — Executive Summary
**${summary.tagline}**

---

### Problem
${summary.problem}

### Proposed Solution
${summary.solution}

### Target Market
${summary.targetMarket}

### Competitive Differentiation
${summary.differentiation}

### Technology & Architecture
${summary.technology}

### Business Model
${summary.businessModel}

### Measurable Impact
${summary.impact}

### Current Status
${summary.currentStatus}

### Next Milestone
${summary.nextMilestone}

---
*Generated by PitchForge (Miro + Qwen Studio)*
`;
}

export function exportPitchPackageZipReady(data: {
  deck?: PitchDeck;
  summary?: ExecutiveSummary;
  attackReport?: PitchAttackReport;
  judgeQuestions?: JudgeQuestion[];
}): string {
  return JSON.stringify(data, null, 2);
}
