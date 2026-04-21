'use client'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Truck, Box, MapPin, Clock, CreditCard } from 'lucide-react'

export default function ShippingPage() {
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
                        Shipping <span style={{ color: '#d4af37' }}>&</span> Delivery
                    </h1>
                    <p style={{ 
                        fontSize: '11px', 
                        letterSpacing: '0.4em', 
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500
                    }}>
                        Global Standards — Local Care
                    </p>
                </motion.div>
            </section>

            {/* Feature Row */}
            <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {[
                        { icon: Truck, title: 'Free Shipping', text: 'On orders above ₹400' },
                        { icon: CreditCard, title: 'COD Available', text: 'Pay at your doorstep' },
                        { icon: Clock, title: 'Early Dispatch', text: '4-7 days processing' },
                        { icon: Box, title: 'Secure Track', text: 'SMS notifications' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{ 
                                padding: '30px 20px', textAlign: 'center', 
                                background: '#fff', border: '1px solid #eee', 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                            }}
                        >
                            <item.icon size={20} color="#d4af37" strokeWidth={1.5} />
                            <div>
                                <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.title}</h4>
                                <p style={{ fontSize: '13px', color: '#888' }}>{item.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Detailed Content */}
            <section style={{ padding: '40px 40px 100px', maxWidth: '900px', margin: '0 auto', flex: 1 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ lineHeight: 1.8, fontSize: '16px', color: '#444' }}
                >
                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '28px', color: '#050505', marginBottom: '24px' }}>General Guidelines</h2>
                        <p style={{ marginBottom: '20px' }}>
                            The REVEIL website is operated by **Trimurty Enterprises**. We are committed to delivering your signature scents within the promised period and in accordance with this policy.
                        </p>
                        <p>
                            We currently deliver across India, using the most reliable courier partners to ensure your products arrive in perfect condition.
                        </p>
                    </div>

                    <div style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '28px', color: '#050505', marginBottom: '24px' }}>Shipping Cost & Updates</h2>
                        <p style={{ marginBottom: '20px' }}>
                            Shipping and handling rates vary based on product size, volume, and destination. The exact cost is calculated and shown at the final checkout window.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                <div style={{ color: '#d4af37' }}>—</div>
                                <span>Orders above **₹400** are eligible for complementary shipping.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ color: '#d4af37' }}>—</div>
                                <span>Once shipped, tracking details are sent directly to your provided mobile number via **SMS**.</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ padding: '40px', background: '#fafafa', border: '1px solid #eee' }}>
                        <h3 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '20px', color: '#ec4899', marginBottom: '15px' }}>Important Note</h3>
                        <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
                            "To ensure timely delivery, please double-check your shipping address before finalizing your order. Once placed, the delivery destination cannot be altered in our system."
                        </p>
                    </div>
                </motion.div>
            </section>

            <StayConnected theme="light" />
        </main>
    )
}
