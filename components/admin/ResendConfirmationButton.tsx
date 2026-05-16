'use client'

import React, { useState } from 'react'
import { Mail, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResendConfirmationButton({ orderId }: { orderId: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleResend = async () => {
        if (status === 'loading') return
        setStatus('loading')

        try {
            const res = await fetch('/api/admin/orders/resend-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            })

            if (!res.ok) throw new Error('Failed to resend')
            
            setStatus('success')
            setTimeout(() => setStatus('idle'), 3000)
        } catch (err) {
            console.error(err)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    return (
        <button
            onClick={handleResend}
            disabled={status === 'loading'}
            className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                status === 'idle' && "text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/5",
                status === 'loading' && "text-blue-500 bg-blue-50",
                status === 'success' && "text-emerald-500 bg-emerald-50",
                status === 'error' && "text-red-500 bg-red-50"
            )}
            title="Resend Order Confirmation Email"
        >
            {status === 'loading' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : status === 'success' ? (
                <Check className="w-3 h-3" />
            ) : (
                <Mail className="w-3 h-3" />
            )}
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent' : status === 'error' ? 'Error' : 'Resend'}
        </button>
    )
}
