import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
  // Fail closed: refuse without a configured webhook token.
  const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN
  if (!expectedToken) {
    console.error('[delivery webhook] SHIPROCKET_WEBHOOK_TOKEN is not set — refusing request')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const incomingToken = request.headers.get('x-api-key')
  if (incomingToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: true, warning: 'invalid payload' })
  }

  const awb = body?.awb
  const status = body?.current_status

  if (!awb) {
    return NextResponse.json({ ok: true, message: 'Endpoint is active' })
  }

  const mappedStatus = STATUS_MAP[status]
  if (!mappedStatus) {
    return NextResponse.json({ ok: true, message: 'Status not mapped' })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ status: mappedStatus })
    .eq('awb_code', awb)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
