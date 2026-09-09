import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Edit3, PlusCircle, Share2, Smartphone } from 'lucide-react'
import { PublicCard } from '@/components/card/PublicCard'

export default async function CardPreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-3 text-gray-900">No Card Created Yet</h1>
        <p className="text-gray-500 mb-6 max-w-sm text-sm">
          Create your digital business card to preview how it looks to your clients and visitors.
        </p>
        <Link
          href="/dashboard/card/edit"
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Create My Card
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg font-bold text-gray-900">Card Live Preview</h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            This is exactly what customers see when they scan your QR code.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/c/${card.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Tab
          </Link>
          <Link
            href="/dashboard/card/edit"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Card
          </Link>
        </div>
      </div>

      {/* Interactive Mobile Device Frame */}
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-mono text-[11px] truncate max-w-[200px]">
                /c/{card.id}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <div className="max-h-[750px] overflow-y-auto">
            <PublicCard card={card} />
          </div>
        </div>
      </div>
    </div>
  )
}
