import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
  // Use a direct client for webhooks (no cookies needed)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Verify Token (Shiprocket sends this in 'x-api-key' header)
  const incomingToken = request.headers.get('x-api-key')
  const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN

  if (expectedToken && incomingToken !== expectedToken) {
    console.error('Webhook Auth Failed: Invalid Token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    console.log('Incoming Webhook Payload:', body)

    const awb    = body.awb
    const status = body.current_status

    if (!awb) {
        // This handles Shiprocket's "Test Webhook" which might send an empty or partial body
        return NextResponse.json({ ok: true, message: 'Endpoint is active' })
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
    // Always return 200 during testing if the crash was just a parsing error
    return NextResponse.json({ ok: true, warning: 'Payload parse error' })
  }
}
