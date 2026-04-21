'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function StatusUpdateMenu({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleStatusChange(newStatus: string) {
        if (newStatus === currentStatus) return
        
        setLoading(true)
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update status')
            }

            router.refresh()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <select 
            disabled={loading}
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#475569',
                backgroundColor: '#f8fafc',
                cursor: loading ? 'not-allowed' : 'pointer',
                outline: 'none'
            }}
        >
            {statuses.map(s => (
                <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
            ))}
        </select>
    )
}
