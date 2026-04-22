'use client'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Phone, Mail, MapPin, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus('idle')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', phone: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch (err) {
            setStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main style={{
            background: '#ffffff',
            color: '#050505',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AnimatedNavbar />

            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                width: '100%',
                marginTop: '0'
            }}>

                {/* Left Side: Visual Legacy */}
                <div style={{
                    position: 'relative',
                    background: '#050505',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        <img
                            src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2021%2C%202026%2C%2010_18_56%20PM%20%281%29.webp"
                            alt="Perfume Essence"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(32px, 4vw, 54px)',
                            fontFamily: 'var(--font-baskerville)',
                            color: '#d4af37',
                            marginBottom: '24px',
                            lineHeight: 1.1
                        }}>
                            The Art of <br /> Communication
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: '#ffffff',
                            maxWidth: '400px',
                            lineHeight: 1.7,
                            marginBottom: '48px'
                        }}>
                            Experience the bespoke world of REVEIL. Our concierge team is here to guide your olfactory journey.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                                    <Mail size={16} />
                                </div>
                                <span style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#ffffff' }}>naniatworkmail@gmail.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                                    <Phone size={16} />
                                </div>
                                <span style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#ffffff' }}>+91 7873789595</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Contact Form */}
                <div style={{
                    background: '#fff',
                    padding: '120px 80px 80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <div style={{ marginBottom: '60px' }}>
                            <h1 style={{
                                fontSize: '48px',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#050505',
                                marginBottom: '12px'
                            }}>
                                Contact <span style={{ color: '#d4af37' }}>REVEIL</span>
                            </h1>
                            <p style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#aaa' }}>
                                Get in touch for exclusive offers
                            </p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    padding: '40px',
                                    border: '1px solid #d4af37',
                                    textAlign: 'center',
                                    background: '#fffcf5',
                                    borderRadius: '2px'
                                }}
                            >
                                <CheckCircle size={48} color="#d4af37" style={{ marginBottom: '20px' }} />
                                <h3 style={{ fontFamily: 'var(--font-baskerville)', fontSize: '24px', marginBottom: '12px' }}>Message Received</h3>
                                <p style={{ color: '#666', fontSize: '14px' }}>Our concierge team will contact you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    style={{
                                        marginTop: '24px', background: 'none', border: 'none',
                                        textDecoration: 'underline', cursor: 'pointer', fontSize: '12px',
                                        letterSpacing: '0.1em'
                                    }}
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{
                                                width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #eee',
                                                padding: '12px 0', color: '#050505', fontSize: '16px', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{
                                                width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #eee',
                                                padding: '12px 0', color: '#050505', fontSize: '16px', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{
                                            width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #eee',
                                            padding: '12px 0', color: '#050505', fontSize: '16px', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        rows={1}
                                        placeholder="Message"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{
                                            width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #eee',
                                            padding: '12px 0', color: '#050505', fontSize: '16px', outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>

                                {status === 'error' && (
                                    <p style={{ color: '#ff4b4b', fontSize: '12px' }}>Failed to send message. Please try again.</p>
                                )}

                                <motion.button
                                    disabled={isSubmitting}
                                    whileHover={!isSubmitting ? { backgroundColor: '#050505', color: '#fff', x: 10 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '20px 30px',
                                        background: '#d4af37', color: '#000',
                                        border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 900, fontSize: '12px', letterSpacing: '0.4em',
                                        textTransform: 'uppercase', transition: 'all 0.4s',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
