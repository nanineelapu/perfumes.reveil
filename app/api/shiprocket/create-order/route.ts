import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require'
import { isUuid } from '@/lib/validators'
import { createShiprocketOrderForOrderId } from '@/lib/fulfillment'
import { triggerOrderFulfilledEmail } from '@/lib/utils/email'

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

  const orderId = body.order_id as string

  try {
    const result = await createShiprocketOrderForOrderId(orderId)

    // Send the customer "your order has shipped" email. We AWAIT it so the
    // admin sees a clear warning in the UI if the email part failed (e.g.
    // RESEND_API_KEY missing, customer has no email). The Shiprocket push has
    // already succeeded, so we still return 200 — but with an emailWarning
    // field the frontend can surface.
    const emailResult = await triggerOrderFulfilledEmail(orderId)

    if (!emailResult.ok) {
      const hint =
        emailResult.reason === 'resend_not_configured'
          ? 'Add RESEND_API_KEY in Vercel env vars and redeploy.'
          : emailResult.reason === 'no_customer_email'
          ? 'Customer has no email on profile and none in auth.users. Add an email manually.'
          : 'See server logs for the upstream Resend error.'
      return NextResponse.json({
        success: true,
        ...result,
        emailWarning: `Fulfilled — but customer email was not sent (${emailResult.reason}).`,
        emailHint: hint,
      })
    }

    return NextResponse.json({
      success: true,
      ...result,
      emailSent: true,
    })
  } catch (err: any) {
    const reason = err?.message || 'Failed to create Shiprocket order'
    console.error('Shiprocket API Error:', reason)
    // Admin-only endpoint — safe to surface the real upstream reason.
    return NextResponse.json({ error: reason }, { status: 500 })
  }
}
