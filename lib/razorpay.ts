import Razorpay from 'razorpay'
import crypto from 'crypto'

let cached: Razorpay | null = null

export function getRazorpay(): Razorpay {
    if (cached) return cached
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local')
    }
    cached = new Razorpay({ key_id, key_secret })
    return cached
}

function safeEqualHex(a: string, b: string): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') return false
    if (a.length !== b.length) return false
    try {
        return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
    } catch {
        return false
    }
}

export function verifyRazorpaySignature(params: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
        console.error('[razorpay] RAZORPAY_KEY_SECRET not configured — refusing verification')
        return false
    }
    const expected = crypto
        .createHmac('sha256', secret)
        .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
        .digest('hex')
    return safeEqualHex(expected, params.razorpay_signature)
}

/**
 * Verify a Razorpay webhook signature. The webhook secret is separate from the
 * key secret and is configured per-webhook in the Razorpay dashboard.
 */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string | null): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) {
        console.error('[razorpay] RAZORPAY_WEBHOOK_SECRET not configured — refusing webhook')
        return false
    }
    if (!signature) return false
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    return safeEqualHex(expected, signature)
}

// Free delivery threshold (rupees). Orders >= this value ship free.
export const FREE_SHIPPING_THRESHOLD = 249
export const SHIPPING_FEE = 50

export function computeShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
