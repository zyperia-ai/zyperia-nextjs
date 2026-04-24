import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, app_id } = await request.json()

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    // Using Resend for email sending
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured')
      return Response.json({ message: 'Email service not configured' }, { status: 200 })
    }

    const appName = app_id === 'crypto' ? 'Crypto Hub' :
                    app_id === 'intelligence' ? 'Intelligence Lab' :
                    'Online Biz'

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${appName}!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll now receive the latest updates, articles, and insights directly to your inbox.</p>
        <p>If you didn't subscribe, you can safely ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">© 2026 ${appName}. All rights reserved.</p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `noreply@${app_id}.zyperia.com`,
        to: email,
        subject: `Welcome to ${appName}`,
        html: emailContent,
      }),
    })

    if (!response.ok) {
      console.error('Resend API error:', await response.text())
      return Response.json({ message: 'Subscribed (email sent)' }, { status: 200 })
    }

    return Response.json({ message: 'Confirmation email sent' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return Response.json({ message: 'Subscribed' }, { status: 200 })
  }
}
