import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// Create a new folder in Dropbox
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, name } = body;

    if (!path || !name) {
      return NextResponse.json({ error: 'Path and name are required' }, { status: 400 });
    }

    const folderPath = path === '/' ? `/${name}` : `${path}/${name}`;

    const response = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: folderPath,
        autorename: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Create folder failed: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      folder: {
        id: result.metadata.id,
        name: result.metadata.name,
        path_display: result.metadata.path_display,
      },
    });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
