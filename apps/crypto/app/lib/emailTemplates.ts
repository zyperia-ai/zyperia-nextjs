/**
 * Email templates for Resend API
 */

interface EmailTemplate {
  subject: string
  html: string
}

export const emailTemplates = {
  subscriptionConfirmation: (email: string, appName: string): EmailTemplate => ({
    subject: `Welcome to ${appName}! Confirm your subscription`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${appName}!</h1>
              <p>The leading source for ${appName.toLowerCase()} insights</p>
            </div>

            <div class="content">
              <p>Hi,</p>
              <p>Thank you for subscribing to ${appName}! We're excited to have you in our community.</p>
              <p>You'll now receive our latest articles, insights, and updates delivered to your inbox.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://verify.example.com" class="button">Confirm Subscription</a>
              </p>
              <p><strong>What to expect:</strong></p>
              <ul>
                <li>Weekly curated articles on ${appName}</li>
                <li>Exclusive insights from industry experts</li>
                <li>Early access to premium content</li>
                <li>Community discussions and events</li>
              </ul>
            </div>

            <div class="footer">
              <p>You're receiving this email because you subscribed to ${appName}.</p>
              <p><a href="https://unsubscribe.example.com" style="color: #0066ff;">Unsubscribe</a> | <a href="https://preferences.example.com" style="color: #0066ff;">Update preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  weeklyNewsletter: (
    subscriberName: string,
    topArticles: Array<{ title: string; slug: string; views: number }>,
    appName: string
  ): EmailTemplate => ({
    subject: `Your Weekly ${appName} Digest - Top Articles`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .article { padding: 20px; border-left: 4px solid #0066ff; margin: 15px 0; background: #f9f9f9; }
            .article-title { font-size: 18px; font-weight: 600; margin: 0; }
            .article-link { display: inline-block; color: #0066ff; text-decoration: none; font-weight: 600; margin-top: 10px; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Weekly Digest</h1>
              <p>Your top ${appName} articles this week</p>
            </div>

            <div style="padding: 30px;">
              <p>Hi ${subscriberName},</p>
              <p>Here are the top articles from this week that our readers loved:</p>

              ${topArticles
                .map(
                  (article) => `
                <div class="article">
                  <p class="article-title">${article.title}</p>
                  <p style="margin: 8px 0; color: #666; font-size: 14px;">${article.views} views</p>
                  <a href="https://crypto.zyperia.ai/articles/${article.slug}" class="article-link">Read Article →</a>
                </div>
              `
                )
                .join('')}

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <strong>Want more?</strong> Visit our full archive to discover more articles.
              </p>
            </div>

            <div class="footer">
              <p>You're receiving this because you subscribed to our weekly digest.</p>
              <p><a href="https://unsubscribe.example.com" style="color: #0066ff;">Unsubscribe</a> | <a href="https://preferences.example.com" style="color: #0066ff;">Update preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newArticleFromFollowed: (
    subscriberName: string,
    article: { title: string; slug: string; excerpt: string; author: string },
    appName: string
  ): EmailTemplate => ({
    subject: `${article.author} just published: ${article.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .article-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; }
            .author { color: #0066ff; font-weight: 600; font-size: 14px; }
            .title { font-size: 24px; font-weight: 700; margin: 15px 0; }
            .excerpt { color: #666; line-height: 1.6; margin: 15px 0; }
            .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="article-card">
              <p class="author">📝 ${article.author}</p>
              <p class="title">${article.title}</p>
              <p class="excerpt">${article.excerpt}</p>
              <p style="margin-top: 20px;">
                <a href="https://crypto.zyperia.ai/articles/${article.slug}" class="button">Read Full Article</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  commentReply: (
    subscriberName: string,
    article: { title: string; slug: string },
    replyAuthor: string,
    appName: string
  ): EmailTemplate => ({
    subject: `${replyAuthor} replied to your comment on "${article.title}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <p>Hi ${subscriberName},</p>
              <p><strong>${replyAuthor}</strong> replied to your comment on <strong>"${article.title}"</strong></p>
              <p style="margin-top: 20px;">
                <a href="https://crypto.zyperia.ai/articles/${article.slug}#comments" class="button">View Reply</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
