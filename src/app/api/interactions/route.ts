import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { card_id, type, link_label, share_id } = body

    if (!card_id || !type) {
      return NextResponse.json(
        { error: 'card_id and type are required' },
        { status: 400 }
      )
    }

    // Detect device type from user agent
    const ua = request.headers.get('user-agent') || ''
    let device_type = 'desktop'
    if (/Mobile|Android|iPhone/i.test(ua)) {
      device_type = 'mobile'
    } else if (/iPad|Tablet/i.test(ua)) {
      device_type = 'tablet'
    }

    const supabase = createAdminClient()

    const { error } = await supabase.from('interactions').insert({
      card_id,
      type,
      link_label: link_label || null,
      share_id: share_id || null,
      device_type,
    })

    if (error) {
      console.error('Interaction insert error:', error)
      return NextResponse.json(
        { error: 'Failed to log interaction' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
