/**
 * Msg91 SMS Service
 * Handles dispatching SMS notifications via Msg91 API.
 */

const MSG91_API_URL = 'https://api.msg91.com/api/v5/flow/';

export async function sendSMSNotification(phone: string, templateId: string, params: Record<string, string>) {
    const authKey = process.env.MSG91_AUTH_KEY;
    
    if (!authKey) {
        console.log('--- MOCK SMS START ---');
        console.log(`To: ${phone}`);
        console.log(`Template: ${templateId}`);
        console.log(`Params:`, params);
        console.log('--- MOCK SMS END ---');
        return { success: true, mocked: true };
    }

    try {
        const response = await fetch(MSG91_API_URL, {
            method: 'POST',
            headers: {
                'authkey': authKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                template_id: templateId,
                short_url: '1', // Optional
                recipients: [
                    {
                        mobiles: phone.startsWith('+91') ? phone.slice(3) : phone,
                        ...params
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Msg91 Error:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (err) {
        console.error('SMS Dispatch Error:', err);
        return { success: false, error: err };
    }
}

/**
 * Utility to send Order Confirmation SMS
 */
export async function sendOrderConfirmationSMS(phone: string, orderId: string, customerName: string) {
    const flowId = process.env.MSG91_FLOW_ID_CONFIRMED;
    if (!flowId) return { success: false, error: 'Flow ID not configured' };

    return await sendSMSNotification(phone, flowId, {
        name: customerName,
        order_id: orderId.slice(0, 8).toUpperCase()
    });
}

/**
 * Utility to send Order Delivered SMS
 */
export async function sendOrderDeliveredSMS(phone: string, orderId: string) {
    const flowId = process.env.MSG91_FLOW_ID_DELIVERED;
    if (!flowId) return { success: false, error: 'Flow ID not configured' };

    return await sendSMSNotification(phone, flowId, {
        order_id: orderId.slice(0, 8).toUpperCase()
    });
}
