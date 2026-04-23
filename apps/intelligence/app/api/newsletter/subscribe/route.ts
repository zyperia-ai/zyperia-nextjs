/**
 * POST /api/newsletter/subscribe
 * Subscribe to ZYPERIA newsletters
 *
 * Body:
 * {
 *   email: string
 *   themes: string[] // ['crypto'] or ['crypto', 'intelligence'] etc
 *   source: 'crypto_site' | 'intelligence_site' | 'onlinebiz_site'
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   message: string
 *   token?: string
 * }
 */

import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail } from '@zyperia/machine/lib/newsletter-service';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, themes, source } = await request.json();

    // Validation
    if (!email || !Array.isArray(themes) || themes.length === 0) {
      return Response.json(
        { success: false, message: 'Email and at least one theme required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already confirmed
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('status')
      .eq('email', email)
      .single();

    if (existing?.status === 'confirmed') {
      return Response.json(
        {
          success: false,
          message: 'Already subscribed! Check your email for the latest newsletter.',
        },
        { status: 409 }
      );
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Upsert subscription
    const { error: upsertError } = await supabase.from('newsletter_subscriptions').upsert({
      email,
      crypto: themes.includes('crypto'),
      intelligence: themes.includes('intelligence'),
      onlinebiz: themes.includes('onlinebiz'),
      status: 'pending',
      confirmation_token: confirmationToken,
      confirmation_sent_at: new Date().toISOString(),
      source,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
    });

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      throw new Error(`Database error: ${upsertError.message}`);
    }

    // Send confirmation email via Resend (fast, transactional)
    const emailResult = await sendConfirmationEmail(email, themes, confirmationToken);

    if (!emailResult.success) {
      console.error('Email send error:', emailResult.error);
      // Still return success to user (email will be retried)
      return Response.json({
        success: true,
        message: 'Subscription registered. Check your email to confirm (may take a moment).',
        token: confirmationToken, // For testing
      });
    }

    // Log the subscription attempt
    await supabase.from('generation_logs').insert({
      app_id: source?.split('_')[0] || 'unknown',
      stage: 'newsletter_subscribe',
      status: 'success',
      duration_seconds: 1,
      ai_model_used: 'resend',
      cost_usd: 0.01, // Resend cost per email
    });

    return Response.json({
      success: true,
      message: '✓ Check your email to confirm your subscriptions!',
      token: confirmationToken, // Include for testing/debugging
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);

    await supabase.from('generation_logs').insert({
      stage: 'newsletter_subscribe',
      status: 'failed',
      duration_seconds: 1,
      error_message: String(error),
    });

    return Response.json(
      {
        success: false,
        message: 'Error processing subscription. Please try again.',
      },
      { status: 500 }
    );
  }
}
