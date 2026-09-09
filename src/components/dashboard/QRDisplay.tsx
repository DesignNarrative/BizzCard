'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Maximize2, Download, Share2, X } from 'lucide-react';
import { toast } from 'sonner';

export function QRDisplay({ cardId }: { cardId: string }) {
  const [url, setUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}/c/${cardId}`);
  }, [cardId]);

  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `bizcard_qr_${cardId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Digital Business Card',
          text: 'Check out my digital business card and save my contact details.',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Card link copied to clipboard!');
    }
  };

  if (!url) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Hidden canvas for downloading */}
      <div className="hidden" ref={canvasRef}>
        <QRCodeCanvas
          id="qr-canvas"
          value={url}
          size={512}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="relative group p-4 bg-white rounded-xl border shadow-sm">
        <QRCodeSVG value={url} size={160} level="H" />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3 mt-6 w-full">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Card
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="bg-white p-8 rounded-3xl mb-8">
            <QRCodeSVG value={url} size={280} level="H" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Scan to Save Contact</h3>
          <p className="text-gray-400 text-center max-w-sm">
            Point your phone's camera at the QR code above to view my digital business card.
          </p>
        </div>
      )}
    </div>
  );
}
