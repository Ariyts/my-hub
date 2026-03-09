import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// Delete file or folder from Dropbox
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const response = await fetch('https://api.dropboxapi.com/2/files/delete_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Delete failed: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      deleted: {
        id: result.metadata?.id,
        name: result.metadata?.name,
        path_display: result.metadata?.path_display,
      },
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
