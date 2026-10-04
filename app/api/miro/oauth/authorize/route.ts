import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get('state') || 'pitchforge';
  const authorizeUrl = miroClient.getOAuthAuthorizeUrl(state);
  return NextResponse.redirect(authorizeUrl);
}
