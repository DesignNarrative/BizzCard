import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, Calendar, MessageSquare, Info } from 'lucide-react'
import { LeadActions } from '@/components/dashboard/LeadActions'

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // Get user's card to verify ownership
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!card) return notFound()

  // Fetch lead via adminClient for verified owner
  const adminClient = createAdminClient()
  const { data: lead } = await adminClient
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('card_id', card.id)
    .single()

  if (!lead) return notFound()

  const formattedDate = new Date(lead.created_at).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/dashboard/leads" className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
                <div className="flex items-center text-gray-500 mt-1 text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {formattedDate}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Phone</div>
                  <div className="text-gray-900 font-semibold">{lead.phone || 'Not provided'}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Email</div>
                  <div className="text-gray-900">{lead.email || 'Not provided'}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium">Interested In</div>
                  <div className="text-gray-900 font-medium mt-0.5">
                    {lead.interest ? (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {lead.interest}
                      </span>
                    ) : 'General Inquiry'}
                  </div>
                </div>
              </div>

              {lead.message && (
                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1">Message</div>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{lead.message}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-wrap gap-4">
                {lead.source && <div><span className="font-medium text-gray-600">Source:</span> {lead.source}</div>}
                {lead.referrer_name && <div><span className="font-medium text-gray-600">Referrer:</span> {lead.referrer_name}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Actions */}
        <div className="md:col-span-1">
          <LeadActions lead={lead} />
        </div>
      </div>
    </div>
  )
}
