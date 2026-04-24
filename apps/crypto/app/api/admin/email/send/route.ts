import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_ID = 'crypto'
const FROM_EMAIL = 'noreply@crypto.zyperia.ai'

/**
 * POST /api/admin/email/send
 * Send email via Resend (admin only)
 *
 * Usage:
 * - Newsletter to multiple recipients
 * - Transactional emails (confirmation, notification)
 */
export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, replyTo } = await request.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    // Handle both single email and array of emails
    const recipients = Array.isArray(to) ? to : [to]

    // Send emails (Resend returns a single response even for bulk)
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject,
      html,
      replyTo: replyTo || FROM_EMAIL,
    })

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        id: response.data?.id,
        recipients: recipients.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
