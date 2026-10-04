export interface MiroConfig {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  boardId?: string;
}

export class MiroClient {
  private accessToken: string | undefined;
  private baseUrl = 'https://api.miro.com/v2';

  constructor(config?: MiroConfig) {
    this.accessToken = config?.accessToken || process.env.MIRO_ACCESS_TOKEN;
  }

  public isConfigured(): boolean {
    return Boolean(this.accessToken && this.accessToken.trim().length > 0);
  }

  public async fetchBoard(boardId: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('MIRO_CONFIG_MISSING: MIRO_ACCESS_TOKEN is not configured.');
    }

    const response = await fetch(`${this.baseUrl}/boards/${encodeURIComponent(boardId)}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Miro API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  public async fetchBoardItems(boardId: string, limit = 50): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('MIRO_CONFIG_MISSING: MIRO_ACCESS_TOKEN is not configured.');
    }

    const response = await fetch(
      `${this.baseUrl}/boards/${encodeURIComponent(boardId)}/items?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Miro API items error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.data || [];
  }
}

export const miroClient = new MiroClient();
