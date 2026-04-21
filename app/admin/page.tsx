import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [{ count: productCount }, { count: orderCount }, { data: recentOrders }] =
        await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true }),
            supabase.from('orders').select('*', { count: 'exact', head: true }),
            supabase.from('orders')
                .select('id, total, status, created_at, profiles(full_name)')
                .order('created_at', { ascending: false })
                .limit(5),
        ])

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-6 py-12 lg:px-12 lg:py-20 space-y-24">
                
                {/* Header & Navigation */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 border-b-2 border-black pb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-black" />
                            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black/40 italic">Administration Console</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-black uppercase italic leading-[0.8]">
                            Dashboard
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                        <Link href="/admin/products" className="flex-1 md:flex-none text-center px-8 py-4 border-2 border-black bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                            Go to Products
                        </Link>
                        <Link href="/admin/orders" className="flex-1 md:flex-none text-center px-8 py-4 border-2 border-black bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                            Go to Orders
                        </Link>
                        <Link href="/admin/carousel" className="flex-1 md:flex-none text-center px-8 py-4 border-2 border-black bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                            Go to Carousel
                        </Link>
                    </div>
                </div>

                {/* Stats Grid - High Contrast */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {[
                        { label: 'Inventory Count', value: productCount ?? 0, detail: 'Total Active Products' },
                        { label: 'Transaction Count', value: orderCount ?? 0, detail: 'Processed Orders' },
                        { label: 'Pipeline Status', value: recentOrders?.filter(o => o.status === 'pending').length ?? 0, detail: 'Awaiting Attention' },
                    ].map((stat) => (
                        <div key={stat.label} className="group relative border-2 border-black p-12 hover:bg-black hover:text-white transition-all duration-500 cursor-default">
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">{stat.label}</span>
                                <div className="text-6xl lg:text-8xl font-light tracking-tighter transition-transform group-hover:scale-105 origin-left duration-500">{stat.value}</div>
                                <p className="text-[9px] font-bold tracking-widest uppercase italic opacity-30">{stat.detail}</p>
                            </div>
                            <div className="absolute bottom-6 right-6 text-xs font-black opacity-5 group-hover:opacity-20 transition-opacity uppercase font-serif tracking-tighter">REVEIL</div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Table */}
                <div className="space-y-12">
                    <div className="flex items-center gap-8">
                        <h2 className="text-2xl font-bold tracking-[0.4em] uppercase text-black">Registry Logs</h2>
                        <div className="h-[2px] flex-1 bg-black/10"></div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    {['Ref', 'Customer', 'Value', 'Status', 'Date'].map((h) => (
                                        <th key={h} className="px-8 py-6 text-[11px] font-black tracking-widest uppercase text-black italic">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {recentOrders?.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/80 transition-colors">
                                        <td className="px-8 py-8 text-[11px] font-mono text-gray-400 group-hover:text-black">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-[11px] font-bold tracking-widest uppercase text-black">
                                                {(order.profiles as any)?.full_name ?? 'Guest'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-sm font-light text-black tracking-tight">
                                            ₹{order.total.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={cn(
                                                "text-[9px] font-black tracking-widest uppercase px-4 py-2 border-2",
                                                order.status === 'pending' ? "border-black bg-black text-white shadow-xl" : "border-black text-black"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-[10px] text-gray-400 group-hover:text-black uppercase tracking-widest font-bold">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
