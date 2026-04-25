export async function sendMSG91OTP(phone: string) {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    
    // MSG91 expects number without '+'
    const cleanPhone = phone.replace('+', '');

    try {
        const response = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${cleanPhone}`, {
            method: 'POST',
            headers: {
                'authkey': authKey || '',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('MSG91 Send Error:', error);
        return { type: 'error', message: 'SMS Gateway connection failed' };
    }
}

export async function verifyMSG91OTP(phone: string, otp: string) {
    const authKey = process.env.MSG91_AUTH_KEY;
    const cleanPhone = phone.replace('+', '');

    try {
        const response = await fetch(`https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${cleanPhone}&authkey=${authKey}`, {
            method: 'GET'
        });
        return await response.json();
    } catch (error) {
        console.error('MSG91 Verify Error:', error);
        throw error;
    }
}
