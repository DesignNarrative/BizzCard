'use client'

import { Phone, MessageCircle } from 'lucide-react'

type LeadActionsProps = {
  lead: {
    id?: string
    phone?: string | null
  }
}

export function LeadActions({ lead }: LeadActionsProps) {
  const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, '') : ''

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <a 
          href={`tel:${cleanPhone}`}
          className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${
            cleanPhone ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !cleanPhone && e.preventDefault()}
        >
          <Phone className="w-5 h-5" />
          <span>Call Lead</span>
        </a>
        <a 
          href={`https://wa.me/${cleanPhone}`}
          target="_blank" rel="noopener noreferrer"
          className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${
            cleanPhone ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !cleanPhone && e.preventDefault()}
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  )
}

