'use client'

import React from 'react'
import { motion } from 'framer-motion'

const icons = [
    {
        name: "Car Hanging Diffuser",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="8" />
                <circle cx="12" cy="2" r="1" fill="#d4af37" stroke="none" />
                <rect x="9" y="8" width="6" height="3" rx="0.5" />
                <path d="M8.5 11h7l.5 9.5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5L8.5 11z" />
                <path d="M5 14c-1.5 0-2 1.5-3.5 1.5M19 14c1.5 0 2 1.5 3.5 1.5" opacity="0.6" />
                <path d="M7 17c-1 0-1.5 1-2.5 1M17 17c1 0 1.5 1 2.5 1" opacity="0.4" />
            </svg>
        )
    },
    {
        name: "Reed Diffuser",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 14l-1 7a1 1 0 001 1h8a1 1 0 001-1l-1-7" />
                <path d="M10 14V11h4v3" />
                <line x1="12" y1="11" x2="12" y2="3" />
                <line x1="11" y1="11" x2="8" y2="4" />
                <line x1="13" y1="11" x2="16" y2="4" />
                <path d="M4 10c1-1 1-3 0-4M20 10c-1-1-1-3 0-4" opacity="0.5" />
            </svg>
        )
    },
    {
        name: "Roll-On Essence",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="6" height="13" rx="1" />
                <path d="M9 13h6" opacity="0.4" />
                <path d="M9 18h6" opacity="0.4" />
                <path d="M9 9V6a1 1 0 011-1h4a1 1 0 011 1v3" />
                <circle cx="12" cy="4.5" r="1.5" />
                <path d="M15 16s1.5-1 1.5-2.5a1.5 1.5 0 00-3 0c0 1.5 1.5 2.5 1.5 2.5z" />
            </svg>
        )
    },
    {
        name: "Reveil 50ml Aqua",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 11l-1 9.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5L17 11H7z" />
                <path d="M10 11V8h4v3" />
                <path d="M9 8V4l1.5 1.5L12 3l1.5 2.5L15 4v4H9z" />
                <path d="M12 14l2 3h-4l2-3z" opacity="0.8" />
            </svg>
        )
    },
    {
        name: "Long-Lasting",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c0 0-4 5-4 10a4 4 0 008 0c0-5-4-10-4-10z" />
                <path d="M12 10c0 0-1.5 2-1.5 4a1.5 1.5 0 003 0c0-2-1.5-4-1.5-4z" opacity="0.6" />
                <line x1="9" y1="21" x2="15" y2="21" />
            </svg>
        )
    },
    {
        name: "Rare Botanicals",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 4 8.5 4 14c0 3 2 5 2 5l6-3 6 3s2-2 2-5c0-5.5-2.5-12-8-12z" />
                <path d="M12 2v14" />
                <path d="M12 9l3-3M12 12l2-2" opacity="0.5" />
            </svg>
        )
    },
    {
        name: "Oud & Woods",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="12" rx="10" ry="8" />
                <ellipse cx="12" cy="12" rx="6" ry="4" opacity="0.7" />
                <path d="M12 10s1 .5 1 1.5a1 1 0 01-2 0c0-1 1-1.5 1-1.5z" />
            </svg>
        )
    },
    {
        name: "Night Fragrance",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                <path d="M16 4l1 1 1-1-1-1-1 1zM20 8l.5.5.5-.5-.5-.5L20 8z" opacity="0.6" />
            </svg>
        )
    }
]

export function InfiniteIconCarousel() {
    // Duplicate the icons array to create an infinite loop effect
    const carouselItems = [...icons, ...icons, ...icons]

    return (
        <section style={{
            background: '#050505',
            padding: '80px 0',
            overflow: 'hidden',
            borderTop: '1px solid rgba(212, 175, 55, 0.1)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
        }}>
            <div style={{
                display: 'flex',
                width: 'fit-content'
            }}>
                <motion.div
                    animate={{ x: [0, -1032] }} // Approximate width of one set
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 15, // Faster scroll speed
                            ease: "linear"
                        }
                    }}
                    style={{
                        display: 'flex',
                        gap: '60px',
                        paddingLeft: '60px'
                    }}
                >
                    {carouselItems.map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            minWidth: '120px'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(212, 175, 55, 0.02)',
                                border: '1px solid rgba(212, 175, 55, 0.1)',
                                borderRadius: '50%'
                            }}>
                                {item.svg}
                            </div>
                            <span style={{
                                color: '#d4af37',
                                fontSize: '10px',
                                fontFamily: 'var(--font-baskerville)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                textAlign: 'center'
                            }}>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
