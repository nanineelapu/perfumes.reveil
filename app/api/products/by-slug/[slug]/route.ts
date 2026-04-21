import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = Promise<{ slug: string }>

// ── GET single product by slug ──────────────────────────────────────────────
export async function GET(_req: Request, { params }: { params: Params }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      reviews (
        id, rating, comment, created_at,
        profiles ( full_name )
      )
    `)
        .eq('slug', slug)
        .single()

    if (error) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(data)
}

// ── PUT update product (admin only) ─────────────────────────────────────────
export async function PUT(request: Request, { params }: { params: Params }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Re-generate slug if name changed
    if (body.name) {
        body.slug = body.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
    }

    const { data, error } = await supabase
        .from('products')
        .update(body)
        .eq('slug', slug)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// ── DELETE product (admin only) ──────────────────────────────────────────────
export async function DELETE(_req: Request, { params }: { params: Params }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('slug', slug)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
