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
        <main style={{ background: '#000', minHeight: '100vh', color: '#fff', position: 'relative', padding: '120px 100px 60px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '80px', alignItems: 'stretch', height: '75vh', minHeight: '600px' }}>

                {/* Left: Balanced Image Container */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2 }}
                    style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: '#050505' }}
                >
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1200'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={product.name}
                    />
                    {/* Subtle Overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
                </motion.section>

                {/* Right: Theme-Based Content (Matching Height) */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px 0'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                    >
                        {/* Inline Navigation */}
                        <div style={{ marginBottom: '40px' }}>
                            <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', textDecoration: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'var(--font-tenor)', opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}>
                                <ArrowLeft size={14} /> Return to Products
                            </Link>
                        </div>

                        <div style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'var(--font-tenor)', fontWeight: 600 }}>
                            {product.category || 'PARFUM'}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(32px, 4vw, 56px)',
                            fontFamily: 'var(--font-baskerville)',
                            fontWeight: 400,
                            lineHeight: 1.1,
                            margin: '0 0 24px',
                            letterSpacing: '-0.01em'
                        }}>
                            {product.name}
                        </h1>

                        <div style={{ fontSize: '20px', color: '#fff', fontFamily: 'var(--font-tenor)', marginBottom: '32px', fontWeight: 300 }}>
                            ₹{product.price.toLocaleString()}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#888', fontFamily: 'var(--font-tenor)', maxWidth: '480px', marginBottom: '48px', fontWeight: 300 }}>
                            {product.description || 'Accessing encrypted olfactory data. This composition is part of the REVEIL Laboratory Archive, designed for high-end olfactory resonance.'}
                        </p>

                        {/* Olfactory Notes Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginBottom: '48px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                            {[
                                { l: 'TOP', v: product.scent_profile?.top || '-' },
                                { l: 'HEART', v: product.scent_profile?.heart || '-' },
                                { l: 'BASE', v: product.scent_profile?.base || '-' }
                            ].map((note, i) => (
                                <div key={i}>
                                    <div style={{ fontSize: '9px', color: '#d4af37', letterSpacing: '0.3em', marginBottom: '10px', fontWeight: 600 }}>{note.l}</div>
                                    <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'var(--font-tenor)' }}>{note.v}</div>
                                </div>
                            ))}
                        </div>

                        {/* Technical Meta */}
                        <div style={{ display: 'flex', gap: '48px', marginBottom: '56px' }}>
                            <div>
                                <div style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>Volume</div>
                                <div style={{ fontSize: '12px', color: '#fff' }}>{product.technical_specs?.volume || '100ML'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>Longevity</div>
                                <div style={{ fontSize: '12px', color: '#fff' }}>{product.technical_specs?.longevity || '12 HRS+'}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <motion.button
                                whileHover={{ backgroundColor: '#fff', color: '#000' }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1, background: 'transparent', border: '1px solid #fff', color: '#fff',
                                    padding: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >
                                ACQUIRE_PRODUCT
                            </motion.button>
                            <motion.button
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                style={{
                                    width: '60px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <ShoppingBag size={18} strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* Bottom Meta */}
            <div style={{ position: 'absolute', bottom: '40px', left: '100px', opacity: 0.2, fontSize: '9px', letterSpacing: '0.3em' }}>
                ID: {product.id.toString().padStart(4, '0')} — STUDIO_REVEIL_FRAGMENT
            </div>
        </main>
    )
}
