'use client'

import { UserPlus } from 'lucide-react'
import { useState } from 'react'

export function SaveContactButton({ cardId, theme, accentColor, name }: { cardId: string, theme: any, accentColor: string | null, name: string }) {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Track interaction
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId, type: 'save_contact' }),
      }).catch(() => {})

      // Download vCard
      const response = await fetch(`/api/vcard/${cardId}`)
      if (!response.ok) throw new Error('Failed to fetch vcard')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name.replace(/\s+/g, '_')}_Contact.vcf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Could not save contact. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Use dynamic inline style for accent color if it exists, otherwise fallback to theme class
  const inlineStyle = accentColor ? { backgroundColor: accentColor } : {}
  const className = `w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold shadow-xl transition-all transform active:scale-95 text-white ${!accentColor ? theme.accent : ''}`

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={className}
      style={inlineStyle}
    >
      <UserPlus className="w-5 h-5" />
      <span>{loading ? 'Saving...' : 'Save Contact'}</span>
    </button>
  )
}
