import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ShiprocketService } from '@/lib/shiprocket';

export async function POST(request: Request) {
    const supabase = await createClient();

    // 1. Auth & Admin Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 2. Get Order ID
    const { orderId } = await request.json();
    if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    try {
        // 3. Fetch Order Details with Items
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select(`
                *,
                profiles ( full_name, email, phone ),
                order_items (
                    quantity,
                    price,
                    products ( name, slug )
                )
            `)
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            throw new Error(fetchError?.message || 'Order not found');
        }

        // 4. Format Data for Shiprocket
        const address = order.shipping_address; // Assuming this is a JSON object with city, state, etc.
        
        const shiprocketData = {
            order_id: order.id,
            order_date: new Date(order.created_at).toISOString().split('T')[0],
            pickup_location: "Primary", // This must match a location name in your Shiprocket panel
            billing_customer_name: order.profiles?.full_name?.split(' ')[0] || 'Customer',
            billing_last_name: order.profiles?.full_name?.split(' ').slice(1).join(' ') || 'Reveil',
            billing_address: address.line1 || address.address || 'Address line missing',
            billing_address_2: address.line2 || '',
            billing_city: address.city || 'City missing',
            billing_pincode: address.pincode || address.postal_code || '000000',
            billing_state: address.state || 'State missing',
            billing_country: "India",
            billing_email: order.profiles?.email || 'email@missing.com',
            billing_phone: order.profiles?.phone || address.phone || '0000000000',
            shipping_is_billing: true,
            order_items: order.order_items.map((item: any) => ({
                name: item.products?.name || 'Perfume Fragment',
                sku: item.products?.slug || 'REV-GENERIC',
                units: item.quantity,
                selling_price: item.price
            })),
            payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
            sub_total: order.total,
            length: 10, // Default dimensions for perfume box
            width: 10,
            height: 10,
            weight: 0.5
        };

        // 5. Trigger Shiprocket Order Creation
        const shipResult = await ShiprocketService.createOrder(shiprocketData);

        // 6. Update local order with Shiprocket references
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                shiprocket_order_id: shipResult.order_id,
                shiprocket_shipment_id: shipResult.shipment_id,
                status: 'processing' // Move status to processing
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Failed to update order with Shiprocket IDs:', updateError);
        }

        return NextResponse.json({
            success: true,
            shiprocket_order_id: shipResult.order_id,
            shiprocket_shipment_id: shipResult.shipment_id
        });

    } catch (error: any) {
        console.error('Fulfillment Error:', error);
        return NextResponse.json({ error: error.message || 'Fulfillment failed' }, { status: 500 });
    }
}
