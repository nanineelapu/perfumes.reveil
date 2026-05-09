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

export function verifyRazorpaySignature(params: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return false
    const expected = crypto
        .createHmac('sha256', secret)
        .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
        .digest('hex')
    return expected === params.razorpay_signature
}

// Free delivery threshold (rupees). Orders >= this value ship free.
export const FREE_SHIPPING_THRESHOLD = 249
export const SHIPPING_FEE = 50

export function computeShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}