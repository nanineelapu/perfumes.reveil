'use client'

import React, { useEffect, useState } from 'react'
import { Truck, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function FreeDeliveryRibbon() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    return (
        <div style={{
            background: '#f8f7f2',
            position: 'relative',
            zIndex: 20,
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            marginTop: '60px',
            marginBottom: '0px'
        }}>
            <section style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
            }}>
                {/* Free Delivery Item */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Truck size={16} color="#d4af37" strokeWidth={1.5} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            color: '#d4af37',
                            fontFamily: 'var(--font-baskerville)',
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            lineHeight: 1
                        }}>
                            Free Delivery
                        </span>
                        <span style={{
                            color: 'rgba(0,0,0,0.55)',
                            fontSize: '10px',
                            letterSpacing: '0.1em',
                            marginTop: '4px'
                        }}>
                            On all orders above ₹250
                        </span>
                    </div>
                </motion.div>

                {/* Secure Payments Item */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShieldCheck size={16} color="#d4af37" strokeWidth={1.5} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            color: '#1a1a1a',
                            fontFamily: 'var(--font-baskerville)',
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            lineHeight: 1
                        }}>
                            Secure Checkout
                        </span>
                        <span style={{
                            color: 'rgba(0,0,0,0.55)',
                            fontSize: '10px',
                            letterSpacing: '0.1em',
                            marginTop: '4px'
                        }}>
                            100% Protected Payments
                        </span>
                    </div>
                </motion.div>

                {/* Premium Quality Item — hidden on mobile to avoid crowding the ribbon */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(212, 175, 55, 0.08)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles size={16} color="#d4af37" strokeWidth={1.5} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                color: '#1a1a1a',
                                fontFamily: 'var(--font-baskerville)',
                                fontSize: '12px',
                                fontWeight: 500,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                lineHeight: 1
                            }}>
                                Original Scents
                            </span>
                            <span style={{
                                color: 'rgba(0,0,0,0.55)',
                                fontSize: '10px',
                                letterSpacing: '0.1em',
                                marginTop: '4px'
                            }}>
                                Direct from Archive
                            </span>
                        </div>
                    </motion.div>
                )}
            </section>
        </div>
    )
}
