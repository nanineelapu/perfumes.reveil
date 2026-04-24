import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import StatusUpdateMenu from '@/components/admin/StatusUpdateMenu'
import { cn } from '@/lib/utils'
import { getAutomaticStatus } from '@/lib/utils/order-status'

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
            profiles(full_name, phone),
            order_items(quantity, products(name))
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Order Fetch Error:', error)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 text-gray-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-900">
                        Order Registry
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-px w-8 bg-accent" />
                        <p className="text-gray-400 text-[10px] font-bold tracking-[.3em] uppercase italic">
                            Transaction & Fulfillment Manifest
                        </p>
                    </div>
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase bg-gray-50 px-4 py-2 border border-gray-100 rounded-full text-gray-500">
                    Total Volume: <span className="text-gray-900 ml-1">{orders?.length ?? 0}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs tracking-wide animate-in fade-in slide-in-from-top-2">
                   ERROR: UNABLE TO SYNCHRONIZE ORDERS — {error.message.toUpperCase()}
                </div>
            )}

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#fcfcfc] border-b border-gray-100">
                                {['Manifest ID', 'Clientele', 'Inventory Manifest', 'Timeline', 'Valuation', 'Liquidity', 'Status', 'Process'].map((h) => (
                                    <th key={h} className="px-8 py-5 text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders?.map((order) => {
                                const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles as any
                                return (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="text-[11px] font-mono text-gray-400 tracking-tighter group-hover:text-gray-900 transition-colors">
                                                #{order.id ? order.id.slice(0, 8).toUpperCase() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-medium tracking-wide text-gray-900">
                                                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : profile?.full_name ?? 'Anonymous Client'}
                                            </div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                                                {profile?.phone || 'NO PHONE RECORD'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] text-gray-500 font-light leading-tight">
                                                {order.order_items?.map((item: any, i: number) => (
                                                    <span key={i} className="block">
                                                        {item.quantity}× {item.products?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-light text-gray-400 uppercase tracking-wider">
                                                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-light text-gray-900">
                                                ₹{order.total != null ? order.total.toLocaleString() : '0'}
                                            </div>
                                            {order.payment_method === 'cod' && (
                                                <div className="text-[8px] text-accent font-bold tracking-widest uppercase mt-1 italic">
                                                    Includes COD Fee
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "text-[9px] font-bold tracking-widest uppercase",
                                                order.payment_status === 'paid' ? "text-emerald-500" : "text-amber-500"
                                            )}>
                                                {order.payment_status ?? 'Awaiting'}
                                            </div>
                                            <div className="text-[8px] text-gray-400 uppercase tracking-tighter mt-1">{order.payment_method?.toUpperCase() ?? 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <OrderStatusBadge status={getAutomaticStatus(order.status ?? 'pending', order.created_at)} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <Link
                                                    href={`/admin@reveil/orders/${order.id}`}
                                                    className="text-[10px] font-bold tracking-widest uppercase text-gray-900 hover:text-accent transition-colors underline underline-offset-4"
                                                >
                                                    Details
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
                    <div className="py-32 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                        </div>
                        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400 whitespace-pre">
                            NO REGISTERED TRANSACTIONS FOUND
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}