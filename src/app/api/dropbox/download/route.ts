import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// Download file from Dropbox
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  try {
    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Dropbox-API-Arg': JSON.stringify({ path }),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Download failed: ${error}` }, { status: response.status });
    }

    const fileBuffer = await response.arrayBuffer();
    const apiResult = response.headers.get('dropbox-api-result');
    
    let filename = path.split('/').pop() || 'download';
    let contentType = 'application/octet-stream';
    
    if (apiResult) {
      try {
        const metadata = JSON.parse(apiResult);
        filename = metadata.name || filename;
      } catch (e) {}
    }

    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'json': 'application/json',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
    };
    
    if (ext && contentTypes[ext]) {
      contentType = contentTypes[ext];
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
