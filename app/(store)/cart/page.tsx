'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Loader2, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([])
    const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart')
            if (res.status === 401) {
                router.push('/auth')
                return
            }
            const data = await res.json()
            const items = data.items || []
            const subtotal = items.reduce((sum: number, item: any) => {
                return sum + ((item.products as any)?.price ?? 0) * item.quantity
            }, 0)

            // FREE SHIPPING LOGIC: Free if subtotal >= 249, else ₹50
            const shipping = subtotal >= 249 ? 0 : 50
            const total = subtotal + shipping

            setCartItems(items)
            setTotals({
                subtotal: subtotal,
                shipping: shipping,
                total: total
            })
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth')
            } else {
                fetchCart()
            }
        }
        checkUser()
    }, [])

    const updateQuantity = async (id: string, newQty: number) => {
        if (newQty < 1) return
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/cart/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQty })
            })
            if (res.ok) await fetchCart()
        } catch (error) {
            console.error('Update error:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const removeItem = async (id: string) => {
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/cart/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) await fetchCart()
        } catch (error) {
            console.error('Remove error:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <Loader2 className="animate-spin" size={32} color="#d4af37" />
                <span style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Loading your cart...</span>
            </div>
        )
    }

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingTop: '80px', paddingBottom: '100px', position: 'relative' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px' }}>

                {/* Header */}
                <header style={{ marginBottom: '60px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d4af37', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '16px', fontFamily: 'var(--font-baskerville)' }}>
                        YOUR ORDER <div style={{ width: '30px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                    </motion.div>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', margin: 0, lineHeight: 1, fontWeight: 300 }}>
                        Your <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 400 }}>Cart</span>
                    </h1>
                </header>

                {/* Free Shipping Progress */}
                {cartItems.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            marginBottom: '48px', 
                            background: 'rgba(212,175,55,0.03)', 
                            border: '1px solid rgba(212,175,55,0.1)',
                            padding: '24px 32px',
                            borderRadius: '2px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Truck size={16} color="#d4af37" />
                                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: totals.subtotal >= 249 ? '#16a34a' : '#fff' }}>
                                    {totals.subtotal >= 249 ? 'Free delivery unlocked! 🎉' : `Add ₹${(249 - totals.subtotal).toLocaleString()} more for free shipping`}
                                </span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em' }}>THRESHOLD: ₹249</span>
                        </div>
                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((totals.subtotal / 249) * 100, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: '100%', background: '#d4af37', position: 'absolute', left: 0, top: 0 }}
                            />
                        </div>
                    </motion.div>
                )}

                {cartItems.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '60px', alignItems: 'start' }}>

                        {/* ITEM LIST */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '140px 1fr auto',
                                            gap: '32px',
                                            padding: '24px',
                                            background: '#0a0a0a',
                                            borderRadius: '2px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            alignItems: 'center',
                                            opacity: updatingId === item.id ? 0.5 : 1,
                                            pointerEvents: updatingId === item.id ? 'none' : 'auto'
                                        }}
                                    >
                                        <div style={{ width: '140px', height: '180px', background: '#000', borderRadius: '2px', overflow: 'hidden' }}>
                                            <img src={item.products.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <p style={{ fontSize: '9px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>{item.products.category}</p>
                                            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', margin: 0, fontWeight: 400 }}>{item.products.name}</h3>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontFamily: 'var(--font-baskerville)' }}>Premium Quality Fragrance</p>

                                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #222', padding: '4px 12px' }}>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Minus size={10} /></button>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Plus size={10} /></button>
                                                </div>
                                                <motion.button 
                                                    whileHover={{ color: '#ff4d4d', scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => removeItem(item.id)} 
                                                    style={{ 
                                                        background: 'rgba(255,255,255,0.03)', 
                                                        border: '1px solid rgba(255,255,255,0.05)', 
                                                        color: 'rgba(255,255,255,0.4)', 
                                                        cursor: 'pointer', 
                                                        fontSize: '8px', 
                                                        fontWeight: 800, 
                                                        textTransform: 'uppercase', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '8px',
                                                        padding: '8px 16px',
                                                        borderRadius: '2px',
                                                        letterSpacing: '0.2em',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <Trash2 size={10} strokeWidth={1.5} /> Remove
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 300, fontFamily: 'var(--font-baskerville)', margin: 0 }}>₹{(item.products.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* SUMMARY PANEL */}
                        <aside style={{ background: '#0a0a0a', padding: '32px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '140px' }}>
                            <h2 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '32px', color: '#d4af37', fontFamily: 'var(--font-baskerville)' }}>Order Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Subtotal</span>
                                    <span>₹{totals.subtotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Shipping</span>
                                    <span style={{ color: totals.shipping === 0 ? '#16a34a' : '#fff' }}>
                                        {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 400 }}>
                                    <span>TOTAL</span>
                                    <span>₹{totals.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    const { data: { user } } = await supabase.auth.getUser()
                                    if (!user) {
                                        router.push('/auth?next=/checkout')
                                        return
                                    }
                                    router.push('/checkout')
                                }}
                                style={{
                                    width: '100%', background: '#fff', color: '#000', border: 'none',
                                    padding: '18px', fontSize: '10px', fontWeight: 900,
                                    textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer',
                                    marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}>
                                Checkout <ArrowRight size={14} />
                            </button>

                            <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <ShieldCheck size={14} color="#d4af37" />
                                    <p style={{ fontSize: '9px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>Secure Transaction</p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Truck size={14} color="#d4af37" />
                                    <p style={{ fontSize: '9px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>Premium Packaging</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '120px 0', border: '1px dashed rgba(255,255,255,0.05)' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: 300, color: '#444', textTransform: 'uppercase', letterSpacing: '0.4em' }}>Your cart is empty</h2>
                        <Link href="/products" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    marginTop: '32px', background: 'transparent', border: '1px solid #d4af37', color: '#d4af37',
                                    padding: '14px 32px', cursor: 'pointer', fontSize: '9px', fontWeight: 900,
                                    textTransform: 'uppercase', letterSpacing: '0.2em'
                                }}
                            >
                                Go Back to Shop
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
