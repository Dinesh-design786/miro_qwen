import { NextRequest, NextResponse } from 'next/server';
import { writePitchToMiro } from '@/services/miro/pitchWriter';
import { miroClient } from '@/services/miro/miroClient';
import { extractBoardIdFromUrl } from '@/services/miro/boardParser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { 
      boardId, 
      project, 
      analysis, 
      deck, 
      attackReport, 
      judgeQuestions, 
      summary,
      replaceExisting,
      createVersion 
    } = body;

    // Check Miro authentication
    if (!miroClient.isConfigured()) {
      return NextResponse.json({
        error: 'MIRO_AUTH_REQUIRED',
        message: 'Miro authentication is required to send pitch to Miro.',
        authorizeUrl: miroClient.getOAuthAuthorizeUrl(),
      }, { status: 401 });
    }

    if (!boardId && project?.miroBoardUrl) {
      boardId = extractBoardIdFromUrl(project.miroBoardUrl) || project.miroBoardUrl;
    }

    if (!boardId) {
      return NextResponse.json({
        error: 'BOARD_ID_REQUIRED',
        message: 'Please provide a valid Miro board ID or board URL.',
      }, { status: 400 });
    }

    // Clean boardId if full URL was provided
    boardId = extractBoardIdFromUrl(boardId) || boardId;

    const result = await writePitchToMiro({
      boardId,
      project,
      analysis,
      deck,
      attackReport,
      judgeQuestions: judgeQuestions || [],
      summary,
      replaceExisting,
      createVersion,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/miro/export-pitch:', error);

    const isAuthError = error.message?.includes('AUTHENTICATION_REQUIRED') || error.message?.includes('TOKEN_EXPIRED');

    return NextResponse.json({
      error: isAuthError ? 'MIRO_AUTH_REQUIRED' : 'MIRO_WRITE_FAILED',
      message: error.message || 'Failed to write pitch to Miro board',
      authorizeUrl: isAuthError ? miroClient.getOAuthAuthorizeUrl() : undefined,
    }, { status: isAuthError ? 401 : 500 });
  }
}
