import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enquiryFormSchema } from '@/lib/validations'

// Rate limiting map (in-memory, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }) // 1 hour
    return false
  }

  if (entry.count >= 5) {
    return true
  }

  entry.count++
  return false
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { card_id, share_id, ...formData } = body

    // Validate form data
    const result = enquiryFormSchema.safeParse(formData)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    if (!card_id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Determine source
    let source = 'direct'
    let referrer_name = null

    if (share_id) {
      source = 'shared'
      // Look up who shared it
      const { data: share } = await supabase
        .from('shares')
        .select('sharer_name')
        .eq('id', share_id)
        .single()
      if (share) {
        referrer_name = share.sharer_name
      }
    }

    // Insert lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        card_id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email || null,
        interest: result.data.interest || null,
        message: result.data.message || null,
        source,
        share_id: share_id || null,
        referrer_name,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit enquiry' },
        { status: 500 }
      )
    }

    // Also log the enquiry interaction
    await supabase.from('interactions').insert({
      card_id,
      type: 'enquiry',
      share_id: share_id || null,
    })

    return NextResponse.json({ success: true, lead })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
