'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Smartphone, Lock, ArrowRight, Loader2, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AuthPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [otpSent, setOtpSent] = useState(false)

    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        otp: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Handle sending OTP
    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`
            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            })

            if (otpError) throw otpError

            setOtpSent(true)
            setMessage(`Access code dispatched to ${formattedPhone}`)
        } catch (err: any) {
            setError(err.message || 'Verification failed.')
        } finally {
            setLoading(false)
        }
    }

    // Phase 2: Verify OTP & Sync Profile
    const handleFinalVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: formData.otp,
                type: 'sms',
            })

            if (verifyError) throw verifyError

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        updated_at: new Date().toISOString(),
                    })

                if (profileError) console.error("Profile sync error:", profileError)
                setMessage('Entry Granted. Synchronizing profile...')
                setTimeout(() => router.push('/'), 1200)
            }
        } catch (err: any) {
            setError(err.message || 'Invalid sequence.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <main style={{
            background: '#fafafa',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            fontFamily: 'var(--font-baskerville)'
        }}>
            {/* Visual Side (Hidden on Mobile) */}
            <div style={{
                flex: 1,
                position: 'relative',
                display: 'none',
                '@media (minWidth: 1024px)': { display: 'block' }
            } as any} className="hidden lg:block">
                <Image
                    src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/COURSEL%20POSTERS/WILDSTONE%20COURSEL.webp"
                    alt="REVEIL Aesthetic"
                    fill
                    className="object-cover"
                    priority
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(250,250,250,0.4), rgba(250,250,250,0.8))',
                    zIndex: 1
                }} />

                <div style={{
                    position: 'absolute', bottom: '10%', left: '10%', zIndex: 2,
                    maxWidth: '80%'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <h2 style={{
                            fontSize: '64px', color: '#fff', fontWeight: 300, lineHeight: 1,
                            letterSpacing: '-0.02em', marginBottom: '16px'
                        }}>
                            The <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Archive</span>
                        </h2>
                        <p style={{
                            color: 'rgba(0,0,0,0.6)', fontSize: '14px',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            maxWidth: '400px', lineHeight: 1.6
                        }}>
                            Curated fragrances, exclusive access, and the art of sensory storytelling. Enter the terminal to synchronize your collections.
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Vertical Text */}
                <div style={{
                    position: 'absolute', top: '10%', left: '5%',
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                    color: 'rgba(212,175,55,0.2)', fontSize: '10px',
                    letterSpacing: '1em', textTransform: 'uppercase',
                    zIndex: 2, pointerEvents: 'none'
                }}>
                    REVEIL STUDIO ARCHIVE — 2026
                </div>
            </div>

            {/* Form Side */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                zIndex: 10,
                minHeight: '100vh'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        width: '100%',
                        maxWidth: '650px',
                        background: '#ffffff',
                        padding: '48px 60px',
                        borderRadius: '8px',
                        boxShadow: '0 40px 120px rgba(0,0,0,0.04)',
                        textAlign: 'center',
                        border: '1px solid rgba(0,0,0,0.02)'
                    }}
                >
                    {/* Brand Logo Header */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '24px', color: '#000', fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
                            REVEIL
                        </h1>
                        <div style={{ height: '1.5px', width: '30px', background: '#d4af37', margin: '12px auto', opacity: 0.5 }} />
                    </div>

                    {/* Welcome Typography */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '38px', color: '#000', fontWeight: 300, marginBottom: '8px', letterSpacing: '0.01em' }}>
                            Welcome to <span style={{ color: '#d4af37', fontWeight: 400 }}>Reveil</span>
                        </h2>
                        <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '13px', fontWeight: 400, letterSpacing: '0.05em' }}>
                            {otpSent ? 'SECURE SEQUENCE REQUIRED' : 'Get Your Handy Perfumes Here'}
                        </p>
                    </div>

                    <form onSubmit={otpSent ? handleFinalVerify : handleInitialSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {!otpSent ? (
                                <>
                                    {/* Phone Section */}
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ fontSize: '10px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.15em' }}>Enter your mobile number</label>
                                        <motion.div
                                            whileHover={{ background: 'linear-gradient(145deg, #ffffff, #f9f9f9)', borderColor: '#000' }}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid rgba(0,0,0,0.08)',
                                                borderRadius: '4px',
                                                padding: '20px 24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                transition: 'all 0.3s ease'
                                            }}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder=""
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                style={{ flex: 1, border: 'none', background: 'none', fontSize: '16px', color: '#000', outline: 'none' }}
                                            />
                                            <Smartphone size={18} style={{ color: '#d4af37', opacity: 0.6 }} />
                                        </motion.div>
                                    </div>

                                    {/* Identity Profile Fields Grid */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                            <motion.div
                                                whileHover={{ borderBottomColor: '#000' }}
                                                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '6px', transition: 'border-color 0.3s' }}>
                                                <label style={{ fontSize: '10px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>First Name</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ borderBottomColor: '#000' }}
                                                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '6px', transition: 'border-color 0.3s' }}>
                                                <label style={{ fontSize: '10px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Last Name</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                            </motion.div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                            <motion.div
                                                whileHover={{ borderBottomColor: '#000' }}
                                                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '6px', transition: 'border-color 0.3s' }}>
                                                <label style={{ fontSize: '10px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Email</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ borderBottomColor: '#000' }}
                                                style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '6px', transition: 'border-color 0.3s' }}>
                                                <label style={{ fontSize: '10px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Password</label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ borderBottom: '2px solid #d4af37', paddingBottom: '8px' }}>
                                        <label style={{ fontSize: '10px', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', display: 'block' }}>Access Sequence</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            placeholder="· · · · · ·"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            required
                                            maxLength={6}
                                            style={{ width: '100%', padding: '8px 0 0', background: 'none', border: 'none', color: '#000', fontSize: '24px', letterSpacing: '0.6em', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                        <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.4)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <ChevronLeft size={14} /> Back
                                        </button>
                                        <button type="button" onClick={handleInitialSubmit} style={{ background: 'none', border: 'none', color: '#000', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                                            Missing OTP? <span style={{ color: '#d4af37' }}>Resend</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.01, backgroundColor: '#c5a02e' }}
                                whileTap={{ scale: 0.99 }}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    background: '#d4af37',
                                    color: '#000',
                                    border: 'none',
                                    padding: '20px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5em',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    borderRadius: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginTop: '8px',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                    otpSent ? <>Verify Sequence <CheckCircle2 size={16} /></> : <>Continue Sequence <ArrowRight size={16} /></>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Status Feedback */}
                    {error && <p style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '16px', letterSpacing: '0.02em', fontWeight: 500 }}>{error}</p>}
                    {message && <p style={{ color: '#d4af37', fontSize: '11px', marginTop: '16px', letterSpacing: '0.02em', fontWeight: 500 }}>{message}</p>}

                    {/* Footer Legal Section */}
                    <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', lineHeight: 1.6, letterSpacing: '0.05em' }}>
                            IDENTITY ENCRYPTION ENABLED — STUDIO ARCHIVE 2026<br />
                            SECURE ACCESS NODE: REVEIL-AUTH-01
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Global Focus Styles Patch */}
            <style jsx global>{`
                input:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
                @media (max-width: 1024px) {
                    .hidden.lg\\:block {
                        display: none !important;
                    }
                }
            `}</style>
        </main>
    )
}
