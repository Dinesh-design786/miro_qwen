import { BoardContext } from '@/types';
import { miroClient } from './miroClient';
import { parseMiroRawItems, extractBoardIdFromUrl } from './boardParser';
import { DEMO_BOARD_CONTEXT } from '@/data/demoBoard';

export interface BoardReaderResult {
  boardContext: BoardContext;
  isDemo: boolean;
  message?: string;
}

export async function readBoard(boardUrlOrId?: string): Promise<BoardReaderResult> {
  const targetId = boardUrlOrId ? (extractBoardIdFromUrl(boardUrlOrId) || boardUrlOrId) : process.env.MIRO_BOARD_ID;

  // If no Miro credentials or demo requested/targetId matches demo, return rich demo board
  if (!miroClient.isConfigured() || !targetId || targetId.includes('demo') || targetId.includes('Demo')) {
    return {
      boardContext: DEMO_BOARD_CONTEXT,
      isDemo: true,
      message: miroClient.isConfigured() 
        ? 'Using rich Demo Miro Board (AI Bug Triage Agent)'
        : 'Miro API credentials not detected. Switched to rich Demo Miro Board mode.',
    };
  }

  try {
    const boardMeta = await miroClient.fetchBoard(targetId);
    const rawItems = await miroClient.fetchBoardItems(targetId, 100);
    const boardContext = parseMiroRawItems(targetId, boardMeta.name, rawItems);

    return {
      boardContext,
      isDemo: false,
      message: `Successfully extracted ${boardContext.items.length} items from Miro board "${boardMeta.name}".`,
    };
  } catch (error: any) {
    console.warn('Failed to read live Miro board, falling back to Demo Board:', error.message);
    return {
      boardContext: DEMO_BOARD_CONTEXT,
      isDemo: true,
      message: `Miro connection error (${error.message}). Loaded realistic Demo Board context instead.`,
    };
  }
}
