'use client'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Footer } from '@/components/store/Footer'

export default function AboutPage() {
    return (
        <main style={{ background: '#050505', color: '#fff', minHeight: '100vh' }}>
            <AnimatedNavbar />

            {/* Hero Section */}
            <section style={{
                padding: '200px 40px 100px',
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
                        fontSize: 'clamp(40px, 8vw, 120px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        marginBottom: '24px'
                    }}>
                        The <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Archive</span> of <br /> Scents
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        letterSpacing: '0.5em',
                        textTransform: 'uppercase',
                        color: '#888',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        Curating excellence since 1999
                    </p>
                </motion.div>

                {/* Background Ghost Text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', fontSize: '25vw',
                    fontFamily: 'var(--font-baskerville)', color: 'rgba(255,255,255,0.02)',
                    userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
                    fontWeight: 900, zIndex: 0
                }}>
                    LEGACY
                </div>
            </section>

            {/* Heritage Section */}
            <section style={{ padding: '100px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 style={{
                            fontSize: '48px',
                            fontFamily: 'var(--font-baskerville)',
                            marginBottom: '32px',
                            color: '#d4af37'
                        }}>Our Story</h2>
                        <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#aaa', marginBottom: '24px' }}>
                            Our journey began in 1999 as **Trimurty Enterprises**. What started as a passion for fine scents grew into a trusted presence in the world of fragrances. For over two decades, we have built a legacy of trust and quality.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#aaa' }}>
                            Founder **Sri D. Laddu Kishore Patro** established our mission: to bring the most evocative olfactory narratives to every home.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        style={{ position: 'relative', height: '600px', background: '#111', overflow: 'hidden' }}
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
                padding: '160px 40px',
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
                        fontSize: ' clamp(24px, 4vw, 54px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontStyle: 'italic',
                        color: '#fff',
                        marginBottom: '20px'
                    }}>
                        "You are never fully dressed without Perfume."
                    </h3>
                    <div style={{ width: '60px', height: '1px', background: '#d4af37', margin: '40px auto' }} />
                    <p style={{ fontSize: '12px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#666' }}>
                        The Reveil Philosophy
                    </p>
                </motion.div>
            </section>

            {/* Evolution Section */}
            <section style={{ padding: '100px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        style={{ position: 'relative', height: '500px', background: '#111', overflow: 'hidden' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"
                            alt="Luxury Perfume"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                        />
                        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 style={{
                            fontSize: '48px',
                            fontFamily: 'var(--font-baskerville)',
                            marginBottom: '32px',
                            color: '#fff'
                        }}>Digital <span style={{ color: '#d4af37' }}>Evolution</span></h2>
                        <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#aaa', marginBottom: '24px' }}>
                            In 2023, we embraced the future with **Refreshub.com**. This digital transition allows us to share the enchanting world of attars, deodorants, and perfumes with perfume lovers everywhere.
                        </p>
                        <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#aaa' }}>
                            We curate the most prominent names in the industry—from Denver and Wild Stone to Secret Temptation—ensuring a symphony of scents that evoke pure delight.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Connect Section */}
            <section style={{
                padding: '100px 40px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.03)'
            }}>
                <h2 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '32px', marginBottom: '40px' }}>Join the Journey</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <div>
                        <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Email Us</p>
                        <a href="mailto:refreshub@yahoo.com" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '18px' }}>refreshub@yahoo.com</a>
                    </div>
                    <div>
                        <p style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>WhatsApp</p>
                        <a href="https://wa.me/917873789595" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '18px' }}>+91 7873789595</a>
                    </div>
                </div>
            </section>

            <StayConnected theme="dark" />
        </main>
    )
}
