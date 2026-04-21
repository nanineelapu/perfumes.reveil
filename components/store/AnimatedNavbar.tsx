'use client'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'

export function AnimatedNavbar() {
    const pathname = usePathname()
    const isDarkPage = pathname === '/orders'
    const textColor = '#d4af37'
    const [isAccountHovered, setIsAccountHovered] = useState(false)

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
            }
        }
    }

    const dropdownVariants: Variants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: 10,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    }

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{
                background: 'transparent',
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '12px 24px 0'
            }}
        >
            <div style={{
                maxWidth: '1400px', margin: '0 auto',
                display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <motion.div variants={itemVariants}>
                    <Link href="/" style={{
                        display: 'flex', alignItems: 'center', height: '100%'
                    }}>
                        <img
                            src="https://lhnamtkpjkrawgql.public.blob.vercel-storage.com/PNG%20LOGO%20REVIL.webp"
                            alt="Reveil Logo"
                            style={{
                                height: '120px',
                                width: 'auto',
                                filter: isDarkPage ? 'brightness(1.2)' : 'none',
                                transition: 'filter 0.3s'
                            }}
                        />
                    </Link>
                </motion.div>

                <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <motion.div variants={itemVariants}>
                            <Link href="/products" style={{ textDecoration: 'none' }}>
                                <motion.span
                                    whileHover="hover"
                                    style={{
                                        color: textColor, display: 'block', fontSize: '13px',
                                        letterSpacing: '0.15em', fontWeight: 500,
                                        fontFamily: 'var(--font-baskerville)',
                                        position: 'relative',
                                        padding: '4px 0'
                                    }}
                                >
                                    Shop
                                    <motion.div
                                        variants={{
                                            hover: { scaleX: 1, opacity: 1 }
                                        }}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '1px', background: textColor, originX: 0.5
                                        }}
                                    />
                                </motion.span>
                            </Link>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Link href="/orders" style={{ textDecoration: 'none' }}>
                                <motion.span
                                    whileHover="hover"
                                    style={{
                                        color: textColor, display: 'block', fontSize: '13px',
                                        letterSpacing: '0.15em', fontWeight: 500,
                                        fontFamily: 'var(--font-baskerville)',
                                        position: 'relative',
                                        padding: '4px 0'
                                    }}
                                >
                                    Orders
                                    <motion.div
                                        variants={{
                                            hover: { scaleX: 1, opacity: 1 }
                                        }}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '1px', background: textColor, originX: 0.5
                                        }}
                                    />
                                </motion.span>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            onMouseEnter={() => setIsAccountHovered(true)}
                            onMouseLeave={() => setIsAccountHovered(false)}
                            style={{ position: 'relative', padding: '10px 0' }}
                        >
                            <motion.span
                                whileHover="hover"
                                style={{
                                    color: textColor, cursor: 'pointer', fontSize: '13px',
                                    letterSpacing: '0.15em', fontWeight: 500,
                                    fontFamily: 'var(--font-baskerville)',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    position: 'relative',
                                    padding: '4px 0'
                                }}>
                                Account
                                <motion.div
                                    variants={{
                                        hover: { scaleX: 1, opacity: 1 }
                                    }}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        height: '1px', background: textColor, originX: 0.5
                                    }}
                                />
                            </motion.span>

                            <AnimatePresence>
                                {isAccountHovered && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: '0',
                                            background: '#0a0a0a',
                                            border: '1px solid rgba(212,175,55,0.2)',
                                            padding: '16px 0',
                                            minWidth: '160px',
                                            borderRadius: '2px',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                            marginTop: '4px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Link href="/auth" style={{
                                                padding: '12px 24px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                fontSize: '11px',
                                                letterSpacing: '0.2em',
                                                fontFamily: 'var(--font-baskerville)',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.3s'
                                            }}
                                                onMouseOver={(e) => e.currentTarget.style.color = textColor}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                                            >
                                                Log In
                                            </Link>
                                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 24px' }} />
                                            <Link href="/auth" style={{
                                                padding: '12px 24px',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                fontSize: '11px',
                                                letterSpacing: '0.2em',
                                                fontFamily: 'var(--font-baskerville)',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.3s'
                                            }}
                                                onMouseOver={(e) => e.currentTarget.style.color = textColor}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                        <Link href="/cart" style={{ color: textColor, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.15, color: '#fff' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <ShoppingBag size={20} strokeWidth={1} />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}
