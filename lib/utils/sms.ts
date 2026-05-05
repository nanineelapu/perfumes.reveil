/**
 * Message Central SMS Notification Service
 * Handles dispatching transactional SMS (order confirmations, delivery alerts)
 * via the Message Central flow API.
 *
 * Required env vars:
 *   MESSAGE_CENTRAL_CUSTOMER_ID
 *   MESSAGE_CENTRAL_AUTH_TOKEN
 *   MESSAGE_CENTRAL_FLOW_ID_CONFIRMED   (order confirmation template ID)
 *   MESSAGE_CENTRAL_FLOW_ID_DELIVERED   (order delivered template ID)
 */

const MC_BASE_URL = 'https://cpaas.messagecentral.com'

export async function sendSMSNotification(
    phone: string,
    templateId: string,
    params: Record<string, string>
) {
    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID
    const authToken = process.env.MESSAGE_CENTRAL_AUTH_TOKEN

    if (!customerId || !authToken) {
        // Mock mode: log to console instead of sending
        console.log('--- MOCK SMS START ---')
        console.log(`To: ${phone}`)
        console.log(`Template: ${templateId}`)
        console.log(`Params:`, params)
        console.log('--- MOCK SMS END ---')
        return { success: true, mocked: true }
    }

    const digits = phone.replace(/\D/g, '').replace(/^91/, '')

    try {
        // Build the message body from params — adjust as needed for your templates
        const paramStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
        const url = `${MC_BASE_URL}/verification/v3/send?countryCode=91&customerId=${customerId}&senderId=REVEIL&type=SMS&mobileNumber=${digits}&flowId=${templateId}&${paramStr}`

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                authToken,
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()

        if (!res.ok) {
            console.error('[Message Central SMS] Error:', data)
            return { success: false, error: data }
        }

        return { success: true, data }
    } catch (err) {
        console.error('[Message Central SMS] Dispatch Error:', err)
        return { success: false, error: err }
    }
}

/**
 * Send Order Confirmation SMS
 */
export async function sendOrderConfirmationSMS(phone: string, orderId: string, customerName: string) {
    const flowId = process.env.MESSAGE_CENTRAL_FLOW_ID_CONFIRMED
    if (!flowId) return { success: false, error: 'Flow ID not configured' }

    return await sendSMSNotification(phone, flowId, {
        name: customerName,
        order_id: orderId.slice(0, 8).toUpperCase(),
    })
}

/**
 * Send Order Delivered SMS
 */
export async function sendOrderDeliveredSMS(phone: string, orderId: string) {
    const flowId = process.env.MESSAGE_CENTRAL_FLOW_ID_DELIVERED
    if (!flowId) return { success: false, error: 'Flow ID not configured' }

    return await sendSMSNotification(phone, flowId, {
        order_id: orderId.slice(0, 8).toUpperCase(),
    })
}
