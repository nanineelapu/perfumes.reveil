import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { shiprocketFetch } from '@/lib/shiprocket'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { order_id } = await request.json()

  // Fetch full order from Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles ( full_name, phone, email ),
      order_items (
        quantity, price,
        products ( name, price )
      )
    `)
    .eq('id', order_id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const address = order.shipping_address as any

  // Build Shiprocket order payload
  const payload = {
    order_id:          order.id.slice(0, 12).toUpperCase(),
    order_date:        new Date(order.created_at).toISOString().slice(0, 19),
    pickup_location:   process.env.SHIPROCKET_PICKUP_NAME || "Primary",

    billing_customer_name:  address.name || order.profiles?.full_name || 'Customer',
    billing_address:        address.line1 || address.address || 'Address line missing',
    billing_city:           address.city || 'City missing',
    billing_pincode:        address.pincode || address.postal_code || '000000',
    billing_state:          address.state || 'State missing',
    billing_country:        'India',
    billing_email:          order.profiles?.email || 'email@missing.com',
    billing_phone:          address.phone || order.profiles?.phone || '0000000000',

    shipping_is_billing:    true,

    payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
    sub_total:      order.total,
    length:         15,
    breadth:        15,
    height:         15,
    weight:         0.5,

    order_items: order.order_items.map((item: any) => ({
      name:         item.products.name,
      sku:          item.products.name.toLowerCase().replace(/\s+/g, '-'),
      units:        item.quantity,
      selling_price: item.price,
      discount:     0,
      tax:          0,
      hsn:          0,
    })),
  }

  try {
    const data = await shiprocketFetch('/orders/create/adhoc', {
      method: 'POST',
      body:   JSON.stringify(payload),
    })

    if (!data.order_id) {
        throw new Error(data.message || 'Failed to create Shiprocket order')
    }

    // Save Shiprocket order ID back to Supabase
    await supabase
      .from('orders')
      .update({ 
          shiprocket_order_id: String(data.order_id),
          shiprocket_shipment_id: String(data.shipment_id),
          status: 'processing'
      })
      .eq('id', order_id)

    return NextResponse.json({
      success:          true,
      shiprocket_order_id: data.order_id,
      shipment_id:      data.shipment_id,
    })
  } catch (err: any) {
    console.error('Shiprocket API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
