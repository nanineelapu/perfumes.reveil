'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/store'
import { ShoppingBag, ArrowLeft, Star, Loader2, Check, MapPin, X as XIcon } from 'lucide-react'
import Link from 'next/link'
import { ReviewsSection } from '@/components/store/ReviewsSection'
import { ReviewInvitation } from '@/components/store/ReviewInvitation'
import ProductCard from '@/components/store/ProductCard'
import { createClient } from '@/lib/supabase/client'

interface ProductContentProps {
    product: Product
    initialReviews: any[]
    relatedProducts?: Product[]
}

export function ProductContent({ product, initialReviews, relatedProducts = [] }: ProductContentProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isMobile, setIsMobile] = useState(false)
    const [reviews, setReviews] = useState(initialReviews)
    const [selectedVolume, setSelectedVolume] = useState(product.technical_specs?.volume || '100ML')
    const [adding, setAdding] = useState(false)
    const [added, setAdded] = useState(false)
    const [actionError, setActionError] = useState<string | null>(null)

    // Pincode delivery check — Reveil ships only within Odisha.
    // Odisha PIN range is 751xxx – 770xxx; we treat anything outside as
    // non-deliverable. India Post API enriches with the area name when reachable.
    const [pincode, setPincode] = useState('')
    const [pinChecking, setPinChecking] = useState(false)
    const [pinResult, setPinResult] = useState<
        | { ok: true; area: string; district: string }
        | { ok: false; reason: string }
        | null
    >(null)

    const isOdishaPin = (pin: string) => {
        if (!/^\d{6}$/.test(pin)) return false
        const prefix = parseInt(pin.slice(0, 3), 10)
        return prefix >= 751 && prefix <= 770
    }

    const checkPincode = async () => {
        const pin = pincode.trim()
        setPinResult(null)
        if (!/^\d{6}$/.test(pin)) {
            setPinResult({ ok: false, reason: 'Enter a valid 6-digit pincode.' })
            return
        }
        if (!isOdishaPin(pin)) {
            setPinResult({ ok: false, reason: 'We currently deliver only within Odisha.' })
            return
        }

        setPinChecking(true)
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
            const data = await res.json()
            const entry = Array.isArray(data) ? data[0] : null
            const office = entry?.PostOffice?.[0]
            if (entry?.Status === 'Success' && office) {
                if ((office.State || '').toLowerCase() === 'odisha') {
                    setPinResult({
                        ok: true,
                        area: office.Name || office.Block || pin,
                        district: office.District || office.Division || '',
                    })
                } else {
                    setPinResult({ ok: false, reason: 'We currently deliver only within Odisha.' })
                }
            } else {
                // API didn't find it — fall back to prefix check (already passed) and accept
                setPinResult({ ok: true, area: 'Odisha', district: '' })
            }
        } catch {
            // Network failure — trust the prefix check we already did
            setPinResult({ ok: true, area: 'Odisha', district: '' })
        } finally {
            setPinChecking(false)
        }
    }

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleAction = async (type: 'cart' | 'buy') => {
        if (adding) return
        setActionError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            const next = type === 'buy'
                ? `/checkout?buyNow=${product.id}&qty=1`
                : `/products/${product.slug}`
            router.push(`/auth?next=${encodeURIComponent(next)}`)
            return
        }

        // BUY NOW — bypass the cart entirely so the existing cart isn't touched
        if (type === 'buy') {
            router.push(`/checkout?buyNow=${product.id}&qty=1`)
            return
        }

        setAdding(true)
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, quantity: 1 }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Could not add to cart')
            }
            window.dispatchEvent(new Event('cart-updated'))
            setAdded(true)
            setTimeout(() => setAdded(false), 1800)
        } catch (err: any) {
            setActionError(err.message || 'Something went wrong')
        } finally {
            setAdding(false)
        }
    }

    return (
        <main style={{
            background: '#f8f7f2',
            minHeight: '100vh',
            color: '#1a1a1a',
            position: 'relative',
            padding: isMobile ? '120px 20px 60px' : '140px 80px 60px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '32px' : '64px',
                alignItems: 'flex-start',
                maxWidth: '1280px',
                margin: '0 auto'
            }}>
                {/* Left: Balanced Image Container */}
                <div style={{ position: 'relative', width: isMobile ? '100%' : '44%', flex: 'none' }}>
                    {/* Background Glow Effect */}
                    {!isMobile && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '120%', height: '120%',
                            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                            zIndex: 0, pointerEvents: 'none'
                        }} />
                    )}

                    <motion.section
                        initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1.2 }}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            background: '#ffffff',
                            width: '100%',
                            height: isMobile ? '400px' : 'clamp(420px, 40vw, 540px)',
                            zIndex: 1
                        }}
                    >
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1200'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
                            alt={product.name}
                        />

                        {/* Luxury Concentration Badge */}
                        <div style={{
                            position: 'absolute', top: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px',
                            padding: '10px 20px', background: 'rgba(5,5,5,0.7)',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.6)',
                            fontSize: '9px', color: '#d4af37', letterSpacing: '0.25em',
                            textTransform: 'uppercase', fontWeight: 800, borderRadius: '999px'
                        }}>
                            {product.technical_specs?.concentration || 'Extrait de Parfum'}
                        </div>
                    </motion.section>

                    {/* Olfactory Notes Grid — sits below the image so the two columns balance */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                            marginTop: isMobile ? '24px' : '32px',
                            padding: isMobile ? '24px' : '28px 32px',
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '24px',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: isMobile ? '16px' : '24px'
                        }}
                    >
                        {[
                            { l: 'TOP', v: product.scent_profile?.top || '-' },
                            { l: 'HEART', v: product.scent_profile?.heart || '-' },
                            { l: 'BASE', v: product.scent_profile?.base || '-' }
                        ].map((note, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '9px', color: '#d4af37', letterSpacing: '0.3em', marginBottom: '10px', fontWeight: 600 }}>{note.l}</div>
                                <div style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: 'var(--font-tenor)', lineHeight: 1.35 }}>{note.v}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Theme-Based Content */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: isMobile ? '0' : '20px 0',
                    flex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                    >
                        <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                            <Link href="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', textDecoration: 'none', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: 'var(--font-tenor)', opacity: 0.8, transition: 'opacity 0.3s' }}>
                                <ArrowLeft size={14} /> Back to Shop
                            </Link>
                        </div>

                        <div style={{ fontSize: '11px', color: '#d4af37', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: isMobile ? '12px' : '20px', fontFamily: 'var(--font-tenor)', fontWeight: 600 }}>
                            {product.category || 'PARFUM'}
                        </div>

                        <h1 style={{
                            fontSize: isMobile ? 'clamp(24px, 7vw, 30px)' : 'clamp(26px, 2.6vw, 40px)',
                            fontFamily: 'var(--font-baskerville)',
                            fontWeight: 400,
                            lineHeight: 1.15,
                            margin: isMobile ? '0 0 16px' : '0 0 12px',
                            letterSpacing: '-0.01em',
                            wordBreak: 'break-word'
                        }}>
                            {product.name}
                        </h1>

                        {/* Rating Display */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={10}
                                        fill={product.rating >= s ? '#d4af37' : 'transparent'}
                                        color={product.rating >= s ? '#d4af37' : 'rgba(0,0,0,0.2)'}
                                    />
                                ))}
                            </div>
                            <span style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em' }}>
                                {product.rating || '0.0'} ({reviews.length} REVIEWS)
                            </span>
                        </div>

                        <div style={{ fontSize: isMobile ? '18px' : '20px', color: '#1a1a1a', fontFamily: 'var(--font-tenor)', marginBottom: isMobile ? '24px' : '32px', fontWeight: 300 }}>
                            ₹{product.price.toLocaleString()}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#888', fontFamily: 'var(--font-tenor)', maxWidth: '480px', marginBottom: isMobile ? '32px' : '40px', fontWeight: 300 }}>
                            {product.description || 'Accessing encrypted olfactory data. This composition is part of the REVEIL Laboratory Archive, designed for high-end olfactory resonance.'}
                        </p>

                        {/* Technical Meta */}
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '32px' : '64px', marginBottom: isMobile ? '32px' : '44px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: isMobile ? '24px' : '32px' }}>
                            <div>
                                <div style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.2em', fontWeight: 600 }}>Select Size</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['50ML', '100ML'].map((v) => (
                                        <motion.button
                                            key={v}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedVolume(v)}
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '10px',
                                                background: selectedVolume === v ? '#d4af37' : 'transparent',
                                                border: `1px solid ${selectedVolume === v ? '#d4af37' : 'rgba(212,175,55,0.5)'}`,
                                                color: selectedVolume === v ? '#000' : '#1a1a1a',
                                                cursor: 'pointer',
                                                letterSpacing: '0.1em',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                fontWeight: selectedVolume === v ? 700 : 400
                                            }}
                                        >
                                            {v}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '8px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.2em', fontWeight: 600 }}>Lasts for</div>
                                <div style={{ fontSize: '11px', color: '#1a1a1a', padding: '8px 0' }}>{product.technical_specs?.longevity || '12 HRS+'}</div>
                            </div>
                        </div>

                        {/* Delivery Pincode Check — Odisha only */}
                        <div style={{ marginBottom: isMobile ? '28px' : '36px' }}>
                            <div style={{
                                fontSize: '8px', color: '#d4af37', textTransform: 'uppercase',
                                marginBottom: '12px', letterSpacing: '0.2em', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                <MapPin size={11} strokeWidth={1.8} /> Check Delivery
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); checkPincode() }}
                                style={{
                                    display: 'flex', alignItems: 'stretch', gap: '0',
                                    maxWidth: '360px',
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    borderRadius: '999px',
                                    overflow: 'hidden',
                                    background: '#ffffff'
                                }}
                            >
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6-digit pincode"
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                                        if (pinResult) setPinResult(null)
                                    }}
                                    style={{
                                        flex: 1, padding: '12px 20px',
                                        border: 'none', outline: 'none',
                                        background: 'transparent',
                                        fontSize: '13px', color: '#1a1a1a',
                                        letterSpacing: '0.1em',
                                        fontFamily: 'var(--font-tenor)'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={pinChecking || pincode.length !== 6}
                                    style={{
                                        padding: '0 22px',
                                        background: pincode.length === 6 ? '#1a1a1a' : 'rgba(0,0,0,0.08)',
                                        color: pincode.length === 6 ? '#fff' : 'rgba(0,0,0,0.4)',
                                        border: 'none',
                                        fontSize: '10px', fontWeight: 700,
                                        letterSpacing: '0.3em',
                                        textTransform: 'uppercase',
                                        cursor: pincode.length === 6 && !pinChecking ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {pinChecking ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
                                </button>
                            </form>

                            {pinResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        marginTop: '12px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        fontSize: '12px',
                                        color: pinResult.ok ? '#0d7a3f' : '#b91c1c',
                                        fontFamily: 'var(--font-tenor)'
                                    }}
                                >
                                    {pinResult.ok ? <Check size={14} strokeWidth={2.2} /> : <XIcon size={14} strokeWidth={2.2} />}
                                    {pinResult.ok ? (
                                        <span>
                                            Delivery available
                                            {pinResult.area && pinResult.area !== 'Odisha' && (
                                                <> to <strong style={{ fontWeight: 600 }}>{pinResult.area}</strong>{pinResult.district ? `, ${pinResult.district}` : ''}</>
                                            )}
                                            . Free shipping on orders above ₹250.
                                        </span>
                                    ) : (
                                        <span>{pinResult.reason}</span>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch' }}>
                            <motion.button
                                type="button"
                                onClick={() => handleAction('buy')}
                                disabled={adding}
                                whileHover={!adding ? { backgroundColor: '#d4af37', color: '#1a1a1a' } : {}}
                                whileTap={!adding ? { scale: 0.98 } : {}}
                                style={{
                                    flex: 1,
                                    background: '#1a1a1a',
                                    border: '1px solid #1a1a1a',
                                    color: '#ffffff',
                                    padding: '20px',
                                    fontSize: '11px', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.4em',
                                    cursor: adding ? 'not-allowed' : 'pointer',
                                    borderRadius: '999px',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                            >
                                {adding ? <><Loader2 size={14} className="animate-spin" /> Processing</> : 'BUY NOW'}
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => handleAction('cart')}
                                disabled={adding}
                                whileHover={!adding ? { scale: 1.05, backgroundColor: '#1a1a1a', color: '#d4af37' } : {}}
                                whileTap={!adding ? { scale: 0.95 } : {}}
                                aria-label="Add to cart"
                                style={{
                                    width: '64px', height: '64px',
                                    background: added ? '#10b981' : '#d4af37',
                                    border: 'none',
                                    color: added ? '#fff' : '#1a1a1a',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: adding ? 'not-allowed' : 'pointer',
                                    borderRadius: '50%',
                                    boxShadow: '0 12px 24px rgba(212,175,55,0.35)',
                                    flexShrink: 0,
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                {adding ? <Loader2 size={18} className="animate-spin" /> : added ? <Check size={20} strokeWidth={2} /> : <ShoppingBag size={20} strokeWidth={1.6} />}
                            </motion.button>
                        </div>
                        {actionError && (
                            <p style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '12px' }}>{actionError}</p>
                        )}
                    </motion.div>
                </section>
            </div>

            {/* New Review Invitation Section (Visible to logged in users) */}
            <div style={{ marginTop: '80px', padding: '0 24px' }}>
                <ReviewInvitation product={{ id: product.id, name: product.name }} />
            </div>

            {/* Reviews Section */}
            <div style={{
                marginTop: '100px',
                borderTop: '1px solid rgba(0,0,0,0.03)',
                paddingTop: '60px',
                background: 'linear-gradient(to bottom, rgba(212,175,55,0.02), transparent)'
            }}>
                <ReviewsSection reviews={reviews} product={{ id: product.id, name: product.name }} />
            </div>

            {/* You May Also Like — related products at the bottom of the page */}
            {relatedProducts.length > 0 && (
                <section style={{
                    maxWidth: '1400px',
                    margin: isMobile ? '60px auto 0' : '120px auto 0',
                    padding: isMobile ? '0 4px' : '0'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'baseline',
                        gap: isMobile ? '8px' : '20px',
                        marginBottom: isMobile ? '24px' : '48px',
                        paddingLeft: isMobile ? '16px' : '0',
                        paddingRight: isMobile ? '16px' : '0'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '10px', color: '#d4af37',
                                letterSpacing: '0.4em', textTransform: 'uppercase',
                                fontWeight: 600, marginBottom: '10px',
                                fontFamily: 'var(--font-tenor)'
                            }}>
                                Curated For You
                            </div>
                            <h2 style={{
                                fontSize: isMobile ? '22px' : 'clamp(24px, 2.4vw, 36px)',
                                fontFamily: 'var(--font-baskerville)',
                                fontWeight: 400,
                                color: '#1a1a1a',
                                margin: 0,
                                letterSpacing: '-0.01em'
                            }}>
                                You May Also Like
                            </h2>
                        </div>
                        <Link href="/products" style={{
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            borderBottom: '1px solid #d4af37',
                            paddingBottom: '4px',
                            fontFamily: 'var(--font-tenor)',
                            fontWeight: 600
                        }}>
                            View All →
                        </Link>
                    </div>

                    <div style={{
                        display: isMobile ? 'flex' : 'grid',
                        gridTemplateColumns: !isMobile ? 'repeat(4, 1fr)' : 'none',
                        gap: isMobile ? '14px' : '24px',
                        overflowX: isMobile ? 'auto' : 'visible',
                        scrollSnapType: isMobile ? 'x mandatory' : 'none',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        padding: isMobile ? '0 16px 16px' : '0',
                        margin: isMobile ? '0 -4px' : '0'
                    }}>
                        <style>{`section > div::-webkit-scrollbar { display: none; }`}</style>
                        {relatedProducts.slice(0, 4).map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    minWidth: isMobile ? '70%' : 'auto',
                                    flex: isMobile ? '0 0 auto' : 'auto',
                                    scrollSnapAlign: isMobile ? 'start' : 'none',
                                    display: 'flex'
                                }}
                            >
                                <ProductCard product={p} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}
