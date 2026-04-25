import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const STATUS_MAP: Record<string, string> = {
  'Picked Up':          'shipped',
  'In Transit':         'shipped',
  'Out For Delivery':   'out_for_delivery',
  'Delivered':          'delivered',
  'Undelivered':        'failed_delivery',
  'Cancelled':          'cancelled',
  'RTO Initiated':      'return_initiated',
  'RTO Delivered':      'returned',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    const body = await request.json()

    const awb    = body.awb
    const status = body.current_status

    if (!awb) {
        return NextResponse.json({ ok: true, message: 'No AWB found in payload' })
    }

    const mappedStatus = STATUS_MAP[status]
    
    if (mappedStatus) {
      const { error } = await supabase
        .from('orders')
        .update({ status: mappedStatus })
        .eq('awb_code', awb)

      if (error) {
          console.error('Webhook DB Update Error:', error)
          return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
      }
      
      console.log(`Order status updated via webhook for AWB ${awb}: ${mappedStatus}`)
    } else {
        console.log(`Received unmapped status from Shiprocket for AWB ${awb}: ${status}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Shiprocket Webhook Error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
