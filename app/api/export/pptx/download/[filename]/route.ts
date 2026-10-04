import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const rawFilename = params.filename;
    const sanitizedFilename = path.basename(decodeURIComponent(rawFilename));

    if (!sanitizedFilename.endsWith('.pptx')) {
      return new NextResponse('Invalid file request', { status: 400 });
    }

    const generatedDir = path.join(process.cwd(), 'generated');
    const filePath = path.join(generatedDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Error downloading PPTX file:', error);
    return new NextResponse('Error reading file', { status: 500 });
  }
}
