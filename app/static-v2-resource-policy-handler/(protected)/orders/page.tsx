import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import StatusUpdateMenu from '@/components/admin/StatusUpdateMenu'
import { cn } from '@/lib/utils'
import { Truck, ArrowRight, ExternalLink, Printer, ShoppingBag } from 'lucide-react'
import FulfillButton from '../../../../components/admin/FulfillButton'
import { getAutomaticStatus } from '@/lib/utils/order-status'
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
        <div className="space-y-12">
            <PageHeader 
                title="Order Registry" 
                subtitle="Transaction and fulfillment manifest for your luxury collection."
            >
                <div className="bg-white px-6 py-2.5 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Volume: </span>
                    <span className="text-sm font-semibold text-black">{orders?.length ?? 0}</span>
                </div>
            </PageHeader>

            {error && (
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center gap-4 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-xs font-bold tracking-widest uppercase">System Sync Error: {error.message}</span>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[12px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-50 bg-gray-50/30">
                                <th className="px-4 py-4">Manifest ID</th>
                                <th className="px-4 py-4">Clientele</th>
                                <th className="px-4 py-4">Inventory</th>
                                <th className="px-4 py-4">Valuation</th>
                                <th className="px-4 py-4">Liquidity</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Logistics</th>
                                <th className="px-4 py-4 text-right">Process</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders?.map((order) => {
                                const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles as any
                                return (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-5">
                                            <div className="text-[12px] font-mono text-gray-400 uppercase">
                                                #{order.id?.slice(0, 8)}
                                            </div>
                                            <div className="text-[11px] text-gray-300 mt-1 uppercase tracking-tighter">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {profile?.full_name ?? 'Anonymous Client'}
                                            </div>
                                            <div className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">
                                                {profile?.phone ?? 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="text-[12px] text-gray-500 font-medium leading-relaxed">
                                                {order.order_items?.map((item: any, i: number) => (
                                                    <span key={i} className="block whitespace-nowrap">
                                                        {item.quantity}× {item.products?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="text-sm font-semibold text-black">
                                                ₹{order.total?.toLocaleString()}
                                            </div>
                                            {order.payment_method === 'cod' && (
                                                <div className="text-[10px] text-[#d4af37] font-bold tracking-widest uppercase mt-1">
                                                    COD
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className={cn(
                                                "inline-flex px-2.5 py-1 rounded text-[11px] font-bold tracking-widest uppercase",
                                                order.payment_status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                {order.payment_status ?? 'Pending'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <OrderStatusBadge status={getAutomaticStatus(order.status ?? 'pending', order.created_at)} />
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                {order.shiprocket_order_id ? (
                                                    <>
                                                        {order.awb_code && (
                                                            <Link href={`/track/${order.awb_code}`} target="_blank" className="text-[11px] font-bold tracking-widest text-indigo-500 hover:text-indigo-700 flex items-center gap-1 uppercase transition-colors">
                                                                <Truck className="w-3 h-3" /> {order.awb_code}
                                                            </Link>
                                                        )}
                                                        {order.label_url && (
                                                            <a href={order.label_url} target="_blank" className="text-[11px] font-bold tracking-widest text-emerald-500 hover:text-emerald-700 flex items-center gap-1 uppercase transition-colors">
                                                                <Printer className="w-3 h-3" /> Label
                                                            </a>
                                                        )}
                                                    </>
                                                ) : (
                                                    <FulfillButton orderId={order.id} isFulfilled={false} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center justify-end gap-4">
                                                <Link href={`/static-v2-resource-policy-handler/orders/${order.id}`} className="text-[12px] font-bold tracking-widest uppercase text-gray-400 hover:text-black flex items-center gap-1 transition-colors">
                                                    Details <ExternalLink className="w-3 h-3" />
                                                </Link>
                                                <StatusUpdateMenu orderId={order.id} currentStatus={order.status ?? 'pending'} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {(!orders || orders.length === 0) && (
                    <div className="py-32 text-center bg-gray-50/30">
                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                        <p className="text-sm font-light tracking-wide text-gray-400 uppercase tracking-widest">
                            No registered transactions found
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}