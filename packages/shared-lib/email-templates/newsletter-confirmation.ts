/**
 * Newsletter confirmation email template
 * Sent when user subscribes to confirm their email address
 */

export interface ConfirmationEmailProps {
  subscriberName: string;
  confirmationUrl: string;
  appName: string;
  appColor: string; // e.g., 'purple', 'cyan', 'emerald'
  expiresIn: string; // e.g., '24 hours'
}

export function getConfirmationEmailHTML({
  subscriberName,
  confirmationUrl,
  appName,
  appColor,
  expiresIn,
}: ConfirmationEmailProps): string {
  const colorMap: Record<string, string> = {
    purple: '#7C6FF7',
    cyan: '#06B6D4',
    emerald: '#10B981',
  };

  const themeColor = colorMap[appColor] || colorMap.purple;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, -20)} 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: ${themeColor}; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center; }
    .token-expires { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirm Your Email</h1>
      <p>Welcome to ${appName}!</p>
    </div>

    <div class="content">
      <p>Hi <strong>${subscriberName}</strong>,</p>

      <p>Thank you for subscribing to ${appName}! To complete your subscription, please confirm your email address by clicking the button below:</p>

      <center>
        <a href="${confirmationUrl}" class="button">Confirm Email Address</a>
      </center>

      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; font-size: 12px; color: #666;">
        <code>${confirmationUrl}</code>
      </p>

      <div class="token-expires">
        <strong>⏱️ This link expires in ${expiresIn}</strong>
        <p style="margin: 5px 0 0 0; font-size: 13px;">If you didn't receive this email or the link expires, you can request a new confirmation email.</p>
      </div>

      <p>Once confirmed, you'll start receiving:</p>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Weekly content updates from our best articles</li>
        <li>Exclusive guides and tutorials</li>
        <li>Early access to new features</li>
        <li>Special offers and promotions</li>
      </ul>

      <p style="color: #6b7280; font-size: 13px;">
        If you did not subscribe to ${appName}, please disregard this email or let us know.
      </p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        <p>You're receiving this email because you subscribed to our newsletter.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getConfirmationEmailText({
  subscriberName,
  confirmationUrl,
  appName,
  expiresIn,
}: ConfirmationEmailProps): string {
  return `
Confirm Your Email

Hi ${subscriberName},

Thank you for subscribing to ${appName}! To complete your subscription, please confirm your email address by visiting this link:

${confirmationUrl}

This link expires in ${expiresIn}.

If you did not subscribe to ${appName}, please disregard this email.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
  `.trim();
}

export function getWelcomeEmailHTML({
  subscriberName,
  appName,
  appColor,
}: Omit<ConfirmationEmailProps, 'confirmationUrl' | 'expiresIn'>): string {
  const colorMap: Record<string, string> = {
    purple: '#7C6FF7',
    cyan: '#06B6D4',
    emerald: '#10B981',
  };

  const themeColor = colorMap[appColor] || colorMap.purple;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, -20)} 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: ${themeColor}; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ${appName}! 🎉</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${subscriberName}</strong>,</p>

      <p>Your email has been confirmed! You're all set to receive updates from ${appName}.</p>

      <p style="color: #6b7280;">You can expect to receive:</p>
      <ul style="color: #374151; line-height: 1.8;">
        <li>📚 Weekly content updates from our best articles</li>
        <li>🔑 Exclusive guides and tutorials</li>
        <li>⭐ Early access to new features</li>
        <li>🎁 Special offers and promotions</li>
      </ul>

      <p style="color: #6b7280; margin-top: 20px;">
        If you have any questions or want to adjust your preferences, just reply to this email.
      </p>

      <div class="footer">
        <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Helper function to adjust color brightness
 */
function adjustColor(color: string, percent: number): string {
  // Simple hex color adjustment
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}
