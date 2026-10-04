import { NextRequest, NextResponse } from 'next/server';
import { analyzePitch } from '@/services/ai/pitchAnalyzer';
import { Project, BoardContext } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, boardContext } = body as { project: Project; boardContext: BoardContext };

    if (!project || !project.problemStatement) {
      return NextResponse.json(
        { error: 'Project details and problem statement are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzePitch(project, boardContext);
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze idea' },
      { status: 500 }
    );
  }
}
