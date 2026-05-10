'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || isSubmitting) return
        setSubmitError(null)
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || 'Could not subscribe. Please try again.')

            setIsSubmitted(true)
            setEmail('')
        } catch (err: any) {
            setSubmitError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Parallax background text
    const bgX = useTransform(smoothProgress, [0, 1], [-200, 200])
    const bgOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.05, 0.2, 0.05])

    // Aesthetic elements
    const circleRotate = useTransform(smoothProgress, [0, 1], [0, 180])
    const circleX = useTransform(smoothProgress, [0, 1], [-50, 50])

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-white text-[#1a1a1a]"
            style={{
                padding: isMobile ? '60px 20px' : '80px 80px',
                minHeight: isMobile ? 'auto' : '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Background Aesthetic: Large Parallax Text */}
            {!isMobile && (
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        x: '-50%',
                        y: '-55%',
                        fontSize: 'clamp(150px, 30vw, 380px)',
                        fontFamily: 'var(--font-baskerville)',
                        color: '#d4af37',
                        opacity: bgOpacity,
                        whiteSpace: 'nowrap',
                        zIndex: 0,
                        translateX: bgX,
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                >
                    REVEIL
                </motion.div>
            )}

            {/* Decorative Gold Elements */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: isMobile ? '220px' : '350px',
                    height: isMobile ? '220px' : '350px',
                    border: '1px solid #d4af3715',
                    borderRadius: '50%',
                    zIndex: 0,
                    rotate: circleRotate,
                    translateX: circleX,
                    left: isMobile ? '50%' : '5%',
                    x: isMobile ? '-50%' : '0',
                    top: isMobile ? '-10%' : '-10%'
                }}
            />

            {/* Content Grid */}
            <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Heading */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: isMobile ? '8px' : '9px',
                            color: '#d4af37',
                            letterSpacing: isMobile ? '0.5em' : '0.8em',
                            textTransform: 'uppercase',
                            marginBottom: isMobile ? '12px' : '20px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-baskerville)'
                        }}
                    >
                        Our Community
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: isMobile ? 'clamp(32px, 10vw, 42px)' : 'clamp(45px, 7vw, 90px)',
                            fontWeight: 800,
                            lineHeight: 0.85,
                            margin: 0,
                            fontFamily: 'var(--font-baskerville)',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.04em'
                        }}
                    >
                        JOIN <br />
                        <motion.span style={{
                            color: 'transparent',
                            WebkitTextStroke: isMobile ? '0.8px #1a1a1a' : '1.5px #1a1a1a',
                            fontFamily: 'var(--font-baskerville)',
                            display: 'inline-block'
                        }}>
                            REVEIL
                        </motion.span>
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                        style={{
                            height: '1px',
                            width: '80px',
                            background: '#d4af37',
                            marginTop: '24px',
                            originX: 0.5
                        }}
                    />
                </div>

                {/* Right Column: Info & Form */}
                <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            fontSize: isMobile ? '13px' : '17px',
                            color: '#666',
                            fontFamily: 'var(--font-baskerville)',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            lineHeight: 1.5,
                            maxWidth: isMobile ? '100%' : '400px',
                            marginBottom: isMobile ? '24px' : '40px',
                            letterSpacing: '-0.01em'
                        }}
                    >
                        Be the first to know about our new perfume launches and special offers.
                        Join our list to get exclusive updates on our luxury collections.
                    </motion.p>

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                onSubmit={handleSubmit}
                                className="w-full max-w-md relative"
                            >
                                <div className="relative group">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ENTER YOUR EMAIL"
                                        style={{
                                            fontFamily: 'var(--font-baskerville)',
                                            fontSize: isMobile ? '10px' : '11px',
                                            paddingRight: '48px'
                                        }}
                                        className="w-full bg-transparent border-b border-[#ddd] py-4 focus:border-[#d4af37] outline-none transition-colors duration-500 tracking-[0.3em]"
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ x: 5, color: '#d4af37' }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-300"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.button>
                                </div>
                                <p
                                    style={{ fontFamily: 'var(--font-baskerville)' }}
                                    className="mt-4 text-[8px] text-gray-400 uppercase tracking-widest font-medium"
                                >
                                    {isSubmitting ? 'Submitting…' : 'Get the latest perfume news and offers'}
                                </p>
                                {submitError && (
                                    <p style={{ marginTop: '8px', fontSize: '11px', color: '#c0392b', fontFamily: 'var(--font-baskerville)' }}>
                                        {submitError}
                                    </p>
                                )}
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    textAlign: isMobile ? 'center' : 'right',
                                    color: '#d4af37',
                                    fontFamily: 'var(--font-baskerville)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-end', gap: '12px', marginBottom: '8px' }}>
                                    <CheckCircle size={16} />
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em' }}>Subscription Confirmed</span>
                                </div>
                                <h4 style={{ fontSize: isMobile ? '16px' : '18px', color: '#1a1a1a', fontWeight: 600, letterSpacing: '-0.02em' }}>
                                    Thank you for choosing REVEIL. <br />
                                    <span style={{ color: '#666', fontSize: isMobile ? '12px' : '14px', fontWeight: 400 }}>We will contact you soon.</span>
                                </h4>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Vertical Decorative Text */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                    position: 'absolute',
                    bottom: isMobile ? '20px' : '40px',
                    right: isMobile ? '12px' : '40px',
                    fontSize: isMobile ? '7px' : '9px',
                    color: '#c4a64f',
                    writingMode: 'vertical-rl',
                    letterSpacing: isMobile ? '0.4em' : '0.8em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-baskerville)',
                    opacity: 0.4
                }}
            >
                REVEIL / {new Date().getFullYear()} / PRIVÉ
            </motion.div>
        </section>
    )
}


