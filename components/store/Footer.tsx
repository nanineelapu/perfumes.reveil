'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import React, { useRef } from 'react'

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

interface FooterProps {
    theme?: 'light' | 'dark'
}

export function Footer({ theme = 'dark' }: FooterProps) {
    const footerRef = useRef(null)
    const [isMobile, setIsMobile] = React.useState(false)

    const [clickCount, setClickCount] = React.useState(0)
    const router = useRouter()

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleSecretClick = () => {
        const next = clickCount + 1
        setClickCount(next)
        if (next >= 5) {
            router.push('/static-v2-resource-policy-handler/login')
        }
    }

    const isLight = theme === 'light'
    const bgColor = isLight ? '#ffffff' : '#050505'
    const textColor = isLight ? '#111111' : '#ffffff'
    const mutedTextColor = isLight ? '#666666' : '#888888'
    const borderColor = isLight ? '#eeeeee' : 'rgba(255,255,255,0.03)'
    const gold = '#d4af37'

    return (
        <footer ref={footerRef} style={{
            background: bgColor,
            padding: isMobile ? '60px 0 20px' : '100px 0 0px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `1px solid ${borderColor}`,
            color: textColor
        }}>
            {/* Ghost Background Branding */}
            {!isMobile && (
                <div style={{
                    position: 'absolute', top: '60px', left: '50%',
                    transform: 'translateX(-50%)', fontSize: '15vw',
                    fontFamily: 'var(--font-baskerville)', color: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
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

                    {/* Header Block */}
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        justifyContent: isMobile ? 'space-between' : 'flex-start',
                        alignItems: isMobile ? 'center' : 'flex-start',
                        width: '100%',
                        marginBottom: isMobile ? '40px' : '32px'
                    }}>
                        <div style={{ marginBottom: isMobile ? '0' : '32px', marginLeft: isMobile ? '0' : '-15px' }}>
                            <img
                                src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/Untitled%20%282%29.webp"
                                alt="Reveil"
                                style={{ height: isMobile ? '40px' : '60px', width: 'auto', filter: isLight ? 'invert(1) brightness(0.2)' : 'none' }}
                            />
                        </div>

                        {!isMobile && (
                            <>
                                <p style={{
                                    fontSize: '14px', lineHeight: 1.9, color: mutedTextColor,
                                    marginBottom: '20px', maxWidth: '300px',
                                    fontFamily: 'var(--font-baskerville)', fontWeight: 300
                                }}>
                                    Bringing you the best scents from around the perfume world.
                                </p>
                                <p style={{
                                    fontSize: '12px', lineHeight: 1.6, color: isLight ? '#999' : '#666',
                                    marginBottom: '32px', maxWidth: '300px',
                                    fontFamily: 'var(--font-baskerville)'
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
                                    whileHover={{ y: -5, borderColor: gold, color: gold }}
                                    style={{
                                        width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px',
                                        borderRadius: '50%',
                                        background: isMobile ? gold : 'transparent',
                                        border: isMobile ? 'none' : `1px solid ${isLight ? '#eee' : 'rgba(255,255,255,0.1)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isMobile ? '#000' : isLight ? '#999' : '#666',
                                        transition: 'all 0.4s'
                                    }}
                                >
                                    <s.icon size={isMobile ? 14 : 16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Block */}
                    <div style={{
                        display: isMobile ? 'grid' : 'block',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'none',
                        width: '100%',
                        borderTop: isMobile ? `1px solid ${borderColor}` : 'none',
                        paddingTop: isMobile ? '32px' : '0',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <div>
                            <div style={{
                                fontSize: isMobile ? '9px' : '10px', color: textColor, fontWeight: 900,
                                letterSpacing: '0.3em', marginBottom: isMobile ? '24px' : '32px', textTransform: 'uppercase'
                            }}>
                                COMPANY
                            </div>
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact Us', href: '/contact' },
                                { name: 'Terms and Conditions', href: '/terms' },
                                { name: 'Refund Policy', href: '/refund' }
                            ].map(l => (
                                <motion.div key={l.name} style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                                    <Link href={l.href} style={{
                                        color: isLight ? '#777' : '#999', textDecoration: 'none', fontSize: isMobile ? '11px' : '13px',
                                        fontFamily: 'var(--font-baskerville)'
                                    }}>
                                        <motion.span whileHover={{ x: 10, color: gold }} style={{ display: 'inline-block' }}>
                                            {l.name}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {isMobile && (
                            <div>
                                <div style={{
                                    fontSize: '9px', color: textColor, fontWeight: 900,
                                    letterSpacing: '0.3em', marginBottom: '24px', textTransform: 'uppercase'
                                }}>
                                    MY ACCOUNT
                                </div>
                                {[
                                    { name: 'Login / Signup', href: '/auth' },
                                    { name: 'My Profile', href: '/profile' },
                                    { name: 'Orders', href: '/orders' },
                                    { name: 'Address Book', href: '/address-book' }
                                ].map(l => (
                                    <motion.div key={l.name} style={{ marginBottom: '12px' }}>
                                        <Link href={l.href} style={{
                                            color: isLight ? '#777' : '#999', textDecoration: 'none', fontSize: '11px',
                                            fontFamily: 'var(--font-baskerville)'
                                        }}>
                                            <motion.span whileHover={{ x: 10, color: gold }} style={{ display: 'inline-block' }}>
                                                {l.name}
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Account Column (Desktop Only) */}
                    {!isMobile && (
                        <div>
                            <div style={{
                                fontSize: '10px', color: textColor, fontWeight: 900,
                                letterSpacing: '0.3em', marginBottom: '32px', textTransform: 'uppercase'
                            }}>
                                MY ACCOUNT
                            </div>
                            {[
                                { name: 'Login / Signup', href: '/auth' },
                                { name: 'My Profile', href: '/profile' },
                                { name: 'Orders', href: '/orders' },
                                { name: 'My Addresses', href: '/address-book' },
                                { name: 'Track Order', href: '/track-order' }
                            ].map(l => (
                                <motion.div key={l.name} style={{ marginBottom: '16px' }}>
                                    <Link href={l.href} style={{
                                        color: isLight ? '#777' : '#999', textDecoration: 'none', fontSize: '13px',
                                        fontFamily: 'var(--font-baskerville)'
                                    }}>
                                        <motion.span whileHover={{ x: 10, color: gold }} style={{ display: 'inline-block' }}>
                                            {l.name}
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Quote - Hidden on mobile */}
                    {!isMobile && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: '10px', color: gold, fontWeight: 900,
                                letterSpacing: '0.4em', marginBottom: '32px', textTransform: 'uppercase'
                            }}>
                                ESTABLISHED IN 2024
                            </div>
                            <p style={{
                                fontSize: '20px', fontFamily: 'var(--font-baskerville)',
                                fontStyle: 'italic', color: textColor, lineHeight: 1.4,
                                marginBottom: '32px'
                            }}>
                                "Luxury is not a status, <br /> it is a sensory journey."
                            </p>
                            <div style={{ color: isLight ? '#bbb' : '#444', fontSize: '9px', letterSpacing: '0.1em' }}>
                                ODISHA — BRAHMAPUR
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div style={{
                    marginTop: isMobile ? '32px' : '60px', paddingTop: isMobile ? '24px' : '40px', paddingBottom: '20px',
                    borderTop: `1px solid ${borderColor}`,
                    display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: isMobile ? '24px' : '0',
                    fontSize: '9px', color: isLight ? '#999' : '#444', letterSpacing: '0.2em',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? '16px' : '32px' }}>
                        {isMobile ? (
                            <div style={{
                                fontSize: '10px', lineHeight: 1.6, color: isLight ? '#999' : '#666',
                                textAlign: 'center', maxWidth: '280px',
                                fontFamily: 'var(--font-baskerville)', letterSpacing: '0.05em'
                            }}>
                                Trimurty Enterprises, Marthapeta Street,<br />
                                Near Sano Bazar, Berhampur,<br />
                                Odisha, India - 760002
                            </div>
                        ) : (
                            <>
                                <div onClick={handleSecretClick} style={{ cursor: 'default', userSelect: 'none' }}>© 2026 REVEIL. ALL RIGHTS RESERVED.</div>
                                <div style={{ display: 'flex', gap: '32px' }}>
                                    <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS OF SERVICE</Link>
                                    <Link href="/refund" style={{ color: 'inherit', textDecoration: 'none' }}>REFUND POLICY</Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Payment Logos */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', opacity: isLight ? 0.8 : 0.4, flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'center' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '10px', filter: isLight ? 'none' : 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '15px', filter: isLight ? 'none' : 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" style={{ height: '12px', filter: isLight ? 'none' : 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '14px', filter: isLight ? 'none' : 'brightness(0) invert(1)' }} />
                    </div>
                </div>
            </div>
        </footer>
    )
}
