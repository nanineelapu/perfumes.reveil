'use client'

import { useState } from 'react'
import { Truck, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FulfillButtonProps {
    orderId: string
    isFulfilled: boolean
}

export default function FulfillButton({ orderId, isFulfilled }: FulfillButtonProps) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>(isFulfilled ? 'success' : 'idle')
    const [error, setError] = useState<string | null>(null)

    async function handleFulfill() {
        if (loading || status === 'success') return
        
        setLoading(true)
        setError(null)
        
        try {
            // Updated to the correct Shiprocket order creation API
            const res = await fetch('/api/shiprocket/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Fulfillment failed')
            }

            setStatus('success')
            // Refresh parent after a delay to show updated state
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (err: any) {
            console.error('Shiprocket Error:', err)
            setError(err.message)
            setStatus('error')
            // Reset error after 3s
            setTimeout(() => setStatus('idle'), 3000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            <motion.button
                whileHover={status === 'idle' ? { scale: 1.02, backgroundColor: '#000', color: '#fff' } : {}}
                whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                onClick={handleFulfill}
                disabled={loading || status === 'success'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '99px',
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    transition: 'all 0.3s ease',
                    cursor: (loading || status === 'success') ? 'not-allowed' : 'pointer',
                    background: status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.03)',
                    color: status === 'success' ? '#10b981' : '#666',
                    border: status === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                }}
            >
                {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle2 size={12} />
                ) : (
                    <Truck size={12} />
                )}
                
                {loading ? 'Processing...' : status === 'success' ? 'Fulfilled' : 'Fulfill via Shiprocket'}
            </motion.button>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: '#fee2e2',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '9px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                            border: '1px solid #fecaca'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
