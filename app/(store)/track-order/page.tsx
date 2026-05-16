'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Loader2, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function TrackOrderPage() {
    const supabase = createClient()
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [order, setOrder] = useState<any>(null)

    const statusSteps = [
        { key: 'pending',           label: 'Order Placed',      icon: Clock },
        { key: 'confirmed',         label: 'Confirmed',         icon: CheckCircle2 },
        { key: 'shipped',           label: 'Shipped',           icon: Truck },
        { key: 'out_for_delivery',  label: 'Out for Delivery',  icon: MapPin },
        { key: 'delivered',         label: 'Delivered',         icon: ShoppingBag },
    ]

    const statusMap: Record<string, number> = {
        pending: 0, confirmed: 1, shipped: 2,
        out_for_delivery: 3, delivered: 4,
        failed_delivery: 2, cancelled: -1, return_initiated: 2, returned: 4
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        const q = query.trim()
        if (!q) return

        setLoading(true)
        setError(null)
        setOrder(null)

        // Try by AWB code first, then by order ID prefix
        const { data: byAwb } = await supabase
            .from('orders')
            .select('id, status, courier_name, awb_code, created_at, shipping_address, total, order_items(quantity, products(name, images))')
            .eq('awb_code', q)
            .maybeSingle()

        if (byAwb) { setOrder(byAwb); setLoading(false); return }

        // Try by full order ID
        const { data: byId } = await supabase
            .from('orders')
            .select('id, status, courier_name, awb_code, created_at, shipping_address, total, order_items(quantity, products(name, images))')
            .eq('id', q)
            .maybeSingle()

        if (byId) { setOrder(byId); setLoading(false); return }

        // Try by order ID starting with (first 8 chars)
        const { data: orders } = await supabase
            .from('orders')
            .select('id, status, courier_name, awb_code, created_at, shipping_address, total, order_items(quantity, products(name, images))')
            .ilike('id', `${q}%`)
            .limit(1)

        if (orders && orders.length > 0) {
            setOrder(orders[0])
        } else {
            setError("We couldn't find that order. Please check the ID and try again.")
        }

        setLoading(false)
    }

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const currentIndex = order ? (statusMap[order.status] ?? 0) : 0
    const address = order?.shipping_address as any

    return (
        <main style={{ background: '#f8f7f2', minHeight: '100vh', color: '#1a1a1a', paddingTop: '120px', paddingBottom: '100px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <header style={{ marginBottom: '60px' }}>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'inline-block', width: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                        Live Tracking
                        <span style={{ display: 'inline-block', width: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontFamily: 'var(--font-baskerville)', fontWeight: 300, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                        Track Your <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Order</span>
                    </motion.h1>
                    <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '13px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>
                        Enter your order ID or tracking number to see where your package is.
                    </p>
                </header>

                {/* Search Box */}
                <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', overflow: 'hidden', background: '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                            <Search size={18} color="rgba(212,175,55,0.6)" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Enter Order ID or AWB..."
                            style={{
                                flex: 1, minWidth: 0, background: 'transparent', border: 'none', color: '#1a1a1a',
                                padding: '20px 16px', fontSize: '14px', outline: 'none',
                                fontFamily: 'var(--font-baskerville)'
                            }}
                        />
                        <motion.button type="submit" disabled={loading} whileHover={{ background: '#c5a02e' }}
                            style={{ padding: '0 24px', background: '#d4af37', border: 'none', color: '#000', cursor: 'pointer', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowRight size={14} /> Track</>}
                        </motion.button>
                    </div>
                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '12px', letterSpacing: '0.02em' }}>
                            {error}
                        </motion.p>
                    )}
                    <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.2)', marginTop: '12px' }}>
                        You can find your Order ID in the <Link href="/orders" style={{ color: 'rgba(212,175,55,0.6)', textDecoration: 'none' }}>Order History</Link> page or in your order confirmation email.
                    </p>
                </motion.form>

                {/* Result */}
                <AnimatePresence>
                    {order && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                            {/* Order Summary Bar */}
                            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4px' }}>Order ID</p>
                                    <p style={{ fontSize: '14px', fontFamily: 'var(--font-baskerville)', color: '#d4af37', fontWeight: 500 }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4px' }}>Placed On</p>
                                    <p style={{ fontSize: '13px' }}>{formatDate(order.created_at)}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4px' }}>Total</p>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#d4af37' }}>₹{order.total?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '4px' }}>Courier</p>
                                    <p style={{ fontSize: '13px' }}>{order.courier_name || 'Processing'}</p>
                                </div>
                                {order.awb_code && (
                                    <Link href={`/track/${order.awb_code}`}
                                        style={{ padding: '10px 20px', background: '#d4af37', color: '#000', borderRadius: '2px', textDecoration: 'none', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={12} /> Live Details
                                    </Link>
                                )}
                            </div>

                            {/* Status Progress */}
                            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '4px', padding: '40px', marginBottom: '24px' }}>
                                <p style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', textAlign: 'center', marginBottom: '40px' }}>
                                    Order Journey
                                </p>

                                {order.status === 'cancelled' ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ color: '#ff4d4d', fontSize: '14px', fontFamily: 'var(--font-baskerville)' }}>This order was cancelled.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
                                        {/* Progress line */}
                                        <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentIndex / 4) * 80}%` }}
                                            transition={{ duration: 1.5, ease: 'circOut' }}
                                            style={{ position: 'absolute', top: '15px', left: '40px', height: '1px', background: '#d4af37', boxShadow: '0 0 10px rgba(212,175,55,0.4)' }}
                                        />

                                        {statusSteps.map((step, i) => {
                                            const done = i <= currentIndex
                                            const current = i === currentIndex
                                            const Icon = step.icon
                                            return (
                                                <div key={step.key} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: done ? '#d4af37' : '#f8f7f2', border: `1px solid ${done ? '#d4af37' : 'rgba(212,175,55,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: current ? '0 0 20px rgba(212,175,55,0.4)' : 'none' }}>
                                                        <Icon size={14} color={done ? '#000' : 'rgba(212,175,55,0.5)'} />
                                                    </div>
                                                    <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: done ? '#1a1a1a' : 'rgba(0,0,0,0.35)', fontWeight: current ? 700 : 400, textAlign: 'center', maxWidth: '60px' }}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Address */}
                            {address && (
                                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '4px', padding: '28px 32px' }}>
                                    <p style={{ fontSize: '9px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '16px' }}>Delivering To</p>
                                    <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{address.name}</p>
                                    <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', fontFamily: 'var(--font-baskerville)', lineHeight: 1.6 }}>
                                        {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                                        {address.city}, {address.state} — {address.pincode}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Help note */}
                {!order && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(0,0,0,0.25)' }}>
                        <Package size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ fontSize: '13px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>
                            Type your order ID above and press Track.
                        </p>
                    </motion.div>
                )}

            </div>
        </main>
    )
}
