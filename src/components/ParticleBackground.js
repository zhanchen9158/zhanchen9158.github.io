import React, { useEffect, useRef } from 'react';


const ParticleBackground = () => {
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

        const ripples = [];
        const rippleCount = 5; // Fewer ripples often look cleaner

        // Initialize ripples
        for (let i = 0; i < rippleCount; i++) {
            ripples.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 50, // Current size
                maxRadius: Math.random() * 100 + 50, // Final size
                speed: Math.random() * 0.05 + 0.05, // Growth speed
                opacity: 1,
            });
        }

        const animate = () => {
            // Use a slight fill color instead of clearRect for a "trail" effect if desired
            // Or stick to clearRect for crisp lines
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ripples.forEach(r => {
                // Draw the ripple circle
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                // Opacity tied to the growth (fades out as it hits maxRadius)
                const currentOpacity = (1 - r.radius / r.maxRadius) * 0.5;
                ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Logic: Grow the ripple
                r.radius += r.speed;

                // Reset ripple when it becomes invisible or too large
                if (r.radius >= r.maxRadius) {
                    r.x = Math.random() * canvas.width;
                    r.y = Math.random() * canvas.height;
                    r.radius = 0;
                    r.maxRadius = Math.random() * 100 + 50;
                    r.speed = Math.random() * 0.5 + 0.2;
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
                zIndex: -1,
            }}
        />
    );
};

export default ParticleBackground;