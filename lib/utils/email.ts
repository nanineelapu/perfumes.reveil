import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderDeliveredEmail(order: any, userEmail: string) {
    const { id, total, order_items, profiles } = order;
    const customerName = profiles?.full_name || 'Valued Customer';
    
    // Fallback if no Resend key is configured
    if (!resend) {
        console.log('--- MOCK EMAIL START ---');
        console.log(`To: ${userEmail}`);
        console.log(`Subject: REVEIL | Order Delivered & E-Invoice [${id.slice(0, 8)}]`);
        console.log(`Content: Your olfactory journey has arrived. Total: ₹${total}`);
        console.log('--- MOCK EMAIL END ---');
        return { success: true, mocked: true };
    }

    try {
        const itemsHtml = order_items.map((item: any) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222;">
                    <p style="margin: 0; color: #fff; font-size: 14px;">${item.products.name}</p>
                    <p style="margin: 4px 0 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Qty: ${item.quantity}</p>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; text-align: right; color: #d4af37;">
                    ₹${item.price.toLocaleString()}
                </td>
            </tr>
        `).join('');

        const { data, error } = await resend.emails.send({
            from: 'REVEIL <orders@reveil-perfumes.com>', // Replace with your verified domain
            to: userEmail || 'naniatworkmail@gmail.com', // Using provided address as fallback
            subject: `REVEIL | Order Delivered & E-Invoice [${id.slice(0, 8).toUpperCase()}]`,
            html: `
                <div style="background-color: #050505; color: #fff; font-family: 'Georgia', serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #d4af37; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; margin: 0; font-size: 24px;">REVEIL</h1>
                        <p style="color: #666; font-size: 10px; letter-spacing: 0.4em; margin-top: 10px; text-transform: uppercase;">Studio Archive</p>
                    </div>

                    <div style="margin-bottom: 40px;">
                        <h2 style="font-weight: 300; font-size: 20px; border-bottom: 1px solid #d4af37; padding-bottom: 10px; color: #fff;">E-INVOICE</h2>
                        <p style="color: #888; font-size: 13px; line-height: 1.6;">
                            Dear ${customerName},<br><br>
                            Your olfactory journey has reached its destination. We are pleased to confirm that your order has been delivered. Below are the details of your archive acquisition.
                        </p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; padding-bottom: 10px;">Item</th>
                                <th style="text-align: right; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; padding-bottom: 10px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 20px 0; color: #888; font-size: 14px;">Total Archive Value</td>
                                <td style="padding: 20px 0; text-align: right; color: #d4af37; font-size: 18px; font-weight: bold;">₹${total.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="background: #111; padding: 20px; border-radius: 2px; margin-bottom: 40px;">
                        <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px;">Reference ID</p>
                        <p style="color: #fff; font-size: 13px; margin: 0; font-family: monospace;">${id.toUpperCase()}</p>
                    </div>

                    <div style="text-align: center; color: #444; font-size: 11px; font-style: italic;">
                        <p>Thank you for choosing REVEIL. <br> May your presence be unforgettable.</p>
                        <div style="width: 40px; height: 1px; background: #d4af37; margin: 20px auto; opacity: 0.3;"></div>
                        <p style="letter-spacing: 0.2em; text-transform: uppercase;">reveil-perfumes.com</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email Dispatch Error:', err);
        return { success: false, error: err };
    }
}
