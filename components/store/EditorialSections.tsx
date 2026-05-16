'use client'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { AnimatedPageSection } from './AnimatedPageSection'
import { Collection } from '@/types/store'

/**
 * Philosophy: Artisan Series
 */
export function PhilosophySection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <AnimatedPageSection delay={0.2} style={{
            padding: isMobile ? '40px 24px' : 'clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px)',
            background: '#f8f7f2',
            color: '#1a1a1a',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Removed Dynamic Background Text to fix scroll lag */}

            {/* Side Headings */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 0.4, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                style={{
                    display: isMobile ? 'none' : 'block',
                    position: 'absolute', right: 'clamp(20px, 4vw, 60px)', top: '50%', transform: 'translateY(-50%)',
                    writingMode: 'vertical-rl',
                    textTransform: 'uppercase',
                    letterSpacing: '1em',
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#d4af37',
                    fontFamily: 'var(--font-baskerville)',
                    zIndex: 2
                }}>
                Reveil / About Us
            </motion.div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 90px' : 'repeat(auto-fit, minmax(300px, 1fr))',
                    alignItems: 'center',
                    gap: isMobile ? '20px' : 'clamp(30px, 6vw, 60px)',
                    textAlign: 'left'
                }}>
                    <div style={{ maxWidth: isMobile ? '100%' : '700px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                fontSize: isMobile ? '9px' : '9px',
                                textTransform: 'uppercase',
                                letterSpacing: isMobile ? '0.6em' : '0.8em',
                                marginBottom: isMobile ? '16px' : '32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#d4af37'
                            }}
                        >
                            Our Craft <span style={{ width: isMobile ? '20px' : '30px', height: '1px', background: '#d4af37' }} />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                fontSize: isMobile ? '15px' : 'clamp(22px, 3.2vw, 38px)',
                                fontFamily: 'var(--font-baskerville)',
                                lineHeight: 1.4,
                                fontWeight: 400,
                                letterSpacing: '-0.01em',
                                margin: 0,
                                color: '#1a1a1a',
                                maxWidth: isMobile ? '100%' : '680px'
                            }}
                        >
                            High-quality diffusers made with natural ingredients that smell great for a long time.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 1 }}
                            style={{ marginTop: isMobile ? '24px' : '48px' }}
                        >
                            <Link href="/about" style={{
                                fontSize: isMobile ? '9px' : '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.4em',
                                color: '#1a1a1a',
                                textDecoration: 'none',
                                borderBottom: '1px solid #d4af37',
                                paddingBottom: '6px'
                            }}>
                                OUR STORY
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'relative',
                            height: isMobile ? '160px' : 'clamp(290px, 28vw, 380px)',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isMobile ? 'flex-end' : 'center',
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/Untitled%20%281%29.png"
                            alt="Reveil Artistry"
                            style={{
                                width: isMobile ? 'auto' : '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: 'contrast(1.05) brightness(0.98)'
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </AnimatedPageSection>
    )
}

/**
 * The Collections: Horizontal Editorial Scroll
 */
export function NotesSection() {
    const containerRef = useRef(null)
    const [collections, setCollections] = useState<Collection[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const handleAction = (e: React.MouseEvent, path: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) {
            router.push('/auth')
            return
        }
        router.push(path)
    }

    useEffect(() => {
        fetch('/api/collections')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCollections(data)
                } else {
                    setCollections([])
                }
            })
            .catch(err => {
                console.error('Failed to fetch collections:', err)
                setCollections([])
            })
    }, [])

    return (
        <section ref={containerRef} style={{
            padding: isMobile ? '40px 24px 16px' : '80px 80px',
            background: '#f8f7f2',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>

                {/* Header */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'center' : 'baseline',
                    gap: isMobile ? '24px' : '40px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <div style={{ flex: 1 }}>
                        {isMobile && (
                            <span
                                style={{
                                    fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.6em',
                                    color: '#1a1a1a', display: 'block', marginBottom: '12px', opacity: 0.5
                                }}
                            >
                                # BEST SELLERS
                            </span>
                        )}
                        <h2
                            style={{
                                fontSize: isMobile ? 'clamp(22px, 6vw, 28px)' : 'clamp(24px, 4vw, 48px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#1a1a1a', margin: 0, letterSpacing: '-0.02em',
                                lineHeight: 1
                            }}
                        >
                            PERFUME <span style={{ color: '#d4af37' }}>COLLECTIONS</span>
                        </h2>
                    </div>

                    {!isMobile && (
                        <div style={{ alignSelf: 'flex-end', opacity: 0.5 }}>
                            <span
                                style={{
                                    fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1em',
                                    color: '#1a1a1a', display: 'block'
                                }}
                            >
                                # BEST SELLERS
                            </span>
                        </div>
                    )}



                </div>

                {/* Editorial Collection Scroll */}
                <div style={{
                    display: isMobile ? 'flex' : 'grid',
                    gridTemplateColumns: !isMobile ? 'repeat(4, 1fr)' : 'none',
                    gap: isMobile ? '16px' : '20px',
                    overflowX: isMobile ? 'auto' : 'visible',
                    paddingBottom: isMobile ? '20px' : '0',
                    scrollSnapType: isMobile ? 'x mandatory' : 'none',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    margin: isMobile ? '0 -24px' : '0',
                    padding: isMobile ? '0 24px' : '0'
                }}>
                    <style>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>
                    {Array.isArray(collections) && collections.map((item, i) => (
                        <div
                            key={item.name}
                            style={{
                                position: 'relative',
                                height: isMobile ? '340px' : '380px',
                                minWidth: isMobile ? '280px' : 'auto',
                                flex: isMobile ? '0 0 auto' : 'auto',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderRadius: '28px',
                                scrollSnapAlign: 'start',
                                boxShadow: isMobile ? '0 10px 30px rgba(0,0,0,0.15)' : '0 8px 24px rgba(0,0,0,0.06)'
                            }}
                        >
                            <div onClick={(e) => handleAction(e, '/products')} style={{ display: 'block', height: '100%' }}>
                                <motion.div
                                    whileHover={!isMobile ? "hover" : ""}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <motion.img
                                        variants={{
                                            hover: { scale: 1.1 }
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        src={item.image_url}
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            filter: 'brightness(0.7)'
                                        }}
                                    />

                                    {/* Desktop Hover Reveal */}
                                    {!isMobile && (
                                        <motion.div
                                            variants={{
                                                hover: { opacity: 1 }
                                            }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: 'absolute', inset: 0,
                                                background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, transparent 80%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <motion.div
                                                variants={{
                                                    hover: { opacity: 1, scale: 1 }
                                                }}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                style={{
                                                    background: '#d4af37', color: '#000',
                                                    padding: '12px 24px', fontSize: '9px',
                                                    fontWeight: 900, textTransform: 'uppercase',
                                                    letterSpacing: '0.2em'
                                                }}
                                            >
                                                Explore
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Label Area */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '24px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{
                                            fontSize: isMobile ? '11px' : '11px', color: '#d4af37',
                                            letterSpacing: '0.05em',
                                            fontFamily: 'var(--font-baskerville)',
                                            textTransform: 'none',
                                            opacity: 0.8,
                                            marginBottom: '8px'
                                        }}>
                                            {item.type}
                                        </div>
                                        <div style={{
                                            fontSize: isMobile ? '20px' : '16px', color: '#fff',
                                            fontWeight: 400, fontFamily: 'var(--font-baskerville)',
                                            letterSpacing: '0.02em',
                                            lineHeight: 1.2
                                        }}>
                                            {item.name}
                                        </div>

                                        {/* Mobile-Only Explore CTA */}
                                        {isMobile && (
                                            <div style={{
                                                marginTop: '16px',
                                                fontSize: '10px',
                                                color: '#d4af37',
                                                fontWeight: 500,
                                                letterSpacing: '0.2em',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                borderTop: '1px solid rgba(212,175,55,0.2)',
                                                paddingTop: '16px'
                                            }}>
                                                View Journey <span style={{ fontSize: '14px' }}>→</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Hint (Bottom) */}
                {isMobile && (
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            color: '#d4af37',
                            opacity: 0.6,
                            fontSize: '16px'
                        }}>
                            <div>←</div>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', alignSelf: 'center' }}>Swipe</div>
                            <div>→</div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

/**
 * Brand Showcase: The Premier Showroom
 */
export function BrandShowcaseSection() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const brands = [
        { name: 'BOMBAY SHAVING CO', logo: '/brands/bombay.png' },
        { name: 'BELLA VITA', logo: '/brands/bellavita.png' },
        { name: 'THE MAN COMPANY', logo: '/brands/man_company.png' },
        { name: 'BEARDO', logo: '/brands/beardo.png' },
        { name: 'WILD STONE', logo: 'https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2019%2C%202026%2C%2009_01_25%20PM.webp' },
        { name: 'MEENA', logo: '/brands/meena-logo.png' },
    ]

    return (
        <section style={{
            padding: isMobile ? '40px 24px' : '60px 80px',
            background: '#050505',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>



                {/* Mobile Sub-label (Bottom) */}
            </div>
        </section>
    )
}

/**
 * Reveil Collection: Restored Noir Red Visuals
 */
export function ReveilCollectionSection() {
    const containerRef = useRef(null)
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    // Parallax Transforms removed to fix scroll lag

    return (
        <section ref={containerRef} style={{
            background: '#f8f7f2',
            padding: isMobile ? '40px 0' : '100px 80px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    minHeight: isMobile ? 'auto' : '85vh',
                    position: 'relative',
                    borderRadius: isMobile ? '0' : '48px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isMobile ? 'none' : '0 80px 160px rgba(0,0,0,1)',
                    border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    padding: isMobile ? '60px 0' : '0',
                    background: isMobile ? '#000' : 'transparent'
                }}
            >
                <div
                    style={{
                        position: 'absolute', inset: 0, zIndex: 0
                    }}
                >
                    <img
                        src={isMobile ? "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1000" : "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=2000"}
                        alt="Reveil Collection"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%)'
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
                    }} />
                </div>

                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    padding: isMobile ? '0 24px' : '0 60px',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1.3fr 0.7fr',
                        gap: isMobile ? '40px' : '80px',
                        alignItems: 'center',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                fontSize: isMobile ? '8px' : '10px', textTransform: 'uppercase', letterSpacing: isMobile ? '0.4em' : '1.4em',
                                color: '#d4af37', display: 'block', marginBottom: isMobile ? '16px' : '28px',
                                fontFamily: 'var(--font-baskerville)', opacity: 0.8,
                                whiteSpace: 'nowrap'
                            }}>
                                P R E M I U M — D I F F U S E R S
                            </span>
                            <h2 style={{
                                fontSize: isMobile ? '32px' : 'clamp(40px, 6vw, 80px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#fff', margin: 0, lineHeight: isMobile ? 1.2 : 0.85,
                                letterSpacing: '-0.01em', textTransform: 'uppercase'
                            }}>
                                REVEIL <br />
                                <span style={{
                                    color: isMobile ? '#fff' : 'transparent',
                                    WebkitTextStroke: isMobile ? 'none' : '1.2px rgba(255,255,255,0.5)',
                                    fontFamily: 'var(--font-baskerville)',
                                    fontStyle: 'italic', fontWeight: 400,
                                    fontSize: isMobile ? '28px' : 'inherit',
                                    display: 'block',
                                    marginTop: isMobile ? '2px' : '0'
                                }}>Diffusers</span>
                            </h2>
                        </div>

                        <motion.div
                            initial={isMobile ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                padding: isMobile ? '32px 20px' : '48px',
                                background: isMobile ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(15px)',
                                borderRadius: isMobile ? '12px' : '4px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                justifySelf: isMobile ? 'center' : 'end',
                                width: isMobile ? '100%' : 'auto',
                                marginTop: isMobile ? '32px' : '0'
                            }}
                        >
                            <h3 style={{
                                fontSize: '22px', color: '#fff',
                                fontFamily: 'var(--font-baskerville)', fontStyle: 'italic',
                                fontWeight: 400, marginBottom: '20px', lineHeight: 1.4
                            }}>
                                "The best smelling diffusers."
                            </h3>
                            <p style={{
                                color: '#bbb', fontSize: '14px', lineHeight: 1.8,
                                marginBottom: '40px', fontWeight: 300,
                                fontFamily: 'var(--font-baskerville)'
                            }}>
                                Shop our most popular collection. Our diffusers are high quality, smell great, and the scent lasts for a long time.
                            </p>


                            <motion.div
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (!user) { router.push('/auth'); return; }
                                    router.push('/products')
                                }}
                                whileHover={{ scale: 1.05, background: '#d4af37', color: '#000' }}
                                style={{
                                    display: 'inline-block',
                                    border: '1px solid rgba(212,175,55,0.5)',
                                    padding: '16px 40px',
                                    borderRadius: '999px',
                                    color: '#d4af37',
                                    textDecoration: 'none',
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    transition: 'all 0.4s ease',
                                    willChange: 'transform',
                                    cursor: 'pointer'
                                }}
                            >
                                View Collection
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}