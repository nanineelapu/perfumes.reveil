'use client'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/store'
import { ShoppingBag, ArrowLeft, Wind, Droplets, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ProductExperiencePage() {
    const { slug } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchProduct() {
            console.log('Fetching Product with Slug:', slug)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error) {
                console.error('Supabase Error:', error)
            }

            if (data) setProduct(data)
            setLoading(false)
        }
        fetchProduct()
    }, [slug])

    if (loading) return (
        <div style={{ height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#d4af37', fontFamily: 'var(--font-tenor)', fontSize: '10px', letterSpacing: '0.4em' }}>INITIALIZING_STUDIO_ARCHIVE...</div>
        </div>
    )

    if (!product) return (
        <div style={{ height: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ color: '#fff', fontFamily: 'var(--font-tenor)', fontSize: '24px', letterSpacing: '0.2em' }}>FRAGMENT_NOT_FOUND</div>
            <div style={{ color: '#444', fontFamily: 'var(--font-tenor)', fontSize: '10px', letterSpacing: '0.4em' }}>ID: {slug}</div>
            <Link href="/products" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '12px', marginTop: '20px', fontFamily: 'var(--font-tenor)' }}>RETURN_TO_ARCHIVE</Link>
        </div>
    )

    return (
        <main style={{ background: '#050505', minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
            
            {/* Background Grid Accent */}
            <div style={{
                position: 'fixed', inset: 0,
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0)',
                backgroundSize: '30px 30px',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Navigation Header */}
            <div style={{
                position: 'fixed', top: 0, width: '100%',
                padding: '40px 60px',
                display: 'flex', justifyContent: 'space-between',
                zIndex: 100, backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
                <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', textDecoration: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-tenor)' }}>
                    <ArrowLeft size={14} /> Back to Archive
                </Link>
                <div style={{ color: '#d4af37', fontFamily: 'var(--font-tenor)', fontSize: '10px', letterSpacing: '0.4em' }}>
                    REF — {product.id.toString().padStart(4, '0')}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '100vh' }}>
                
                {/* Left: Cinematic Visuals */}
                <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 0 0' }}>
                    <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1200'} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                            alt={product.name}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0) 50%, rgba(5,5,5,0.8) 100%)' }} />
                    </motion.div>

                    {/* Technical Tag Overlay */}
                    <div style={{ position: 'absolute', bottom: '60px', left: '60px', borderLeft: '1px solid #d4af37', paddingLeft: '24px' }}>
                        <div style={{ fontSize: '9px', color: '#666', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-tenor)' }}>Status</div>
                        <div style={{ fontSize: '12px', color: '#fff', letterSpacing: '0.1em', fontFamily: 'var(--font-tenor)' }}>STABLE_ARCHIVE</div>
                    </div>
                </section>

                {/* Right: Immersive Details */}
                <section style={{ 
                    padding: '160px 80px 100px', 
                    background: '#050505',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: '24px', fontFamily: 'var(--font-tenor)' }}>
                            {product.category || 'Laboratory Fragment'}
                        </div>
                        
                        <h1 style={{ 
                            fontSize: 'clamp(40px, 5vw, 72px)', 
                            fontFamily: 'var(--font-cormorant)', 
                            fontWeight: 300,
                            lineHeight: 1,
                            margin: '0 0 24px',
                            letterSpacing: '-0.02em'
                        }}>
                            {product.name}
                        </h1>

                        <div style={{ fontSize: '24px', color: '#fff', fontFamily: 'var(--font-tenor)', marginBottom: '48px', opacity: 0.8 }}>
                            {product.price.toLocaleString()} INR
                        </div>

                        <p style={{ 
                            fontSize: '15px', 
                            lineHeight: 1.8, 
                            color: '#999', 
                            marginBottom: '64px',
                            fontFamily: 'var(--font-tenor)',
                            maxWidth: '500px'
                        }}>
                            {product.description || 'Accessing encrypted olfactory data. This composition is part of the REVEIL Laboratory Archive, designed for high-end olfactory resonance.'}
                        </p>

                        {/* Scent Profile Breakdown */}
                        <div style={{ marginBottom: '64px' }}>
                            <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '32px', fontFamily: 'var(--font-tenor)' }}>Perspective Profile</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                {[
                                    { label: 'TOP', note: product.scent_profile?.top || 'Citrus Drift', icon: <Wind size={16} /> },
                                    { label: 'HEART', note: product.scent_profile?.heart || 'Oudh Resin', icon: <Droplets size={16} /> },
                                    { label: 'BASE', note: product.scent_profile?.base || 'White Musk', icon: <Clock size={16} /> }
                                ].map((note, i) => (
                                    <div key={i} style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                                        <div style={{ color: '#d4af37', marginBottom: '16px' }}>{note.icon}</div>
                                        <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-tenor)' }}>{note.label}</div>
                                        <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>{note.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div style={{ display: 'flex', gap: '48px', marginBottom: '64px', padding: '32px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div>
                                <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-tenor)' }}>Volume</div>
                                <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>{product.technical_specs?.volume || '100ML'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-tenor)' }}>Longevity</div>
                                <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>{product.technical_specs?.longevity || '12 HRS+'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '8px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'var(--font-tenor)' }}>Intensity</div>
                                <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>EXTRAIT DE PARFUM</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#000' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1.5,
                                    background: 'transparent',
                                    border: '1px solid #fff',
                                    color: '#fff',
                                    padding: '24px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.4em',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-tenor)',
                                    transition: 'all 0.4s'
                                }}
                            >
                                ACQUIRE_FRAGMENT
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    flex: 0.5,
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    padding: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ShoppingBag size={20} strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>
        </main>
    )
}
