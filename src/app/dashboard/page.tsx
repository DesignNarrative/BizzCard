import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { PlusCircle, Eye, Users, Download, ArrowRight, Activity } from 'lucide-react'
import { QRDisplay } from '@/components/dashboard/QRDisplay'
import { timeAgo } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch card belonging to this user
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
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome to BizCard!</h1>
        <p className="text-gray-600 mb-8 max-w-md text-sm">
          You don&apos;t have a digital business card yet. Create one now to start sharing your professional identity and collecting leads.
        </p>
        <Link 
          href="/dashboard/card/edit" 
          className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
        >
          Create Your First Card
        </Link>
      </div>
    )
  }

  // Use admin client to reliably get interactions & leads for this verified card
  const adminClient = createAdminClient()

  // Fetch all leads for this card
  const { data: leads } = await adminClient
    .from('leads')
    .select('*')
    .eq('card_id', card.id)
    .order('created_at', { ascending: false })

  // Fetch all interactions for this card
  const { data: interactions } = await adminClient
    .from('interactions')
    .select('type, created_at')
    .eq('card_id', card.id)

  const allInteractions = interactions || []
  const allLeads = leads || []

  const stats = {
    views: allInteractions.filter(s => s.type === 'view').length,
    saves: allInteractions.filter(s => s.type === 'save_contact').length,
    leads: allLeads.length,
  }

  const recentLeads = allLeads.slice(0, 5)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Preview & QR */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 w-full text-gray-900">Your Card QR</h2>
          <QRDisplay cardId={card.id} />
          
          <div className="mt-6 w-full text-center space-y-3">
            <div>
              <p className="font-semibold text-lg text-gray-900">{card.name}</p>
              <p className="text-sm text-gray-500">{card.designation}{card.company ? ` • ${card.company}` : ''}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link 
                href="/dashboard/card"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View How It Looks to Others
              </Link>
              <Link 
                href="/dashboard/card/edit"
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors text-center"
              >
                Edit Card Details
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium uppercase tracking-wider">Card Views</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.views}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium uppercase tracking-wider">Contact Saves</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.saves}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.leads}</div>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {stats.leads}
                </span>
              </div>
              <Link href="/dashboard/leads" className="text-gray-900 text-sm font-semibold flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <Link href={`/dashboard/leads/${lead.id}`} key={lead.id} className="block group">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 group-hover:border-gray-300 group-hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{lead.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>📞 {lead.phone}</span>
                            {lead.interest && (
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium text-gray-700">
                                {lead.interest}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {timeAgo(lead.created_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium text-gray-700">No leads yet.</p>
                <p className="text-xs text-gray-400 mt-1">Share your card or QR code to start receiving client enquiries.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
