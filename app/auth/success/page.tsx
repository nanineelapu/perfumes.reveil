'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const REDIRECT_SECONDS = 5
const LOGIN_PATH = '/auth?mode=login'

export default function AuthSuccessPage() {
    const router = useRouter()
    const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)

    // Sign the user out so they go through the proper login flow on redirect
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.signOut().catch(() => {
            // Ignore — even if signOut fails, the redirect still works
        })
    }, [])

    // Countdown + auto-redirect to login
    useEffect(() => {
        if (secondsLeft <= 0) {
            router.push(LOGIN_PATH)
            return
        }
        const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [secondsLeft, router])

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #1a140a 0%, #050505 50%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'var(--font-geist-sans)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    maxWidth: '450px',
                    width: '100%',
                    textAlign: 'center',
                    background: 'rgba(15, 15, 15, 0.6)',
                    backdropFilter: 'blur(20px)',
                    padding: '60px 40px',
                    borderRadius: '24px',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}
                >
                    <CheckCircle size={40} color="#d4af37" strokeWidth={1.5} />
                </motion.div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    marginBottom: '16px',
                    fontFamily: 'var(--font-baskerville)',
                    letterSpacing: '-0.02em'
                }}>
                    You're <span style={{ color: '#d4af37' }}>Registered</span>
                </h1>

                <p style={{
                    color: '#888',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                    fontWeight: 300
                }}>
                    Your account has been created successfully. Please log in to continue — or wait, and we'll take you there automatically.
                </p>

                <motion.button
                    onClick={() => router.push(LOGIN_PATH)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        background: '#d4af37',
                        color: '#000',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s'
                    }}
                >
                    <LogIn size={18} />
                    Go to Login
                </motion.button>

                <div style={{
                    marginTop: '20px',
                    fontSize: '11px',
                    color: '#666',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                }}>
                    Redirecting in <span style={{ color: '#d4af37', fontWeight: 700 }}>{secondsLeft}s</span>
                </div>

                <div style={{
                    marginTop: '40px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '11px',
                    color: '#444',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                }}>
                    Welcome to Réveil
                </div>
            </motion.div>
        </div>
    )
}
