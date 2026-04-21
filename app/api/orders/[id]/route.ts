import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

// GET single order
export async function GET(_req: Request, { params }: Params) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      profiles ( full_name, phone ),
      order_items (
        id, quantity, price,
        products ( id, name, images, slug )
      )
    `)
        .eq('id', params.id)
        .single()

    if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Users can only view their own orders
    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'admin' && data.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(data)
}

// PATCH — update order status (admin only)
export async function PATCH(request: Request, { params }: Params) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }

    const { status } = await request.json()

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
            { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', params.id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// DELETE order (admin only)
export async function DELETE(_req: Request, { params }: Params) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete order items first (foreign key constraint)
    await supabase.from('order_items').delete().eq('order_id', params.id)
    const { error } = await supabase.from('orders').delete().eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}