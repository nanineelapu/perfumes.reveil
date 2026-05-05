/**
 * Message Central OTP Service
 * Handles sending and verifying OTPs via Message Central API.
 * Docs: https://www.messagecentral.com/
 *
 * Required env vars:
 *   MESSAGE_CENTRAL_CUSTOMER_ID  — Your customer ID from Message Central
 *   MESSAGE_CENTRAL_AUTH_TOKEN   — Auth token (base64 encoded password or bearer token)
 *   MESSAGE_CENTRAL_COUNTRY_CODE — Country code (e.g. 91 for India)
 */

const MC_BASE_URL = 'https://cpaas.messagecentral.com'

/**
 * Send an OTP to the given phone number via Message Central.
 * Returns { verificationId, success } on success.
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
        console.warn('[Message Central] Credentials not set — OTP not sent.')
        return { success: false, message: 'OTP service not configured.' }
    }

    // Strip everything except digits, remove leading country code if present
    const digits = phone.replace(/\D/g, '').replace(/^91/, '')

    try {
        const url = `${MC_BASE_URL}/verification/v3/send?countryCode=${countryCode}&customerId=${customerId}&senderId=REVEIL&type=SMS&mobileNumber=${digits}&message=&flowType=SMS`

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                authToken,
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()
        console.log('[Message Central] Send Response:', data)

        if (data?.responseCode === 200 && data?.data?.verificationId) {
            return { success: true, verificationId: String(data.data.verificationId) }
        }

        return {
            success: false,
            message: data?.message || 'Failed to send OTP. Please try again.',
        }
    } catch (err: any) {
        console.error('[Message Central] Send Error:', err)
        return { success: false, message: err.message || 'OTP service error.' }
    }
}

/**
 * Verify the OTP provided by the user.
 * Returns { success: true } if valid, otherwise { success: false, message }.
 */
export async function verifyMessageCentralOTP(
    verificationId: string,
    otp: string
): Promise<{ success: boolean; message?: string }> {
    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID
    const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN

    if (!customerId || !authToken) {
        console.warn('[Message Central] Credentials not set — OTP not verified.')
        return { success: false, message: 'OTP service not configured.' }
    }

    try {
        const url = `${MC_BASE_URL}/verification/v3/validateOtp?customerId=${customerId}&code=${otp}&verificationId=${verificationId}`

        const res = await fetch(url, {
            method: 'GET',
            headers: { authToken },
        })

        const data = await res.json()
        console.log('[Message Central] Verify Response:', data)

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
