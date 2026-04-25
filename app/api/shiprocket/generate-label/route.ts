import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { shiprocketFetch } from '@/lib/shiprocket'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { shipment_id, order_id } = await request.json()

  if (!shipment_id || !order_id) {
    return NextResponse.json({ error: 'Shipment ID and Order ID are required' }, { status: 400 })
  }

  try {
    const data = await shiprocketFetch('/courier/generate/label', {
      method: 'POST',
      body:   JSON.stringify({ shipment_id: [shipment_id] }),
    })

    const labelUrl = data.label_url

    if (!labelUrl) {
      console.warn('Shiprocket Label Response:', data)
      return NextResponse.json({ error: 'Label not ready yet, try again in 30 seconds' }, { status: 400 })
    }

    await supabase
      .from('orders')
      .update({ label_url: labelUrl })
      .eq('id', order_id)

    return NextResponse.json({ success: true, label_url: labelUrl })
  } catch (err: any) {
    console.error('Label Generation Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
