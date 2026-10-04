import { NextRequest, NextResponse } from 'next/server';
import { generateJudgeQuestions } from '@/services/ai/judgeAgent';
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
        { error: 'Project and analysis are required for AI Judge mode' },
        { status: 400 }
      );
    }

    const judgeQuestions = await generateJudgeQuestions(project, analysis, boardContext);
    return NextResponse.json({ judgeQuestions });
  } catch (error: any) {
    console.error('Error in /api/judge:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate judge questions' },
      { status: 500 }
    );
  }
}
