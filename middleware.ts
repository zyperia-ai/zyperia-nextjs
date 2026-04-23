import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware para rotear /crypto, /intelligence, /onlinebiz
 *
 * Transforma requests para:
 * - /crypto/* → apps/crypto/*
 * - /intelligence/* → apps/intelligence/*
 * - /onlinebiz/* → apps/onlinebiz/*
 *
 * Raiz (/) → landing page
 */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Root path - serve landing page
  if (pathname === '/' || pathname === '') {
    return NextResponse.next();
  }

  // Route /crypto/* to apps/crypto
  if (pathname.startsWith('/crypto')) {
    // Rewrite /crypto/* to /apps/crypto/*
    const newPathname = pathname.replace(/^\/crypto/, '');
    request.nextUrl.pathname = newPathname || '/';

    return NextResponse.rewrite(
      new URL(`/apps/crypto${newPathname || '/'}`, request.url)
    );
  }

  // Route /intelligence/* to apps/intelligence
  if (pathname.startsWith('/intelligence')) {
    const newPathname = pathname.replace(/^\/intelligence/, '');
    request.nextUrl.pathname = newPathname || '/';

    return NextResponse.rewrite(
      new URL(`/apps/intelligence${newPathname || '/'}`, request.url)
    );
  }

  // Route /onlinebiz/* to apps/onlinebiz
  if (pathname.startsWith('/onlinebiz')) {
    const newPathname = pathname.replace(/^\/onlinebiz/, '');
    request.nextUrl.pathname = newPathname || '/';

    return NextResponse.rewrite(
      new URL(`/apps/onlinebiz${newPathname || '/'}`, request.url)
    );
  }

  // All other routes pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
