import { NextRequest, NextResponse } from 'next/server';
import { generatePitchVideo } from '@/services/export/serverVideoGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPitch = body.pitch || body.deck || body;
    const speakerScript = body.speakerScript;

    if (!rawPitch || typeof rawPitch !== 'object') {
      return NextResponse.json(
        { success: false, error: 'A valid pitch object is required for video generation.' },
        { status: 400 }
      );
    }

    const result = await generatePitchVideo(rawPitch, speakerScript);

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      videoUrl: result.videoUrl,
      durationSeconds: result.durationSeconds,
      sizeBytes: result.sizeBytes,
      slideCount: result.slideCount,
    });
  } catch (error: any) {
    console.error('Video generation endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Video generation failed' },
      { status: 500 }
    );
  }
}
