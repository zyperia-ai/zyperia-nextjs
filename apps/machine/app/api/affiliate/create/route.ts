/**
 * POST /api/affiliate/create
 * Create affiliate links for an article
 *
 * Body:
 * {
 *   post_id: string (UUID of blog_posts)
 *   platform_ids?: string[] (specific platform UUIDs, or all if omitted)
 *   platforms?: string[] (platform names, e.g., ["Kraken", "Zapier"])
 *   placement: "inline" | "comparison_table" | "recommended_section" | "footer"
 *   context?: string (e.g., "for beginners", "advanced trading")
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   message: string
 *   links?: Array<{
 *     id: string
 *     tracking_id: string
 *     platform_name: string
 *     platform_id: string
 *     tracking_url: string
 *   }>
 *   error?: string
 * }
 */

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const {
      post_id,
      platform_ids,
      platforms,
      placement = 'inline',
      context = '',
    } = await request.json();

    if (!post_id) {
      return Response.json(
        { success: false, error: 'post_id is required' },
        { status: 400 }
      );
    }

    if (!placement || !['inline', 'comparison_table', 'recommended_section', 'footer'].includes(placement)) {
      return Response.json(
        { success: false, error: 'Invalid placement' },
        { status: 400 }
      );
    }

    // Get platform IDs
    let platformsToLink: string[] = platform_ids || [];

    if (platforms && platforms.length > 0) {
      const { data: platformData, error: platformError } = await supabase
        .from('affiliate_platforms')
        .select('id')
        .in('name', platforms)
        .eq('is_active', true);

      if (platformError) {
        console.error('Platform lookup error:', platformError);
        return Response.json(
          { success: false, error: 'Failed to find platforms' },
          { status: 500 }
        );
      }

      platformsToLink = platformData?.map((p) => p.id) || [];
    }

    if (platformsToLink.length === 0) {
      return Response.json(
        { success: false, error: 'No platforms specified or found' },
        { status: 400 }
      );
    }

    // Check if article exists
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, title')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return Response.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Create affiliate links for each platform
    const affiliateLinks = platformsToLink.map((platform_id) => {
      const trackingId = `aff_${post_id.substring(0, 8)}_${platform_id.substring(0, 8)}_${crypto.randomBytes(4).toString('hex')}`;

      return {
        post_id,
        platform_id,
        tracking_id: trackingId,
        placement,
        context: context || null,
      };
    });

    const { data: createdLinks, error: linkError } = await supabase
      .from('affiliate_links')
      .insert(affiliateLinks)
      .select(
        `
        id,
        tracking_id,
        platform_id,
        affiliate_platforms (name)
      `
      );

    if (linkError) {
      console.error('Link creation error:', linkError);
      return Response.json(
        { success: false, error: 'Failed to create affiliate links' },
        { status: 500 }
      );
    }

    // Format response
    const links = createdLinks?.map((link) => ({
      id: link.id,
      tracking_id: link.tracking_id,
      platform_name: (link.affiliate_platforms as any)?.name || 'Unknown',
      platform_id: link.platform_id,
      tracking_url: `/api/affiliate/click?id=${link.tracking_id}`,
    })) || [];

    return Response.json({
      success: true,
      message: `Created ${links.length} affiliate links for: ${post.title}`,
      links,
    });
  } catch (error) {
    console.error('Affiliate creation error:', error);
    return Response.json(
      { success: false, error: 'Failed to create affiliate links' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/affiliate/create?post_id=xxx&platforms=Kraken,Zapier
 * Get or create affiliate links for an article
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const platformsParam = searchParams.get('platforms');

    if (!postId) {
      return Response.json(
        { success: false, error: 'post_id is required' },
        { status: 400 }
      );
    }

    // Check existing links for this post
    const { data: existingLinks, error: existError } = await supabase
      .from('affiliate_links')
      .select(
        `
        id,
        tracking_id,
        platform_id,
        placement,
        affiliate_platforms (name)
      `
      )
      .eq('post_id', postId);

    if (existError) {
      console.error('Link lookup error:', existError);
      return Response.json(
        { success: false, error: 'Failed to look up affiliate links' },
        { status: 500 }
      );
    }

    // If links exist, return them
    if (existingLinks && existingLinks.length > 0) {
      const links = existingLinks.map((link) => ({
        id: link.id,
        tracking_id: link.tracking_id,
        platform_name: (link.affiliate_platforms as any)?.name || 'Unknown',
        platform_id: link.platform_id,
        placement: link.placement,
        tracking_url: `/api/affiliate/click?id=${link.tracking_id}`,
      }));

      return Response.json({
        success: true,
        message: 'Retrieved existing affiliate links',
        links,
      });
    }

    // If not, and platforms specified, create them
    if (platformsParam) {
      const platforms = platformsParam.split(',').map((p) => p.trim());

      const body = JSON.stringify({
        post_id: postId,
        platforms,
        placement: 'inline',
      });

      const createReq = new Request(request.url.split('?')[0], {
        method: 'POST',
        headers: request.headers,
        body,
      });

      return POST(createReq);
    }

    return Response.json({
      success: true,
      message: 'No affiliate links found for this article',
      links: [],
    });
  } catch (error) {
    console.error('Affiliate GET error:', error);
    return Response.json(
      { success: false, error: 'Failed to retrieve affiliate links' },
      { status: 500 }
    );
  }
}
