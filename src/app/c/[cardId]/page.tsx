import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PublicCard } from '@/components/card/PublicCard'
import { ViewTracker } from '@/components/card/ViewTracker'

type Props = {
  params: Promise<{ cardId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params
  const supabase = await createClient()
  const { data: card } = await supabase
    .from('cards')
    .select('name, company, designation, about')
    .eq('id', cardId)
    .eq('is_published', true)
    .single()

  if (!card) return { title: 'Card Not Found' }

  const title = card.company ? `${card.name} — ${card.company}` : card.name
  return {
    title,
    description: card.about || `${card.name}${card.designation ? ` | ${card.designation}` : ''}${card.company ? ` at ${card.company}` : ''}`,
  }
}

export default async function CardPage({ params }: Props) {
  const { cardId } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .eq('is_published', true)
    .single()

  if (error || !card) {
    notFound()
  }

  // Check if card is paused
  if (card.status === 'paused') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⏸️</div>
          <h1 className="text-xl font-semibold text-gray-900">Card Unavailable</h1>
          <p className="text-gray-500 mt-2">This card is currently unavailable.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ViewTracker cardId={card.id} />
      <PublicCard card={card} />
    </>
  )
}
