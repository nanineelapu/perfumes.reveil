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
        const { address_id } = body as { address_id?: string }

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

        // Pull the live cart and price from DB — never trust client values
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

        // Stock + subtotal
        let subtotal = 0
        for (const item of cartItems) {
            const product = item.products as any
            if (!product) {
                return NextResponse.json({ error: 'A product in your cart is no longer available' }, { status: 400 })
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