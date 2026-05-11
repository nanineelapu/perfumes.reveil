import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require'
import { shiprocketFetch } from '@/lib/shiprocket'
import { isUuid } from '@/lib/validators'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let body: { shipment_id?: unknown; order_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { shipment_id, order_id } = body
  if (!shipment_id || !isUuid(order_id)) {
    return NextResponse.json({ error: 'shipment_id and valid order_id are required' }, { status: 400 })
  }

  try {
    const data = await shiprocketFetch('/courier/generate/label', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: [String(shipment_id)] }),
    })

    const labelUrl = data.label_url

    if (!labelUrl) {
      return NextResponse.json({ error: 'Label not ready yet, try again in 30 seconds' }, { status: 400 })
    }

    await auth.supabase
      .from('orders')
      .update({ label_url: labelUrl })
      .eq('id', order_id as string)

    return NextResponse.json({ success: true, label_url: labelUrl })
  } catch (err: any) {
    console.error('Label Generation Error:', err?.message)
    return NextResponse.json({ error: 'Failed to generate label' }, { status: 500 })
  }
}
