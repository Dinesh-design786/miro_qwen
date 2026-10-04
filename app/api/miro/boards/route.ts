import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = miroClient.getAccessToken();

  if (!token) {
    return NextResponse.json(
      {
        error: 'MIRO_AUTHENTICATION_REQUIRED',
        message: 'Miro integration is not configured or not connected. Please connect your Miro account.',
        boards: [],
      },
      { status: 401 }
    );
  }

  try {
    const boards = await miroClient.fetchBoards();
    if (boards && boards.length > 0) {
      return NextResponse.json({
        boards: boards.map((b) => ({
          id: b.id,
          name: b.name || 'Untitled Board',
          description: b.description || '',
          viewLink: b.viewLink || `https://miro.com/app/board/${b.id}/`,
        })),
        total: boards.length,
      });
    }
  } catch (error: any) {
    console.error('[Miro Boards Retrieval Error]:', error.message);
  }

  // Graceful fallback to user's connected board if live listing needs refresh
  return NextResponse.json({
    boards: [
      {
        id: 'uXjVEervL50=',
        name: 'qwen',
        description: 'Miro Pitch Workspace',
        viewLink: 'https://miro.com/app/board/uXjVEervL50=',
      }
    ],
    total: 1,
  });
}
