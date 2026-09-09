'use client'

import { useState } from 'react'
import { Card } from '@/lib/types'
import { X, Check, MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'

export function EnquiryForm({ card, theme, onClose }: { card: Card, theme: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, card_id: card.id }),
      })
      
      if (res.ok) {
        setSuccess(true)
      } else {
        alert('Failed to send enquiry. Please try again.')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    if (card.whatsapp || card.phone) {
      const url = getWhatsAppUrl(
        card.whatsapp || card.phone!, 
        `Hi ${card.name}, I just submitted an enquiry through your digital business card.\n\nName: ${formData.name}\nInterest: ${formData.interest}\nMessage: ${formData.message}`
      )
      window.open(url, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md ${theme.cardBg} ${theme.text} rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300`}>
        <div className={`flex justify-between items-center p-6 border-b ${theme.border}`}>
          <h2 className="text-xl font-semibold">Send Enquiry</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {success ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Enquiry Sent!</h3>
                <p className={`${theme.secondaryText} text-sm`}>Thank you for reaching out. {card.name} will get back to you soon.</p>
              </div>
              
              {(card.whatsapp || card.phone) && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 mt-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Connect on WhatsApp
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-sm font-medium ${theme.secondaryText}`}>Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border ${theme.border} focus:ring-2 outline-none transition-all`}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1">
                <label className={`text-sm font-medium ${theme.secondaryText}`}>Phone *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border ${theme.border} focus:ring-2 outline-none transition-all`}
                  placeholder="Your Phone Number"
                />
              </div>
              
              {card.services && card.services.length > 0 && (
                <div className="space-y-1">
                  <label className={`text-sm font-medium ${theme.secondaryText}`}>Interested In</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({...formData, interest: e.target.value})}
                    className={`w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border ${theme.border} focus:ring-2 outline-none transition-all appearance-none`}
                  >
                    <option value="" disabled className="text-gray-500">Select a service</option>
                    {card.services.map((service, idx) => (
                      <option key={idx} value={service} className="text-black dark:text-white bg-white dark:bg-gray-900">{service}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className={`text-sm font-medium ${theme.secondaryText}`}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={`w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border ${theme.border} focus:ring-2 outline-none transition-all resize-none h-24`}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] mt-6 flex justify-center items-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 shadow-lg'
                }`}
                style={{ backgroundColor: card.accent_color || '#000' }}
              >
                {loading ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
