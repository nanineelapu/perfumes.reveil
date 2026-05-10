import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyRazorpaySignature, computeShipping } from '@/lib/razorpay'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            address_id,
            buy_now,
        } = body as {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
            address_id: string
            buy_now?: { product_id: string; quantity: number }
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !address_id) {
            return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 })
        }

        // 1. Verify HMAC signature — anyone can call this endpoint, signature is the only proof of payment
        const valid = verifyRazorpaySignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        })
        if (!valid) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
        }

        // 2. Confirm address belongs to user
        const { data: address, error: addressError } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', address_id)
            .eq('user_id', user.id)
            .single()
        if (addressError || !address) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 })
        }

        // 3. Build line items: buy-now (single product) or whole cart
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

            if (cartError) return NextResponse.json({ error: cartError.message }, { status: 500 })
            if (!cartItems || cartItems.length === 0) {
                return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
            }
            lineItems = cartItems.map((c: any) => ({ quantity: c.quantity, products: c.products }))
        }

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

        // 4. Create order with paid status
        const shippingAddress = {
            label: address.label,
            full_name: address.full_name,
            phone: address.phone,
            address_line1: address.address_line1,
            address_line2: address.address_line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
        }

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total,
                status: 'confirmed',
                payment_method: 'razorpay',
                payment_status: 'paid',
                payment_id: razorpay_payment_id,
                shipping_address: shippingAddress,
            })
            .select()
            .single()

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 500 })
        }

        // 5. Insert items with DB prices
        const orderItems = lineItems.map((item) => {
            const product = item.products
            return {
                order_id: order.id,
                product_id: product.id,
                quantity: item.quantity,
                price: product.price,
            }
        })

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            await supabase.from('orders').delete().eq('id', order.id)
            return NextResponse.json({ error: itemsError.message }, { status: 500 })
        }

        // 6. Decrement stock
        for (const item of lineItems) {
            const product = item.products
            await supabase
                .from('products')
                .update({ stock: product.stock - item.quantity })
                .eq('id', product.id)
        }

        // 7. Clear cart — only when this wasn't a "Buy Now" flow
        if (!buy_now?.product_id) {
            await supabase.from('cart_items').delete().eq('user_id', user.id)
        }

        // 8. Fire-and-forget Shiprocket
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        fetch(`${baseUrl}/api/shiprocket/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: order.id }),
        }).catch((err) => console.error('Shiprocket trigger error:', err))

        return NextResponse.json({ success: true, order_id: order.id }, { status: 201 })
    } catch (err: any) {
        console.error('Razorpay verify error:', err)
        return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 })
    }
}