'use client'

import React from 'react'

const icons = [
    {
        name: "Rare Botanicals",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V8" />
                <path d="M12 8c0-3 2-5 5-5 0 3-2 5-5 5z" />
                <path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5z" />
                <path d="M12 16c0-3 2-5 5-5 0 3-2 5-5 5z" opacity="0.7" />
                <path d="M9 22h6" />
            </svg>
        )
    },
    {
        name: "Rose Damascena",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="11" r="3" />
                <path d="M12 8c-2-2-5-1-5 2 0 2 2 3 5 3" />
                <path d="M12 14c2 2 5 1 5-2 0-2-2-3-5-3" />
                <path d="M9 11c-2 2-1 5 2 5 2 0 3-2 3-5" />
                <path d="M15 11c2-2 1-5-2-5-2 0-3 2-3 5" />
                <path d="M12 14v8" />
                <path d="M10 22h4" />
            </svg>
        )
    },
    {
        name: "Saffron Threads",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4c2 5 2 10 0 16" />
                <path d="M10 4c2 5 2 10 0 16" />
                <path d="M14 4c2 5 2 10 0 16" />
                <path d="M18 4c2 5 2 10 0 16" />
            </svg>
        )
    },
    {
        name: "Oud Cambodge",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="12" rx="10" ry="8" />
                <ellipse cx="12" cy="12" rx="6" ry="4" opacity="0.6" />
                <path d="M4 12c4-3 12-3 16 0" opacity="0.5" />
                <path d="M8 12c2-1 6-1 8 0" opacity="0.5" />
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
        name: "Reveil Signature",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 22V8c0-1 .5-2 1-3l3-3 3 3c.5 1 1 2 1 3v14z" />
                <path d="M8 13h8" />
                <path d="M10 4h4" />
                <circle cx="12" cy="17" r="1" fill="#d4af37" stroke="none" />
            </svg>
        )
    },
    {
        name: "Sandalwood & Amber",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20c0-3 2-5 4-5s4 2 4 5" />
                <path d="M12 20c0-3 2-5 4-5s4 2 4 5" />
                <path d="M3 20h18" />
                <path d="M8 15v-3M16 15v-3" opacity="0.5" />
                <circle cx="8" cy="9" r="2" opacity="0.7" />
                <circle cx="16" cy="9" r="2" opacity="0.7" />
            </svg>
        )
    },
    {
        name: "Jasmine Absolute",
        svg: (
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#d4af37" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M12 4a4 4 0 010 8M12 20a4 4 0 010-8" />
                <path d="M4 12a4 4 0 018 0M20 12a4 4 0 01-8 0" />
                <path d="M6.3 6.3a4 4 0 005.7 5.7M17.7 17.7a4 4 0 00-5.7-5.7" opacity="0.6" />
                <path d="M6.3 17.7a4 4 0 015.7-5.7M17.7 6.3a4 4 0 01-5.7 5.7" opacity="0.6" />
            </svg>
        )
    }
]

export function InfiniteIconCarousel() {
    // Triplicate for seamless infinite loop
    const carouselItems = [...icons, ...icons, ...icons]

    return (
        <section style={{
            background: '#f8f7f2',
            padding: '80px 0',
            overflow: 'hidden',
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
            <div className="reveil-marquee-track">
                <div className="reveil-marquee-inner">
                    {carouselItems.map((item, idx) => (
                        <div key={idx} className="reveil-marquee-item">
                            <div className="reveil-icon-circle">
                                {item.svg}
                            </div>
                            <span className="reveil-icon-label">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes reveil-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }

                .reveil-marquee-track {
                    width: 100%;
                    overflow: hidden;
                }

                .reveil-marquee-inner {
                    display: flex;
                    gap: 60px;
                    width: max-content;
                    animation: reveil-scroll 20s linear infinite;
                    will-change: transform;
                }

                .reveil-marquee-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    min-width: 120px;
                    flex-shrink: 0;
                }

                .reveil-icon-circle {
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(212, 175, 55, 0.08);
                    border: 1px solid rgba(212, 175, 55, 0.35);
                    border-radius: 50%;
                }

                .reveil-icon-label {
                    color: #d4af37;
                    font-size: 10px;
                    font-family: var(--font-baskerville);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    text-align: center;
                    white-space: nowrap;
                }

                @media (prefers-reduced-motion: reduce) {
                    .reveil-marquee-inner {
                        animation: none;
                    }
                }
            `}</style>
        </section>
    )
}
