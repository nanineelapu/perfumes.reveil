'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader() {
    const [loading, setLoading] = useState(true)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        // Check if preloader has already been shown in this session
        const hasShownInSession = sessionStorage.getItem('reveil_session_preloader_shown')

        if (hasShownInSession) {
            setLoading(false)
            setShouldRender(false)
            return
        }

        // It's the first time in this session
        setShouldRender(true)

        const timer = setTimeout(() => {
            setLoading(false)
            sessionStorage.setItem('reveil_session_preloader_shown', 'true')
        }, 3200) // Duration of the animation sequence

        return () => clearTimeout(timer)
    }, [])

    if (!shouldRender) return null

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        y: '-100%',
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        background: '#f8f7f2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'all'
                    }}
                >
                    {/* Architectural Ambient Text */}
                    <div style={{
                        position: 'absolute',
                        fontSize: '30vw',
                        fontWeight: 900,
                        fontFamily: 'var(--font-baskerville)',
                        color: 'rgba(212,175,55,0.08)',
                        whiteSpace: 'nowrap',
                        zIndex: 0,
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}>
                        ESTATE 2026
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(15px)', scale: 0.95 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontSize: 'clamp(28px, 6vw, 56px)',
                                fontFamily: 'var(--font-baskerville)',
                                color: '#1a1a1a',
                                letterSpacing: '0.5em',
                                textTransform: 'uppercase',
                                fontWeight: 400,
                                marginBottom: '32px'
                            }}
                        >
                            RE<span style={{ color: '#d4af37' }}>VEIL</span>
                        </motion.div>

                        <div style={{
                            width: '200px',
                            height: '1px',
                            background: 'rgba(212,175,55,0.3)',
                            margin: '0 auto',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 2.2,
                                    ease: "easeInOut",
                                    repeat: 0
                                }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to right, transparent, #d4af37, transparent)'
                                }}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            style={{
                                marginTop: '40px',
                                fontSize: '8px',
                                letterSpacing: '1em',
                                color: '#888',
                                textTransform: 'uppercase',
                                fontWeight: 600
                            }}
                        >
                            Initializing Laboratory Archive
                        </motion.div>
                    </div>

                    {/* Corner Decoration */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '8px'
                    }}>
                        <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                        <div style={{ fontSize: '8px', color: '#888', letterSpacing: '0.2em' }}>PULLING_ASSETS_V1.02</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
