export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { miroClient } = await import('@/services/miro/miroClient');
    const result = miroClient.validateConfig();
    if (!result.valid) {
      console.warn('\n⚠️ [PitchForge Miro Environment Configuration]');
      result.errors.forEach(err => console.warn('  - ' + err));
      console.warn('  Ensure MIRO_CLIENT_ID, MIRO_CLIENT_SECRET, and MIRO_REDIRECT_URL are set in .env.local');
      console.warn('  Expected development redirect: http://localhost:3000/api/miro/oauth/callback\n');
    } else {
      console.log('\n✅ [PitchForge Miro Environment Configuration Validated]');
      console.log('  OAuth redirect URI:', process.env.MIRO_REDIRECT_URL || 'http://localhost:3000/api/miro/oauth/callback');
      console.log('  MIRO_CLIENT_ID configured: true');
      console.log('  MIRO_CLIENT_SECRET configured: true\n');
    }
  }
}
