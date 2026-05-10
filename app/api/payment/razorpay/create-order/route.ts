import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpay, computeShipping } from '@/lib/razorpay'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json().catch(() => ({}))
        const { address_id, buy_now } = body as {
            address_id?: string
            buy_now?: { product_id: string; quantity: number }
        }

        if (!address_id) {
            return NextResponse.json({ error: 'address_id is required' }, { status: 400 })
        }

        // Verify the address belongs to this user
        const { data: address, error: addressError } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', address_id)
            .eq('user_id', user.id)
            .single()

        if (addressError || !address) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 })
        }

        // Build line items: from buy_now (single product) or from cart_items
        type LineItem = { quantity: number; products: { id: string; name: string; price: number; stock: number } }
        let lineItems: LineItem[] = []

        if (buy_now?.product_id) {
            const qty = Math.max(1, Number(buy_now.quantity) || 1)
            const { data: product, error: prodErr } = await supabase
                .from('products')
                .select('id, name, price, stock')
                .eq('id', buy_now.product_id)
                .single()
            if (prodErr || !product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }
            lineItems = [{ quantity: qty, products: product as any }]
        } else {
            const { data: cartItems, error: cartError } = await supabase
                .from('cart_items')
                .select('id, quantity, products ( id, name, price, stock )')
                .eq('user_id', user.id)

            if (cartError) {
                return NextResponse.json({ error: cartError.message }, { status: 500 })
            }
            if (!cartItems || cartItems.length === 0) {
                return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
            }
            lineItems = cartItems.map((c: any) => ({ quantity: c.quantity, products: c.products }))
        }

        // Stock + subtotal
        let subtotal = 0
        for (const item of lineItems) {
            const product = item.products
            if (!product) {
                return NextResponse.json({ error: 'A product is no longer available' }, { status: 400 })
            }
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Not enough stock for "${product.name}". Available: ${product.stock}` },
                    { status: 400 }
                )
            }
            subtotal += product.price * item.quantity
        }

        const shippingFee = computeShipping(subtotal)
        const total = subtotal + shippingFee

        const razorpay = getRazorpay()
        const rpOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // paise
            currency: 'INR',
            receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
            notes: {
                user_id: user.id,
                address_id,
            },
        })

        return NextResponse.json({
            razorpay_order_id: rpOrder.id,
            amount: rpOrder.amount,
            currency: rpOrder.currency,
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
            subtotal,
            shipping: shippingFee,
            total,
        })
    } catch (err: any) {
        console.error('Razorpay create-order error:', err)
        const message = err?.error?.description || err?.message || 'Failed to create payment order'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}