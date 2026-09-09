export interface Card {
  id: string
  user_id: string
  name: string
  designation: string | null
  company: string | null
  about: string | null
  logo_url: string | null
  profile_photo_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  address: string | null
  map_url: string | null
  map_latitude: number | null
  map_longitude: number | null
  instagram: string | null
  facebook: string | null
  linkedin: string | null
  youtube: string | null
  twitter: string | null
  google_reviews_url: string | null
  custom_links: CustomLink[]
  services: string[]
  theme: string
  accent_color: string
  status: 'active' | 'paused' | 'deleted'
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CustomLink {
  label: string
  url: string
  icon: string
}

export interface Lead {
  id: string
  card_id: string
  name: string
  phone: string
  email: string | null
  interest: string | null
  message: string | null
  source: 'direct' | 'shared' | 'qr'
  share_id: string | null
  referrer_name: string | null
  status: 'new' | 'contacted' | 'converted' | 'not_interested'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  card_id: string
  type: string
  link_label: string | null
  share_id: string | null
  device_type: string | null
  created_at: string
}

export interface Share {
  id: string
  card_id: string
  parent_share_id: string | null
  sharer_name: string | null
  code: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'pro' | 'business'
  created_at: string
  updated_at: string
}
