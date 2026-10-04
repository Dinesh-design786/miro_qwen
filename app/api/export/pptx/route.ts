import { NextRequest, NextResponse } from 'next/server';
import { generatePptxFile } from '@/services/export/serverPptxGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPitch = body.pitch || body.deck || body;

    if (!rawPitch || typeof rawPitch !== 'object') {
      return NextResponse.json(
        { success: false, error: 'A valid pitch object is required for PPT generation.' },
        { status: 400 }
      );
    }

    const result = await generatePptxFile(rawPitch);

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      slideCount: result.slideCount,
      sizeBytes: result.sizeBytes,
      downloadUrl: `/api/export/pptx/download/${encodeURIComponent(result.fileName)}`,
    });
  } catch (error: any) {
    console.error('PPT generation endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'PPT generation failed' },
      { status: 500 }
    );
  }
}
