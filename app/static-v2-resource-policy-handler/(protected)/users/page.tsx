import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import PageHeader from '../_components/PageHeader'
import { Users, Mail, Phone, Calendar, ArrowRight } from 'lucide-react'

export default async function UsersPage() {
    const supabase = await createClient()

    const { data: allUsers, error } = await supabase
        .from('profiles')
        .select(`
            *,
            orders ( id )
        `)
        .order('created_at', { ascending: false })

    const users = allUsers?.filter(u => u.role !== 'admin')

    return (
        <div className="space-y-12">
            <PageHeader 
                title="User Registry" 
                subtitle="Exclusive registry of individuals synchronized with the Reveil Archive."
            >
                <div className="bg-white px-6 py-2.5 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Total Members: </span>
                    <span className="text-sm font-semibold text-black">{users?.length ?? 0}</span>
                </div>
            </PageHeader>

            {error && (
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-red-600 text-xs font-bold tracking-widest uppercase flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Registry access error: {error.message}
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-50 bg-gray-50/30">
                                <th className="px-8 py-5">Archive ID</th>
                                <th className="px-8 py-5">Full Name</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Activity</th>
                                <th className="px-8 py-5">Joined Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users?.map((profile: any) => (
                                <tr key={profile.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-mono text-gray-400 uppercase">
                                            #{profile.id.slice(0, 12)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                                {profile.first_name?.[0] || profile.full_name?.[0] || '?'}
                                            </div>
                                            <span className="text-xs font-semibold text-gray-900">
                                                {profile.first_name || profile.full_name || 'Anonymous'} {profile.last_name || ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Mail className="w-3 h-3 text-gray-300" />
                                                {profile.email || '—'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Phone className="w-3 h-3 text-gray-300" />
                                                {profile.phone || '—'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-[9px] font-bold tracking-widest uppercase">
                                            {profile.orders?.length || 0} Orders
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-medium">
                                            <Calendar className="w-3.3 h-3.3" />
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {profile.orders?.length > 0 && (
                                            <Link 
                                                href={`/static-v2-resource-policy-handler/orders?search=${profile.phone}`} 
                                                className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-[#d4af37] hover:text-black transition-colors"
                                            >
                                                View Orders <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!users || users.length === 0) && (
                    <div className="py-32 text-center bg-gray-50/30">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                        <p className="text-sm font-light tracking-wide text-gray-400 uppercase tracking-widest">
                            Registry is currently empty
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

