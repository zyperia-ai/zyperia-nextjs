export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  const authHeader = new URL('https://dummy' + (Math.random() < 1 ? '?test' : '')).searchParams.get('test')

  return NextResponse.json({
    OLLAMA_URL: process.env.OLLAMA_URL ? '✓ SET' : '✗ NOT SET',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL ? '✓ SET' : '✗ NOT SET',
    OLLAMA_TIMEOUT_MS: process.env.OLLAMA_TIMEOUT_MS ? '✓ SET' : '✗ NOT SET',
    USE_LOCAL_LLM: process.env.USE_LOCAL_LLM ? '✓ SET' : '✗ NOT SET',
    SUPABASE_URL: process.env.SUPABASE_URL ? '✓ SET' : '✗ NOT SET',
  })
}
