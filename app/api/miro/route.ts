import { NextRequest, NextResponse } from 'next/server';
import { readBoard } from '@/services/miro/boardReader';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { boardUrlOrId } = body;

    const result = await readBoard(boardUrlOrId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/miro:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to read Miro board' },
      { status: 500 }
    );
  }
}
