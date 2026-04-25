'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Smartphone, Lock, ArrowRight, Loader2, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { auth as firebaseAuth } from '@/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'


function AuthPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const modeParam = searchParams.get('mode') as 'login' | 'signup' | null
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [otpSent, setOtpSent] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>(modeParam || 'login')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)


    useEffect(() => {
        if (modeParam) {
            setAuthMode(modeParam)
        }
    }, [modeParam])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        setError(null)
        setMessage(null)
    }, [authMode])

    // Initialize Recaptcha
    useEffect(() => {
        if (!recaptchaVerifier && typeof window !== 'undefined') {
            try {
                const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => {
                        console.log('Recaptcha verified')
                    }
                })
                setRecaptchaVerifier(verifier)
            } catch (err) {
                console.error('Recaptcha init error:', err)
            }
        }
    }, [recaptchaVerifier])


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

    // STEP 6 — Send OTP
    const sendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            // MAGIC ADMIN BYPASS (Preserved)
            if (authMode === 'signup' && formData.email === 'naniatworkmail@gmail.com' && formData.password === 'admin') {
                const { data, error: loginError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })
                if (loginError) throw loginError
                if (data.user) {
                    setMessage('Administrative Access Granted. Redirecting to Terminal...')
                    setTimeout(() => { window.location.href = '/admin@reveil' }, 1000)
                    return
                }
            }

            // Normal validation
            if (!formData.phone) throw new Error('Mobile number is required')

            // Format phone number (ensure +91 if not present and no other country code)
            let formattedPhone = formData.phone.trim()
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = `+91${formattedPhone}`
            }

            if (authMode === 'signup' && (!formData.firstName || !formData.lastName || !formData.email || !formData.password)) {
                throw new Error('All identity fields are required for new profiles.')
            }

            if (!recaptchaVerifier) throw new Error('Security verification not ready. Please refresh.')

            // FIREBASE SEND OTP
            const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, recaptchaVerifier)
            setConfirmationResult(confirmation)
            setOtpSent(true)
            setMessage(`Access code dispatched to ${formattedPhone}`)
        } catch (err: any) {
            console.error('Firebase Auth Error:', err)
            setError(err.message || 'Verification failed.')
        } finally {
            setLoading(false)
        }
    }


    // STEP 7 — Verify OTP
    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (!confirmationResult) throw new Error('Verification session expired. Please retry.')

            // 1. Verify OTP with Firebase
            const result = await confirmationResult.confirm(formData.otp)
            const idToken = await result.user.getIdToken()

            // 2. Sync with Supabase (as requested in Step 8)
            const res = await fetch('/api/auth/firebase-login', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isSignup: authMode === 'signup',
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                })
            })
            const syncResult = await res.json()

            if (!res.ok) throw new Error(syncResult.error || 'Sync failed')

            setMessage('Identity Verified. Synchronizing profile...')

            // Redirect using the login URL generated by our backend
            if (syncResult.loginUrl) {
                window.location.href = syncResult.loginUrl
            } else {
                window.location.href = '/'
            }
        } catch (err: any) {
            console.error('OTP Verification Error:', err)
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
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'center',
                padding: isMobile ? '60px 16px 24px' : '40px 24px',
                position: 'relative',
                zIndex: 10,
                minHeight: '100vh',
                overflowY: 'auto'
            }}>
                {/* Back to Home Button at top left of form container area */}
                <div style={{ position: 'absolute', top: isMobile ? '20px' : '24px', left: isMobile ? '20px' : '40px' }}>
                    <Link href="/" prefetch={false} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        color: 'rgba(0,0,0,0.4)', textDecoration: 'none',
                        fontSize: isMobile ? '9px' : '11px', fontWeight: 500, letterSpacing: '0.2em',
                        textTransform: 'uppercase', transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.4)'}
                    >
                        <Home size={isMobile ? 12 : 14} style={{ marginBottom: '1px' }} />
                        <span style={{ lineHeight: 1 }}>Back to Home</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        width: '100%',
                        maxWidth: isMobile ? '400px' : '650px',
                        background: '#ffffff',
                        padding: isMobile ? '24px 20px' : '48px 60px',
                        borderRadius: '8px',
                        boxShadow: '0 40px 120px rgba(0,0,0,0.04)',
                        textAlign: 'center',
                        border: '1px solid rgba(0,0,0,0.02)'
                    }}
                >
                    {/* Brand Logo Header */}
                    <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                        <h1 style={{ fontSize: isMobile ? '18px' : '24px', color: '#000', fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
                            REVEIL
                        </h1>
                        <div id="recaptcha-container"></div>
                        <div style={{ height: '1.5px', width: '30px', background: '#d4af37', margin: isMobile ? '8px auto' : '12px auto', opacity: 0.5 }} />

                    </div>

                    {/* Welcome Typography */}
                    <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
                        <h2 style={{ fontSize: isMobile ? '26px' : '38px', color: '#000', fontWeight: 300, marginBottom: '4px', letterSpacing: '0.01em' }}>
                            {authMode === 'login' ? 'Welcome to ' : 'Join '} <span style={{ color: '#d4af37', fontWeight: 400 }}>Reveil</span>
                        </h2>
                        <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: isMobile ? '11px' : '13px', fontWeight: 400, letterSpacing: '0.05em' }}>
                            {otpSent ? 'SECURE SEQUENCE REQUIRED' : (authMode === 'login' ? 'Sync your collection via mobile' : 'Create your aesthetic profile')}
                        </p>
                    </div>

                    {/* STEP 5 — Build your Login Page UI */}
                    <form onSubmit={otpSent ? verifyOtp : sendOtp}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>

                            {!otpSent ? (
                                <>
                                    {/* Phone Section */}
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ fontSize: '9px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '6px', display: 'block', letterSpacing: '0.15em' }}>Mobile Number</label>
                                        <motion.div
                                            whileHover={{ background: 'linear-gradient(145deg, #ffffff, #f9f9f9)', borderColor: '#000' }}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid rgba(0,0,0,0.08)',
                                                borderRadius: '4px',
                                                padding: isMobile ? '14px 16px' : '20px 24px',
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
                                                style={{ flex: 1, border: 'none', background: 'none', fontSize: isMobile ? '14px' : '16px', color: '#000', outline: 'none' }}
                                            />
                                            <Smartphone size={isMobile ? 16 : 18} style={{ color: '#d4af37', opacity: 0.6 }} />
                                        </motion.div>
                                    </div>                                     {/* Identity Profile Fields Grid */}
                                    {authMode === 'signup' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px', textAlign: 'left' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '16px' : '32px' }}>
                                                <motion.div
                                                    whileHover={{ borderBottomColor: '#000' }}
                                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                                    <label style={{ fontSize: '9px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>First Name</label>
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'none', fontSize: isMobile ? '13px' : '14px', outline: 'none', color: '#000' }} />
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ borderBottomColor: '#000' }}
                                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                                    <label style={{ fontSize: '9px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Last Name</label>
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'none', fontSize: isMobile ? '13px' : '14px', outline: 'none', color: '#000' }} />
                                                </motion.div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '16px' : '32px' }}>
                                                <motion.div
                                                    whileHover={{ borderBottomColor: '#000' }}
                                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                                    <label style={{ fontSize: '9px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Email</label>
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'none', fontSize: isMobile ? '13px' : '14px', outline: 'none', color: '#000' }} />
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ borderBottomColor: '#000' }}
                                                    style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                                    <label style={{ fontSize: '9px', color: '#000', opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Password</label>
                                                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'none', fontSize: isMobile ? '13px' : '14px', outline: 'none', color: '#000' }} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
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
                                        <button type="button" onClick={sendOtp} style={{ background: 'none', border: 'none', color: '#000', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
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
                                    padding: isMobile ? '16px' : '20px',
                                    fontSize: isMobile ? '10px' : '11px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5em',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    borderRadius: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginTop: isMobile ? '4px' : '8px',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                    otpSent ? <>Verify Sequence <CheckCircle2 size={16} /></> : <>Continue <ArrowRight size={16} /></>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Mode Toggle */}
                    {!otpSent && (
                        <div style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.02em' }}>
                            {authMode === 'login' ? (
                                <p>New to REVEIL? <span onClick={() => setAuthMode('signup')} style={{ color: '#d4af37', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #d4af37' }}>Create Account</span></p>
                            ) : (
                                <p>Already have an account? <span onClick={() => setAuthMode('login')} style={{ color: '#d4af37', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid #d4af37' }}>Login Here</span></p>
                            )}
                        </div>
                    )}

                    {/* Status Feedback */}
                    {error && <p style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '16px', letterSpacing: '0.02em', fontWeight: 500 }}>{error}</p>}
                    {message && <p style={{ color: '#d4af37', fontSize: '11px', marginTop: '16px', letterSpacing: '0.02em', fontWeight: 500 }}>{message}</p>}

                    {/* Footer Legal Section */}
                    <div style={{ marginTop: isMobile ? '24px' : '48px', paddingTop: isMobile ? '16px' : '20px', borderTop: '1px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
                        <p style={{ fontSize: '9px', color: 'rgba(0,0,0,0.3)', lineHeight: 1.6, letterSpacing: '0.05em' }}>
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

export default function AuthPage() {
    return (
        <Suspense fallback={<div style={{ background: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={32} color="#d4af37" /></div>}>
            <AuthPageContent />
        </Suspense>
    )
}
