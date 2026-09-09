import { z } from 'zod'

const phoneRegex = /^[+]?[\d\s-()]{7,25}$/

export const cardFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  designation: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  about: z.string().max(500).optional().nullable(),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').optional().nullable().or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, 'Invalid phone number').optional().nullable().or(z.literal('')),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  address: z.string().max(300).optional().nullable(),
  map_url: z.string().url().optional().nullable().or(z.literal('')),
  instagram: z.string().max(200).optional().nullable(),
  facebook: z.string().max(200).optional().nullable(),
  linkedin: z.string().max(200).optional().nullable(),
  youtube: z.string().max(200).optional().nullable(),
  twitter: z.string().max(200).optional().nullable(),
  google_reviews_url: z.string().url().optional().nullable().or(z.literal('')),
  services: z.array(z.string()).optional().default([]),
  custom_links: z.array(z.object({
    label: z.string().min(1),
    url: z.string().url(),
    icon: z.string().optional().default('link'),
  })).optional().default([]),
  theme: z.string().optional().default('default'),
})

export type CardFormData = z.infer<typeof cardFormSchema>

export const enquiryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().min(7, 'Phone number is required').regex(phoneRegex, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  interest: z.string().max(200).optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
})

export type EnquiryFormData = z.infer<typeof enquiryFormSchema>
