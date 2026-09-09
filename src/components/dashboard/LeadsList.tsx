'use client'

import { useState } from 'react'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

type Lead = {
  id: string
  name: string
  interest: string | null
  message: string | null
  status: string
  source: string
  created_at: string
}

export function LeadsList({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState('all')

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'converted', label: 'Converted' },
    { key: 'not_interested', label: 'Not Interested' },
  ]

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'all') return true
    return lead.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'converted': return 'bg-green-500'
      case 'not_interested': return 'bg-gray-400'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="space-y-2">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Link
              href={`/dashboard/leads/${lead.id}`}
              key={lead.id}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getStatusColor(lead.status)}`} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lead.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {lead.interest && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                          {lead.interest}
                        </span>
                      )}
                      {lead.source && lead.source !== 'direct' && (
                        <span className="text-xs text-gray-400">via {lead.source}</span>
                      )}
                    </div>
                    {lead.message && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{lead.message}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {timeAgo(lead.created_at)}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No leads found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
