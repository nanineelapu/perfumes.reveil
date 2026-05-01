'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight, User, ShoppingBag } from 'lucide-react'

export default function AuthSuccessPage() {
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
                    Welcome to <span style={{ color: '#d4af37' }}>Reveil</span>
                </h1>

                <p style={{
                    color: '#888',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    marginBottom: '48px',
                    fontWeight: 300
                }}>
                    Your account has been successfully created. You are now part of our exclusive circle of fragrance collectors.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link href="/profile" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                background: '#d4af37',
                                color: '#000',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.3s'
                            }}
                        >
                            <User size={18} />
                            View My Profile
                        </motion.button>
                    </Link>

                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '16px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.3s'
                            }}
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                            <ArrowRight size={18} />
                        </motion.button>
                    </Link>
                </div>

                <div style={{
                    marginTop: '48px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '12px',
                    color: '#444',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>
                    Experience Elegance
                </div>
            </motion.div>
        </div>
    )
}
