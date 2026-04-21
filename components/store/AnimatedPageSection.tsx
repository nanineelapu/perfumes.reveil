'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    className?: string
    style?: React.CSSProperties
    delay?: number
    duration?: number
    initialY?: number
    initialX?: number
}

export function AnimatedPageSection({ 
    children, 
    className, 
    style, 
    delay = 0.4, 
    duration = 1.8,
    initialY = 50,
    initialX = 0
}: Props) {
    return (
        <motion.section
            initial={{ y: initialY, x: initialX, opacity: 0 }}
            whileInView={{ y: 0, x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
            style={style}
        >
            {children}
        </motion.section>
    )
}
