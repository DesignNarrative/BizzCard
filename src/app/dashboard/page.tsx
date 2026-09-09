import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, Eye, Users, Download, ArrowRight, Activity } from 'lucide-react'
import { QRDisplay } from '@/components/dashboard/QRDisplay'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch card
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to BizCard!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          You don't have a digital business card yet. Create one now to start sharing your professional identity and collecting leads.
        </p>
        <Link 
          href="/dashboard/card/edit" 
          className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
        >
          Create Your First Card
        </Link>
      </div>
    )
  }

  // Fetch leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('card_id', card.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch today's stats (mocking the query for now)
  const today = new Date().toISOString().split('T')[0]
  const { data: statsData } = await supabase
    .from('interactions')
    .select('type')
    .eq('card_id', card.id)
    .gte('created_at', today)

  const stats = {
    views: statsData?.filter(s => s.type === 'view').length || 0,
    saves: statsData?.filter(s => s.type === 'save').length || 0,
    leads: statsData?.filter(s => s.type === 'lead').length || 0,
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Preview & QR */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 w-full">Your Card QR</h2>
          <QRDisplay cardId={card.id} />
          <div className="mt-6 w-full text-center">
            <p className="font-medium text-lg">{card.name}</p>
            <p className="text-sm text-gray-500 mb-4">{card.designation}</p>
            <Link 
              href={`/dashboard/card/edit`}
              className="text-primary text-sm font-medium hover:underline block"
            >
              Edit Card Details
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Views Today</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.views}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Contact Saves</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.saves}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-4">
              <div className="flex items-center space-x-2 text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">New Leads</span>
              </div>
              <div className="text-3xl font-bold text-primary">{stats.leads}</div>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Leads</h2>
              <Link href="/dashboard/leads" className="text-primary text-sm font-medium flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {leads && leads.length > 0 ? (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <Link href={`/dashboard/leads/${lead.id}`} key={lead.id} className="block group">
                    <div className="flex items-center justify-between p-4 rounded-xl border group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.interest || 'General Inquiry'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No leads yet.</p>
                <p className="text-sm">Share your card to start getting enquiries.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
