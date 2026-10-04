import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');
  const errorDescription = req.nextUrl.searchParams.get('error_description');

  if (error) {
    console.error('Miro OAuth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?miro_error=${encodeURIComponent(errorDescription || error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?miro_error=No_authorization_code_received', req.url)
    );
  }

  try {
    await miroClient.exchangeCodeForToken(code);
    return NextResponse.redirect(
      new URL('/?miro_connected=true', req.url)
    );
  } catch (err: any) {
    console.error('Failed to exchange Miro code for token:', err);
    return NextResponse.redirect(
      new URL(`/?miro_error=${encodeURIComponent(err.message || 'Token_exchange_failed')}`, req.url)
    );
  }
}
