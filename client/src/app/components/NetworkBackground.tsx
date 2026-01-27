'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
}

const PARTICLE_SPEED = 0.3

// Calculate particle count based on screen size (smooth scaling)
const getParticleCount = (width: number, height: number) => {
    const area = width * height
    // Base: 1 particle per ~8,888 pixels (50% more active again)
    const baseCount = Math.floor(area / 8888)

    // Mobile boost: 30% more particles for smaller screens (fades out at 1024px)
    const mobileBoost = width < 1024 ? 1 + (0.3 * (1 - width / 1024)) : 1
    const count = Math.floor(baseCount * mobileBoost)

    return Math.max(45, Math.min(count, 180))
}

// Calculate connection distance based on screen width (smooth scaling)
const getConnectionDistance = (width: number) => {
    // Scale from 80px at 320px width to 150px at 1920px width
    const minDist = 80
    const maxDist = 150
    const minWidth = 320
    const maxWidth = 1920
    const ratio = Math.min(1, Math.max(0, (width - minWidth) / (maxWidth - minWidth)))
    return minDist + (maxDist - minDist) * ratio
}

export const NetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const lastDimensionsRef = useRef({ width: 0, height: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const initParticles = (width: number, height: number) => {
            const count = getParticleCount(width, height)
            particlesRef.current = []
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * PARTICLE_SPEED,
                    vy: (Math.random() - 0.5) * PARTICLE_SPEED,
                    size: Math.random() * 1.5 + 0.5,
                })
            }
        }

        const resizeCanvas = () => {
            const width = window.innerWidth
            const height = window.innerHeight

            // Only reinitialize if width changed significantly (ignore height changes from mobile address bar)
            const widthChanged = Math.abs(width - lastDimensionsRef.current.width) > 50
            const heightChangedSignificantly = Math.abs(height - lastDimensionsRef.current.height) > 150

            canvas.width = width
            canvas.height = height

            // Only reinit particles on significant changes or first load
            if (particlesRef.current.length === 0 || widthChanged || heightChangedSignificantly) {
                initParticles(width, height)
                lastDimensionsRef.current = { width, height }
            }
        }

        const draw = () => {
            if (!ctx || !canvas) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const connectionDistance = getConnectionDistance(canvas.width)
            const particles = particlesRef.current

            // Update and draw particles
            particles.forEach((p, i) => {
                p.x += p.vx
                p.y += p.vy

                // Bounce off edges (use current canvas size)
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                // Keep particles in bounds
                p.x = Math.max(0, Math.min(canvas.width, p.x))
                p.y = Math.max(0, Math.min(canvas.height, p.y))

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
                ctx.fill()

                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(0, 150, 255, ${0.6 * (1 - distance / connectionDistance)})`
                        ctx.lineWidth = 0.5
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas()
        draw()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
        />
    )
}
