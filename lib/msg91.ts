export async function sendMSG91OTP(phone: string) {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    
    // Remove '+' and make sure it's just the number with country code (e.g. 919999999999)
    const cleanPhone = phone.replace('+', '');

    try {
        const response = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${cleanPhone}&authkey=${authKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        console.error('MSG91 Send Error:', error);
        throw error;
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
