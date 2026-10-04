export interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface QwenChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' };
}

export class QwenClient {
  private apiKey: string | undefined;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.QWEN_API_KEY;
    this.model = process.env.QWEN_MODEL || 'qwen-max';
    this.baseUrl = (process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/+$/, '');
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getModelName(): string {
    return this.model;
  }

  public async chatCompletion(
    messages: QwenMessage[], 
    options?: QwenChatOptions
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('QWEN_API_KEY_NOT_CONFIGURED');
    }

    const targetModel = options?.model || this.model;
    const body: Record<string, any> = {
      model: targetModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 3000,
    };

    if (options?.responseFormat?.type === 'json_object') {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Qwen API returned error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response received from Qwen API');
    }

    return content;
  }

  public async chatCompletionJson<T>(
    messages: QwenMessage[],
    options?: QwenChatOptions
  ): Promise<T> {
    const rawContent = await this.chatCompletion(messages, {
      ...options,
      responseFormat: { type: 'json_object' },
    });

    try {
      // Find JSON block if wrapped in markdown code fence
      const cleanJson = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      return JSON.parse(cleanJson) as T;
    } catch (parseError: any) {
      console.error('Failed to parse Qwen JSON response:', rawContent);
      throw new Error(`Invalid JSON returned by Qwen: ${parseError.message}`);
    }
  }
}

export const qwenClient = new QwenClient();
