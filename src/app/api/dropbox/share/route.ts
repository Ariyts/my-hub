import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN || 'd8y865kx40dqriq';

// Create shared link for a file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    const response = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        settings: {
          access: 'viewer',
          allow_download: true,
          audience: 'public',
          requested_visibility: 'public',
        },
      }),
    });

    // If link already exists, get existing link
    if (response.status === 409) {
      const listResponse = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path,
          direct_only: true,
        }),
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        if (listData.links && listData.links.length > 0) {
          const link = listData.links[0];
          // Convert dl=0 to raw=1 for direct access
          const directUrl = link.url.replace('dl=0', 'raw=1');
          return NextResponse.json({
            success: true,
            url: directUrl,
            existing: true,
          });
        }
      }
      
      return NextResponse.json({ error: 'Failed to get shared link' }, { status: 500 });
    }

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Share failed: ${error}` }, { status: response.status });
    }

    const result = await response.json();
    const directUrl = result.url.replace('dl=0', 'raw=1');
    
    return NextResponse.json({
      success: true,
      url: directUrl,
      existing: false,
    });
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json({ error: 'Failed to create shared link' }, { status: 500 });
  }
}

// Get thumbnail for an image
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  try {
    const response = await fetch('https://content.dropboxapi.com/2/files/get_thumbnail_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          resource: { '.tag': 'path', path },
          format: 'jpeg',
          size: 'w640h480',
          quality: 'quality_80',
        }),
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to get thumbnail' }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Thumbnail error:', error);
    return NextResponse.json({ error: 'Failed to get thumbnail' }, { status: 500 });
  }
}
