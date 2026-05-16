import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireUser } from '@/lib/auth/require'
import { isUuid, clampInt } from '@/lib/validators'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createShiprocketOrderForOrderId } from '@/lib/fulfillment'
import { computeShipping } from '@/lib/razorpay'
import { triggerOrderConfirmationEmail } from '@/lib/utils/email'
import { NextResponse } from 'next/server'

const COD_MAX_TOTAL_INR = 5000
const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const statusFilter = searchParams.get('status')
    if (statusFilter && !VALID_STATUSES.includes(statusFilter)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const page = clampInt(searchParams.get('page') || '1', 1, 100000) || 1
    const limit = clampInt(searchParams.get('limit') || '20', 1, 100) || 20
    const offset = (page - 1) * limit

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

    if (!isAdmin) query = query.eq('user_id', user.id)
    if (statusFilter) query = query.eq('status', statusFilter)

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
        orders: data,
        total: count,
        page,
        totalPages: Math.ceil((count ?? 0) / limit),
    })
}

export async function POST(request: Request) {
    const auth = await requireUser()
    if (!auth.ok) return auth.response
    const { user, supabase } = auth

    const rl = await rateLimit({ key: `orders:post:${user.id}`, limit: 10, windowSec: 60 })
    if (!rl.ok) return rateLimitResponse(rl)
    const ipRl = await rateLimit({ key: `orders:post:ip:${getClientIp(request)}`, limit: 30, windowSec: 60 })
    if (!ipRl.ok) return rateLimitResponse(ipRl)

    let body: any
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { items, shipping_address, payment_method = 'cod', buy_now = false } = body || {}

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        return NextResponse.json({ error: 'items array is required' }, { status: 400 })
    }
    if (!shipping_address || typeof shipping_address !== 'object') {
        return NextResponse.json({ error: 'shipping_address is required' }, { status: 400 })
    }
    if (payment_method !== 'cod' && payment_method !== 'razorpay') {
        return NextResponse.json({ error: 'Invalid payment_method' }, { status: 400 })
    }
    // Only allow direct creation for COD here — Razorpay must go through
    // /api/payment/razorpay/verify so the payment is bound to the order.
    if (payment_method !== 'cod') {
        return NextResponse.json(
            { error: 'Use /api/payment/razorpay/verify for online payments' },
            { status: 400 }
        )
    }

    // Normalise + validate every line item
    const normalisedItems: { product_id: string; quantity: number }[] = []
    for (const it of items) {
        if (!isUuid(it?.product_id)) return NextResponse.json({ error: 'Invalid product_id' }, { status: 400 })
        const qty = clampInt(it?.quantity, 1, 20)
        if (!qty) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
        normalisedItems.push({ product_id: it.product_id, quantity: qty })
    }

    const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .in('id', normalisedItems.map(i => i.product_id))

    if (productError) {
        return NextResponse.json({ error: 'Could not load products' }, { status: 500 })
    }

    for (const item of normalisedItems) {
        const product = products?.find(p => p.id === item.product_id)
        if (!product) {
            return NextResponse.json({ error: `Product ${item.product_id} not found` }, { status: 404 })
        }
        if (product.stock < item.quantity) {
            return NextResponse.json(
                { error: `Not enough stock for "${product.name}". Available: ${product.stock}` },
                { status: 400 }
            )
        }
    }

    const subtotal = normalisedItems.reduce((sum, item) => {
        const product = products!.find(p => p.id === item.product_id)!
        return sum + product.price * item.quantity
    }, 0)
    const shippingFee = computeShipping(subtotal)
    const total = subtotal + shippingFee

    if (total > COD_MAX_TOTAL_INR) {
        return NextResponse.json(
            { error: `COD is unavailable for orders above ₹${COD_MAX_TOTAL_INR}. Please pay online.` },
            { status: 400 }
        )
    }

    // Atomic create-order + decrement stock via RPC (see security.sql).
    const admin = createAdminClient()
    const { data: orderId, error: rpcError } = await admin.rpc('create_cod_order', {
        p_user_id: user.id,
        p_shipping_address: shipping_address,
        p_items: normalisedItems,
        p_total: total,
    })
    if (rpcError || !orderId) {
        console.error('[orders] create_cod_order RPC error:', rpcError?.message)
        return NextResponse.json({ error: 'Could not place order' }, { status: 500 })
    }

    if (!buy_now) {
        await supabase.from('cart_items').delete().eq('user_id', user.id)
    }

    const { data: fullOrder } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id, quantity, price,
        products ( name, images )
      )
    `)
        .eq('id', orderId as string)
        .single()

    ;(async () => {
        try {
            await createShiprocketOrderForOrderId(orderId as string)
            await triggerOrderConfirmationEmail(orderId as string)
        } catch (err: any) {
            console.error('[orders] Background tasks failed:', err?.message)
        }
    })()

    return NextResponse.json(fullOrder, { status: 201 })
}
