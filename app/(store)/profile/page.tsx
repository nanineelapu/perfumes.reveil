'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, MapPin, Package, LogOut, ChevronRight, Edit2, Check, X, Loader2 } from 'lucide-react'
import { PremiumLoader } from '@/components/store/PremiumLoader'
import { realEmail } from '@/lib/validators'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [savingName, setSavingName] = useState(false)
    const [nameError, setNameError] = useState<string | null>(null)
    const [firstNameInput, setFirstNameInput] = useState('')
    const [lastNameInput, setLastNameInput] = useState('')
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

    const startEditingName = () => {
        setFirstNameInput(profile?.first_name || '')
        setLastNameInput(profile?.last_name || '')
        setNameError(null)
        setIsEditing(true)
    }

    const cancelEditingName = () => {
        setIsEditing(false)
        setNameError(null)
    }

    const saveName = async () => {
        if (!user) return
        const first = firstNameInput.trim()
        const last = lastNameInput.trim()
        if (!first) {
            setNameError('First name cannot be empty.')
            return
        }
        setSavingName(true)
        setNameError(null)
        const { data, error } = await supabase
            .from('profiles')
            .update({ first_name: first, last_name: last })
            .eq('id', user.id)
            .select()
            .single()
        setSavingName(false)
        if (error) {
            setNameError(error.message || 'Failed to update name.')
            return
        }
        if (data) setProfile(data)
        setIsEditing(false)
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
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, #f3eee2 0%, #f8f7f2 50%)',
            color: '#1a1a1a',
            padding: isMobile ? '100px 16px 60px' : '140px 24px 80px',
            fontFamily: 'var(--font-geist-sans)',
            overflowX: 'hidden'
        }}>
            {/* HIDDEN SEO HEADINGS - GOD LEVEL SEO */}
            <div className="sr-only">
                <h1>REVEIL User Profile - Luxury Fragrance Collector Portal</h1>
                <h2>Manage Your Signature Perfume Collection and Designer Scents India</h2>
                <p>Welcome to your personal REVEIL archive. Manage your laboratory fragrance orders, review your favorite scents, and update your collector preferences.</p>
            </div>

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
                                Hi, <span style={{ color: '#d4af37' }}>{profile?.first_name || user?.user_metadata?.first_name || realEmail(user?.email)?.split('@')[0] || 'Collector'}</span>
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
                                border: '1px solid rgba(255,75,75,0.25)',
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
                                {!isEditing ? (
                                    <motion.button
                                        type="button"
                                        onClick={startEditingName}
                                        whileHover={{ scale: 1.1 }}
                                        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                                        aria-label="Edit name"
                                    >
                                        <Edit2 size={18} />
                                    </motion.button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <motion.button
                                            type="button"
                                            onClick={saveName}
                                            disabled={savingName}
                                            whileHover={{ scale: 1.1 }}
                                            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', cursor: savingName ? 'not-allowed' : 'pointer', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                                            aria-label="Save"
                                        >
                                            {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                            Save
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={cancelEditingName}
                                            disabled={savingName}
                                            whileHover={{ scale: 1.1 }}
                                            style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', color: '#888', cursor: savingName ? 'not-allowed' : 'pointer', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                                            aria-label="Cancel"
                                        >
                                            <X size={14} />
                                            Cancel
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                            {nameError && (
                                <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '-16px', marginBottom: '16px' }}>{nameError}</p>
                            )}

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                                gap: isMobile ? '24px' : '40px' 
                            }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={firstNameInput}
                                            onChange={(e) => setFirstNameInput(e.target.value)}
                                            disabled={savingName}
                                            style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a', fontSize: '16px', padding: '10px 12px', borderRadius: '6px', outline: 'none' }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', fontWeight: 400 }}>{profile?.first_name || '—'}</p>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={lastNameInput}
                                            onChange={(e) => setLastNameInput(e.target.value)}
                                            disabled={savingName}
                                            style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a', fontSize: '16px', padding: '10px 12px', borderRadius: '6px', outline: 'none' }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', fontWeight: 400 }}>{profile?.last_name || '—'}</p>
                                    )}
                                </div>
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>Email Address</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Mail size={16} color="#d4af37" />
                                        <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 400, wordBreak: 'break-all' }}>{profile?.email || realEmail(user?.email) || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>Phone Number</label>
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
                                    <ChevronRight size={20} color="#555" style={{ marginLeft: 'auto' }} />
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
                                    <ChevronRight size={20} color="#555" style={{ marginLeft: 'auto' }} />
                                </div>
                                <motion.button
                                    onClick={() => router.push('/address-book')}
                                    whileHover={{ background: 'rgba(0,0,0,0.04)' }}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'transparent',
                                        border: '1px solid rgba(0,0,0,0.12)',
                                        color: '#1a1a1a',
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
