'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ReviewModal } from './ReviewModal'

interface ReviewInvitationProps {
    product: {
        id: string
        name: string
    }
}

export function ReviewInvitation({ product }: ReviewInvitationProps) {
    const [user, setUser] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialRating, setInitialRating] = useState(0)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }
        getUser()
    }, [])

    if (!user) return null

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, #ffffff 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '28px',
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
        }}>
            <div style={{
                width: '40px', height: '1px', background: '#d4af37'
            }} />

            <div>
                <h3 style={{
                    fontSize: '22px',
                    fontFamily: 'var(--font-baskerville)',
                    color: '#1a1a1a',
                    marginBottom: '12px',
                    fontWeight: 400
                }}>
                    How does {product.name} resonate with you?
                </h3>
                <p style={{
                    fontSize: '13px',
                    color: '#666',
                    letterSpacing: '0.05em',
                    maxWidth: '420px',
                    lineHeight: 1.6
                }}>
                    Share your sensory journey. Your narrative helps others discover their signature presence.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                        key={s}
                        whileHover={{ scale: 1.2, color: '#d4af37' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setInitialRating(s)
                            setIsModalOpen(true)
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(0,0,0,0.18)',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <Star size={26} fill="currentColor" strokeWidth={1} />
                    </motion.button>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#1a1a1a', color: '#d4af37' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                style={{
                    background: '#d4af37',
                    border: 'none',
                    color: '#1a1a1a',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 18px rgba(212,175,55,0.3)',
                    transition: 'all 0.3s'
                }}
            >
                Add Detail Review <ArrowRight size={14} />
            </motion.button>

            <ReviewModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                // initialRating={initialRating} // I should update ReviewModal to accept this
            />
        </div>
    )
}
