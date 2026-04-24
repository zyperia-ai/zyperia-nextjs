/**
 * Welcome email template for new newsletter subscribers
 */

export function getWelcomeEmailHtml(name: string, blogName: string, confirmUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: white; padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ${blogName}! 🎉</h1>
    </div>

    <div class="content">
      <h2>Hi ${name},</h2>

      <p>Thank you for subscribing to ${blogName}! We're excited to have you as part of our community.</p>

      <p>You'll now receive:</p>
      <ul>
        <li>🎯 Expert insights and in-depth guides</li>
        <li>📰 Latest news and trends in your areas of interest</li>
        <li>💡 Exclusive tips and strategies</li>
        <li>🔔 Early access to new content</li>
      </ul>

      <p>Our content is carefully curated and updated regularly to help you stay informed and ahead of the curve.</p>

      <p style="text-align: center;">
        <a href="${confirmUrl}" class="button">View Latest Articles</a>
      </p>

      <p>If you have any questions or feedback, we'd love to hear from you. Just reply to this email!</p>

      <p>Best regards,<br>The ${blogName} Team</p>
    </div>

    <div class="footer">
      <p>You received this email because you subscribed to ${blogName}.</p>
      <p><a href="https://zyperia.ai/unsubscribe">Unsubscribe</a> | <a href="https://zyperia.ai/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmailText(name: string, blogName: string): string {
  return `
Welcome to ${blogName}!

Hi ${name},

Thank you for subscribing to ${blogName}! We're excited to have you as part of our community.

You'll now receive:
- 🎯 Expert insights and in-depth guides
- 📰 Latest news and trends in your areas of interest
- 💡 Exclusive tips and strategies
- 🔔 Early access to new content

Our content is carefully curated and updated regularly to help you stay informed and ahead of the curve.

If you have any questions or feedback, we'd love to hear from you. Just reply to this email!

Best regards,
The ${blogName} Team

---
You received this email because you subscribed to ${blogName}.
Unsubscribe: https://zyperia.ai/unsubscribe
Privacy Policy: https://zyperia.ai/privacy
  `;
}
