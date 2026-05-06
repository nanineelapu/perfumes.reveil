'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, MapPin, Package, LogOut, ChevronRight, Edit2 } from 'lucide-react'
import { PremiumLoader } from '@/components/store/PremiumLoader'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const checkRes = () => {
            setIsMobile(window.innerWidth < 768)
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
        }
        checkRes()
        window.addEventListener('resize', checkRes)
        return () => window.removeEventListener('resize', checkRes)
    }, [])

    useEffect(() => {
        async function getProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/auth')
                    return
                }
                setUser(user)

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) setProfile(data)
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        getProfile()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    if (loading) {
        return <PremiumLoader iconName="user" text="Loading Profile" />
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    const cardStyle: React.CSSProperties = {
        background: 'rgba(15, 15, 15, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #1a140a 0%, #050505 50%)',
            color: '#fff',
            padding: isMobile ? '100px 16px 60px' : '140px 24px 80px',
            fontFamily: 'var(--font-geist-sans)',
            overflowX: 'hidden'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header Section */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'flex-start' : 'flex-end',
                        gap: isMobile ? '24px' : '0',
                        marginBottom: isMobile ? '32px' : '48px'
                    }}>
                        <div style={{ width: '100%' }}>
                            <motion.h1 variants={itemVariants} style={{
                                fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
                                fontWeight: 300,
                                letterSpacing: '-0.02em',
                                marginBottom: '8px',
                                fontFamily: 'var(--font-baskerville)',
                                wordBreak: 'break-word',
                                lineHeight: 1.2
                            }}>
                                Hi, <span style={{ color: '#d4af37' }}>{profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Collector'}</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} style={{ color: '#666', fontSize: isMobile ? '13px' : '15px', lineHeight: 1.5 }}>
                                Manage your personal details and order history.
                            </motion.p>
                        </div>
                        <motion.button
                            variants={itemVariants}
                            onClick={handleLogout}
                            whileHover={{ scale: 1.05, color: '#ff4b4b' }}
                            style={{
                                background: 'rgba(255,75,75,0.05)',
                                border: '1px solid rgba(255,75,75,0.1)',
                                color: '#ff4b4b',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                transition: 'all 0.3s'
                            }}
                        >
                            <LogOut size={16} /> Logout
                        </motion.button>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: (isMobile || isTablet) ? '1fr' : '1.2fr 0.8fr', 
                        gap: isMobile ? '24px' : '32px' 
                    }}>
                        {/* Left Column: Profile Info */}
                        <motion.div variants={itemVariants} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#d4af37' }}>Account Details</h3>
                                <motion.button whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                    <Edit2 size={18} />
                                </motion.button>
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                                gap: isMobile ? '24px' : '40px' 
                            }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#444', letterSpacing: '0.1em', marginBottom: '8px' }}>First Name</label>
                                    <p style={{ fontSize: '16px', fontWeight: 400 }}>{profile?.first_name || '—'}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#444', letterSpacing: '0.1em', marginBottom: '8px' }}>Last Name</label>
                                    <p style={{ fontSize: '16px', fontWeight: 400 }}>{profile?.last_name || '—'}</p>
                                </div>
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#444', letterSpacing: '0.1em', marginBottom: '8px' }}>Email Address</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Mail size={16} color="#d4af37" />
                                        <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 400, wordBreak: 'break-all' }}>{user?.email}</p>
                                    </div>
                                </div>
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#444', letterSpacing: '0.1em', marginBottom: '8px' }}>Phone Number</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Phone size={16} color="#d4af37" />
                                        <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 400 }}>{profile?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Quick Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <motion.div variants={itemVariants} style={{ ...cardStyle, padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '12px' }}>
                                        <Package size={24} color="#d4af37" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 500 }}>Recent Orders</h4>
                                        <p style={{ fontSize: '12px', color: '#666' }}>View your order history</p>
                                    </div>
                                    <ChevronRight size={20} color="#333" style={{ marginLeft: 'auto' }} />
                                </div>
                                <motion.button 
                                    onClick={() => router.push('/orders')}
                                    whileHover={{ background: 'rgba(212,175,55,0.1)' }}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'transparent',
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        color: '#d4af37',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    View All Orders
                                </motion.button>
                            </motion.div>

                            <motion.div variants={itemVariants} style={{ ...cardStyle, padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '12px' }}>
                                        <MapPin size={24} color="#d4af37" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 500 }}>Address Book</h4>
                                        <p style={{ fontSize: '12px', color: '#666' }}>Save your delivery addresses</p>
                                    </div>
                                    <ChevronRight size={20} color="#333" style={{ marginLeft: 'auto' }} />
                                </div>
                                <motion.button 
                                    onClick={() => router.push('/address-book')}
                                    whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Manage Addresses
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
