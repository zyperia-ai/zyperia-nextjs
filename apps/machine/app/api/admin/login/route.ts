import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'zyperia_admin_session'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password obrigatória' }, { status: 400 })
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Password incorrecta' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, password, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    })

    return response

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
