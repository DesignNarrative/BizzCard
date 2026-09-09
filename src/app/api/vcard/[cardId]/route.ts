import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateVCard } from '@/lib/vcard'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('cards')
    .select('id, name, designation, company, phone, whatsapp, email, website, address, about, profile_photo_url')
    .eq('id', cardId)
    .eq('is_published', true)
    .single()

  if (error || !card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  }

  const baseUrl = request.nextUrl.origin
  const vcf = generateVCard(card, baseUrl)

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.name.replace(/[^a-zA-Z0-9\s]/g, '')}.vcf"`,
    },
  })
}
