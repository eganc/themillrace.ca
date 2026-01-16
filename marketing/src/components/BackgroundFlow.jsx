import React, { useEffect, useRef } from 'react';

export const BackgroundFlow = ({ containerRect, physicsMode = 'active' }) => {
    const canvasRef = useRef(null);
    const physicsState = useRef({ speedMultiplier: 1, jitter: 1 });

    useEffect(() => {
        if (physicsMode === 'calm') physicsState.current = { speedMultiplier: 0.3, jitter: 0.5 };
        if (physicsMode === 'active') physicsState.current = { speedMultiplier: 1, jitter: 1 };
        if (physicsMode === 'rapid') physicsState.current = { speedMultiplier: 2.5, jitter: 2 };
    }, [physicsMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const particles = [];
        const particleCount = 120;

        const resize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                if (!canvas) return;
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 2 + 1;
                this.speedY = Math.random() * 1 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                if (!canvas) return;
                this.y += this.speedY * physicsState.current.speedMultiplier;
                this.x += this.speedX * physicsState.current.jitter;

                if (containerRect) {
                    const buffer = 40;
                    const rect = {
                        left: containerRect.left - buffer,
                        right: containerRect.right + buffer,
                        top: containerRect.top - buffer,
                        bottom: containerRect.bottom + buffer
                    };

                    if (this.x > rect.left && this.x < rect.right && this.y > rect.top && this.y < rect.bottom) {
                        const pushDir = this.x < (rect.left + rect.right) / 2 ? -1 : 1;
                        this.x += pushDir * 2;
                        this.speedX += pushDir * 0.1;
                    }
                }

                const centerX = canvas.width / 2;
                this.speedX += (centerX - this.x) * 0.00005;

                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(82, 121, 111, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#52796F';
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            const p = new Particle();
            p.y = Math.random() * (canvas?.height || window.innerHeight); // distribute initially
            particles.push(p);
        }

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(27, 73, 101, 0.05)';
            ctx.lineWidth = 1;

            const lineCount = physicsMode === 'calm' ? 3 : physicsMode === 'rapid' ? 8 : 5;

            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                ctx.moveTo(canvas.width * (i / (lineCount - 1)), 0);
                ctx.bezierCurveTo(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, canvas.width * (i / (lineCount - 1)), canvas.height);
                ctx.stroke();
            }
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, [containerRect, physicsMode]);

    return <canvas ref={canvasRef} className="background-canvas" />;
};
