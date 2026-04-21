'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react'

const initialCart = [
    {
        id: '1',
        name: 'Oudh Noir',
        category: 'EXTRAIT SERIES',
        price: 18500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '2',
        name: 'Saffron Silk',
        category: 'ESSENCE SERIES',
        price: 9200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    }
]

export default function CartPage() {
    const [cart, setCart] = useState(initialCart)

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ))
    }

    const removeItem = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const shipping = subtotal > 15000 ? 0 : 500
    const total = subtotal + shipping

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px' }}>

                {/* Header: Refined and compact */}
                <header style={{ marginBottom: '60px', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d4af37', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6em', marginBottom: '16px', fontFamily: 'var(--font-baskerville)' }}>
                        STUDIO SELECTIONS <div style={{ width: '30px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                    </motion.div>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontFamily: 'var(--font-baskerville)', textTransform: 'uppercase', margin: 0, lineHeight: 1, fontWeight: 300 }}>
                        Your <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 400 }}>Basket</span>
                    </h1>
                </header>

                {cart.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '60px', alignItems: 'start' }}>

                        {/* ITEM LIST: Refined card layout */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        whileHover={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}
                                        transition={{ duration: 0.4 }}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '140px 1fr auto',
                                            gap: '32px',
                                            padding: '24px',
                                            background: '#0a0a0a',
                                            borderRadius: '2px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ width: '140px', height: '180px', background: '#000', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <p style={{ fontSize: '9px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-baskerville)' }}>{item.category}</p>
                                            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', margin: 0, fontWeight: 400 }}>{item.name}</h3>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontFamily: 'var(--font-baskerville)' }}>Standard Atelier Bottling — 100ml</p>

                                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', padding: '4px 12px', borderRadius: '2px', border: '1px solid #222' }}>
                                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}><Minus size={10} /></button>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-baskerville)' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}><Plus size={10} /></button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', fontFamily: 'var(--font-baskerville)' }}
                                                    onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                                                    onMouseOut={(e) => e.currentTarget.style.color = '#444'}>
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'right', minWidth: '100px' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 300, fontFamily: 'var(--font-baskerville)', margin: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* SUMMARY PANEL: Refined and compact */}
                        <aside style={{
                            background: '#0a0a0a', color: '#fff', padding: '32px',
                            borderRadius: '2px', position: 'sticky', top: '140px',
                            width: '340px', flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h2 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '32px', color: '#d4af37', fontFamily: 'var(--font-baskerville)' }}>Atelier Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-baskerville)' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-baskerville)' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Shipping</span>
                                    <span style={{ fontWeight: 600, color: shipping === 0 ? '#16a34a' : '#fff' }}>
                                        {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 400, fontFamily: 'var(--font-baskerville)' }}>
                                    <span style={{ letterSpacing: '0.1em' }}>TOTAL</span>
                                    <span style={{ color: '#fff' }}>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button style={{
                                width: '100%', background: '#fff', color: '#000', border: 'none',
                                padding: '18px', borderRadius: '2px', fontSize: '10px', fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer',
                                marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                Secure Checkout <ArrowRight size={14} />
                            </button>

                            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <ShieldCheck size={14} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '9px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-baskerville)' }}>Secure Transaction</p>
                                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0', lineHeight: 1.4, fontFamily: 'var(--font-baskerville)' }}>Encrypted by REVEIL protocols.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <Truck size={14} style={{ color: '#d4af37', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '9px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-baskerville)' }}>Artisan Packaging</p>
                                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0', lineHeight: 1.4, fontFamily: 'var(--font-baskerville)' }}>Standard boutique boxing included.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '120px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: 300, color: '#444', textTransform: 'uppercase', letterSpacing: '0.4em', fontFamily: 'var(--font-baskerville)' }}>Your studio basket is empty</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            style={{
                                marginTop: '32px', background: 'transparent', border: '1px solid #d4af37', color: '#d4af37',
                                padding: '14px 32px', cursor: 'pointer', fontSize: '9px', fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: '2px',
                                fontFamily: 'var(--font-baskerville)'
                            }}
                        >
                            Return to Collection
                        </motion.button>
                    </div>
                )}
            </div>
        </main>

    )
}
