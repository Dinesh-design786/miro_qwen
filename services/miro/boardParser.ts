import { BoardContext, BoardItem, BoardItemType, BoardFrame } from '@/types';
import { DEMO_BOARD_CONTEXT } from '@/data/demoBoard';

export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export function parseMiroRawItems(boardId: string, boardTitle: string, rawItems: any[]): BoardContext {
  const items: BoardItem[] = [];
  const frames: BoardFrame[] = [];

  for (const raw of rawItems) {
    const rawType = raw.type || 'unknown';
    let type: BoardItemType = 'text';
    let text = '';
    let color: string | undefined;

    if (rawType === 'sticky_note') {
      type = 'sticky_note';
      text = stripHtml(raw.data?.content || raw.content || '');
      color = raw.style?.fillColor || '#FEF08A';
    } else if (rawType === 'text') {
      type = 'text';
      text = stripHtml(raw.data?.content || raw.content || '');
    } else if (rawType === 'frame') {
      type = 'frame';
      text = raw.data?.title || raw.title || 'Untitled Frame';
      frames.push({
        id: raw.id,
        title: text,
        x: raw.position?.x || 0,
        y: raw.position?.y || 0,
        width: raw.geometry?.width || 500,
        height: raw.geometry?.height || 400,
        itemIds: [],
      });
    } else if (rawType === 'connector') {
      type = 'connector';
      text = stripHtml(raw.data?.captions?.[0]?.content || '');
    } else if (rawType === 'shape') {
      type = 'shape';
      text = stripHtml(raw.data?.content || '');
    } else if (rawType === 'card') {
      type = 'card';
      text = stripHtml(raw.data?.title || raw.data?.description || '');
    } else if (rawType === 'image') {
      type = 'image';
      text = raw.data?.title || 'Board Image';
    }

    if (text || type === 'frame') {
      items.push({
        id: raw.id || `item-${Math.random().toString(36).substring(2, 9)}`,
        type,
        text,
        position: {
          x: raw.position?.x || 0,
          y: raw.position?.y || 0,
        },
        parentId: raw.parent?.id,
        color,
        metadata: raw.geometry || {},
      });
    }
  }

  return {
    boardId,
    title: boardTitle || 'Connected Miro Board',
    description: `Extracted ${items.length} board items across ${frames.length} frames`,
    lastModified: new Date().toISOString(),
    items,
    frames,
  };
}

export function extractBoardIdFromUrl(url: string): string | null {
  if (!url) return null;
  // Miro board URLs: https://miro.com/app/board/uXjVO123abc=/ or similar
  const match = url.match(/miro\.com\/app\/board\/([^/?#]+)/i);
  return match ? match[1] : null;
}
