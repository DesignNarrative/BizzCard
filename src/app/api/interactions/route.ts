import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// In-memory view deduplication map: key = `ip_cardId`, value = timestamp
const recentViewsMap = new Map<string, number>()

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

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'

    // Deduplicate rapid view events within 15 minutes per IP + Card
    if (type === 'view' && ip !== 'unknown') {
      const now = Date.now()
      const key = `${ip}_${card_id}`
      const lastView = recentViewsMap.get(key)

      if (lastView && now - lastView < 15 * 60 * 1000) {
        // Already recorded a view recently, return success without duplicating
        return NextResponse.json({ success: true, deduped: true })
      }
      recentViewsMap.set(key, now)

      // Prune old entries if map grows
      if (recentViewsMap.size > 1000) {
        for (const [k, time] of recentViewsMap.entries()) {
          if (now - time > 15 * 60 * 1000) recentViewsMap.delete(k)
        }
      }
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
