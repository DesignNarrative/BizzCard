'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Eye,
  UserPlus,
  Flame,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Share2,
  Star,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
  views: number
  save_contact: number
  call: number
  whatsapp: number
  email: number
  website: number
  directions: number
  share: number
  enquiry: number
  social: number
  custom_link: number
}

type Period = '7d' | '30d' | '90d' | 'all'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    views: 0, save_contact: 0, call: 0, whatsapp: 0, email: 0,
    website: 0, directions: 0, share: 0, enquiry: 0, social: 0, custom_link: 0,
  })
  const [period, setPeriod] = useState<Period>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's card
      const { data: card } = await supabase
        .from('cards')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!card) {
        setLoading(false)
        return
      }

      // Calculate date range
      let fromDate: string | null = null
      const now = new Date()
      if (period === '7d') {
        fromDate = new Date(now.getTime() - 7 * 86400000).toISOString()
      } else if (period === '30d') {
        fromDate = new Date(now.getTime() - 30 * 86400000).toISOString()
      } else if (period === '90d') {
        fromDate = new Date(now.getTime() - 90 * 86400000).toISOString()
      }

      // Fetch interactions
      let query = supabase
        .from('interactions')
        .select('type')
        .eq('card_id', card.id)

      if (fromDate) {
        query = query.gte('created_at', fromDate)
      }

      const { data: interactions } = await query

      if (interactions) {
        const counts: Stats = {
          views: 0, save_contact: 0, call: 0, whatsapp: 0, email: 0,
          website: 0, directions: 0, share: 0, enquiry: 0, social: 0, custom_link: 0,
        }
        interactions.forEach((i) => {
          const key = i.type as keyof Stats
          if (key in counts) {
            counts[key]++
          }
        })
        setStats(counts)
      }

      setLoading(false)
    }

    fetchStats()
  }, [period])

  const funnelData = [
    { label: 'Card Views', value: stats.views, icon: Eye, color: 'bg-blue-500' },
    { label: 'Contact Saves', value: stats.save_contact, icon: UserPlus, color: 'bg-emerald-500' },
    { label: 'Leads', value: stats.enquiry, icon: Flame, color: 'bg-orange-500' },
  ]

  const maxFunnel = Math.max(...funnelData.map((d) => d.value), 1)

  const actionBreakdown = [
    { label: 'Calls', value: stats.call, icon: Phone },
    { label: 'WhatsApp', value: stats.whatsapp, icon: MessageCircle },
    { label: 'Email', value: stats.email, icon: Mail },
    { label: 'Website', value: stats.website, icon: Globe },
    { label: 'Directions', value: stats.directions, icon: MapPin },
    { label: 'Shares', value: stats.share, icon: Share2 },
    { label: 'Social', value: stats.social, icon: Star },
  ].filter((a) => a.value > 0)

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: 'all', label: 'All Time' },
  ]

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              period === p.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Funnel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              The Funnel
            </h2>
            <div className="space-y-4">
              {funnelData.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(item.value / maxFunnel) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Breakdown */}
          {actionBreakdown.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Action Breakdown
              </h2>
              <div className="space-y-3">
                {actionBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {stats.views === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 text-sm">
                No activity yet. Share your card to start tracking.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
