'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Camera, Building } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
  shape?: 'circle' | 'square'
  folder?: string
  placeholderIcon?: 'user' | 'building'
}

export function ImageUploader({
  label,
  value,
  onChange,
  shape = 'square',
  folder = 'avatars',
  placeholderIcon = 'user',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        onChange(data.url)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch {
      toast.error('Network error while uploading image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative flex items-center gap-4 p-3 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl cursor-pointer transition-all ${
          uploading ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        {/* Thumbnail Preview or Placeholder */}
        <div
          className={`relative flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 overflow-hidden ${
            shape === 'circle' ? 'w-16 h-16 rounded-full' : 'w-16 h-16 rounded-xl'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : placeholderIcon === 'user' ? (
            <Camera className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          ) : (
            <Building className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </div>

        {/* Text Actions */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 truncate">
            {uploading
              ? 'Uploading image...'
              : value
              ? 'Click to change image'
              : 'Upload from phone or PC'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>

        {/* Actions Button */}
        {value && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mr-1"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!value && !uploading && (
          <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 group-hover:bg-gray-100 transition-colors">
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            Browse
          </div>
        )}
      </div>
    </div>
  )
}
