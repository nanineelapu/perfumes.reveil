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
    const [step, setStep] = useState<'auth' | 'name'>('auth')
    const [userId, setUserId] = useState<string | null>(null)
    const [loginUrl, setLoginUrl] = useState<string | null>(null)


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
        if (!recaptchaVerifier && typeof window !== 'undefined' && firebaseAuth) {
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




    // --- FLOW 2: CUSTOMER LOGIN (Firebase OTP) ---
    const sendOtp = async (e: React.FormEvent) => {
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (!firebaseAuth) throw new Error('Something went wrong. Please try again later.')
            if (!formData.phone) throw new Error('Please enter your phone number.')

            // Format phone number
            let cleaned = formData.phone.replace(/[^\d+]/g, '')
            let formattedPhone = cleaned
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = formattedPhone.startsWith('91') && formattedPhone.length >= 12 ? `+${formattedPhone}` : `+91${formattedPhone}`
            }

            if (authMode === 'signup' && (!formData.firstName || !formData.lastName || !formData.email || !formData.password)) {
                throw new Error('Please fill in all your details first.')
            }

            if (!recaptchaVerifier) throw new Error('Still loading, please wait a moment.')

            const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, recaptchaVerifier)
            setConfirmationResult(confirmation)
            setOtpSent(true)
            setMessage(`OTP sent to ${formattedPhone}`)
        } catch (err: any) {
            console.error('Customer Auth Error:', err)

            let errorMessage = 'Something went wrong. Please try again.'
            if (err.code === 'auth/unsupported-phone-number') errorMessage = 'That phone number format is not supported.'
            else if (err.code === 'auth/invalid-phone-number') errorMessage = 'Please enter a valid phone number.'
            else if (err.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Please wait and try again.'
            else if (err.message) errorMessage = err.message

            setError(errorMessage)
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
            if (!confirmationResult) throw new Error('Your session has expired. Please start again.')

            // 1. Verify OTP with Firebase
            const result = await confirmationResult.confirm(formData.otp)
            const firebaseUser = result.user
            const idToken = await firebaseUser.getIdToken()

            // 2. Sync with Supabase
            const res = await fetch('/api/auth/firebase-sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_token: idToken,
                    phone: firebaseUser.phoneNumber,
                    firebase_uid: firebaseUser.uid,
                    isSignup: authMode === 'signup',
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                })
            })

            const syncResult = await res.json()
            if (!res.ok) throw new Error(syncResult.error || 'Sync failed')

            setMessage('Code verified! Setting up your account...')

            // Handle New User vs Existing User
            if (syncResult.is_new_user) {
                setUserId(syncResult.user_id)
                setLoginUrl(syncResult.loginUrl)
                setStep('name')
            } else if (syncResult.loginUrl) {
                // This redirect establishes the Supabase session cookies automatically
                window.location.href = syncResult.loginUrl
            } else {
                window.location.href = '/'
            }
        } catch (err: any) {
            console.error('OTP Verification Error:', err)
            setError(err.message || 'That code is wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // STEP 8 — Save Name for New Users
    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault()
        const firstName = formData.firstName.trim()
        const fullName = `${formData.firstName} ${formData.lastName}`.trim()

        if (!firstName) {
            setError('Please enter at least your first name.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Save name via API using the stored userId (session not established yet)
            const res = await fetch('/api/auth/save-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    full_name: fullName,
                    first_name: formData.firstName,
                    last_name: formData.lastName
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Could not save your name.')
            }

            setMessage('All set! Logging you in...')
            // Redirect via magic link — this establishes the Supabase session
            window.location.href = loginUrl || '/'
        } catch (err: any) {
            console.error('Save Name Error:', err)
            setError(err.message || 'Could not save your name. Please try again.')
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
                            Explore our curated fragrances. Log in to shop, save your favourites, and track your orders.
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
                    {/* Brand Logo Header (Secret Admin Toggle) */}
                    <div style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                        <h1
                            style={{
                                fontSize: isMobile ? '18px' : '24px',
                                color: '#000',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                margin: 0,
                                transition: 'color 0.3s'
                            }}
                        >
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
                            {otpSent ? 'Enter the code we sent you' : (authMode === 'login' ? 'We will send a code to your phone' : 'Create your account — it only takes a minute')}
                        </p>
                    </div>

                    {/* MAIN AUTH FORM */}
                    {step === 'name' ? (
                        <form onSubmit={handleSaveName}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <motion.div
                                        whileHover={{ borderBottomColor: '#d4af37' }}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                        <label style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>First Name *</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ borderBottomColor: '#d4af37' }}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '4px', transition: 'border-color 0.3s' }}>
                                        <label style={{ fontSize: '9px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '2px', display: 'block', letterSpacing: '0.15em' }}>Last Name (optional)</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'none', fontSize: '14px', outline: 'none', color: '#000' }} />
                                    </motion.div>
                                </div>
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
                                        marginTop: '12px'
                                    }}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <>Save & Continue <ArrowRight size={16} /></>}
                                </motion.button>
                            </div>
                        </form>
                    ) : (
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
                                                    gap: '12px',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                <span style={{
                                                    fontSize: isMobile ? '14px' : '16px',
                                                    color: '#000',
                                                    opacity: 0.4,
                                                    fontWeight: 500,
                                                    borderRight: '1px solid rgba(0,0,0,0.1)',
                                                    paddingRight: '12px'
                                                }}>+91</span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="Your phone number"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    style={{ flex: 1, border: 'none', background: 'none', fontSize: isMobile ? '14px' : '16px', color: '#000', outline: 'none' }}
                                                />
                                                <Smartphone size={isMobile ? 16 : 18} style={{ color: '#d4af37', opacity: 0.6 }} />
                                            </motion.div>
                                        </div>

                                        {/* Identity Profile Fields Grid */}
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
                                            <label style={{ fontSize: '10px', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', display: 'block' }}>Enter Code</label>
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
                                                Didn't get the code? <span style={{ color: '#d4af37' }}>Resend</span>
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
                                        otpSent ? <>Verify Code <CheckCircle2 size={16} /></> : <>Send OTP <ArrowRight size={16} /></>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    )}

                    {/* Mode Toggle */}
                    {!otpSent && (
                        <div style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.02em', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                            Your information is safe with us.<br />
                            © Reveil 2026
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Global Focus Styles Patch */}
            <style jsx global>{`
                .grecaptcha-badge { 
                    visibility: hidden !important; 
                }
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
