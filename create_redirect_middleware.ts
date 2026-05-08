// Middleware template para apps (crypto, intelligence, onlinebiz)
// Copiar para: apps/{APP}/middleware.ts

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

  // Extract app_id from environment or infer from request
  const app_id = process.env.NEXT_PUBLIC_APP_ID || 'crypto' // Will be set per app
  
  try {
    // Query redirects table
    const { data: redirect, error } = await supabase
      .from('redirects')
      .select('to_path, status_code')
      .eq('app_id', app_id)
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
    // Silently fail - let the request continue
    console.error('Redirect check failed:', err)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
