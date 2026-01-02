import React, { useRef, useEffect } from 'react';
import bg from '../pics/underlightglow.webp';


const ParticleBackground = ({ }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const particles = [];
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                opacity: Math.random(),
                speed: Math.random() * 0.005 + 0.001,
                increasing: Math.random() > 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();

                if (p.increasing) {
                    p.opacity += p.speed;
                    if (p.opacity >= 1) p.increasing = false;
                } else {
                    p.opacity -= p.speed;
                    if (p.opacity <= 0) {
                        p.increasing = true;

                        p.x = Math.random() * canvas.width;
                        p.y = Math.random() * canvas.height;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#0f172a',
                zIndex: -1,
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        />
    );
};

export default ParticleBackground;