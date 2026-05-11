import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require'
import { isUuid } from '@/lib/validators'
import { createShiprocketOrderForOrderId } from '@/lib/fulfillment'

export async function POST(request: Request) {
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    let body: any
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const orderId = body?.orderId
    if (!isUuid(orderId)) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })

    try {
        const result = await createShiprocketOrderForOrderId(orderId)
        return NextResponse.json({
            success: true,
            shiprocket_order_id: result.shiprocket_order_id,
            shiprocket_shipment_id: result.shipment_id,
        })
    } catch (error: any) {
        console.error('Fulfillment Error:', error?.message)
        return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 })
    }
}
