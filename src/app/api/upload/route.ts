import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Max 5MB file size
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be under 5MB' },
        { status: 400 }
      )
    }

    // Allow image files
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|ico)$/i.test(file.name)
    if (!isImage) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const bucketName = 'card-assets'

    // Check if bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === bucketName)

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
      })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${nanoid(12)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Fallback: Return as base64 data URL if storage fails
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      return NextResponse.json({ url: base64 })
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrlData.publicUrl })
  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
