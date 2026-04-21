'use client'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Package, ShieldCheck, Clock, MessageCircle } from 'lucide-react'

export default function RefundPage() {
    return (
        <main style={{ background: '#ffffff', color: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AnimatedNavbar />

            {/* Header Section */}
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
                        Refund <span style={{ color: '#d4af37' }}>&</span> Returns
                    </h1>
                    <p style={{ 
                        fontSize: '11px', 
                        letterSpacing: '0.4em', 
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500
                    }}>
                        Our Commitment to Quality
                    </p>
                </motion.div>
            </section>

            {/* Policy Content */}
            <section style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ padding: '30px', border: '1px solid #eee' }}
                    >
                        <Clock size={24} color="#d4af37" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '20px', marginBottom: '15px' }}>7-Day Window</h3>
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
                            Returns must be initiated within 7 days of receiving your order. Requests beyond this window cannot be accommodated.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ padding: '30px', border: '1px solid #eee' }}
                    >
                        <ShieldCheck size={24} color="#d4af37" style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '20px', marginBottom: '15px' }}>Damage & Defects</h3>
                        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>
                            We accept returns specifically for manufacturing defects or items damaged during transit. 
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ lineHeight: 1.8, fontSize: '16px', color: '#444' }}
                >
                    <h2 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '32px', color: '#050505', marginBottom: '32px' }}>The Process</h2>
                    
                    <p style={{ marginBottom: '24px' }}>
                        To begin a return, please contact the **REVEIL Concierge** via WhatsApp or Email. Kindly provide your order number and photographic evidence of the damage.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '48px' }}>
                        {[
                            { title: 'Condition', text: 'Items must be unused, in original packaging, with all tags intact.' },
                            { title: 'Options', text: 'We offer either a full refund or a replacement, depending on your choice.' },
                            { title: 'Shipping', text: 'For accepted defect claims, REVEIL covers the return shipping costs.' }
                        ].map((item, i) => (
                            <li key={i} style={{ marginBottom: '24px', display: 'flex', gap: '15px' }}>
                                <div style={{ minWidth: '4px', height: '4px', borderRadius: '50%', background: '#d4af37', marginTop: '10px' }} />
                                <div>
                                    <strong style={{ color: '#050505' }}>{item.title}:</strong> {item.text}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ textAlign: 'center', padding: '60px', background: '#fafafa', border: '1px dashed #ddd' }}>
                        <h4 style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: '20px' }}>Contact Concierge</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <a href="mailto:refreshub@yahoo.com" style={{ color: '#050505', textDecoration: 'none', fontWeight: 600 }}>Email Support</a>
                            <a href="https://wa.me/917873789595" style={{ color: '#050505', textDecoration: 'none', fontWeight: 600 }}>WhatsApp Us</a>
                        </div>
                    </div>
                </motion.div>
            </section>

            <StayConnected theme="light" />
        </main>
    )
}
