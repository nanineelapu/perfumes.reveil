import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require'
import { NextResponse } from 'next/server'
import { notifyGoogleOfChange } from '@/lib/utils/indexing'

type Params = Promise<{ id: string }>

const ALLOWED_FIELDS = [
    'name', 'slug', 'price', 'description', 'images', 'category',
    'stock', 'is_featured', 'meta_title', 'meta_description', 'scent_profile',
    'rating',
] as const

function pickAllowedFields(body: Record<string, unknown>) {
    const out: Record<string, unknown> = {}
    for (const f of ALLOWED_FIELDS) {
        if (f in body) out[f] = body[f]
    }
    return out
}

export async function GET(_req: Request, { params }: { params: Params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: Params }) {
    const { id } = await params
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    let body: Record<string, unknown>
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const updates = pickAllowedFields(body)
    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await auth.supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    try {
        await notifyGoogleOfChange(`https://reveil-perfumes.com/products/${data.slug}`, 'URL_UPDATED')
    } catch (err) {
        console.error('Indexing API Error:', err)
    }

    return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
    const { id } = await params
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    const { error } = await auth.supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
