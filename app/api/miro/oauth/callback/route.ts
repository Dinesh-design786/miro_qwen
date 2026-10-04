import { NextRequest, NextResponse } from 'next/server';
import { miroClient } from '@/services/miro/miroClient';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');
  const errorDescription = req.nextUrl.searchParams.get('error_description');

  console.log('[PitchForge Miro Callback Received]');
  console.log('  Callback reached: true');
  console.log('  Authorization code received:', Boolean(code));
  if (error) {
    console.warn('  OAuth error parameter:', error, errorDescription);
  }

  // 1. OAuth denial / error from provider
  if (error) {
    const isDenial = error === 'access_denied' || errorDescription?.toLowerCase().includes('denied');
    const userMessage = isDenial
      ? 'Miro authorization was cancelled or denied.'
      : (errorDescription || 'Unable to connect to Miro. Check the Miro OAuth configuration.');

    return NextResponse.redirect(
      new URL(`/?miro_error=${encodeURIComponent(userMessage)}`, req.url)
    );
  }

  // 2. Missing authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL(`/?miro_error=${encodeURIComponent('No authorization code was returned by Miro.')}`, req.url)
    );
  }

  // 3. Server-side token exchange
  try {
    await miroClient.exchangeCodeForToken(code);
    console.log('[PitchForge Miro Callback] Token successfully stored. Redirecting to PitchForge (?miro=connected)...');
    return NextResponse.redirect(
      new URL('/?miro=connected', req.url)
    );
  } catch (err: any) {
    console.error('[PitchForge Miro Callback] Token exchange failure:', err.message);

    let friendlyError = 'Unable to connect to Miro. Token exchange failed.';
    if (err.message?.includes('invalid_grant')) {
      friendlyError = 'Invalid or expired Miro authorization code. Please try connecting again.';
    } else if (err.message?.includes('secretKeyNotFound') || err.message?.includes('ClientSecret does not exist')) {
      friendlyError = 'Miro Client Secret does not match your Miro app. You can enter your Miro Access Token directly in the Send to Miro modal.';
    } else if (err.message?.includes('401')) {
      friendlyError = 'Miro authentication failed. Please verify your Miro app credentials or enter a direct Access Token.';
    } else if (err.message) {
      // Strip any raw JSON brackets from message
      friendlyError = err.message.replace(/\{[\s\S]*?\}/g, '').replace(/\s+/g, ' ').trim() || friendlyError;
    }

    return NextResponse.redirect(
      new URL(`/?miro_error=${encodeURIComponent(friendlyError)}`, req.url)
    );
  }
}
