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

    if (!sanitizedFilename.endsWith('.mp4')) {
      return new NextResponse('Invalid video request', { status: 400 });
    }

    const generatedDir = path.join(process.cwd(), 'generated');
    const filePath = path.join(generatedDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Video file not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = fs.createReadStream(filePath, { start, end });
      // Stream to Web ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => controller.error(err));
        },
      });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    } else {
      const fileBuffer = fs.readFileSync(filePath);
      const isDownload = req.nextUrl.searchParams.get('download') === '1';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': fileSize.toString(),
          'Accept-Ranges': 'bytes',
          ...(isDownload ? { 'Content-Disposition': `attachment; filename="${sanitizedFilename}"` } : {}),
        },
      });
    }
  } catch (error: any) {
    console.error('Error serving video file:', error);
    return new NextResponse('Error serving video', { status: 500 });
  }
}
