'use client'

import { useState, useRef, useEffect } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Maximize2, Download, Share2, X, MessageCircle, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface QRDisplayProps {
  cardId: string
  card?: {
    name?: string | null
    designation?: string | null
    company?: string | null
    theme?: string | null
  }
}

export function QRDisplay({ cardId, card }: QRDisplayProps) {
  const [url, setUrl] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUrl(`${window.location.origin}/c/${cardId}`)
  }, [cardId])

  const cardName = card?.name || 'My Contact'
  const cardSubtitle = [card?.designation, card?.company].filter(Boolean).join(' • ')

  // Generate and download a high-resolution luxury digital business card image
  const handleDownloadLuxuryCard = () => {
    setDownloading(true)
    try {
      const qrCanvas = document.getElementById('qr-canvas-source') as HTMLCanvasElement
      if (!qrCanvas) {
        toast.error('Could not generate QR image')
        return
      }

      // Create a high-res canvas (1080 x 1440 portrait luxury card)
      const canvas = document.createElement('canvas')
      const width = 1080
      const height = 1440
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        toast.error('Canvas rendering failed')
        return
      }

      // 1. Background Gradient (Luxury Deep Midnight)
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0a0f1d')
      bgGradient.addColorStop(0.5, '#0f172a')
      bgGradient.addColorStop(1, '#020617')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // 2. Subtle luxury accent glow
      const glow = ctx.createRadialGradient(width / 2, 280, 50, width / 2, 280, 500)
      glow.addColorStop(0, 'rgba(56, 189, 248, 0.12)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      // 3. Elegant Inner Card Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(40, 40, width - 80, height - 80, 48)
      ctx.stroke()

      // 4. Top Badge ("DIGITAL BUSINESS CARD")
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.roundRect(width / 2 - 190, 100, 380, 52, 26)
      ctx.fill()

      ctx.fillStyle = '#94a3b8'
      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '3px'
      ctx.fillText('DIGITAL BUSINESS CARD', width / 2, 134)

      // 5. Founder / Person Name
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 58px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0px'
      ctx.fillText(cardName, width / 2, 240)

      // 6. Designation & Company Subtitle
      if (cardSubtitle) {
        ctx.fillStyle = '#38bdf8'
        ctx.font = '500 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.fillText(cardSubtitle, width / 2, 300)
      }

      // 7. QR Code White Container Box
      const boxSize = 620
      const boxX = (width - boxSize) / 2
      const boxY = 380

      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetY = 20
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxSize, boxSize, 40)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      // 8. Draw QR Code into Box
      const qrPadding = 50
      const qrSize = boxSize - qrPadding * 2
      ctx.drawImage(qrCanvas, boxX + qrPadding, boxY + qrPadding, qrSize, qrSize)

      // 9. Scan Instruction Text
      ctx.fillStyle = '#ffffff'
      ctx.font = '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText('Scan with Phone Camera', width / 2, 1080)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.fillText('Tap or scan to view card & save contact', width / 2, 1130)

      // 10. Footer Watermark & Permanent Link
      ctx.fillStyle = '#475569'
      ctx.font = '500 22px monospace'
      ctx.fillText(url.replace(/^https?:\/\//, ''), width / 2, 1260)

      ctx.fillStyle = '#64748b'
      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillText('BIZCARD', width / 2, 1320)

      // 11. Trigger Download
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `${cardName.replace(/\s+/g, '_')}_BizCard.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      toast.success('Luxury Business Card downloaded!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to download card')
    } finally {
      setDownloading(false)
    }
  }

  // 1-Tap WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `Hi, here is my digital business card for ${cardName}${cardSubtitle ? ` (${cardSubtitle})` : ''}.\n\nTap or scan to view and save my contact:\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Card link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardName} — Digital Business Card`,
          text: `Check out my digital business card and save my contact details.`,
          url: url,
        })
      } catch {
        // Cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  if (!url) return null

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hidden high-res canvas for drawing */}
      <div className="hidden" ref={canvasRef}>
        <QRCodeCanvas
          id="qr-canvas-source"
          value={url}
          size={512}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* QR Code Container */}
      <div className="relative group p-4 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
        <QRCodeSVG value={url} size={170} level="H" />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 p-1.5 bg-gray-900/80 text-white rounded-lg opacity-80 hover:opacity-100 transition-all active:scale-95 backdrop-blur-sm"
          title="Full Screen View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Quick Action Buttons */}
      <div className="flex flex-col gap-2.5 mt-5 w-full">
        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4" />
          Share on WhatsApp
        </button>

        <div className="flex gap-2 w-full">
          {/* Download Luxury Card */}
          <button
            onClick={handleDownloadLuxuryCard}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-3 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Creating...' : 'Download Card'}
          </button>

          {/* Copy Link / Native Share */}
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
            title="Share or Copy Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Overlay with Person Name & Company */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-gray-950/95 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200 backdrop-blur-md">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Card Holder Details */}
          <div className="text-center mb-6 max-w-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/60 px-3 py-1 rounded-full">
              Digital Business Card
            </span>
            <h3 className="text-3xl font-bold text-white mt-3">{cardName}</h3>
            {cardSubtitle && (
              <p className="text-sm text-gray-300 mt-1 font-medium">{cardSubtitle}</p>
            )}
          </div>

          {/* Big Sharp QR Code */}
          <div className="bg-white p-6 rounded-3xl mb-6 shadow-2xl">
            <QRCodeSVG value={url} size={280} level="H" />
          </div>

          <p className="text-gray-400 text-xs text-center max-w-xs mb-6">
            Point phone camera at this QR code to view the live card and save contact.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Share
            </button>
            <button
              onClick={handleDownloadLuxuryCard}
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download Card
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
