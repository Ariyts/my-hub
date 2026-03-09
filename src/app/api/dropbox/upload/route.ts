import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// Upload file to Dropbox
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || '/';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filePath = path === '/' ? `/${file.name}` : `${path}/${file.name}`;
    
    const fileBuffer = await file.arrayBuffer();
    
    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: filePath,
          mode: 'add',
          autorename: true,
          mute: false,
          strict_conflict: false,
        }),
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Upload failed: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      file: {
        id: result.id,
        name: result.name,
        path_display: result.path_display,
        size: result.size,
        server_modified: result.server_modified,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
