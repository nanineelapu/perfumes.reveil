import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface StayConnectedProps {
    theme?: 'light' | 'dark'
}

export function StayConnected({ theme = 'light' }: StayConnectedProps) {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isLight = theme === 'light'
    const bgColor = isLight ? '#fafafa' : '#0a0a0a'
    const textColor = isLight ? '#050505' : '#ffffff'
    const subColor = '#d4af37' // Use Gold theme color instead of green
    const borderColor = isLight ? '#eee' : 'rgba(255,255,255,0.05)'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsSubmitting(true)

        // Mocking API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            setEmail('')
        }, 1000)
    }

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

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.form 
                            key="form"
                            onSubmit={handleSubmit}
                            style={{ 
                                display: 'flex', 
                                background: isLight ? '#fff' : '#000', 
                                border: `1px solid ${borderColor}`,
                                padding: '8px',
                                boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.03)' : 'none'
                            }}
                        >
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                type="submit"
                                disabled={isSubmitting}
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
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? '...' : 'Subscribe'}
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                padding: '20px',
                                color: subColor,
                                fontFamily: 'var(--font-baskerville)'
                            }}
                        >
                            <CheckCircle size={32} style={{ margin: '0 auto 12px' }} />
                            <h4 style={{ fontSize: '18px', color: textColor, fontWeight: 700 }}>
                                Thank you for choosing REVEIL.
                            </h4>
                            <p style={{ fontSize: '14px', opacity: 0.7 }}>We will contact you soon.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    )
}
