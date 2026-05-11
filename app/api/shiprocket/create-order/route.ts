import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require'
import { isUuid } from '@/lib/validators'
import { createShiprocketOrderForOrderId } from '@/lib/fulfillment'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let body: { order_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isUuid(body.order_id)) {
    return NextResponse.json({ error: 'order_id must be a UUID' }, { status: 400 })
  }

  try {
    const result = await createShiprocketOrderForOrderId(body.order_id as string)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    const reason = err?.message || 'Failed to create Shiprocket order'
    console.error('Shiprocket API Error:', reason)
    // Admin-only endpoint — safe to surface the real upstream reason.
    return NextResponse.json({ error: reason }, { status: 500 })
  }
}
