import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { LeadsList } from '@/components/dashboard/LeadsList'
import { Activity } from 'lucide-react'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user's card
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!card) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-2">No Card Yet</h2>
        <p className="text-gray-500">Create your digital business card first to start collecting leads.</p>
      </div>
    )
  }

  // Fetch leads reliably via admin client
  const adminClient = createAdminClient()
  const { data: leads } = await adminClient
    .from('leads')
    .select('*')
    .eq('card_id', card.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="text-sm text-gray-500 font-medium">
          Total: {leads?.length || 0}
        </div>
      </div>

      {leads && leads.length > 0 ? (
        <LeadsList leads={leads} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No leads yet</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            When people view your digital business card and submit an enquiry, their details will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
