import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function UsersPage() {
    const supabase = await createClient()

    const { data: allUsers, error } = await supabase
        .from('profiles')
        .select(`
            *,
            orders ( id )
        `)
        .order('created_at', { ascending: false })

    // Filter to only show registered customers (non-admins)
    const users = allUsers?.filter(u => u.role !== 'admin')

    return (
        <div className="max-w-[1400px] mx-auto space-y-12">
            <div className="border-b-2 border-black pb-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-0.5 w-12 bg-black" />
                    <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black/40 italic">Registry Terminal</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-black uppercase italic leading-[0.8]">
                    User Archive
                </h1>
                <p className="text-gray-400 mt-6 text-[11px] font-bold tracking-widest uppercase italic max-w-xl">
                    Exclusive registry of individuals who have synchronized their IDs with the Reveil Studio Archive.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-500 border border-red-100 rounded-sm">
                    Registry access error: {error.message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b-2 border-black">
                            {['ID Reference', 'Name', 'Mobile Number', 'Email Address', 'Order Activity', 'Registered'].map((h) => (
                                <th key={h} className="px-8 py-6 text-[11px] font-black tracking-widest uppercase text-black italic">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {users?.map((profile: any) => (
                            <tr key={profile.id} className="group hover:bg-gray-50/80 transition-colors">
                                <td className="px-8 py-8 text-[11px] font-mono text-gray-400 group-hover:text-black">
                                    #{profile.id.slice(0, 12).toUpperCase()}
                                </td>
                                <td className="px-8 py-8">
                                    <span className="text-[11px] font-bold tracking-widest uppercase text-black">
                                        {profile.first_name || profile.full_name || 'Anonymous'} {profile.last_name || ''}
                                    </span>
                                </td>
                                <td className="px-8 py-8 text-[11px] font-bold tracking-widest text-[#d4af37]">
                                    {profile.phone || '· · · · · · · · · ·'}
                                </td>
                                <td className="px-8 py-8 text-sm font-light text-black tracking-tight">
                                    {profile.email || 'No email provided'}
                                </td>
                                <td className="px-8 py-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold tracking-widest text-gray-900">
                                            {profile.orders?.length || 0} ORDERS
                                        </span>
                                        {profile.orders?.length > 0 && (
                                            <Link href={`/admin@reveil/orders?search=${profile.phone}`} className="text-[9px] text-[#d4af37] font-bold tracking-widest uppercase hover:underline">
                                                View Volume
                                            </Link>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-8 text-[10px] text-gray-400 group-hover:text-black uppercase tracking-widest font-bold">
                                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Archive Date Unknown'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users?.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 italic text-gray-400">
                    Archive is currently empty.
                </div>
            )}
        </div>
    )
}
