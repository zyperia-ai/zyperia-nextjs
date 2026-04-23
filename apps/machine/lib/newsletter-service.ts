/**
 * ZYPERIA Newsletter Service
 * Manages: Resend (transactional), SendGrid (bulk), Supabase (data), Beehiiv (optional ads)
 *
 * Cost Breakdown:
 * - Resend: €0.01 per email (confirmations, reminders) = ~€5-10/month
 * - SendGrid: €15/month (unlimited sends for newsletters)
 * - Supabase: Free tier (newsletter_subscriptions table)
 * - Total: €20-25/month for full newsletter system
 *
 * Revenue:
 * - Google AdSense on blogs + newsletter CTR
 * - Affiliate links in articles + newsletters
 * - Optional Beehiiv ads in newsletters (€0 if they get 30% commission on ads)
 */

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
export interface NewsletterSubscriber {
  email: string;
  crypto: boolean;
  intelligence: boolean;
  onlinebiz: boolean;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  source: 'crypto_site' | 'intelligence_site' | 'onlinebiz_site';
  confirmationToken?: string;
}

export interface SendGridEmail {
  to: string;
  subject: string;
  htmlContent: string;
  from: string;
  fromName: string;
  categories?: string[];
  customArgs?: Record<string, string>;
}

/**
 * STEP 1: Send Confirmation Email via Resend (transactional)
 * Fast, cheap, tracked
 */
export async function sendConfirmationEmail(
  email: string,
  themes: string[],
  confirmationToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${confirmationToken}`;

    const themeLabels: Record<string, string> = {
      crypto: '🔐 Crypto & Blockchain',
      intelligence: '🧠 AI & Business Automation',
      onlinebiz: '💰 Earn Money Online',
    };

    const themesHtml = themes
      .map((t) => `<li style="margin: 8px 0;">${themeLabels[t] || t}</li>`)
      .join('');

    const htmlContent = `
      <div style="font-family: 'Syne', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0a0520; font-size: 28px; margin-bottom: 16px;">
          Welcome to ZYPERIA! 🎉
        </h2>

        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thanks for signing up. Please confirm your newsletter subscriptions:
        </p>

        <ul style="color: #333; font-size: 15px; list-style: none; padding: 0; margin: 24px 0;">
          ${themesHtml}
        </ul>

        <div style="margin: 32px 0; text-align: center;">
          <a href="${confirmUrl}"
             style="background: linear-gradient(135deg, #7C6FF7 0%, #00C9A7 100%);
                    color: white;
                    padding: 14px 32px;
                    border-radius: 8px;
                    text-decoration: none;
                    display: inline-block;
                    font-weight: bold;
                    font-size: 16px;">
            CONFIRM SUBSCRIPTIONS
          </a>
        </div>

        <p style="color: #666; font-size: 13px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
          If you didn't sign up for ZYPERIA newsletters, you can safely ignore this email.
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 16px;">
          © 2026 ZYPERIA. All rights reserved.<br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}"
             style="color: #999; text-decoration: none;">
            Unsubscribe from all
          </a>
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'ZYPERIA <noreply@zyperia.ai>',
      to: email,
      subject: '✓ Confirm your ZYPERIA newsletter subscriptions',
      html: htmlContent,
    });

    return {
      success: !result.error,
      messageId: result.data?.id,
      error: result.error?.message,
    };
  } catch (error) {
    console.error('Confirmation email error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * STEP 2: Send Reminder Email (24h after signup if not confirmed)
 */
export async function sendReminderEmail(
  email: string,
  confirmationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${confirmationToken}`;

    const htmlContent = `
      <div style="font-family: 'Syne', sans-serif; max-width: 600px; margin: 0 auto;">
        <h3 style="color: #0a0520; font-size: 20px; margin-bottom: 16px;">
          Don't miss out! 📧
        </h3>

        <p style="color: #333; font-size: 15px; line-height: 1.6;">
          We noticed you started subscribing but haven't confirmed yet.
        </p>

        <p style="color: #333; font-size: 15px; line-height: 1.6;">
          Click below to confirm and get weekly insights delivered to your inbox:
        </p>

        <div style="margin: 24px 0; text-align: center;">
          <a href="${confirmUrl}"
             style="background: #7C6FF7;
                    color: white;
                    padding: 12px 28px;
                    border-radius: 6px;
                    text-decoration: none;
                    display: inline-block;
                    font-weight: bold;">
            Confirm Now
          </a>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          © 2026 ZYPERIA
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'ZYPERIA <noreply@zyperia.ai>',
      to: email,
      subject: 'Confirm your ZYPERIA subscriptions',
      html: htmlContent,
    });

    return {
      success: !result.error,
      error: result.error?.message,
    };
  } catch (error) {
    console.error('Reminder email error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * STEP 3: Send Newsletter via SendGrid (bulk, for monetization)
 *
 * Newsletter structure:
 * 1. Header (branded)
 * 2. Featured article + summary
 * 3. 3-5 more articles
 * 4. [OPTIONAL] Sponsored section (monetization)
 * 5. Affiliate call-out
 * 6. Footer (unsubscribe, social)
 */
export async function sendNewsletter(
  theme: 'crypto' | 'intelligence' | 'onlinebiz',
  articles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    heroImageUrl?: string;
    affiliateLink?: string;
  }>,
  options?: {
    sponsoredContent?: { title: string; description: string; cta_url: string; cta_text: string };
    customContent?: string;
  }
) {
  try {
    // Get all confirmed subscribers for this theme
    const { data: subscribers, error: subscribeError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq(theme, true)
      .eq('status', 'confirmed');

    if (subscribeError || !subscribers) {
      throw new Error(`Failed to fetch subscribers: ${subscribeError?.message}`);
    }

    console.log(`Newsletter: ${theme}, Recipients: ${subscribers.length}`);

    // Build email content
    const themeLabels: Record<string, { name: string; color: string; icon: string }> = {
      crypto: { name: 'Crypto & Blockchain', color: '#7C6FF7', icon: '🔐' },
      intelligence: { name: 'AI & Business Automation', color: '#7C6FF7', icon: '🧠' },
      onlinebiz: { name: 'Earn Money Online', color: '#7C6FF7', icon: '💰' },
    };

    const themeInfo = themeLabels[theme];
    const blogUrl = `https://${theme}.zyperia.ai`;

    const articleHtml = articles
      .map(
        (article, idx) => `
      <div style="margin-bottom: 32px; ${idx === 0 ? 'border-bottom: 3px solid #eee; padding-bottom: 24px;' : ''}">
        ${article.heroImageUrl ? `<img src="${article.heroImageUrl}" alt="${article.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;" />` : ''}

        <h3 style="color: #0a0520; font-size: ${idx === 0 ? '24px' : '18px'}; margin: 16px 0 8px 0;">
          ${article.title}
        </h3>

        <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
          ${article.excerpt}
        </p>

        <a href="${blogUrl}/${article.slug}"
           style="color: ${themeInfo.color}; text-decoration: none; font-weight: bold; font-size: 14px;">
          Read More →
        </a>

        ${article.affiliateLink ? `<p style="margin-top: 8px;"><a href="${article.affiliateLink}" style="color: #00C9A7; font-size: 13px; text-decoration: none;">Recommended: ${article.title}</a></p>` : ''}
      </div>
    `
      )
      .join('');

    const sponsoredHtml = options?.sponsoredContent
      ? `
        <div style="background: #F5F5F5; border-left: 4px solid ${themeInfo.color}; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="color: #999; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">Sponsored</p>
          <h4 style="color: #0a0520; margin: 0 0 8px 0;">${options.sponsoredContent.title}</h4>
          <p style="color: #555; font-size: 14px; margin: 0 0 12px 0;">${options.sponsoredContent.description}</p>
          <a href="${options.sponsoredContent.cta_url}"
             style="background: ${themeInfo.color}; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 14px; display: inline-block;">
            ${options.sponsoredContent.cta_text}
          </a>
        </div>
      `
      : '';

    const htmlContent = `
      <div style="font-family: 'Syne', sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${themeInfo.color} 0%, #00C9A7 100%); padding: 32px 16px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0 0 8px 0; font-size: 32px;">
            ${themeInfo.icon} ${themeInfo.name}
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
            Weekly insights delivered to your inbox
          </p>
        </div>

        <!-- Main content -->
        <div style="padding: 32px 16px;">
          ${articleHtml}
          ${sponsoredHtml}

          <!-- Affiliate call-out -->
          <div style="background: #F0EFFA; padding: 16px; border-radius: 6px; margin: 24px 0; text-align: center;">
            <p style="color: #0a0520; font-size: 14px; margin: 0;">
              <strong>💡 Pro Tip:</strong> We include affiliate links to products we genuinely use and recommend.
              <br/>When you buy through our links, we earn a small commission at no extra cost to you.
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 32px;">
            <p style="color: #666; font-size: 13px; margin: 0 0 12px 0;">
              © 2026 ZYPERIA. All content is educational and for information purposes only.
            </p>

            <p style="color: #999; font-size: 12px; margin: 0;">
              <a href="${blogUrl}/privacy" style="color: #999; text-decoration: none;">Privacy Policy</a> •
              <a href="${blogUrl}/terms" style="color: #999; text-decoration: none;">Terms</a> •
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #999; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </div>
    `;

    // Send via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: subscribers.map((sub) => ({
          to: [{ email: sub.email }],
          custom_args: { theme, subscriber_email: sub.email },
        })),
        from: {
          email: 'newsletter@zyperia.ai',
          name: `ZYPERIA ${themeInfo.name}`,
        },
        subject: `${themeInfo.icon} ${articles[0]?.title || `${themeInfo.name} This Week`}`,
        html: htmlContent,
        categories: [theme, 'newsletter', new Date().toISOString().split('T')[0]],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
          subscription_tracking: { enable: true },
        },
      }),
    });

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    // Log newsletter send
    await supabase.from('generation_logs').insert({
      app_id: theme,
      stage: 'newsletter_send',
      status: 'success',
      duration_seconds: 1,
      ai_model_used: 'sendgrid',
      cost_usd: subscribers.length * 0.0001, // Very cheap
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      recipientCount: subscribers.length,
      theme,
    };
  } catch (error) {
    console.error('Newsletter send error:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Get newsletter statistics (opens, clicks, etc.)
 * Requires SendGrid webhook to track events
 */
export async function getNewsletterStats(theme: string, days: number = 7) {
  try {
    const { data: stats } = await supabase
      .from('newsletter_performance')
      .select('*')
      .eq('theme', theme)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (!stats) return null;

    const totals = stats.reduce(
      (acc, stat) => ({
        opens: acc.opens + (stat.opens || 0),
        clicks: acc.clicks + (stat.clicks || 0),
        unsubscribes: acc.unsubscribes + (stat.unsubscribes || 0),
        bounces: acc.bounces + (stat.bounces || 0),
        sendsCount: acc.sendsCount + 1,
      }),
      { opens: 0, clicks: 0, unsubscribes: 0, bounces: 0, sendsCount: 0 }
    );

    return {
      ...totals,
      openRate: (totals.opens / (stats.length * 1000)) * 100, // Rough estimate
      clickRate: (totals.clicks / totals.opens) * 100,
    };
  } catch (error) {
    console.error('Stats error:', error);
    return null;
  }
}

export async function getSubscriberCount(theme: string) {
  const { count } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq(theme, true)
    .eq('status', 'confirmed');

  return count || 0;
}
