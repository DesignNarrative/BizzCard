'use client'

import { Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/lib/types'

export function ShareButton({ card, theme }: { card: Card, theme: any }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Track interaction
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: card.id, type: 'share' }),
    }).catch(() => {})

    const url = window.location.href
    const title = `${card.name}'s Digital Business Card`
    const text = `Check out ${card.name}'s digital business card!`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
      } catch (err) {
        console.error('Error sharing', err)
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold border-2 ${theme.border} hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all duration-150`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-500" />
          <span>Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span>Share This Card</span>
        </>
      )}
    </button>
  )
}
