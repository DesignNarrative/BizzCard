'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { CARD_THEMES, type CardTheme } from '@/lib/constants'
import { Save, Plus, Trash2, ArrowLeft, Loader2, Eye } from 'lucide-react'
import Link from 'next/link'
import { ImageUploader } from '@/components/dashboard/ImageUploader'
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  YouTubeIcon,
  TwitterXIcon,
  GoogleReviewsIcon,
} from '@/components/icons/BrandIcons'

const themeKeys = Object.keys(CARD_THEMES) as CardTheme[]

export default function CardEditPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [cardId, setCardId] = useState('')
  const [userId, setUserId] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    about: '',
    phone: '',
    whatsapp: '',
    sameAsPhone: false,
    email: '',
    website: '',
    address: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    twitter: '',
    google_reviews_url: '',
    services: [] as string[],
    custom_links: [] as { label: string; url: string; icon: string }[],
    theme: 'default' as string,
    profile_photo_url: '',
    logo_url: '',
  })

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (card) {
        setIsNew(false)
        setCardId(card.id)
        setFormData({
          name: card.name || '',
          designation: card.designation || '',
          company: card.company || '',
          about: card.about || '',
          phone: card.phone || '',
          whatsapp: card.whatsapp || '',
          sameAsPhone: !!(card.phone && card.phone === card.whatsapp),
          email: card.email || '',
          website: card.website || '',
          address: card.address || '',
          instagram: card.instagram || '',
          facebook: card.facebook || '',
          linkedin: card.linkedin || '',
          youtube: card.youtube || '',
          twitter: card.twitter || '',
          google_reviews_url: card.google_reviews_url || '',
          services: card.services || [],
          custom_links: card.custom_links || [],
          theme: card.theme || 'default',
          profile_photo_url: card.profile_photo_url || '',
          logo_url: card.logo_url || '',
        })
      } else {
        setIsNew(true)
        setCardId(`c_${nanoid(8)}`)
      }
      setLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addService = () => {
    setFormData((prev) => ({ ...prev, services: [...prev.services, ''] }))
  }

  const updateService = (index: number, value: string) => {
    const updated = [...formData.services]
    updated[index] = value
    setFormData((prev) => ({ ...prev, services: updated }))
  }

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const addCustomLink = () => {
    setFormData((prev) => ({
      ...prev,
      custom_links: [...prev.custom_links, { label: '', url: '', icon: 'link' }],
    }))
  }

  const updateCustomLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...formData.custom_links]
    updated[index] = { ...updated[index], [field]: value }
    setFormData((prev) => ({ ...prev, custom_links: updated }))
  }

  const removeCustomLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      custom_links: prev.custom_links.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setSaving(true)

    const dbData = {
      id: cardId,
      user_id: userId,
      name: formData.name.trim(),
      designation: formData.designation.trim() || null,
      company: formData.company.trim() || null,
      about: formData.about.trim() || null,
      phone: formData.phone.trim() || null,
      whatsapp: formData.sameAsPhone
        ? formData.phone.trim() || null
        : formData.whatsapp.trim() || null,
      email: formData.email.trim() || null,
      website: formData.website.trim() || null,
      address: formData.address.trim() || null,
      instagram: formData.instagram.trim() || null,
      facebook: formData.facebook.trim() || null,
      linkedin: formData.linkedin.trim() || null,
      youtube: formData.youtube.trim() || null,
      twitter: formData.twitter.trim() || null,
      google_reviews_url: formData.google_reviews_url.trim() || null,
      services: formData.services.filter((s) => s.trim()),
      custom_links: formData.custom_links.filter((l) => l.label.trim() && l.url.trim()),
      theme: formData.theme,
      profile_photo_url: formData.profile_photo_url.trim() || null,
      logo_url: formData.logo_url.trim() || null,
    }

    const { error } = await supabase.from('cards').upsert(dbData)

    setSaving(false)
    if (error) {
      toast.error('Error saving card: ' + error.message)
    } else {
      toast.success(isNew ? 'Card created!' : 'Card updated!')
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 py-4 -mx-4 px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? 'Create Card' : 'Edit Card'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              href="/dashboard/card"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {/* ── Identity ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Mayur Bangera" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={inputClass} placeholder="Founder" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="ABC Interiors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Tell people about your business..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader
              label="Profile Photo"
              value={formData.profile_photo_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, profile_photo_url: url }))}
              shape="circle"
              folder="avatars"
              placeholderIcon="user"
            />
            <ImageUploader
              label="Company Logo"
              value={formData.logo_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, logo_url: url }))}
              shape="square"
              folder="logos"
              placeholderIcon="building"
            />
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="9876543210" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sameAsPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sameAsPhone: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  Same as phone
                </label>
              </div>
              <input
                type="tel"
                name="whatsapp"
                value={formData.sameAsPhone ? formData.phone : formData.whatsapp}
                onChange={handleChange}
                disabled={formData.sameAsPhone}
                className={`${inputClass} ${formData.sameAsPhone ? 'bg-gray-50 text-gray-400' : ''}`}
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hello@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Your business address..." />
          </div>
        </section>

        {/* ── Social Media ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'instagram', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/...' },
              { name: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon, placeholder: 'https://linkedin.com/in/...' },
              { name: 'facebook', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/...' },
              { name: 'twitter', label: 'X (Twitter)', icon: TwitterXIcon, placeholder: 'https://x.com/...' },
              { name: 'youtube', label: 'YouTube', icon: YouTubeIcon, placeholder: 'https://youtube.com/...' },
              { name: 'google_reviews_url', label: 'Google Reviews', icon: GoogleReviewsIcon, placeholder: 'Google reviews URL' },
            ].map((social) => (
              <div key={social.name}>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <social.icon className="w-4 h-4 text-gray-500" />
                  <span>{social.label}</span>
                </label>
                <input
                  type="url"
                  name={social.name}
                  value={formData[social.name as keyof typeof formData] as string}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder={social.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Services</h2>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {formData.services.length === 0 && (
            <p className="text-sm text-gray-400 italic">No services added yet.</p>
          )}
          <div className="space-y-2">
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => updateService(index, e.target.value)}
                  placeholder="e.g. Interior Design"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Custom Links ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Custom Links</h2>
            <button
              type="button"
              onClick={addCustomLink}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {formData.custom_links.length === 0 && (
            <p className="text-sm text-gray-400 italic">No custom links added yet.</p>
          )}
          <div className="space-y-3">
            {formData.custom_links.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
                  placeholder="Link Label (e.g. Portfolio)"
                  className={`${inputClass} sm:w-1/3`}
                />
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeCustomLink(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Appearance ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Card Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themeKeys.map((key) => {
              const t = CARD_THEMES[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, theme: key }))}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.theme === key
                      ? 'border-gray-900 bg-gray-50 scale-[1.02]'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-10 rounded-lg ${t.bg} border ${t.border}`} />
                  <span className="text-xs font-medium text-gray-700">{t.name}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </form>
  )
}
