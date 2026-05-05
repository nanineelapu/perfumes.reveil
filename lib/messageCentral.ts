/**
 * Message Central OTP Service
 * Handles sending and verifying OTPs via Message Central API.
 * Docs: https://www.messagecentral.com/
 *
 * Required env vars:
 *   MESSAGE_CENTRAL_CUSTOMER_ID  — Your customer ID (e.g. C-9098EFD657F64B3)
 *   MESSAGE_CENTRAL_AUTH_TOKEN   — The JWT auth token from MC dashboard (starts with eyJ...)
 *   MESSAGE_CENTRAL_COUNTRY_CODE — Country code (default: 91 for India)
 */

const MC_BASE_URL = 'https://cpaas.messagecentral.com'

/**
 * Send an OTP to the given phone number via Message Central.
 */
export async function sendMessageCentralOTP(phone: string): Promise<{
    success: boolean
    verificationId?: string
    message?: string
}> {
    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID
    const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN
    const countryCode = process.env.MESSAGE_CENTRAL_COUNTRY_CODE || '91'

    if (!customerId || !authToken) {
        console.error('[Message Central] Missing CUSTOMER_ID or AUTH_TOKEN env vars.')
        return { success: false, message: 'OTP service not configured.' }
    }

    // Strip everything except digits, remove leading 91 if present
    const digits = phone.replace(/\D/g, '').replace(/^91/, '')

    try {
        const url = `${MC_BASE_URL}/verification/v3/send?countryCode=${countryCode}&customerId=${customerId}&flowType=SMS&mobileNumber=${digits}&otpLength=4`

        console.log('[Message Central] Sending OTP to:', digits)

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                authToken,
                'Content-Type': 'application/json',
            },
        })

        const text = await res.text()
        console.log('[Message Central] Send raw response:', text)

        let data: any
        try {
            data = JSON.parse(text)
        } catch {
            return { success: false, message: `MC service error: ${text.slice(0, 100)}` }
        }

        if (data?.responseCode === 200 && data?.data?.verificationId) {
            return { success: true, verificationId: String(data.data.verificationId) }
        }

        return {
            success: false,
            message: data?.message || `OTP failed (code: ${data?.responseCode})`,
        }
    } catch (err: any) {
        console.error('[Message Central] Send Error:', err)
        return { success: false, message: err.message || 'OTP service error.' }
    }
}

/**
 * Verify the OTP provided by the user.
 */
export async function verifyMessageCentralOTP(
    verificationId: string,
    otp: string
): Promise<{ success: boolean; message?: string }> {
    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID
    const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN

    if (!customerId || !authToken) {
        return { success: false, message: 'OTP service not configured.' }
    }

    try {
        const url = `${MC_BASE_URL}/verification/v3/validateOtp?customerId=${customerId}&code=${otp}&verificationId=${verificationId}`

        const res = await fetch(url, {
            method: 'GET',
            headers: { authToken },
        })

        const text = await res.text()
        console.log('[Message Central] Verify raw response:', text)

        let data: any
        try {
            data = JSON.parse(text)
        } catch {
            return { success: false, message: `Verify service error: ${text.slice(0, 100)}` }
        }

        if (data?.responseCode === 200 && data?.data?.verificationStatus === 'VERIFICATION_COMPLETED') {
            return { success: true }
        }

        return {
            success: false,
            message: data?.message || 'Invalid or expired OTP.',
        }
    } catch (err: any) {
        console.error('[Message Central] Verify Error:', err)
        return { success: false, message: err.message || 'OTP verification error.' }
    }
}
