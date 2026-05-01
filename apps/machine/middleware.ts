import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const SESSION_COOKIE = 'zyperia_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Só protege /admin (não APIs de cron)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Login page é pública
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Verificar cookie de sessão
  const session = request.cookies.get(SESSION_COOKIE)
  if (session?.value === ADMIN_PASSWORD) {
    return NextResponse.next()
  }

  // Redirecionar para login
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
