import fs from 'fs';
import path from 'path';
import PptxGenJS from 'pptxgenjs';
import { CanonicalPitchDeck, validateAndNormalizePitch } from './canonicalPitch';

export interface PptxGenerationResult {
  filePath: string;
  fileName: string;
  sizeBytes: number;
  slideCount: number;
}

/**
 * Server-side PPTX generator that builds a real .pptx file with exactly 10 canonical slides
 * adhering strictly to the PitchForge dark cinematic aesthetic.
 */
export async function generatePptxFile(rawPitch: any): Promise<PptxGenerationResult> {
  const deck: CanonicalPitchDeck = validateAndNormalizePitch(rawPitch);

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9'; // 16:9 widescreen
  pptx.author = 'PitchForge AI Studio';
  pptx.company = 'PitchForge (Miro + Qwen)';
  pptx.title = deck.title;
  pptx.subject = 'Startup Pitch Presentation';

  // PitchForge Color Tokens
  const BG_COLOR = '080808';
  const CARD_BG = '141414';
  const CARD_SECONDARY = '1A1A1A';
  const PRIMARY_ORANGE = 'FF4D00';
  const ACCENT_ORANGE = 'FF6A00';
  const TEXT_LIGHT = 'FFFFFF';
  const TEXT_MUTED = 'A1A1AA';
  const BORDER_COLOR = '27272A';

  // 1. Cover Slide
  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: BG_COLOR };

  // Subtle accent top line
  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 0.8,
    w: 8.4,
    h: 0.05,
    fill: { color: PRIMARY_ORANGE },
    line: { color: PRIMARY_ORANGE },
  });

  coverSlide.addText('PITCHFORGE  •  AI PITCH STUDIO', {
    x: 0.8,
    y: 1.1,
    w: 8.4,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Arial',
    color: PRIMARY_ORANGE,
    bold: true,
    charSpacing: 3,
  });

  coverSlide.addText(deck.title.toUpperCase(), {
    x: 0.8,
    y: 1.7,
    w: 8.4,
    h: 1.6,
    fontSize: 32,
    fontFace: 'Arial Black',
    color: TEXT_LIGHT,
    bold: true,
  });

  coverSlide.addText(deck.tagline, {
    x: 0.8,
    y: 3.5,
    w: 8.4,
    h: 0.8,
    fontSize: 16,
    fontFace: 'Arial',
    color: TEXT_MUTED,
  });

  // Cover metadata card
  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 4.8,
    w: 8.4,
    h: 1.0,
    fill: { color: CARD_BG },
    line: { color: BORDER_COLOR, width: 1 },
  });

  coverSlide.addText(`10 CANONICAL SLIDES  •  ~${Math.ceil(deck.totalDurationSeconds / 60)} MINUTE NARRATIVE  •  QWEN REASONING ENGINE`, {
    x: 1.1,
    y: 5.15,
    w: 7.8,
    h: 0.4,
    fontSize: 10,
    fontFace: 'Arial',
    color: TEXT_LIGHT,
    bold: true,
  });

  // 2. 10 Canonical Content Slides
  for (const slide of deck.slides) {
    const pSlide = pptx.addSlide();
    pSlide.background = { color: BG_COLOR };

    // Top Category Header & Slide Indicator
    pSlide.addText(slide.canonicalLabel, {
      x: 0.8,
      y: 0.5,
      w: 5.0,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: PRIMARY_ORANGE,
      bold: true,
      charSpacing: 2,
    });

    pSlide.addText(`SLIDE ${slide.numberFormatted} / 10  •  PITCHFORGE`, {
      x: 6.0,
      y: 0.5,
      w: 3.2,
      h: 0.35,
      fontSize: 10,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      align: 'right',
    });

    // Slide Title
    pSlide.addText(slide.title, {
      x: 0.8,
      y: 0.9,
      w: 8.4,
      h: 0.7,
      fontSize: 22,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      bold: true,
    });

    // Subtitle / Objective
    pSlide.addText(slide.subtitle, {
      x: 0.8,
      y: 1.55,
      w: 8.4,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      italic: true,
    });

    // Left Main Panel: Key Points & Evidence
    pSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 2.1,
      w: 5.4,
      h: 4.5,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });

    pSlide.addText('CORE STRATEGIC PILLARS', {
      x: 1.1,
      y: 2.3,
      w: 4.8,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: PRIMARY_ORANGE,
      bold: true,
      charSpacing: 1.5,
    });

    const bulletItems = slide.keyPoints.map(point => ({
      text: `${point}\n`,
      options: {
        fontSize: 12,
        fontFace: 'Arial',
        color: TEXT_LIGHT,
        bullet: { type: 'bullet' as const, color: PRIMARY_ORANGE },
        spaceAfter: 10,
      },
    }));

    pSlide.addText(bulletItems, {
      x: 1.1,
      y: 2.7,
      w: 4.8,
      h: 2.8,
    });

    if (slide.evidence) {
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 1.1,
        y: 5.7,
        w: 4.8,
        h: 0.7,
        fill: { color: CARD_SECONDARY },
        line: { color: PRIMARY_ORANGE, width: 1 },
      });

      pSlide.addText(`SUPPORTING EVIDENCE: ${slide.evidence}`, {
        x: 1.25,
        y: 5.8,
        w: 4.5,
        h: 0.5,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_LIGHT,
        italic: true,
      });
    }

    // Right Panel: Visual Element & Narration Timing
    pSlide.addShape(pptx.ShapeType.rect, {
      x: 6.4,
      y: 2.1,
      w: 2.8,
      h: 4.5,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
    });

    pSlide.addText('VISUAL DIRECTION', {
      x: 6.6,
      y: 2.3,
      w: 2.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      bold: true,
      charSpacing: 1.5,
    });

    pSlide.addText(slide.visualSuggestion, {
      x: 6.6,
      y: 2.7,
      w: 2.4,
      h: 2.4,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      italic: true,
    });

    // Timing Badge
    pSlide.addShape(pptx.ShapeType.rect, {
      x: 6.6,
      y: 5.4,
      w: 2.4,
      h: 0.5,
      fill: { color: '201205' },
      line: { color: PRIMARY_ORANGE, width: 1 },
    });

    pSlide.addText(`EST. DURATION: ~${slide.durationSeconds}s`, {
      x: 6.6,
      y: 5.5,
      w: 2.4,
      h: 0.3,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: ACCENT_ORANGE,
      bold: true,
      align: 'center',
    });

    // Speaker Script as PowerPoint Speaker Notes
    pSlide.addNotes(
      `SPEAKER SCRIPT:\n${slide.speakerScript}\n\nSLIDE: ${slide.canonicalLabel}\nOBJECTIVE: ${slide.subtitle}`
    );
  }

  // Ensure generated directory exists
  const outputDir = path.join(process.cwd(), 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeTitle = deck.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  const fileName = `pitchforge-${safeTitle}-${timestamp}.pptx`;
  const filePath = path.join(outputDir, fileName);

  // Write file to disk
  await pptx.writeFile({ fileName: filePath });

  // Verification step (Section 5)
  if (!fs.existsSync(filePath)) {
    throw new Error(`PPT file was not written to ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('Generated PPT file is 0 bytes');
  }

  return {
    filePath,
    fileName,
    sizeBytes: stats.size,
    slideCount: 10,
  };
}
