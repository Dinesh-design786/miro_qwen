import { NextRequest, NextResponse } from 'next/server';
import { generateSlideVisualPrompt, getSlideImageUrl } from '@/services/media/imageGenerator';
import { Slide } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slide, projectName, customPrompt, seed } = body as {
      slide?: Slide;
      projectName?: string;
      customPrompt?: string;
      seed?: number;
    };

    let prompt = customPrompt;
    if (!prompt && slide) {
      prompt = generateSlideVisualPrompt(slide, projectName);
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Slide or custom prompt is required' },
        { status: 400 }
      );
    }

    const currentSeed = seed || Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${currentSeed}&model=flux`;

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      seed: currentSeed,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
