'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef } from 'react'

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

    return (
        <footer ref={footerRef} style={{
            background: '#050505',
            padding: '100px 0 0px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.03)'
        }}>
            {/* Ghost Background Branding */}
            <div style={{
                position: 'absolute', top: '60px', left: '50%',
                transform: 'translateX(-50%)', fontSize: '15vw',
                fontFamily: 'var(--font-baskerville)', color: 'rgba(255,255,255,0.02)',
                userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
                fontWeight: 900
            }}>
                REVEIL ESTATE
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1fr', gap: '40px' }}>

                    {/* Brand Meta Column */}
                    <div>
                        <div style={{ marginBottom: '32px' }}>
                            <img src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/PNG%20LOGO%20REVIL.webp" alt="Reveil" style={{ height: '100px', width: 'auto' }} />
                        </div>
                        <p style={{
                            fontSize: '14px', lineHeight: 1.9, color: '#888',
                            marginBottom: '20px', maxWidth: '300px',
                            fontFamily: 'var(--font-baskerville)', fontWeight: 300
                        }}>
                            Curating the world's most evocative olfactory narratives.
                        </p>
                        <p style={{
                            fontSize: '12px', lineHeight: 1.6, color: '#666',
                            marginBottom: '32px', maxWidth: '300px',
                            fontFamily: 'var(--font-baskerville)'
                        }}>
                            Trimurty Enterprises, Marthapeta Street,<br />
                            Near Sano Bazar, Berhampur,<br />
                            Odisha, India - 760002
                        </p>
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
                                        width: '40px', height: '40px',
                                        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#666', transition: 'all 0.4s'
                                    }}
                                >
                                    <s.icon size={16} strokeWidth={1.5} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <div style={{
                            fontSize: '10px', color: '#fff', fontWeight: 900,
                            letterSpacing: '0.3em', marginBottom: '32px', textTransform: 'uppercase'
                        }}>
                            COMPANY
                        </div>
                        {['About Us', 'Contact Us', 'Terms and Conditions', 'Refund Policy', 'Shipping Policy'].map(l => (
                            <motion.div key={l} style={{ marginBottom: '16px' }}>
                                <Link href={l === 'About Us' ? '/about' : l === 'Contact Us' ? '/contact' : l === 'Terms and Conditions' ? '/terms' : l === 'Refund Policy' ? '/refund' : l === 'Shipping Policy' ? '/shipping' : '#'} style={{
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

                    {/* My Account Column */}
                    <div>
                        <div style={{
                            fontSize: '10px', color: '#fff', fontWeight: 900,
                            letterSpacing: '0.3em', marginBottom: '32px', textTransform: 'uppercase'
                        }}>
                            MY ACCOUNT
                        </div>
                        {['Login / Signup', 'My Profile', 'Orders', 'Address Book', 'Track Order'].map(l => (
                            <motion.div key={l} style={{ marginBottom: '16px' }}>
                                <a href="#" style={{
                                    color: '#999', textDecoration: 'none', fontSize: '13px',
                                    fontFamily: 'var(--font-baskerville)'
                                }}>
                                    <motion.span whileHover={{ x: 10, color: '#fff' }} style={{ display: 'inline-block' }}>
                                        {l}
                                    </motion.span>
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Subscription Anchor */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '10px', color: '#d4af37', fontWeight: 900,
                            letterSpacing: '0.4em', marginBottom: '32px', textTransform: 'uppercase'
                        }}>
                            ESTABLISHED IN 2024
                        </div>
                        <p style={{
                            fontSize: '20px', fontFamily: 'var(--font-baskerville)',
                            fontStyle: 'italic', color: '#fff', lineHeight: 1.4,
                            marginBottom: '32px'
                        }}>
                            "Luxury is not a status, <br /> it is a sensory journey."
                        </p>
                        <div style={{ color: '#444', fontSize: '10px', letterSpacing: '0.1em' }}>
                            LONDON — PARIS — MUMBAI
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    marginTop: '60px', paddingTop: '40px', paddingBottom: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.03)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '9px', color: '#444', letterSpacing: '0.2em'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div>© 2026 REVEIL. ALL RIGHTS RESERVED.</div>
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>TERMS OF SERVICE</a>
                        </div>
                    </div>

                    {/* Payment Logos */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', opacity: 0.4 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '12px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '18px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" style={{ height: '14px', filter: 'brightness(0) invert(1)' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '16px', filter: 'brightness(0) invert(1)' }} />
                    </div>
                </div>
            </div>
        </footer>
    )
}
