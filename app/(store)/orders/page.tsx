'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, CheckCircle, ChevronRight, Download, HelpCircle, Loader2, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAutomaticStatus } from '@/lib/utils/order-status'

interface OrderItem {
    id: string
    quantity: number
    price: number
    products: {
        name: string
        images: string[]
        slug: string
    }
}

interface Order {
    id: string
    created_at: string
    status: string
    total: number
    order_items: OrderItem[]
}

export default function OrdersPage() {
    const supabase = createClient()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }
            setUser(user)

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    total,
                    status,
                    created_at,
                    order_items (
                        id,
                        quantity,
                        price,
                        products ( name, images, slug )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setOrders(data as any)
            }
            setLoading(false)
        }

        fetchOrders()
    }, [supabase])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase()
        if (s === 'delivered' || s === 'completed' || s === 'confirmed' || s === 'confirm') {
            return { bg: 'rgba(74, 222, 128, 0.05)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ade80', icon: <CheckCircle size={12} color="#4ade80" /> }
        }
        if (s === 'cancelled' || s === 'failed' || s === 'refunded') {
            return { bg: 'rgba(248, 113, 113, 0.05)', border: 'rgba(248, 113, 113, 0.2)', text: '#f87171', icon: <HelpCircle size={12} color="#f87171" /> }
        }
        // Processing, Confirmed, Pending
        return { bg: 'rgba(212, 175, 55, 0.05)', border: 'rgba(212, 175, 55, 0.2)', text: '#d4af37', icon: <Truck size={12} color="#d4af37" /> }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
                <Loader2 className="animate-spin" size={32} color="#d4af37" />
            </div>
        )
    }

    if (!user) {
        return (
            <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
                    <div style={{ marginBottom: '32px', opacity: 0.3 }}>
                        <ShoppingBag size={64} strokeWidth={1} style={{ margin: '0 auto', color: '#d4af37' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-baskerville)', marginBottom: '16px', fontWeight: 300 }}>Welcome Back</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px', letterSpacing: '0.02em' }}>Access your exclusive fragrance collection and orders.</p>
                    <Link href="/auth" style={{
                        background: '#d4af37', color: '#000', padding: '18px 48px',
                        borderRadius: '2px', textDecoration: 'none', fontSize: '11px',
                        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em',
                        display: 'inline-block', boxShadow: '0 10px 30px rgba(212,175,55,0.1)'
                    }}>
                        Continue to Your Account
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingTop: '160px', paddingBottom: '120px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <header style={{ marginBottom: '80px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d4af37', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '24px', fontFamily: 'var(--font-baskerville)' }}
                    >
                        Archive Terminal <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.2)' }} />
                    </motion.div>
                    <h1 style={{ fontSize: '64px', fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em', fontWeight: 300, lineHeight: 1 }}>
                        Your <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 400 }}>ORDERS</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '20px', fontSize: '16px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic', fontWeight: 400 }}>Tracking your olfactory journey through the Reveil archive.</p>
                </header>

                {/* Orders List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {orders.length > 0 ? (
                        orders.map((order, idx) => {
                            const autoStatus = getAutomaticStatus(order.status, order.created_at)
                            const statusStyles = getStatusStyles(autoStatus)
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        background: '#111',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    {/* Order Info Bar */}
                                    <div style={{
                                        padding: '24px 40px',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.01)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '48px' }}>
                                            <div>
                                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>Ref ID</p>
                                                <p style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'var(--font-baskerville)', color: '#fff', letterSpacing: '0.05em' }}>{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>Date</p>
                                                <p style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'var(--font-baskerville)', color: '#fff' }}>{formatDate(order.created_at)}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>Amount</p>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#d4af37', fontFamily: 'var(--font-baskerville)' }}>₹{order.total.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 24px', borderRadius: '2px', background: statusStyles.bg, border: `1px solid ${statusStyles.border}` }}>
                                            {statusStyles.icon}
                                            <span style={{ fontSize: '9px', fontWeight: 800, color: statusStyles.text, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-baskerville)' }}>{autoStatus}</span>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div style={{ padding: '40px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                            {order.order_items.map((item, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                                        <div style={{ width: '100px', height: '100px', borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <img src={item.products?.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                                        </div>
                                                        <div>
                                                            <h3 style={{ fontSize: '20px', fontWeight: 300, margin: 0, fontFamily: 'var(--font-baskerville)', color: '#fff', letterSpacing: '0.02em' }}>{item.products?.name}</h3>
                                                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '12px 0 0', fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Qty: {item.quantity} — <span style={{ color: '#d4af37' }}>₹{item.price.toLocaleString()}</span></p>
                                                        </div>
                                                    </div>
                                                    <Link href={`/products/${item.products?.slug}`} style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'var(--font-baskerville)', textDecoration: 'none' }}>
                                                        REPLENISH <ChevronRight size={14} strokeWidth={3} />
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions Bar */}
                                    <div style={{ padding: '24px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'flex-end', gap: '40px' }}>
                                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-baskerville)' }}>
                                            <Download size={14} /> Document
                                        </button>
                                        <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-baskerville)' }}>
                                            <HelpCircle size={14} /> Assistance
                                        </button>
                                        <button style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 40px', borderRadius: '2px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', fontFamily: 'var(--font-baskerville)' }}>
                                            Track Shipment
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '120px 0', background: '#111', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', fontFamily: 'var(--font-baskerville)', fontStyle: 'italic', letterSpacing: '0.05em' }}>No orders yet.</p>
                            <Link href="/products" style={{
                                background: '#d4af37',
                                color: '#000',
                                fontSize: '11px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.4em',
                                marginTop: '32px',
                                display: 'inline-block',
                                textDecoration: 'none',
                                padding: '16px 40px',
                                borderRadius: '2px'
                            }}>
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Membership Footer */}
                <div style={{ marginTop: '160px', textAlign: 'center', padding: '100px 40px', borderRadius: '4px', background: 'linear-gradient(135deg, #111 0%, #050505 100%)', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                        <div style={{ width: '1px', height: '80px', background: '#d4af37', opacity: 0.5 }} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 300, margin: 0, fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff' }}>Elevate your Status</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginTop: '24px', maxWidth: '540px', margin: '24px auto', lineHeight: 1.8, fontFamily: 'var(--font-baskerville)', fontStyle: 'italic' }}>Reveil members get priority dispatch, complimentary miniature samples, and exclusive early access to the Noir Series archive.</p>
                </div>

            </div>
        </main>
    )
}
