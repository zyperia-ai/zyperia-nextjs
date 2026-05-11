import { NextRequest, NextResponse } from 'next/server'

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Validar input
    if (!email || !source) {
      return NextResponse.json(
        { success: false, message: 'Email e source são obrigatórios' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }

    const validSources = ['crypto', 'intelligence', 'onlinebiz', 'home']
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { success: false, message: 'Source inválido' },
        { status: 400 }
      )
    }

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    // Verificar se email já existe
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('status')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('Erro ao verificar email:', checkError)
      return NextResponse.json(
        { success: false, message: 'Erro ao processar subscrição' },
        { status: 500 }
      )
    }

    // Se já existe e está activo
    if (existing && existing.status === 'active') {
      return NextResponse.json(
        { success: false, message: 'Este email já está subscrito' },
        { status: 400 }
      )
    }

    // Se existe mas está desinscristo, reactivar
    if (existing && existing.status === 'unsubscribed') {
      const { error: updateError } = await supabaseAdmin
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email)

      if (updateError) {
        console.error('Erro ao reactivar:', updateError)
        return NextResponse.json(
          { success: false, message: 'Erro ao processar subscrição' },
          { status: 500 }
        )
      }
    } else {
      // Inserir novo subscritor
      const { error: insertError } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({
          email,
          source,
          status: 'active',
          confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Erro ao inserir:', insertError)
        return NextResponse.json(
          { success: false, message: 'Erro ao processar subscrição' },
          { status: 500 }
        )
      }
    }

    // Enviar email de boas-vindas (não bloquear se falhar)
    try {
      await resend.emails.send({
        from: 'newsletter@zyperia.ai',
        to: email,
        subject: 'Bem-vindo à ZYPERIA 🚀',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Bem-vindo à ZYPERIA!</h1>

            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Obrigado por te inscreveres na nossa newsletter. A partir de agora vais receber os melhores artigos, insights e análises
              directamente na tua caixa de entrada.
            </p>

            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Fica atento às próximas actualizações!
            </p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Fonte: ${source === 'home' ? 'zyperia.ai' : source + '.zyperia.ai'}
              </p>
            </div>

            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              <a href="https://zyperia.ai" style="color: #7C6FF7; text-decoration: none;">Visita zyperia.ai</a> |
              <a href="https://zyperia.ai/unsubscribe?email=${encodeURIComponent(email)}" style="color: #7C6FF7; text-decoration: none;">Desinscrever</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.warn('Aviso: Email de boas-vindas não enviado:', emailError)
      // Não bloquear - subscrição já foi guardada na BD
    }

    return NextResponse.json({
      success: true,
      message: 'Subscrito com sucesso! Bem-vindo à ZYPERIA.',
    })
  } catch (error) {
    console.error('Erro no endpoint newsletter:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao processar subscrição' },
      { status: 500 }
    )
  }
}
