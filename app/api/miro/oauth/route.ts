import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const configCheck = miroClient.validateConfig();
    if (!configCheck.valid) {
      console.error('[Miro OAuth] Configuration error:', configCheck.errors.join(', '));
      return NextResponse.redirect(
        new URL('/?miro_error=' + encodeURIComponent('Miro integration is not configured. Please check MIRO_CLIENT_ID, MIRO_CLIENT_SECRET, and MIRO_REDIRECT_URL in .env.'), req.url)
      );
    }

    const state = req.nextUrl.searchParams.get('state') || 'pitchforge';
    const authorizeUrl = miroClient.getOAuthAuthorizeUrl(state);
    
    return NextResponse.redirect(authorizeUrl);
  } catch (error: any) {
    console.error('[Miro OAuth Start Error]:', error.message);
    return NextResponse.redirect(
      new URL('/?miro_error=' + encodeURIComponent(error.message || 'Unable to connect to Miro. Check the Miro OAuth configuration.'), req.url)
    );
  }
}
