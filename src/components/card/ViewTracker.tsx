'use client'

import { useEffect } from 'react'

export function ViewTracker({ cardId }: { cardId: string }) {
  useEffect(() => {
    try {
      const sessionKey = `bizcard_view_${cardId}`
      // Only count 1 view per browser session
      if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1')
        fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card_id: cardId, type: 'view' }),
        }).catch(() => {}) // Fire and forget
      }
    } catch {
      // Fallback
    }
  }, [cardId])

  return null
}
