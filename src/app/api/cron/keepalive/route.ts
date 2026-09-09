import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Lightweight count query to keep the database active
    const { count, error } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Keepalive Supabase ping error:', error)
      return NextResponse.json(
        { ok: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase keepalive ping successful',
      cardsCount: count,
    })
  } catch (err: any) {
    console.error('Keepalive ping exception:', err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'Internal error', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
