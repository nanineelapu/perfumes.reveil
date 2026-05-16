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
            to: userEmail || 'reveilfragrances@gmail.com', // Using provided address as fallback
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

export async function sendOrderConfirmationEmail(order: any, userEmail: string) {
    const { id, total, order_items, profiles } = order;
    const customerName = profiles?.full_name || 'Valued Customer';
    
    if (!resend) {
        console.log('--- MOCK ORDER CONFIRMATION START ---');
        console.log(`To: ${userEmail}`);
        console.log(`Subject: REVEIL | Order Confirmed [${id.slice(0, 8)}]`);
        return { success: true, mocked: true };
    }

    try {
        const itemsHtml = order_items.map((item: any) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">
                    <p style="margin: 0; color: #fff; font-size: 14px; font-weight: 500;">${item.products.name}</p>
                    <p style="margin: 4px 0 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Quantity: ${item.quantity}</p>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; text-align: right; color: #d4af37; font-weight: 500;">
                    ₹${item.price.toLocaleString()}
                </td>
            </tr>
        `).join('');

        const { data, error } = await resend.emails.send({
            from: 'REVEIL <orders@reveil-perfumes.com>',
            to: userEmail,
            subject: `REVEIL | Order Confirmed [${id.slice(0, 8).toUpperCase()}]`,
            html: `
                <div style="background-color: #050505; color: #fff; font-family: 'Baskerville', 'Georgia', serif; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
                    <div style="text-align: center; margin-bottom: 50px;">
                        <h1 style="color: #d4af37; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; margin: 0; font-size: 28px;">REVEIL</h1>
                        <p style="color: #666; font-size: 10px; letter-spacing: 0.5em; margin-top: 12px; text-transform: uppercase;">The Art of Presence</p>
                    </div>

                    <div style="margin-bottom: 40px; text-align: center;">
                        <h2 style="font-weight: 300; font-size: 22px; color: #fff; text-transform: uppercase; letter-spacing: 0.1em;">Order Confirmed</h2>
                        <div style="width: 30px; height: 1px; background: #d4af37; margin: 15px auto;"></div>
                        <p style="color: #888; font-size: 14px; line-height: 1.8; margin-top: 20px;">
                            Dear ${customerName},<br><br>
                            Thank you for your acquisition from the REVEIL Archive. Your order has been successfully placed and is now being prepared by our laboratory.
                        </p>
                    </div>

                    <div style="background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; margin-bottom: 40px;">
                        <h3 style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 20px; font-weight: 400;">Your Selection</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td style="padding: 25px 0 0; color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Grand Total</td>
                                    <td style="padding: 25px 0 0; text-align: right; color: #d4af37; font-size: 20px; font-weight: 600;">₹${total.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div style="margin-bottom: 40px;">
                        <div style="display: flex; justify-content: space-between; gap: 20px;">
                            <div style="flex: 1;">
                                <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Order Reference</p>
                                <p style="color: #fff; font-size: 12px; margin: 0; font-family: monospace;">#${id.toUpperCase().slice(0, 12)}</p>
                            </div>
                            <div style="flex: 1; text-align: right;">
                                <p style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Status</p>
                                <p style="color: #d4af37; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">Processing</p>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #1a1a1a; padding-top: 40px; color: #444; font-size: 11px;">
                        <p style="margin-bottom: 15px;">Our artisans are now preparing your selection for transit.</p>
                        <p>Questions about your order? Reply to this email or visit our <a href="https://reveilfragrances.in/track" style="color: #d4af37; text-decoration: none;">tracking portal</a>.</p>
                        <div style="margin-top: 30px;">
                            <p style="letter-spacing: 0.3em; text-transform: uppercase; color: #666;">REVEILFRAGRANCES.IN</p>
                        </div>
                    </div>
                </div>
            `
        });

        return { success: !error, data, error };
    } catch (err) {
        return { success: false, error: err };
    }
}

export async function triggerOrderConfirmationEmail(orderId: string) {
    try {
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const admin = createAdminClient();
        
        const { data: order } = await admin
            .from('orders')
            .select(`
                id,
                total,
                profiles ( full_name, email ),
                order_items (
                    quantity,
                    price,
                    products ( name )
                )
            `)
            .eq('id', orderId)
            .single();
        if (!order) return;
        const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;

        if (profile?.email) {
            const normalizedOrder = { ...order, profiles: profile };
            await sendOrderConfirmationEmail(normalizedOrder, profile.email);
        }
    } catch (err) {
        console.error('[triggerOrderConfirmationEmail] Error:', err);
    }
}

export async function sendAdminCredentialsEmail(recipientEmail: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) return { success: true, mocked: true };
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    try {
        await resend.emails.send({
            from: 'REVEIL Security <security@reveil-perfumes.com>',
            to: recipientEmail,
            subject: 'REVEIL | Your Administrative Access Credentials',
            html: `
                <div style="background-color: #050505; color: #fff; font-family: 'Georgia', serif; padding: 40px; border: 1px solid #1a1a1a; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #d4af37; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;">REVEIL</h1>
                        <p style="color: #666; font-size: 10px; letter-spacing: 0.5em; text-transform: uppercase;">Laboratory Security</p>
                    </div>
                    
                    <p style="color: #ccc; font-size: 14px; line-height: 1.6;">
                        Below are the requested administrative credentials for the REVEIL Laboratory Archive system.
                    </p>
                    
                    <div style="background: #0a0a0a; padding: 30px; border-left: 2px solid #d4af37; margin: 30px 0;">
                        <p style="margin: 0 0 15px; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">Direct Access Link</p>
                        <p style="margin: 0 0 25px; color: #fff; font-size: 14px;">https://reveilfragrances.in/static-v2-resource-policy-handler/login</p>
                        
                        <p style="margin: 0 0 10px; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">Credentials</p>
                        <p style="margin: 0; color: #fff; font-size: 14px;"><strong>Email:</strong> reveilfragrances@gmail.com</p>
                        <p style="margin: 8px 0 0; color: #fff; font-size: 14px;"><strong>Password:</strong> BalajISaanU1095#</p>
                    </div>
                    
                    <p style="color: #444; font-size: 11px; font-style: italic; border-top: 1px solid #1a1a1a; padding-top: 20px;">
                        This is a confidential system transmission. Please ensure these credentials are stored securely and not shared with unauthorized personnel.
                    </p>
                </div>
            `
        });
        return { success: true };
    } catch (err) {
        console.error('[sendAdminCredentialsEmail] Error:', err);
        return { success: false, error: err };
    }
}
