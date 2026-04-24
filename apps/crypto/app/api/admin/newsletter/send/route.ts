export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, content, article_id } = body

    if (!subject || !content) {
      return Response.json({ error: 'Subject and content required' }, { status: 400 })
    }

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('app_id', 'crypto')
      .eq('status', 'active')

    if (subError) throw subError

    if (!subscribers || subscribers.length === 0) {
      return Response.json({ error: 'No active subscribers' }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return Response.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Send emails in batches
    const emailPromises = subscribers.map((subscriber) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@crypto.zyperia.com',
          to: subscriber.email,
          subject,
          html: content,
        }),
      })
    )

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return Response.json(
      {
        message: 'Newsletter sent',
        sent: successful,
        failed,
        total: subscribers.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return Response.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
