import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Optional: Only allow logged in users to upload review media
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let formData: FormData
    try {
        formData = await request.formData()
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    const random = crypto.randomBytes(16).toString('hex')
    const fileName = `reviews/${Date.now()}-${random}.${ext}`

    const { error } = await supabase.storage
        .from('product-images') // Reusing existing bucket
        .upload(fileName, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
        })

    if (error) {
        console.error('Upload Error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
}
