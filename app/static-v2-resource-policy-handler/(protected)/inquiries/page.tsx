'use client'

import { supabase } from '@/lib/supabase/client'
import PageHeader from '../_components/PageHeader'
import { Mail, Phone, Calendar, User, MessageSquare, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchInquiries = async () => {
        setIsLoading(true)
        try {
            const { data, error: dbError } = await supabase
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false })

            if (dbError) throw dbError
            setInquiries(data || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchInquiries()

        const channel = supabase
            .channel('admin_inquiries_list')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'contact_inquiries' },
                () => {
                    fetchInquiries()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const markAsRead = async (id: string) => {
        try {
            const { error: updateError } = await supabase
                .from('contact_inquiries')
                .update({ is_read: true })
                .eq('id', id)

            if (updateError) throw updateError

            // Local update for instant feedback
            setInquiries(prev => prev.map(item =>
                item.id === id ? { ...item, is_read: true } : item
            ))
        } catch (err: any) {
            alert('Failed to mark as read: ' + err.message)
        }
    }

    return (
        <div className="space-y-10">
            <PageHeader
                title="Customer Inquiries"
                subtitle="Manage and respond to customer messages from the contact page."
            >
                <div className="bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Inquiries: </span>
                    <span className="text-sm font-bold text-black">{inquiries.length}</span>
                </div>
            </PageHeader>

            {error && (
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Could not load inquiries: {error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inquiries.map((inquiry: any) => (
                                <tr key={inquiry.id} className={cn(
                                    "hover:bg-gray-50 transition-colors align-top",
                                    !inquiry.is_read && "bg-blue-50/20"
                                )}>
                                    <td className="px-6 py-5">
                                        {!inquiry.is_read ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-ping" />
                                                New
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                                                Read
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                                <User size={12} className="text-[#d4af37]" />
                                                {inquiry.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <Mail size={12} className="text-gray-400" />
                                                {inquiry.email}
                                            </div>
                                            {inquiry.phone && (
                                                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {inquiry.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 max-w-md">
                                        <div className="text-xs text-gray-700 leading-relaxed">
                                            {inquiry.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-400 whitespace-nowrap">
                                            <Calendar size={12} />
                                            {new Date(inquiry.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {!inquiry.is_read ? (
                                            <button
                                                onClick={() => markAsRead(inquiry.id)}
                                                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#d4af37] hover:text-black uppercase tracking-widest transition-all hover:scale-105"
                                            >
                                                Mark as Read <CheckCircle2 size={12} />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                Archived
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!isLoading && inquiries.length === 0) && (
                    <div className="py-24 text-center bg-gray-50">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-base font-semibold text-gray-500">
                            No inquiries found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            When customers fill out the contact form, they will appear here.
                        </p>
                    </div>
                )}

                {isLoading && inquiries.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-400">Loading inquiries...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
