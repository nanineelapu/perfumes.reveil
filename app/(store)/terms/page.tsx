"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedNavbar } from '@/components/store/AnimatedNavbar'
import { StayConnected } from '@/components/store/StayConnected'
import { Footer } from '@/components/store/Footer'

export default function TermsPage() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <main style={{ background: '#ffffff', color: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
            <div className="sr-only">
                <h1>REVEIL Terms and Conditions - Luxury Perfume Store Policies</h1>
                <h2>Legal Terms for Buying Designer Fragrances and Attars Online India</h2>
                <p>Read the official terms and conditions for REVEIL. Information regarding user rights, intellectual property, and purchase agreements for our signature laboratory fragrances.</p>
            </div>

            <AnimatedNavbar />

            {/* Header section */}
            <section style={{
                padding: isMobile ? '140px 24px 60px' : '180px 40px 60px',
                textAlign: 'center',
                background: '#fafafa',
                borderBottom: '1px solid #eee'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 style={{
                        fontSize: isMobile ? '36px' : 'clamp(32px, 5vw, 64px)',
                        fontFamily: 'var(--font-baskerville)',
                        fontWeight: 900,
                        color: '#050505',
                        marginBottom: '10px'
                    }}>
                        Terms <span style={{ color: '#d4af37' }}>&</span> Conditions
                    </h1>
                    <p style={{
                        fontSize: isMobile ? '9px' : '11px',
                        letterSpacing: isMobile ? '0.2em' : '0.4em',
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500
                    }}>
                        Last Updated — April 2026
                    </p>
                </motion.div>
            </section>

            {/* Content Section */}
            <section style={{
                padding: isMobile ? '60px 24px' : '100px 40px',
                maxWidth: '900px',
                margin: '0 auto',
                flex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ lineHeight: 1.8, fontSize: isMobile ? '15px' : '16px', color: '#444' }}
                >
                    <p style={{ marginBottom: '40px', fontSize: isMobile ? '17px' : '18px', fontWeight: 500, color: '#050505' }}>
                        These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and REVEIL (“we”, “us”, or “our”), concerning your access to and use of this website.
                    </p>

                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', color: '#050505', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
                        <p>
                            By accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Use. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately.
                        </p>
                    </div>

                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', color: '#050505', marginBottom: '16px' }}>2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
                        </p>
                    </div>

                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', color: '#050505', marginBottom: '16px' }}>3. User Representations</h2>
                        <p>
                            By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete; you will maintain the accuracy of such information and promptly update such registration information as necessary.
                        </p>
                    </div>

                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-baskerville)', color: '#050505', marginBottom: '16px' }}>4. Prohibited Activities</h2>
                        <p>
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>
                    </div>
                </motion.div>
            </section>

            <StayConnected theme="light" />
        </main>
    )
}
