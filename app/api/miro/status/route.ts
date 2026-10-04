import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';
import { getMiroTokenDetails } from '@/services/miro/tokenStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = miroClient.getAccessToken();
  const tokenDetails = getMiroTokenDetails();
  const isConfigured = miroClient.hasCredentials();

  if (!token) {
    return NextResponse.json({
      connected: false,
      configured: isConfigured,
      message: isConfigured 
        ? 'Miro integration is configured, but account is not connected.' 
        : 'Miro integration is not configured. Missing MIRO_CLIENT_ID or MIRO_CLIENT_SECRET.',
    });
  }

  return NextResponse.json({
    connected: true,
    configured: isConfigured,
    user_id: tokenDetails?.user_id,
    team_id: tokenDetails?.team_id,
    scope: tokenDetails?.scope,
  });
}
