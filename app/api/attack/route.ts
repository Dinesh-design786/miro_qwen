import { NextRequest, NextResponse } from 'next/server';
import { attackPitch } from '@/services/ai/pitchCritic';
import { Project, BoardContext, PitchAnalysis } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, analysis, boardContext } = body as {
      project: Project;
      analysis: PitchAnalysis;
      boardContext: BoardContext;
    };

    if (!project || !analysis) {
      return NextResponse.json(
        { error: 'Project and current analysis are required to run Attack My Pitch' },
        { status: 400 }
      );
    }

    const attackReport = await attackPitch(project, analysis, boardContext);
    return NextResponse.json({ attackReport });
  } catch (error: any) {
    console.error('Error in /api/attack:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to attack pitch' },
      { status: 500 }
    );
  }
}
