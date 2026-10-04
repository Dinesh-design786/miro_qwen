import { getStoredMiroToken, saveMiroToken, MiroTokenData } from './tokenStore';

export interface MiroConfig {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUrl?: string;
}

export class MiroClient {
  private baseUrl = 'https://api.miro.com/v2';
  private oauthUrl = 'https://api.miro.com/v1/oauth/token';

  private clientId: string;
  private clientSecret: string;
  private redirectUrl: string;

  constructor(config?: MiroConfig) {
    this.clientId = config?.clientId || process.env.MIRO_CLIENT_ID || '3458764685921914585';
    this.clientSecret = config?.clientSecret || process.env.MIRO_CLIENT_SECRET || 'PcBeQohwuS1x2ngnroQU6QenjdTt8rgk';
    this.redirectUrl = config?.redirectUrl || process.env.MIRO_REDIRECT_URL || 'http://localhost:3000/api/miro/oauth/callback';
  }

  public getAccessToken(): string | null {
    return getStoredMiroToken();
  }

  public isConfigured(): boolean {
    const token = this.getAccessToken();
    return Boolean(token && token.trim().length > 0);
  }

  public getOAuthAuthorizeUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
    });
    if (state) {
      params.append('state', state);
    }
    return `https://miro.com/oauth/authorize?${params.toString()}`;
  }

  public async exchangeCodeForToken(code: string): Promise<MiroTokenData> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUrl,
    });

    const res = await fetch(this.oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Miro OAuth token exchange failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    saveMiroToken(data);
    return data;
  }

  private async request(endpoint: string, options: RequestInit = {}, retries = 3): Promise<any> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('MIRO_AUTHENTICATION_REQUIRED: No Miro access token found. Please connect your Miro account.');
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 429 && retries > 0) {
        // Rate limited, wait and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || '2', 10);
        console.warn(`Miro API 429 Rate Limit hit. Retrying in ${retryAfter}s...`);
        await new Promise(r => setTimeout(r, retryAfter * 1000 + 200));
        return this.request(endpoint, options, retries - 1);
      }

      if (response.status === 401) {
        throw new Error('MIRO_TOKEN_EXPIRED: The Miro OAuth session has expired or is invalid. Please reconnect Miro.');
      }

      if (response.status === 403) {
        throw new Error('MIRO_PERMISSION_DENIED: Missing boards:write permission. Please re-authorize the app with write permissions.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `Miro API error (${response.status})`;
        try {
          const parsed = JSON.parse(errorText);
          errorMsg = parsed.message || parsed.error || errorMsg;
        } catch {
          errorMsg += `: ${errorText}`;
        }
        throw new Error(errorMsg);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (err: any) {
      // Sanitize any accidental secret leakage
      if (err.message && (err.message.includes(this.clientSecret) || (token && err.message.includes(token)))) {
        throw new Error('Miro API communication failed. Sensitive token suppressed.');
      }
      throw err;
    }
  }

  public async fetchBoard(boardId: string): Promise<any> {
    return this.request(`/boards/${encodeURIComponent(boardId)}`);
  }

  public async fetchBoards(): Promise<any[]> {
    const data = await this.request('/boards?limit=20');
    return data.data || [];
  }

  public async fetchBoardItems(boardId: string, limit = 50): Promise<any[]> {
    const data = await this.request(`/boards/${encodeURIComponent(boardId)}/items?limit=${limit}`);
    return data.data || [];
  }

  public async getFrames(boardId: string): Promise<any[]> {
    const data = await this.request(`/boards/${encodeURIComponent(boardId)}/items?type=frame&limit=50`);
    return data.data || [];
  }

  public async createFrame(boardId: string, options: {
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<any> {
    return this.request(`/boards/${encodeURIComponent(boardId)}/frames`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          title: options.title,
        },
        geometry: {
          width: options.width,
          height: options.height,
        },
        position: {
          x: options.x,
          y: options.y,
        },
      }),
    });
  }

  public async createStickyNote(boardId: string, options: {
    content: string;
    x: number;
    y: number;
    color?: string;
    parentId?: string;
  }): Promise<any> {
    // Miro accepted colors: gray, light_yellow, yellow, orange, light_green, green, dark_green, cyan, light_pink, pink, violet, red, light_blue, blue, dark_blue, black
    const payload: any = {
      data: {
        content: `<p>${options.content}</p>`,
        shape: 'square',
      },
      style: {
        fillColor: options.color || 'yellow',
        textAlign: 'left',
        textAlignVertical: 'top',
      },
      position: {
        x: options.x,
        y: options.y,
      },
    };

    if (options.parentId) {
      payload.parent = { id: options.parentId };
    }

    return this.request(`/boards/${encodeURIComponent(boardId)}/sticky_notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async createText(boardId: string, options: {
    content: string;
    x: number;
    y: number;
    width?: number;
    parentId?: string;
  }): Promise<any> {
    const payload: any = {
      data: {
        content: options.content.startsWith('<p>') || options.content.startsWith('<h1>') || options.content.startsWith('<h3>') 
          ? options.content 
          : `<p>${options.content}</p>`,
      },
      position: {
        x: options.x,
        y: options.y,
      },
    };

    if (options.width) {
      payload.geometry = { width: options.width };
    }

    if (options.parentId) {
      payload.parent = { id: options.parentId };
    }

    return this.request(`/boards/${encodeURIComponent(boardId)}/texts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async createShape(boardId: string, options: {
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    shape?: string; // rectangle, round_rectangle, circle, etc.
    fillColor?: string;
    textColor?: string;
    borderColor?: string;
    parentId?: string;
  }): Promise<any> {
    const payload: any = {
      data: {
        content: `<p>${options.content}</p>`,
        shape: options.shape || 'round_rectangle',
      },
      style: {
        fillColor: options.fillColor || '#1E1B4B',
        borderColor: options.borderColor || '#6366F1',
        borderWidth: 2,
        color: options.textColor || '#FFFFFF',
        textAlign: 'center',
        textAlignVertical: 'middle',
      },
      geometry: {
        width: options.width,
        height: options.height,
      },
      position: {
        x: options.x,
        y: options.y,
      },
    };

    if (options.parentId) {
      payload.parent = { id: options.parentId };
    }

    return this.request(`/boards/${encodeURIComponent(boardId)}/shapes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async createConnector(boardId: string, options: {
    startItemId: string;
    endItemId: string;
    caption?: string;
    strokeColor?: string;
  }): Promise<any> {
    const payload: any = {
      startItem: {
        id: options.startItemId,
        snapTo: 'auto',
      },
      endItem: {
        id: options.endItemId,
        snapTo: 'auto',
      },
      style: {
        strokeColor: options.strokeColor || '#6366F1',
        strokeWidth: 2,
        startStrokeCap: 'none',
        endStrokeCap: 'stealth',
      },
    };

    if (options.caption) {
      payload.captions = [{ content: options.caption }];
    }

    return this.request(`/boards/${encodeURIComponent(boardId)}/connectors`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async deleteItem(boardId: string, itemId: string): Promise<any> {
    return this.request(`/boards/${encodeURIComponent(boardId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    });
  }
}

export const miroClient = new MiroClient();
