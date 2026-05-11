import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { requireAdmin } from '@/lib/auth/require'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
}

export async function POST(request: Request) {
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

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

    // Generate a random filename — never trust the client's
    const random = crypto.randomBytes(16).toString('hex')
    const fileName = `${Date.now()}-${random}.${ext}`

    const { error } = await auth.supabase.storage
        .from('product-images')
        .upload(fileName, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
        })

    if (error) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

    const { data: { publicUrl } } = auth.supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
}
