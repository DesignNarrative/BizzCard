'use client'

import { useEffect } from 'react'

export function ViewTracker({ cardId }: { cardId: string }) {
  useEffect(() => {
    fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: cardId, type: 'view' }),
    }).catch(() => {}) // Fire and forget
  }, [cardId])

  return null
}
