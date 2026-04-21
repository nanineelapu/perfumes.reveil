'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Slide = {
    id: string
    title: string | null
    image_url: string
    video_url?: string
    link: string | null
    display_order: number
    button_label?: string
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 40,
        startIndex: 0
    })
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!emblaApi) return

        let intervalId: NodeJS.Timeout
        const activeSlide = slides[current]

        // Snappy pacing for navigation
        if (!activeSlide?.video_url) {
            intervalId = setInterval(() => emblaApi.scrollNext(), 8000)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [emblaApi, current, slides])

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            setCurrent(emblaApi.selectedScrollSnap())
        }
        emblaApi.on('select', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi])

    const scrollTo = useCallback(
        (i: number) => emblaApi?.scrollTo(i),
        [emblaApi]
    )

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    if (slides.length === 0) return null

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }} ref={emblaRef}>
            <div style={{ display: 'flex' }}>
                {slides.map((slide, i) => (
                    <div key={slide.id} style={{ flex: '0 0 100%', minWidth: 0, position: 'relative' }}>
                        <SlideMedia
                            slide={slide}
                            isActive={current === i}
                            emblaApi={emblaApi}
                        />
                    </div>
                ))}
            </div>

            {/* Premium Dash Indicators & Navigation */}
            {slides.length > 1 && (
                <div style={{
                    position: 'absolute', bottom: '60px', left: '120px',
                    display: 'flex', alignItems: 'center', gap: '32px', zIndex: 10
                }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                style={{
                                    width: i === current ? '60px' : '15px',
                                    height: '4px',
                                    background: i === current ? '#fff' : 'rgba(255,255,255,0.2)',
                                    border: 'none', cursor: 'pointer', padding: 0,
                                    borderRadius: '10px',
                                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '32px' }}>
                        <button
                            onClick={scrollPrev}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#fff', opacity: 0.5, padding: '8px',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                        >
                            <ChevronLeft size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={scrollNext}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#fff', opacity: 0.5, padding: '8px',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                        >
                            <ChevronRight size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SlideMedia({ slide, isActive, emblaApi }: { slide: Slide, isActive: boolean, emblaApi: any }) {
    const [isLoaded, setIsLoaded] = useState(false)

    // Immediate load strategy for snappier navigation
    useEffect(() => {
        if (!slide.video_url) {
            setIsLoaded(true)
        } else {
            // Safety timeout for videos
            const timer = setTimeout(() => setIsLoaded(true), 2500)
            return () => clearTimeout(timer)
        }
    }, [slide.video_url])

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', background: '#000' }}>

            {/* Minimalist circular luxury loader */}
            <AnimatePresence>
                {!isLoaded && isActive && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 5, background: '#000'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: '40px', height: '40px',
                                border: '2px solid rgba(212,175,55,0.1)',
                                borderTop: '2px solid #d4af37',
                                borderRadius: '50%'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Media */}
            <motion.div
                animate={{
                    opacity: isActive && isLoaded ? 1 : 0,
                    scale: isActive ? 1.05 : 1.1
                }}
                transition={{
                    opacity: { duration: 1.5, ease: "easeOut" },
                    scale: { duration: 25, ease: "linear" }
                }}
                style={{ height: '100%', width: '100%', willChange: 'opacity, transform' }}
            >
                {slide.video_url ? (
                    <video
                        src={slide.video_url}
                        autoPlay
                        muted
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                        onCanPlay={() => setIsLoaded(true)}
                        onEnded={() => {
                            setTimeout(() => emblaApi?.scrollNext(), 3000)
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.25) contrast(1.15)'
                        }}
                    />
                ) : (
                    <img
                        src={slide.image_url}
                        alt={slide.title ?? 'Slide'}
                        onLoad={() => setIsLoaded(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.35)'
                        }}
                    />
                )}
            </motion.div>



            {/* Side Light Sweep Effect */}
            <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={isActive ? { x: '100%', opacity: [0, 0.4, 0] } : {}}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    zIndex: 1, pointerEvents: 'none'
                }}
            />

            {/* Content Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 120px',
                textAlign: 'left', zIndex: 2,
                pointerEvents: isActive ? 'auto' : 'none'
            }}>
                <div style={{ maxWidth: '900px' }}>
                    <motion.div
                        initial="initial"
                        animate={isActive ? "animate" : "initial"}
                        variants={{
                            animate: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.8
                                }
                            }
                        }}
                    >
                        <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
                            <motion.div
                                variants={{
                                    initial: { clipPath: 'inset(100% 0% 0% 0%)', y: '100%' },
                                    animate: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 }
                                }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontSize: '11px', fontWeight: 400, letterSpacing: '0.8em', color: '#d4af37',
                                    textTransform: 'uppercase',
                                    fontFamily: 'var(--font-baskerville)'
                                }}
                            >
                                Reveil Collection
                            </motion.div>
                        </div>

                        {slide.title && (
                            <h2 style={{
                                color: '#fff',
                                fontSize: (slide.title?.toLowerCase().includes('collection') || slide.title?.toLowerCase().includes('stones')) ? 'clamp(28px, 5.5vw, 84px)' : 'clamp(32px, 6vw, 100px)',
                                fontWeight: 900,
                                margin: '0 0 40px',
                                lineHeight: 1.1,
                                fontFamily: 'var(--font-baskerville)',
                                letterSpacing: '-0.03em',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    variants={{
                                        initial: { clipPath: 'inset(100% 0% 0% 0%)', y: '100%' },
                                        animate: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 }
                                    }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {slide.title?.split(' ').map((word, i) => {
                                        const lowerWord = word.toLowerCase()
                                        const isAccent = lowerWord.includes('meena') || lowerWord.includes('stones') || lowerWord.includes('scent') || lowerWord.includes('collection')
                                        return (
                                            <span key={i} style={{
                                                color: isAccent ? '#d4af37' : '#fff',
                                                fontStyle: isAccent ? 'italic' : 'normal',
                                                fontWeight: isAccent ? 600 : 900,
                                                marginRight: '0.25em'
                                            }}>
                                                {word}
                                            </span>
                                        )
                                    })}
                                </motion.div>
                            </h2>
                        )}

                        <div style={{ marginTop: '20px' }}>
                            <motion.div
                                variants={{
                                    initial: { clipPath: 'inset(100% 0% 0% 0%)', y: '100%' },
                                    animate: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 }
                                }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <motion.a
                                    href="/products"
                                    whileHover={{
                                        backgroundColor: '#d4af37',
                                        color: '#000',
                                        borderRadius: '0px',
                                        scale: 1.05,
                                        letterSpacing: '0.4em'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        display: 'inline-block', padding: '18px 48px',
                                        background: '#fff', color: '#000',
                                        borderRadius: '100px', fontWeight: 700, fontSize: '11px',
                                        textTransform: 'uppercase', letterSpacing: '0.3em',
                                        textDecoration: 'none',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                        border: '1px solid transparent'
                                    }}
                                >
                                    {slide.button_label || 'The Essence'}
                                </motion.a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
