'use client'
import { motion } from 'framer-motion'
import { Sparkles, User, Package, Heart, ShoppingBag, FlaskConical, Loader2 } from 'lucide-react'

const ICON_MAP = {
    sparkles: Sparkles,
    user: User,
    package: Package,
    heart: Heart,
    shopping: ShoppingBag,
    fragrance: FlaskConical,
    loader: Loader2
}

interface PremiumLoaderProps {
    iconName: keyof typeof ICON_MAP
    text?: string
}

export function PremiumLoader({ iconName, text }: PremiumLoaderProps) {
    const Icon = ICON_MAP[iconName] || Loader2

    return (
        <div style={{
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f8f7f2',
            color: '#d4af37',
            gap: '24px'
        }}>
            <div style={{ position: 'relative' }}>
                {/* Outer Glow Ring */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: -20,
                        border: '1px solid #d4af37',
                        borderRadius: '50%',
                        filter: 'blur(10px)'
                    }}
                />

                {/* Rotating Icon Container */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <Icon size={48} strokeWidth={1} />
                </motion.div>
            </div>

            {text && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{ 
                        fontSize: '10px', 
                        color: '#d4af37', 
                        letterSpacing: '0.4em', 
                        textTransform: 'uppercase',
                        fontWeight: 300
                    }}
                >
                    {text}
                </motion.span>
            )}
        </div>
    )
}
