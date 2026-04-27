/**
 * Email Notifications System
 * Sends alerts for pipeline status, errors, and opportunities
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface NotificationPayload {
  type: 'success' | 'warning' | 'error' | 'opportunity';
  subject: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Send daily pipeline summary email
 */
export async function sendDailyPipelineSummary(email: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get stats
    const { count: publishedToday } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .gte('published_at', `${today}T00:00:00`);

    const { data: logs } = await supabase
      .from('generation_logs')
      .select('status, stage')
      .gte('created_at', `${today}T00:00:00`);

    const failedCount = logs?.filter((l: any) => l.status === 'failed').length || 0;
    const successCount = logs?.filter((l: any) => l.status === 'success').length || 0;

    const htmlBody = `
      <h2>📊 Daily Pipeline Summary - ${today}</h2>

      <h3>✅ Success Metrics</h3>
      <ul>
        <li><strong>Articles Published:</strong> ${publishedToday || 0}</li>
        <li><strong>Successful Stages:</strong> ${successCount}</li>
        <li><strong>Failed Stages:</strong> ${failedCount}</li>
      </ul>

      ${failedCount > 0 ? `
        <h3>⚠️ Issues Detected</h3>
        <p>There were ${failedCount} failed stages today. Check the dashboard for details.</p>
      ` : `
        <h3>🎉 All Systems Operational</h3>
        <p>Pipeline ran smoothly with no failures.</p>
      `}

      <h3>📈 Next Steps</h3>
      <p><a href="https://crypto.zyperia.ai/api/pipeline-status">View Pipeline Status</a></p>
      <p><a href="https://crypto.zyperia.ai/api/admin/dashboard?token=YOUR_TOKEN">View Analytics Dashboard</a></p>
    `;

    await sendEmail({
      to: email,
      subject: `📊 Daily Pipeline Summary - ${publishedToday || 0} articles published`,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Error sending daily summary:', error);
  }
}

/**
 * Send alert for critical errors
 */
export async function sendErrorAlert(email: string, stage: string, error: string) {
  try {
    const htmlBody = `
      <h2>🚨 Pipeline Error Alert</h2>

      <p><strong>Stage:</strong> ${stage}</p>
      <p><strong>Error:</strong> ${error}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>

      <h3>Actions to Take</h3>
      <ol>
        <li>Check the <a href="https://vercel.com/dashboard">Vercel dashboard</a> for function logs</li>
        <li>Verify environment variables are set</li>
        <li>Check database connectivity in Supabase</li>
        <li>Review generation_logs table for details</li>
      </ol>

      <p>If this persists, check the <a href="https://crypto.zyperia.ai/api/pipeline-status">pipeline status API</a>.</p>
    `;

    await sendEmail({
      to: email,
      subject: `🚨 Pipeline Error: ${stage}`,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Error sending error alert:', error);
  }
}

/**
 * Send opportunity notification (top articles, trends, etc)
 */
export async function sendOpportunityAlert(email: string, opportunity: string, details: any) {
  try {
    const htmlBody = `
      <h2>💡 Content Opportunity Detected</h2>

      <p><strong>${opportunity}</strong></p>

      <h3>Details</h3>
      <ul>
        ${Object.entries(details)
          .map(([key, value]: [string, any]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join('')}
      </ul>

      <h3>Recommendation</h3>
      <p>Consider creating additional content around this opportunity to capture more traffic.</p>
    `;

    await sendEmail({
      to: email,
      subject: `💡 Content Opportunity: ${opportunity}`,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Error sending opportunity alert:', error);
  }
}

/**
 * Send weekly performance report
 */
export async function sendWeeklyReport(email: string) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get stats
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('app_id, views, engagement_score, generation_approach')
      .eq('status', 'published')
      .gte('published_at', weekAgo.toISOString());

    const { data: performance } = await supabase
      .from('blog_performance')
      .select('*')
      .gte('date', weekAgo.toISOString().split('T')[0]);

    const totalViews = performance?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0;
    const totalAffiliateClicks = performance?.reduce((sum: number, p: any) => sum + (p.affiliate_clicks || 0), 0) || 0;
    const totalAdSenseRevenue = performance?.reduce((sum: number, p: any) => sum + (p.adsense_revenue || 0), 0) || 0;

    // Top performers
    const topArticles = articles
      ?.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 5) || [];

    const htmlBody = `
      <h2>📈 Weekly Performance Report</h2>

      <p><strong>Period:</strong> ${weekAgo.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}</p>

      <h3>📊 Overview</h3>
      <ul>
        <li><strong>Total Views:</strong> ${totalViews.toLocaleString()}</li>
        <li><strong>Affiliate Clicks:</strong> ${totalAffiliateClicks}</li>
        <li><strong>AdSense Revenue:</strong> €${totalAdSenseRevenue.toFixed(2)}</li>
        <li><strong>Articles Published:</strong> ${articles?.length || 0}</li>
      </ul>

      <h3>🏆 Top 5 Performers</h3>
      <ol>
        ${topArticles.map((a: any) => `<li>${a.views || 0} views</li>`).join('')}
      </ol>

      <h3>💡 Insights</h3>
      <ul>
        ${articles && articles.length > 0 ? `
          <li>Average views per article: ${Math.round(totalViews / articles.length)}</li>
          <li>Most popular approach: ${getMostPopularApproach(articles)}</li>
        ` : `
          <li>No data available for this week</li>
        `}
      </ul>

      <p><a href="https://crypto.zyperia.ai/api/admin/dashboard?token=YOUR_TOKEN">View Full Dashboard</a></p>
    `;

    await sendEmail({
      to: email,
      subject: `📈 Weekly Report - ${totalViews.toLocaleString()} views`,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Error sending weekly report:', error);
  }
}

/**
 * Generic email sender using Resend
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not set - email not sent');
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'notifications@zyperia.ai',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`);
    }

    console.log(`✓ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

function getMostPopularApproach(articles: any[]): string {
  const approaches: Record<string, number> = {};
  articles.forEach((a: any) => {
    const approach = a.generation_approach || 'unknown';
    approaches[approach] = (approaches[approach] || 0) + (a.views || 0);
  });

  let topApproach = 'original';
  let topViews = 0;
  Object.entries(approaches).forEach(([approach, views]: [string, number]) => {
    if (views > topViews) {
      topApproach = approach;
      topViews = views;
    }
  });

  return topApproach;
}

export async function sendCircuitBreakerAlert({
  consecutive_rejections,
  threshold,
}: {
  consecutive_rejections: number
  threshold: number
}) {
  const ownerEmail = process.env.OWNER_EMAIL || 'luis@zyperia.ai'

  const htmlBody = `
    <h2>🔴 Circuit Breaker Aberto — Pipeline Pausado</h2>

    <p>O pipeline de publicação automática foi pausado porque detectou <strong>${consecutive_rejections} rejeições consecutivas</strong> (threshold: ${threshold}).</p>

    <h3>O que aconteceu</h3>
    <p>Os últimos ${consecutive_rejections} artigos gerados falharam as verificações de qualidade (Camadas 1-4). Para proteger a qualidade editorial, o pipeline foi suspenso automaticamente.</p>

    <h3>Próximos passos</h3>
    <ol>
      <li>Verifica a tabela <code>rejected_articles</code> no Supabase para perceber os motivos de rejeição.</li>
      <li>Verifica os logs em <code>generation_logs</code> com status <code>rejected</code>.</li>
      <li>Se o problema for nos prompts ou na qualidade do conteúdo, ajusta o <code>theme-config.json</code>.</li>
      <li>O pipeline retoma automaticamente quando a contagem de rejeições consecutivas for interrompida por um sucesso.</li>
    </ol>

    <p><strong>Hora:</strong> ${new Date().toISOString()}</p>
  `

  await sendEmail({
    to: ownerEmail,
    subject: `🔴 Circuit Breaker Aberto — ${consecutive_rejections} rejeições consecutivas`,
    html: htmlBody,
  })
}
