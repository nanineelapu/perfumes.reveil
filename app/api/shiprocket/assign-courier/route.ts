import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require'
import { shiprocketFetch } from '@/lib/shiprocket'
import { isUuid } from '@/lib/validators'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let body: { order_id?: unknown; shipment_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!isUuid(body.order_id) || !body.shipment_id) {
    return NextResponse.json({ error: 'order_id and shipment_id required' }, { status: 400 })
  }
  const order_id = body.order_id as string
  const shipment_id = String(body.shipment_id)

  const { data: order, error: orderError } = await auth.supabase
    .from('orders')
    .select('shipping_address')
    .eq('id', order_id)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const address = order?.shipping_address as any
  const pincode = address?.pincode || address?.postal_code || '000000'

  try {
    const serviceRes = await shiprocketFetch(
      `/courier/serviceability/?pickup_postcode=${encodeURIComponent(process.env.SHIPROCKET_PICKUP_PINCODE || '500001')}&delivery_postcode=${encodeURIComponent(pincode)}&weight=0.5&cod=1`
    )

    const couriers = serviceRes.data?.available_courier_companies ?? []
    const bestCourier = couriers.sort((a: any, b: any) => Number(a.rate) - Number(b.rate))[0]

    if (!bestCourier) {
      return NextResponse.json({ error: 'No courier available for this pincode' }, { status: 400 })
    }

    const assignRes = await shiprocketFetch('/courier/assign/awb', {
      method: 'POST',
      body: JSON.stringify({
        shipment_id,
        courier_id: String(bestCourier.courier_company_id),
      }),
    })

    const awbData = assignRes.response?.data
    const awb = (assignRes.awb_assign_status === 1 || assignRes.status === 1) ? (awbData?.awb_code || assignRes.awb_code) : null
    const courierName = bestCourier.courier_name

    if (!awb) {
      console.error('Shiprocket AWB Error:', assignRes?.message)
      return NextResponse.json({ error: 'AWB assignment failed' }, { status: 500 })
    }

    await auth.supabase
      .from('orders')
      .update({
        awb_code: awb,
        courier_name: courierName,
        status: 'shipped',
      })
      .eq('id', order_id)

    return NextResponse.json({ success: true, awb, courier_name: courierName })
  } catch (err: any) {
    console.error('Courier Assignment Error:', err?.message)
    return NextResponse.json({ error: 'Courier assignment failed' }, { status: 500 })
  }
}
