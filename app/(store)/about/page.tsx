'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Footer } from '@/components/store/Footer'

export default function AboutPage() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <main style={{ background: '#050505', color: '#fff', minHeight: '100vh' }}>
            <AnimatedNavbar />

            {/* Hero Section */}
            <section style={{
                padding: isMobile ? '140px 24px 60px' : '200px 40px 100px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 style={{
                        fontSize: isMobile ? '48px' : 'clamp(40px, 8vw, 100px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        textTransform: 'uppercase'
                    }}>
                        The <span style={{ color: '#d4af37' }}>Reveil</span> Story
                    </h1>
                    <p style={{
                        fontSize: isMobile ? '10px' : '14px',
                        letterSpacing: isMobile ? '0.3em' : '0.5em',
                        textTransform: 'uppercase',
                        color: '#888',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        Curating excellence since 1999
                    </p>
                </motion.div>
            </section>

            {/* Heritage Section */}
            <section style={{ padding: isMobile ? '60px 24px' : '100px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '40px' : '80px',
                    alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 style={{
                            fontSize: isMobile ? '32px' : '48px',
                            fontFamily: 'var(--font-baskerville)',
                            marginBottom: '32px',
                            color: '#d4af37'
                        }}>Our Story</h2>
                        <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: 1.8, color: '#aaa', marginBottom: '24px' }}>
                            Our journey began in 1999 as **Trimurty Enterprises**. What started as a passion for fine scents grew into a trusted presence in the world of fragrances. For over two decades, we have built a legacy of trust and quality.
                        </p>
                        <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: 1.8, color: '#aaa' }}>
                            Founder **Sri D. Laddu Kishore Patro** established our mission: to bring the most evocative olfactory narratives to every home.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        style={{
                            position: 'relative',
                            height: isMobile ? '350px' : '600px',
                            background: '#111',
                            overflow: 'hidden',
                            order: isMobile ? -1 : 0
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1541604193435-225878d06a83?auto=format&fit=crop&q=80"
                            alt="Fragrance Creation"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                        />
                        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }} />
                    </motion.div>
                </div>
            </section>

            {/* Quote Section */}
            <section style={{
                padding: isMobile ? '100px 24px' : '160px 40px',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #050505, #0a0a0a, #050505)',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h3 style={{
                        fontSize: isMobile ? '24px' : ' clamp(24px, 4vw, 54px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontStyle: 'italic',
                        color: '#fff',
                        marginBottom: '20px',
                        lineHeight: 1.4
                    }}>
                        "You are never fully dressed without Perfume."
                    </h3>
                    <div style={{ width: '40px', height: '1px', background: '#d4af37', margin: '32px auto' }} />
                    <p style={{ fontSize: isMobile ? '9px' : '12px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#666' }}>
                        The Reveil Philosophy
                    </p>
                </motion.div>
            </section>

            {/* Evolution Section */}
            <section style={{ padding: isMobile ? '60px 24px' : '100px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '40px' : '80px',
                    alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        style={{ position: 'relative', height: isMobile ? '350px' : '500px', background: '#111', overflow: 'hidden' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"
                            alt="Luxury Perfume"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                        />
                        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 style={{
                            fontSize: isMobile ? '32px' : '48px',
                            fontFamily: 'var(--font-baskerville)',
                            marginBottom: '32px',
                            color: '#fff'
                        }}>Digital <span style={{ color: '#d4af37' }}>Evolution</span></h2>
                        <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: 1.8, color: '#aaa', marginBottom: '24px' }}>
                            In 2023, we embraced the future with **Refreshub.com**. This digital transition allows us to share the enchanting world of attars, deodorants, and perfumes with perfume lovers everywhere.
                        </p>
                        <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: 1.8, color: '#aaa' }}>
                            We curate the most prominent names in the industry—from Denver and Wild Stone to Secret Temptation—ensuring a symphony of scents that evoke pure delight.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Connect Section */}
            <section style={{
                padding: isMobile ? '80px 24px' : '100px 40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.03)'
            }}>
                <h2 style={{ fontFamily: 'var(--font-baskerville)', fontSize: isMobile ? '28px' : '32px', marginBottom: '40px' }}>Join the Journey</h2>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'center',
                    gap: isMobile ? '32px' : '40px'
                }}>
                    <div>
                        <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Email Us</p>
                        <a href="mailto:refreshub@yahoo.com" style={{ color: '#d4af37', textDecoration: 'none', fontSize: isMobile ? '16px' : '18px' }}>refreshub@yahoo.com</a>
                    </div>
                    <div>
                        <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>WhatsApp</p>
                        <a href="https://wa.me/917873789595" style={{ color: '#d4af37', textDecoration: 'none', fontSize: isMobile ? '16px' : '18px' }}>+91 7873789595</a>
                    </div>
                </div>
            </section>

            <StayConnected theme="dark" />
        </main>
    )
}

