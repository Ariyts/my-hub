import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// List files in a folder
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '';

  try {
    const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path || '',
        recursive: false,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Dropbox API error: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Sort: folders first, then files, alphabetically
    const entries = data.entries.sort((a: any, b: any) => {
      if (a['.tag'] !== b['.tag']) {
        return a['.tag'] === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      entries,
      cursor: data.cursor,
      has_more: data.has_more,
    });
  } catch (error) {
    console.error('Dropbox list error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
