import { NextRequest, NextResponse } from 'next/server';
import { getProgramsByCategory } from '@zyperia/shared-lib';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('article_id');
    const category = searchParams.get('category') || 'earning';

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: 'Missing article_id' },
        { status: 400 }
      );
    }

    const programs = getProgramsByCategory(category);

    const links = programs.map((program) => ({
      id: `${articleId}:${program.id}`,
      article_id: articleId,
      program_id: program.id,
      program_name: program.name,
      commission_rate: program.commission_rate,
      url: program.url,
      clicks: Math.floor(Math.random() * 100),
      conversions: Math.floor(Math.random() * 10),
    }));

    return NextResponse.json(
      { success: true, data: links },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get affiliate links error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch affiliate links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, program_id, custom_url, label } = body;

    if (!article_id || !program_id) {
      return NextResponse.json(
        { success: false, message: 'article_id and program_id required' },
        { status: 400 }
      );
    }

    console.log('Create affiliate link:', {
      article_id,
      program_id,
      custom_url,
      label,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Affiliate link created',
        link_id: `${article_id}:${program_id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create affiliate link error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create affiliate link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('link_id');

    if (!linkId) {
      return NextResponse.json(
        { success: false, message: 'Missing link_id' },
        { status: 400 }
      );
    }

    console.log('Delete affiliate link:', linkId);

    return NextResponse.json(
      { success: true, message: 'Affiliate link deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete affiliate link error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete affiliate link' },
      { status: 500 }
    );
  }
}
