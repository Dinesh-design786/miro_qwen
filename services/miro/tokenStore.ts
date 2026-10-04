import fs from 'fs';
import path from 'path';

export interface MiroTokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  user_id?: string;
  team_id?: string;
  created_at: number;
}

const TOKEN_FILE_PATH = path.join(process.cwd(), 'data', 'miro_token.json');

export function saveMiroToken(tokenData: Partial<MiroTokenData>): void {
  try {
    const fullData: MiroTokenData = {
      access_token: tokenData.access_token || '',
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type || 'Bearer',
      scope: tokenData.scope,
      user_id: tokenData.user_id,
      team_id: tokenData.team_id,
      created_at: Date.now(),
    };

    const dir = path.dirname(TOKEN_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(fullData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save Miro token to file:', error);
  }
}

export function getStoredMiroToken(): string | null {
  // 1. First check environment variable
  if (process.env.MIRO_ACCESS_TOKEN && process.env.MIRO_ACCESS_TOKEN.trim().length > 0) {
    return process.env.MIRO_ACCESS_TOKEN.trim();
  }

  // 2. Next check persisted token file
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const raw = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
      const data: MiroTokenData = JSON.parse(raw);
      if (data.access_token && data.access_token.trim().length > 0) {
        return data.access_token.trim();
      }
    }
  } catch (error) {
    console.warn('Failed to read stored Miro token:', error);
  }

  return null;
}

export function getMiroTokenDetails(): MiroTokenData | null {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const raw = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Failed to read Miro token details:', error);
  }
  return null;
}

export function clearStoredMiroToken(): void {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      fs.unlinkSync(TOKEN_FILE_PATH);
    }
  } catch (error) {
    console.warn('Failed to clear Miro token file:', error);
  }
}
