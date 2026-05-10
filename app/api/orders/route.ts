import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Check if admin (admins see all orders, users see only their own)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    let query = supabase
        .from('orders')
        .select(`
      id,
      total,
      status,
      payment_method,
      shipping_address,
      created_at,
      profiles ( id, full_name, phone ),
      order_items (
        id,
        quantity,
        price,
        products ( id, name, images, slug )
      )
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    // Non-admin users only see their own orders
    if (!isAdmin) query = query.eq('user_id', user.id)

    // Optional status filter
    if (status) query = query.eq('status', status)

    const { data, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
        orders: data,
        total: count,
        page,
        totalPages: Math.ceil((count ?? 0) / limit)
    })
}

export async function POST(request: Request) {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const body = await request.json()
    const { items, shipping_address, payment_method = 'cod', buy_now = false } = body

    // 3. Validate
    if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'items array is required' }, { status: 400 })
    }
    if (!shipping_address) {
        return NextResponse.json({ error: 'shipping_address is required' }, { status: 400 })
    }

    // 4. Verify stock and get live prices from DB
    //    Never trust prices sent from the client — always read from DB
    const productIds = items.map((i: any) => i.product_id)

    const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .in('id', productIds)

    if (productError) {
        return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    // Check every product exists and has enough stock
    for (const item of items) {
        const product = products?.find(p => p.id === item.product_id)
        if (!product) {
            return NextResponse.json(
                { error: `Product ${item.product_id} not found` },
                { status: 404 }
            )
        }
        if (product.stock < item.quantity) {
            return NextResponse.json(
                { error: `Not enough stock for "${product.name}". Available: ${product.stock}` },
                { status: 400 }
            )
        }
    }

    // 5. Calculate total using DB prices (not client prices)
    const subtotal = items.reduce((sum: number, item: any) => {
        const product = products!.find(p => p.id === item.product_id)!
        return sum + product.price * item.quantity
    }, 0)

    const shippingFee = subtotal >= 249 ? 0 : 50
    const total = subtotal + shippingFee

    // 6. Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total,
            status: 'pending',
            payment_method,
            payment_status: payment_method === 'cod' ? 'pending' : 'pending',
            shipping_address,
        })
        .select()
        .single()

    if (orderError) {
        return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // 7. Insert order items with DB prices
    const orderItems = items.map((item: any) => {
        const product = products!.find(p => p.id === item.product_id)!
        return {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,   // always use DB price
        }
    })

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        // Rollback: delete the order if items failed
        await supabase.from('orders').delete().eq('id', order.id)
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // 8. Decrement stock for each product
    for (const item of items) {
        const product = products!.find(p => p.id === item.product_id)!
        await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id)
    }

    // 9. Clear user's cart — skip when this was a "Buy Now" flow
    if (!buy_now) {
        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
    }

    // 10. Return full order with items
    const { data: fullOrder } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id, quantity, price,
        products ( name, images )
      )
    `)
        .eq('id', order.id)
        .single()

    // 10. TRIGGER SHIPROCKET (Background)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    fetch(`${baseUrl}/api/shiprocket/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
    }).catch(err => console.error('Shiprocket Background Trigger Error:', err))

    return NextResponse.json(fullOrder, { status: 201 })
}