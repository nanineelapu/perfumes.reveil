import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

// ── PATCH — update quantity of a specific cart item ──────────────────────────
export async function PATCH(request: Request, { params }: Params) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
        return NextResponse.json(
            { error: 'quantity must be at least 1. To remove, use DELETE.' },
            { status: 400 }
        )
    }

    // 1. Verify this cart item belongs to this user
    const { data: cartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, user_id, product_id, quantity')
        .eq('id', params.id)
        .single()

    if (fetchError || !cartItem) {
        return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }
    if (cartItem.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Check stock
    const { data: product } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', cartItem.product_id)
        .single()

    if (product && quantity > product.stock) {
        return NextResponse.json(
            { error: `Only ${product.stock} units of "${product.name}" available` },
            { status: 400 }
        )
    }

    // 3. Update
    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', params.id)
        .select(`
      id, quantity,
      products ( id, name, slug, price, images, stock )
    `)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data })
}

// ── DELETE — remove a specific item from cart ────────────────────────────────
export async function DELETE(_req: Request, { params }: Params) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership before deleting
    const { data: cartItem } = await supabase
        .from('cart_items')
        .select('user_id')
        .eq('id', params.id)
        .single()

    if (!cartItem) {
        return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }
    if (cartItem.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', params.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}