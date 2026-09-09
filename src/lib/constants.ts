export const APP_NAME = 'BizCard'
export const APP_DESCRIPTION = 'Your digital business card, always with you.'
export const APP_TAGLINE = 'Tap. Share. Connect.'

// Card themes
export const CARD_THEMES = {
  default: {
    name: 'Classic White',
    bg: 'bg-white',
    text: 'text-gray-900',
    secondaryText: 'text-gray-500',
    accent: 'bg-gray-900 text-white',
    accentHover: 'hover:bg-gray-800',
    border: 'border-gray-200',
    cardBg: 'bg-white',
    buttonBg: 'bg-gray-50 hover:bg-gray-100',
    buttonText: 'text-gray-700',
    gradient: '',
  },
  dark: {
    name: 'Midnight Dark',
    bg: 'bg-gray-950',
    text: 'text-white',
    secondaryText: 'text-gray-400',
    accent: 'bg-white text-gray-900',
    accentHover: 'hover:bg-gray-100',
    border: 'border-gray-800',
    cardBg: 'bg-gray-950',
    buttonBg: 'bg-gray-900 hover:bg-gray-800',
    buttonText: 'text-gray-200',
    gradient: '',
  },
  navy: {
    name: 'Royal Navy',
    bg: 'bg-slate-900',
    text: 'text-white',
    secondaryText: 'text-slate-400',
    accent: 'bg-blue-500 text-white',
    accentHover: 'hover:bg-blue-600',
    border: 'border-slate-700',
    cardBg: 'bg-slate-900',
    buttonBg: 'bg-slate-800 hover:bg-slate-700',
    buttonText: 'text-slate-200',
    gradient: '',
  },
  emerald: {
    name: 'Forest Green',
    bg: 'bg-emerald-950',
    text: 'text-white',
    secondaryText: 'text-emerald-300',
    accent: 'bg-emerald-500 text-white',
    accentHover: 'hover:bg-emerald-600',
    border: 'border-emerald-800',
    cardBg: 'bg-emerald-950',
    buttonBg: 'bg-emerald-900 hover:bg-emerald-800',
    buttonText: 'text-emerald-200',
    gradient: '',
  },
  rose: {
    name: 'Elegant Rose',
    bg: 'bg-rose-950',
    text: 'text-white',
    secondaryText: 'text-rose-300',
    accent: 'bg-rose-500 text-white',
    accentHover: 'hover:bg-rose-600',
    border: 'border-rose-800',
    cardBg: 'bg-rose-950',
    buttonBg: 'bg-rose-900 hover:bg-rose-800',
    buttonText: 'text-rose-200',
    gradient: '',
  },
  amber: {
    name: 'Golden Luxury',
    bg: 'bg-amber-950',
    text: 'text-white',
    secondaryText: 'text-amber-300',
    accent: 'bg-amber-500 text-gray-900',
    accentHover: 'hover:bg-amber-400',
    border: 'border-amber-800',
    cardBg: 'bg-amber-950',
    buttonBg: 'bg-amber-900 hover:bg-amber-800',
    buttonText: 'text-amber-200',
    gradient: '',
  },
  violet: {
    name: 'Royal Purple',
    bg: 'bg-violet-950',
    text: 'text-white',
    secondaryText: 'text-violet-300',
    accent: 'bg-violet-500 text-white',
    accentHover: 'hover:bg-violet-600',
    border: 'border-violet-800',
    cardBg: 'bg-violet-950',
    buttonBg: 'bg-violet-900 hover:bg-violet-800',
    buttonText: 'text-violet-200',
    gradient: '',
  },
  sky: {
    name: 'Ocean Blue',
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    secondaryText: 'text-sky-600',
    accent: 'bg-sky-600 text-white',
    accentHover: 'hover:bg-sky-700',
    border: 'border-sky-200',
    cardBg: 'bg-sky-50',
    buttonBg: 'bg-sky-100 hover:bg-sky-200',
    buttonText: 'text-sky-700',
    gradient: '',
  },
} as const

export type CardTheme = keyof typeof CARD_THEMES

// Lead statuses
export const LEAD_STATUSES = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: '🔵' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: '🟢' },
  not_interested: { label: 'Not Interested', color: 'bg-gray-100 text-gray-500', icon: '⚫' },
} as const

export type LeadStatus = keyof typeof LEAD_STATUSES

// Interaction types
export const INTERACTION_TYPES = [
  'view',
  'save_contact',
  'call',
  'whatsapp',
  'email',
  'website',
  'directions',
  'social',
  'custom_link',
  'share',
  'enquiry',
] as const

export type InteractionType = (typeof INTERACTION_TYPES)[number]

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: 'Instagram', urlPrefix: 'https://instagram.com/' },
  { key: 'facebook', label: 'Facebook', icon: 'Facebook', urlPrefix: 'https://facebook.com/' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', urlPrefix: 'https://linkedin.com/in/' },
  { key: 'youtube', label: 'YouTube', icon: 'Youtube', urlPrefix: 'https://youtube.com/' },
  { key: 'twitter', label: 'X', icon: 'Twitter', urlPrefix: 'https://x.com/' },
] as const
