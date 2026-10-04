import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';
import { getMiroTokenDetails } from '@/services/miro/tokenStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isConfigured = miroClient.isConfigured();
  const tokenDetails = getMiroTokenDetails();

  if (!isConfigured) {
    return NextResponse.json({
      isAuthenticated: false,
      boards: [],
      message: 'Miro account is not connected.',
    });
  }

  try {
    const boards = await miroClient.fetchBoards();
    return NextResponse.json({
      isAuthenticated: true,
      user_id: tokenDetails?.user_id,
      team_id: tokenDetails?.team_id,
      boards: boards.map((b: any) => ({
        id: b.id,
        name: b.name,
        viewLink: b.viewLink,
      })),
    });
  } catch (err: any) {
    console.warn('Miro auth check warning:', err.message);
    const isTokenExpired = err.message.includes('401') || err.message.includes('TOKEN_EXPIRED');
    return NextResponse.json({
      isAuthenticated: !isTokenExpired,
      error: err.message,
      boards: [],
    });
  }
}
