import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { sendOrderDeliveredEmail } from '@/lib/utils/email'
import { sendOrderConfirmationSMS, sendOrderDeliveredSMS } from '@/lib/utils/sms'
import { realEmail } from '@/lib/validators'

type Params = Promise<{ id: string }>

// GET single order
export async function GET(_req: Request, { params }: { params: Params }) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      profiles ( full_name, phone ),
      order_items (
        id, quantity, price,
        products ( id, name, images, slug )
      )
    `)
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Users can only view their own orders
    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'admin' && data.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(data)
}

// PATCH — update order status (admin only)
export async function PATCH(request: Request, { params }: { params: Params }) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
    }

    const { status } = await request.json()

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
        return NextResponse.json(
            { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
            { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // If order was marked as delivered, send the invoice email
    if (status === 'delivered') {
        try {
            // 1. Fetch full order details including products and customer info
            const { data: fullOrder } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles ( full_name, phone ),
                    order_items (
                        id, quantity, price,
                        products ( id, name )
                    )
                `)
                .eq('id', id)
                .single();

            if (fullOrder) {
                // 2. Prefer the real email saved on profiles. Fall back to
                //    auth.users only if it's a real (non-placeholder) address.
                const adminClient = createAdminClient();
                const { data: profileRow } = await adminClient
                    .from('profiles')
                    .select('email')
                    .eq('id', fullOrder.user_id)
                    .maybeSingle();
                const { data: { user: orderUser } } = await adminClient.auth.admin.getUserById(fullOrder.user_id);

                const customerEmail = realEmail(profileRow?.email) || realEmail(orderUser?.email);

                // 3. Dispatch the premium email only if we have a real address.
                if (customerEmail) {
                    await sendOrderDeliveredEmail(fullOrder, customerEmail);
                } else {
                    console.info('[Order Delivered] Skipping email — customer has no real email on file');
                }

                // 4. Dispatch the SMS
                if (fullOrder.profiles?.phone) {
                    await sendOrderDeliveredSMS(fullOrder.profiles.phone, id);
                }
            }
        } catch (emailErr) {
            console.error('Failed to send delivery notifications:', emailErr);
            // We don't return an error here because the order update itself succeeded
        }
    }

    // If order was confirmed, send confirmation SMS
    if (status === 'confirmed') {
        try {
            const { data: fullOrder } = await supabase
                .from('orders')
                .select('*, profiles(full_name, phone)')
                .eq('id', id)
                .single();

            if (fullOrder?.profiles?.phone) {
                await sendOrderConfirmationSMS(
                    fullOrder.profiles.phone, 
                    id, 
                    fullOrder.profiles.full_name || 'Valued Customer'
                );
            }
        } catch (smsErr) {
            console.error('Failed to send confirmation SMS:', smsErr);
        }
    }

    return NextResponse.json(data)
}

// DELETE order (admin only)
export async function DELETE(_req: Request, { params }: { params: Params }) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete order items first (foreign key constraint)
    await supabase.from('order_items').delete().eq('order_id', id)
    const { error } = await supabase.from('orders').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}