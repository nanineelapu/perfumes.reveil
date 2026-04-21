'use client'
import { motion } from 'framer-motion'

interface StayConnectedProps {
    theme?: 'light' | 'dark'
}

export function StayConnected({ theme = 'light' }: StayConnectedProps) {
    const isLight = theme === 'light'
    const bgColor = isLight ? '#fafafa' : '#0a0a0a'
    const textColor = isLight ? '#050505' : '#ffffff'
    const subColor = '#d4af37' // Use Gold theme color instead of green
    const borderColor = isLight ? '#eee' : 'rgba(255,255,255,0.05)'

    return (
        <section style={{ 
            padding: '80px 40px', 
            background: bgColor, 
            textAlign: 'center',
            borderTop: `1px solid ${borderColor}`
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 900, 
                    letterSpacing: '0.2em', 
                    color: textColor,
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-baskerville)'
                }}>
                    Stay Connected
                </h3>
                <p style={{ 
                    fontSize: '14px', 
                    color: subColor, 
                    marginBottom: '40px',
                    fontFamily: 'var(--font-baskerville)',
                    fontStyle: 'italic'
                }}>
                    Join Our News Letter to receive latest Fashion news.
                </p>

                <div style={{ 
                    display: 'flex', 
                    background: isLight ? '#fff' : '#000', 
                    border: `1px solid ${borderColor}`,
                    padding: '8px',
                    boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.03)' : 'none'
                }}>
                    <input 
                        type="email" 
                        placeholder="example@gmail.com"
                        style={{ 
                            flex: 1, 
                            background: 'transparent', 
                            border: 'none', 
                            outline: 'none', 
                            padding: '12px 20px',
                            color: textColor,
                            fontSize: '14px'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: textColor, color: isLight ? '#fff' : '#000' }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                            background: subColor, 
                            color: '#000', 
                            border: 'none', 
                            padding: '0 30px',
                            fontWeight: 900,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        Subscribe
                    </motion.button>
                </div>
            </motion.div>
        </section>
    )
}
