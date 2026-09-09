import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // If it starts with 91 and is 12 digits, format as Indian number
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  
  // If it's 10 digits (Indian mobile without country code)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  
  return phone
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '')
  const number = digits.startsWith('91') ? digits : `91${digits}`
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${encodedMessage}`
}

export function getTelUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const number = digits.startsWith('91') ? `+${digits}` : `+91${digits}`
  return `tel:${number}`
}

export function getMailtoUrl(email: string, subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${params}`
}

export function getMapsUrl(address?: string | null, lat?: number | null, lng?: number | null): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  }
  return '#'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return past.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
