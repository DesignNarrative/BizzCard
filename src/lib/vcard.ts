export interface VCardData {
  id: string
  name: string
  designation?: string | null
  company?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  about?: string | null
  profile_photo_url?: string | null
}

export function generateVCard(card: VCardData, baseUrl: string): string {
  const permanentUrl = `${baseUrl}/c/${card.id}`
  
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(card.name)}`,
  ]

  if (card.company) {
    lines.push(`ORG:${escapeVCardValue(card.company)}`)
  }
  if (card.designation) {
    lines.push(`TITLE:${escapeVCardValue(card.designation)}`)
  }
  if (card.phone) {
    lines.push(`TEL;TYPE=CELL:${card.phone}`)
  }
  if (card.email) {
    lines.push(`EMAIL:${card.email}`)
  }
  if (card.website) {
    lines.push(`URL:${card.website}`)
  }
  // Always include the permanent BizCard URL
  lines.push(`URL;TYPE=PREF:${permanentUrl}`)
  if (card.address) {
    lines.push(`ADR:;;${escapeVCardValue(card.address)}`)
  }
  if (card.about) {
    lines.push(`NOTE:${escapeVCardValue(card.about)}`)
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}
