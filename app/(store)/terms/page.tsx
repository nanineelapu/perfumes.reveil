'use client'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'

export default function TermsPage() {
    return (
        <main style={{ background: '#ffffff', color: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AnimatedNavbar />

            {/* Header section with some air */}
            <section style={{ 
                padding: '180px 40px 60px', 
                textAlign: 'center',
                background: '#fafafa',
                borderBottom: '1px solid #eee'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 style={{ 
                        fontSize: 'clamp(32px, 5vw, 64px)', 
                        fontFamily: 'var(--font-baskerville)',
                        fontWeight: 900,
                        color: '#050505',
                        marginBottom: '10px'
                    }}>
                        Terms <span style={{ color: '#d4af37' }}>&</span> Conditions
                    </h1>
                    <p style={{ 
                        fontSize: '11px', 
                        letterSpacing: '0.4em', 
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500
                    }}>
                        Last Updated — April 2026
                    </p>
                </motion.div>
            </section>

            {/* Content Section */}
            <section style={{ padding: '100px 40px', maxWidth: '900px', margin: '0 auto', flex: 1 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ lineHeight: 1.8, fontSize: '16px', color: '#444' }}
                >
                    <p style={{ marginBottom: '40px', fontSize: '18px', fontWeight: 500, color: '#050505' }}>
                        These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and REVEIL (“we”, “us”, or “our”), concerning your access to and use of this website.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        By accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Use. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately.
                    </p>

                </motion.div>
            </section>

            <StayConnected theme="light" />
        </main>
    )
}
