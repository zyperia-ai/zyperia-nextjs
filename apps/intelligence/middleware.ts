import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only check article paths
  if (!pathname.includes('/articles/')) {
    return NextResponse.next()
  }

  try {
    // Query redirects table for this app
    const { data: redirect, error } = await supabase
      .from('redirects')
      .select('to_path, status_code')
      .eq('app_id', 'intelligence')
      .eq('from_path', pathname)
      .eq('active', true)
      .single()

    if (!error && redirect) {
      // Redirect found - return 301 (or specified status code)
      return NextResponse.redirect(
        new URL(redirect.to_path, request.url),
        redirect.status_code || 301
      )
    }
  } catch (err) {
    // Silently fail - let the request continue to 404 if no article found
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
