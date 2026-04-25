'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useRef, useState, useEffect } from 'react'

const FacebookIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

const InstagramIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
)

const YoutubeIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
)

export function Footer() {
    const footerRef = useRef(null)
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <footer ref={footerRef} style={{
            background: '#050505',
            padding: isMobile ? '60px 0 20px' : '100px 0 0px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.03)'
        }}>
            {/* Ghost Background Branding - Hidden on mobile for height efficiency */}
            {!isMobile && (
                <div style={{
                    position: 'absolute', top: '60px', left: '50%',
                    transform: 'translateX(-50%)', fontSize: '15vw',
                    fontFamily: 'var(--font-baskerville)', color: 'rgba(255,255,255,0.02)',
                    userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
                    fontWeight: 900
                }}>
                    REVEIL ESTATE
                </div>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 40px', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: isMobile ? 'flex' : 'grid',
                    flexDirection: isMobile ? 'column' : 'row',
                    gridTemplateColumns: isMobile ? 'none' : '1.2fr 0.8fr 0.8fr 1fr',
                    gap: isMobile ? '32px' : '40px',
                    textAlign: isMobile ? 'center' : 'left',
                    alignItems: isMobile ? 'center' : 'flex-start'
                }}>

                    {/* Header Block - New Logo & Social Row for Mobile */}
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        justifyContent: isMobile ? 'space-between' : 'flex-start',
                        alignItems: isMobile ? 'center' : 'flex-start',
                        width: '100%',
                        marginBottom: isMobile ? '40px' : '32px'
                    }}>
                        <div style={{ marginBottom: isMobile ? '0' : '32px', marginLeft: isMobile ? '0' : '-15px' }}>
                            <img src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/Untitled%20%282%29.webp" alt="Reveil" style={{ height: isMobile ? '40px' : '60px', width: 'auto' }} />
                        </div>
                        
                        {!isMobile && (
                            <>
                                <p style={{
                                    fontSize: isMobile ? '13px' : '14px', lineHeight: 1.9, color: '#888',
                                    marginBottom: '20px', maxWidth: isMobile ? '100%' : '300px',
                                    fontFamily: 'var(--font-baskerville)', fontWeight: 300,
                                    textAlign: isMobile ? 'center' : 'left'
                                }}>
                                    Curating the world's most evocative olfactory narratives.
                                </p>
                                <p style={{
                                    fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6, color: '#666',
                                    marginBottom: '32px', maxWidth: isMobile ? '100%' : '300px',
                                    fontFamily: 'var(--font-baskerville)',
                                    textAlign: isMobile ? 'center' : 'left'
                                }}>
                                    Trimurty Enterprises, Marthapeta Street,<br />
                                    Near Sano Bazar, Berhampur,<br />
                                    Odisha, India - 760002
                                </p>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[
                                { icon: FacebookIcon, href: '#' },
                                { icon: InstagramIcon, href: '#' },
                                { icon: YoutubeIcon, href: '#' }
                            ].map((s, idx) => (
                                <motion.a
                                    key={idx} href={s.href}
                                    whileHover={{ y: -5, borderColor: '#d4af37', color: '#d4af37' }}
                                    style={{
                                        width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px',
                                        borderRadius: '50%',
                                        background: isMobile ? '#d4af37' : 'transparent',
                                        border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isMobile ? '#000' : '#666',
                                        transition: 'all 0.4s'
                                    }}
                                >
                                    <s.icon size={isMobile ? 14 : 16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Block - 2 Column Grid for Mobile */}
                    <div style={{ 
                        display: isMobile ? 'grid' : 'block', 
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'none', 
                        width: '100%',
                        borderTop: isMobile ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        paddingTop: isMobile ? '32px' : '0',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <div>
                            <div style={{
                                fontSize: isMobile ? '9px' : '10px', color: '#fff', fontWeight: 900,
                                letterSpacing: '0.3em', marginBottom: isMobile ? '24px' : '32px', textTransform: 'uppercase'
                            }}>
                                COMPANY
                            </div>
                            {['About Us', 'Contact Us', 'Terms and Conditions', 'Refund Policy'].map(l => (
                                <motion.div key={l} style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                                    <Link href={l === 'About Us' ? '/about' : l === 'Contact Us' ? '/contact' : l === 'Terms and Conditions' ? '/terms' : l === 'Refund Policy' ? '/refund' : '#'} style={{
                                        color: '#999', textDecoration: 'none', fontSize: isMobile ? '11px' : '13px',
                                        fontFamily: 'var(--font-baskerville)'
                                    }}>
                                        <motion.span whileHover={{ x: 10, color: '#fff' }} style={{ display: 'inline-block' }}>
                                            {l}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {isMobile && (
                            <div>
                                <div style={{
                                    fontSize: '9px', color: '#fff', fontWeight: 900,
                                    letterSpacing: '0.3em', marginBottom: '24px', textTransform: 'uppercase'
                                }}>
                                    MY ACCOUNT
                                </div>
                                {['Login / Signup', 'My Profile', 'Orders', 'Address Book'].map(l => (
                                    <motion.div key={l} style={{ marginBottom: '12px' }}>
                                        <Link href={l === 'Login / Signup' ? '/auth' : l === 'My Profile' ? '/profile' : l === 'Orders' ? '/orders' : '#'} style={{
                                            color: '#999', textDecoration: 'none', fontSize: '11px',
                                            fontFamily: 'var(--font-baskerville)'
                                        }}>
                                            <motion.span whileHover={{ x: 10, color: '#fff' }} style={{ display: 'inline-block' }}>
                                                {l}
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}

                            </div>
                        )}
                    </div>

                    {/* My Account Column (Desktop Only, Mobile is now part of the 2-col above) */}
                    {!isMobile && (
                        <div>
                            <div style={{
                                fontSize: '10px', color: '#fff', fontWeight: 900,
                                letterSpacing: '0.3em', marginBottom: '32px', textTransform: 'uppercase'
                            }}>
                                MY ACCOUNT
                            </div>
                            {['Login / Signup', 'My Profile', 'Orders', 'Address Book', 'Track Order'].map(l => (
                                <motion.div key={l} style={{ marginBottom: '16px' }}>
                                    <Link href={l === 'Login / Signup' ? '/auth' : l === 'My Profile' ? '/profile' : l === 'Orders' ? '/orders' : '#'} style={{
                                        color: '#999', textDecoration: 'none', fontSize: '13px',
                                        fontFamily: 'var(--font-baskerville)'
                                    }}>
                                        <motion.span whileHover={{ x: 10, color: '#fff' }} style={{ display: 'inline-block' }}>
                                            {l}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}

                        </div>
                    )}

                    {/* Subscription Anchor - Hidden on mobile to save height */}
                    {!isMobile && (
                        <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
                            <div style={{
                                fontSize: isMobile ? '8px' : '10px', color: '#d4af37', fontWeight: 900,
                                letterSpacing: '0.4em', marginBottom: isMobile ? '24px' : '32px', textTransform: 'uppercase'
                            }}>
                                ESTABLISHED IN 2024
                            </div>
                            <p style={{
                                fontSize: isMobile ? '16px' : '20px', fontFamily: 'var(--font-baskerville)',
                                fontStyle: 'italic', color: '#fff', lineHeight: 1.4,
                                marginBottom: '32px'
                            }}>
                                "Luxury is not a status, <br /> it is a sensory journey."
                            </p>
                            <div style={{ color: '#444', fontSize: '9px', letterSpacing: '0.1em' }}>
                                ODISHA — BRAHMAPUR — ANDHRA PRADESH
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div style={{
                    marginTop: isMobile ? '32px' : '60px', paddingTop: isMobile ? '24px' : '40px', paddingBottom: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: isMobile ? '24px' : '0',
                    fontSize: '9px', color: '#444', letterSpacing: '0.2em',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '16px' : '32px' }}>
                        {isMobile ? (
                            <div style={{
                                fontSize: '10px', lineHeight: 1.6, color: '#666',
                                textAlign: 'center', maxWidth: '280px',
                                fontFamily: 'var(--font-baskerville)', letterSpacing: '0.05em'
                            }}>
                                Trimurty Enterprises, Marthapeta Street,<br />
                                Near Sano Bazar, Berhampur,<br />
                                Odisha, India - 760002
                            </div>
                        ) : (
                            <>
                                <div>© 2026 REVEIL. ALL RIGHTS RESERVED.</div>
                                <div style={{ display: 'flex', gap: '32px' }}>
                                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS OF SERVICE</a>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Payment Logos */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', opacity: 0.4, flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'center' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '10px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '15px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" style={{ height: '12px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '14px', filter: 'brightness(0) invert(1)' }} />
                    </div>
                </div>
            </div>
        </footer>
    )
}
