import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET — fetch current user's wishlist
export async function GET() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('wishlists')
        .select(`
            id,
            product_id,
            products (
                id,
                name,
                slug,
                price,
                images,
                category,
                description
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
}

// POST — add item to wishlist
export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
        return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    // Check if item already in wishlist
    const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product_id)
        .single()

    if (existing) {
        return NextResponse.json({ message: 'Already in wishlist', item: existing })
    }

    const { data, error } = await supabase
        .from('wishlists')
        .insert({
            user_id: user.id,
            product_id
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data, action: 'added' }, { status: 201 })
}

// DELETE — remove item from wishlist (using product_id or wishlist id)
export async function DELETE(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')
    const wishlist_id = searchParams.get('id')

    let query = supabase.from('wishlists').delete().eq('user_id', user.id)

    if (wishlist_id) {
        query = query.eq('id', wishlist_id)
    } else if (product_id) {
        query = query.eq('product_id', product_id)
    } else {
        return NextResponse.json({ error: 'product_id or id is required' }, { status: 400 })
    }

    const { error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Removed from wishlist' })
}
