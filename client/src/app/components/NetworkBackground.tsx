'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
}

const PARTICLE_COUNT = 100
const CONNECTION_DISTANCE = 150
const PARTICLE_SPEED = 0.5

export const NetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particles = []
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * PARTICLE_SPEED,
                    vy: (Math.random() - 0.5) * PARTICLE_SPEED,
                    size: Math.random() * 2 + 1,
                })
            }
        }

        const draw = () => {
            if (!ctx || !canvas) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((p, i) => {
                p.x += p.vx
                p.y += p.vy

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.fill()

                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(0, 150, 255, ${1 - distance / CONNECTION_DISTANCE})`
                        ctx.lineWidth = 1
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
