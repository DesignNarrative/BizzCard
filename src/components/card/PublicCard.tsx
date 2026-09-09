'use client'

import { useState } from 'react'
import { Card } from '@/lib/types'
import { CARD_THEMES } from '@/lib/constants'
import {
  getTelUrl,
  getWhatsAppUrl,
  getMailtoUrl,
  getMapsUrl,
} from '@/lib/utils'
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  Send
} from 'lucide-react'
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  YouTubeIcon,
  TwitterXIcon,
  GoogleReviewsIcon,
} from '@/components/icons/BrandIcons'
import { SaveContactButton } from './SaveContactButton'
import { ShareButton } from './ShareButton'
import { EnquiryForm } from './EnquiryForm'
import Image from 'next/image'

export function PublicCard({ card }: { card: Card }) {
  const [showEnquiry, setShowEnquiry] = useState(false)
  const theme = CARD_THEMES[card.theme as keyof typeof CARD_THEMES] || CARD_THEMES.default

  const trackInteraction = (type: string, data?: string) => {
    try {
      fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: card.id, type, data }),
      }).catch(() => {})
    } catch {
      // Ignore
    }
  }

  const actions = [
    {
      icon: Phone,
      label: 'Call',
      url: card.phone ? getTelUrl(card.phone) : null,
      type: 'call',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      url: (card.whatsapp || card.phone) ? getWhatsAppUrl(card.whatsapp || card.phone!, `Hi ${card.name}, I found your contact on your digital business card.`) : null,
      type: 'whatsapp',
    },
    {
      icon: Mail,
      label: 'Email',
      url: card.email ? getMailtoUrl(card.email, `Enquiry from BizCard`) : null,
      type: 'email',
    },
    {
      icon: Globe,
      label: 'Website',
      url: card.website,
      type: 'website',
      target: '_blank'
    },
    {
      icon: MapPin,
      label: 'Directions',
      url: card.address ? getMapsUrl(card.address, card.map_latitude, card.map_longitude) : null,
      type: 'directions',
      target: '_blank'
    },
    {
      icon: GoogleReviewsIcon,
      label: 'Reviews',
      url: card.google_reviews_url,
      type: 'reviews',
      target: '_blank'
    }
  ].filter(action => action.url)

  const socials = [
    { icon: InstagramIcon, url: card.instagram, type: 'instagram' },
    { icon: FacebookIcon, url: card.facebook, type: 'facebook' },
    { icon: LinkedInIcon, url: card.linkedin, type: 'linkedin' },
    { icon: YouTubeIcon, url: card.youtube, type: 'youtube' },
    { icon: TwitterXIcon, url: card.twitter, type: 'twitter' },
  ].filter(social => social.url)

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col font-sans transition-colors duration-300`}>
      <div className={`flex-1 w-full max-w-md mx-auto ${theme.cardBg} shadow-2xl relative flex flex-col min-h-screen`}>
        {/* Header Section */}
        <div className="px-8 pt-12 pb-8 flex flex-col items-center text-center relative z-10">
          {card.profile_photo_url && (
            <div className="mb-6 relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.profile_photo_url} alt={card.name} className="object-cover w-full h-full" />
            </div>
          )}
          {card.logo_url && !card.profile_photo_url && (
            <div className="mb-6 relative w-24 h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.logo_url} alt="Logo" className="object-contain w-full h-full" />
            </div>
          )}
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">{card.name}</h1>
          {(card.designation || card.company) && (
            <div className={`text-lg font-medium ${theme.secondaryText} space-y-1`}>
              {card.designation && <p>{card.designation}</p>}
              {card.company && <p>{card.company}</p>}
            </div>
          )}
          
          {card.logo_url && card.profile_photo_url && (
             <div className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-lg p-2 backdrop-blur-sm shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.logo_url} alt="Logo" className="object-contain w-full h-full opacity-80" />
             </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-8 pb-12 flex-1 flex flex-col gap-8">
          
          <SaveContactButton cardId={card.id} theme={theme} accentColor={card.accent_color} name={card.name} />

          {/* Action Grid */}
          {actions.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, idx) => (
                <a
                  key={idx}
                  href={action.url!}
                  target={action.target}
                  rel={action.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => trackInteraction(action.type)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl ${theme.buttonBg} ${theme.buttonText} hover:opacity-90 active:scale-95 active:opacity-75 transition-all duration-150 gap-2 group cursor-pointer select-none shadow-sm`}
                >
                  <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex justify-center gap-4 flex-wrap">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackInteraction(social.type)}
                  className={`p-3 rounded-full ${theme.buttonBg} ${theme.buttonText} hover:opacity-90 active:scale-90 active:opacity-75 transition-all duration-150 cursor-pointer shadow-sm`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}

          {/* About */}
          {card.about && (
            <div className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${theme.secondaryText}`}>About</h2>
              <p className="text-base leading-relaxed opacity-90 whitespace-pre-wrap">{card.about}</p>
            </div>
          )}

          {/* Services */}
          {card.services && card.services.length > 0 && (
            <div className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${theme.secondaryText}`}>Services</h2>
              <ul className="space-y-2">
                {card.services.map((service, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.accent || 'bg-current'}`} />
                    <span className="text-base">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Custom Links */}
          {card.custom_links && card.custom_links.length > 0 && (
            <div className="space-y-3">
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${theme.secondaryText}`}>Links</h2>
              <div className="space-y-2">
                {card.custom_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackInteraction('custom_link', link.url)}
                    className={`flex items-center justify-between p-4 rounded-xl ${theme.buttonBg} ${theme.buttonText} hover:opacity-90 active:scale-[0.98] transition-all duration-150`}
                  >
                    <span className="font-medium">{link.label}</span>
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Send Enquiry & Share */}
          <div className="flex flex-col gap-3 mt-4">
             <button
                onClick={() => setShowEnquiry(true)}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold border-2 ${theme.border} hover:bg-white/5 active:scale-[0.98] transition-all duration-150 shadow-sm`}
              >
                <Send className="w-5 h-5" />
                Send Enquiry
              </button>
             <ShareButton card={card} theme={theme} />
          </div>

        </div>
        
        {/* Footer */}
        <div className={`py-6 text-center text-xs font-medium tracking-wide ${theme.secondaryText} mt-auto`}>
          POWERED BY BIZCARD
        </div>
      </div>

      {showEnquiry && (
        <EnquiryForm 
          card={card} 
          theme={theme} 
          onClose={() => setShowEnquiry(false)} 
        />
      )}
    </div>
  )
}
