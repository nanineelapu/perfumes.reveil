import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import CancelOrderButton from '@/components/admin/CancelOrderButton'
import { cn } from '@/lib/utils'
import { Truck, ExternalLink, Printer, ShoppingBag } from 'lucide-react'
import FulfillButton from '../../../../components/admin/FulfillButton'
import { getDisplayStatus } from '@/lib/utils/order-status'
import PageHeader from '../_components/PageHeader'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            total,
            status,
            payment_status,
            payment_method,
            created_at,
            cod_charge,
            shipping_cost,
            awb_code,
            label_url,
            courier_name,
            shiprocket_order_id,
            profiles(full_name, phone),
            order_items(quantity, products(name))
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-10">
            <PageHeader
                title="Orders"
                subtitle="Manage and track every customer order."
            >
                <div className="bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Orders: </span>
                    <span className="text-sm font-bold text-black">{orders?.length ?? 0}</span>
                </div>
            </PageHeader>

            {error && (
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Could not load orders: {error.message}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left table-fixed">
                    <thead>
                        <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50">
                            <th className="px-3 py-3 w-[11%]">Order</th>
                            <th className="px-3 py-3 w-[15%]">Customer</th>
                            <th className="px-3 py-3 w-[22%]">Items</th>
                            <th className="px-3 py-3 w-[10%]">Amount</th>
                            <th className="px-3 py-3 w-[9%]">Payment</th>
                            <th className="px-3 py-3 w-[12%]">Status</th>
                            <th className="px-3 py-3 w-[12%]">Shipping</th>
                            <th className="px-3 py-3 w-[9%] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders?.map((order: any) => {
                            const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles as any
                            const displayStatus = getDisplayStatus(order)
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors align-top">
                                    {/* Order */}
                                    <td className="px-3 py-4">
                                        <div className="text-xs font-mono font-semibold text-gray-900 truncate">
                                            #{order.id?.slice(0, 8).toUpperCase()}
                                        </div>
                                        <div className="text-[11px] text-gray-400 mt-1">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </div>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-3 py-4">
                                        <div className="text-xs font-semibold text-gray-900 truncate">
                                            {profile?.full_name ?? 'Guest'}
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                                            {profile?.phone ?? '—'}
                                        </div>
                                    </td>

                                    {/* Items */}
                                    <td className="px-3 py-4">
                                        <div className="text-xs text-gray-700 leading-snug space-y-0.5">
                                            {order.order_items?.map((item: any, i: number) => (
                                                <div key={i} className="truncate">
                                                    <span className="font-semibold text-gray-900">{item.quantity}×</span> {item.products?.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-bold text-black">
                                            ₹{order.total?.toLocaleString()}
                                        </div>
                                        {order.payment_method === 'cod' && (
                                            <div className="inline-flex mt-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold">COD</div>
                                        )}
                                        {order.payment_method === 'razorpay' && (
                                            <div className="inline-flex mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">Online</div>
                                        )}
                                    </td>

                                    {/* Payment status */}
                                    <td className="px-3 py-4">
                                        <div className={cn(
                                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize whitespace-nowrap",
                                            order.payment_status === 'paid'
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                        )}>
                                            {order.payment_status ?? 'Pending'}
                                        </div>
                                    </td>

                                    {/* Order status — derived from real signals only */}
                                    <td className="px-3 py-4">
                                        <OrderStatusBadge status={displayStatus} />
                                    </td>

                                    {/* Shipping */}
                                    <td className="px-3 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            {order.shiprocket_order_id ? (
                                                <>
                                                    {order.awb_code && (
                                                        <Link href={`/track/${order.awb_code}`} target="_blank" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors truncate">
                                                            <Truck className="w-3 h-3 shrink-0" /> {order.awb_code}
                                                        </Link>
                                                    )}
                                                    {order.label_url && (
                                                        <a href={order.label_url} target="_blank" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors">
                                                            <Printer className="w-3 h-3 shrink-0" /> Label
                                                        </a>
                                                    )}
                                                    {!order.awb_code && !order.label_url && (
                                                        <span className="text-[11px] text-gray-400">In Shiprocket</span>
                                                    )}
                                                </>
                                            ) : (
                                                <FulfillButton orderId={order.id} isFulfilled={false} />
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-3 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/static-v2-resource-policy-handler/orders/${order.id}`} className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-0.5 transition-colors">
                                                Details <ExternalLink className="w-3 h-3" />
                                            </Link>
                                            <CancelOrderButton orderId={order.id} currentStatus={order.status ?? 'pending'} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {(!orders || orders.length === 0) && (
                    <div className="py-24 text-center bg-gray-50">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-base font-semibold text-gray-500">
                            No orders yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            New orders will show up here as customers check out.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
