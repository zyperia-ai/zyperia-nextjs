/**
 * GET /api/newsletter/confirm?token=xxx
 * Confirm email subscription (from confirmation email link)
 *
 * Response: Redirects to /newsletter-confirmed page
 */

import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/newsletter-error?reason=invalid_token`,
        302
      );
    }

    // Find pending subscription with this token
    const { data: subscription, error: findError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, email, crypto, intelligence, onlinebiz')
      .eq('confirmation_token', token)
      .eq('status', 'pending')
      .single();

    if (findError || !subscription) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/newsletter-error?reason=invalid_token`,
        302
      );
    }

    // Confirm subscription
    const { error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // Clear token for security
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/newsletter-error?reason=update_failed`,
        302
      );
    }

    // Log confirmation
    const themesConfirmed = [
      subscription.crypto ? 'Crypto' : '',
      subscription.intelligence ? 'Intelligence' : '',
      subscription.onlinebiz ? 'OnlineBiz' : '',
    ]
      .filter(Boolean)
      .join(', ');

    // Log success (non-blocking)
    void supabase.from('generation_logs').insert({
      stage: 'newsletter_confirm',
      status: 'success',
      duration_seconds: 1,
      ai_model_used: 'supabase',
    });

    // Redirect to success page with email for display
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/newsletter-confirmed?email=${encodeURIComponent(subscription.email)}&themes=${encodeURIComponent(themesConfirmed)}`,
      302
    );
  } catch (error) {
    console.error('Newsletter confirm error:', error);

    // Log error (non-blocking)
    void supabase.from('generation_logs').insert({
      stage: 'newsletter_confirm',
      status: 'failed',
      duration_seconds: 1,
      error_message: String(error),
    });

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/newsletter-error?reason=server_error`,
      302
    );
  }
}
