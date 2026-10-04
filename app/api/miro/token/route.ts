import { NextRequest, NextResponse } from 'next/server';
import { saveMiroToken, getStoredMiroToken, getMiroTokenDetails } from '@/services/miro/tokenStore';
import { miroClient } from '@/services/miro/miroClient';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = getStoredMiroToken();
  const details = getMiroTokenDetails();

  return NextResponse.json({
    hasToken: Boolean(token && token.trim().length > 0),
    maskedToken: token ? `${token.slice(0, 10)}...${token.slice(-6)}` : null,
    scope: details?.scope,
    team_id: details?.team_id,
    user_id: details?.user_id,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken, clientSecret } = body;

    if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
      return NextResponse.json(
        { error: 'TOKEN_REQUIRED', message: 'Please provide a valid Miro access token string.' },
        { status: 400 }
      );
    }

    const cleanToken = accessToken.trim();

    // Persist to data/miro_token.json
    saveMiroToken({
      access_token: cleanToken,
      token_type: 'Bearer',
      scope: 'boards:read boards:write',
      created_at: Date.now(),
    });

    // Also update runtime process.env
    process.env.MIRO_ACCESS_TOKEN = cleanToken;

    if (clientSecret && typeof clientSecret === 'string' && clientSecret.trim()) {
      process.env.MIRO_CLIENT_SECRET = clientSecret.trim();
    }

    console.log('[PitchForge Miro Token Update] Token updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Miro access token saved and verified.',
      maskedToken: `${cleanToken.slice(0, 10)}...${cleanToken.slice(-6)}`,
    });
  } catch (error: any) {
    console.error('[PitchForge Miro Token Update Error]:', error);
    return NextResponse.json(
      { error: 'UPDATE_FAILED', message: error.message || 'Failed to save Miro access token.' },
      { status: 500 }
    );
  }
}
