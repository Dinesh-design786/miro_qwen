import { NextRequest, NextResponse } from 'next/server';
import { generatePitchDeck, generateExecutiveSummary } from '@/services/ai/pitchGenerator';
import { Project, PitchAnalysis } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, analysis, slideCount = 10 } = body as {
      project: Project;
      analysis: PitchAnalysis;
      slideCount?: number;
    };

    if (!project || !analysis) {
      return NextResponse.json(
        { error: 'Project and analysis are required to generate pitch' },
        { status: 400 }
      );
    }

    const [deck, summary] = await Promise.all([
      generatePitchDeck(project, analysis, slideCount),
      generateExecutiveSummary(project, analysis),
    ]);

    return NextResponse.json({ deck, summary });
  } catch (error: any) {
    console.error('Error in /api/generate-pitch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pitch deck' },
      { status: 500 }
    );
  }
}
