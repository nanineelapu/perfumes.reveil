import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { shiprocketFetch } from '@/lib/shiprocket'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { order_id, shipment_id } = await request.json()

  // 1. Check serviceability
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('shipping_address')
    .eq('id', order_id)
    .single()

  if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const address    = order?.shipping_address as any
  const pincode    = address.pincode || address.postal_code || '000000'
  
  try {
    const serviceRes = await shiprocketFetch(
      `/courier/serviceability/?pickup_postcode=${process.env.SHIPROCKET_PICKUP_PINCODE || '500001'}&delivery_postcode=${pincode}&weight=0.5&cod=1`
    )

    // 2. Pick cheapest recommended courier
    const couriers        = serviceRes.data?.available_courier_companies ?? []
    const bestCourier     = couriers.sort((a: any, b: any) => Number(a.rate) - Number(b.rate))[0]

    if (!bestCourier) {
      return NextResponse.json({ error: 'No courier available for this pincode' }, { status: 400 })
    }

    // 3. Assign courier + get AWB
    const assignRes = await shiprocketFetch('/courier/assign/awb', {
      method: 'POST',
      body:   JSON.stringify({
        shipment_id: String(shipment_id),
        courier_id: String(bestCourier.courier_company_id),
      }),
    })

    // Check for AWB in response
    const awbData = assignRes.response?.data
    const awb     = (assignRes.awb_assign_status === 1 || assignRes.status === 1) ? (awbData?.awb_code || assignRes.awb_code) : null
    const courierName = bestCourier.courier_name

    if (!awb) {
      console.error('Shiprocket AWB Error:', assignRes)
      return NextResponse.json({ error: assignRes.message || 'AWB assignment failed' }, { status: 500 })
    }

    // 4. Save AWB + courier to Supabase
    await supabase
      .from('orders')
      .update({
        awb_code:     awb,
        courier_name: courierName,
        status:       'shipped',
      })
      .eq('id', order_id)

    return NextResponse.json({ success: true, awb, courier_name: courierName })
  } catch (err: any) {
    console.error('Courier Assignment Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
