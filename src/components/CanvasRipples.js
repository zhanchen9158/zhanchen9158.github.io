import {
    useEffect, useRef, useCallback, memo,
    forwardRef, useImperativeHandle
} from 'react';
import { styled } from '@mui/material/styles';
import { useAnimateContext } from './AnimateContext';


const StyledCanvas = styled('canvas')({
    position: 'fixed',
    top: 0, left: 0,
    width: '100dvw', height: '100dvh',
    pointerEvents: 'none',
    zIndex: 99,
});

const CanvasRipples = forwardRef((props, ref) => {

    const { manual, system } = useAnimateContext();
    const isNormal = (system || manual) === 'normal';
    if (!isNormal) return null;

    const { canvasRef, addRipple } = useRippleCanvas();

    useImperativeHandle(ref, () => ({
        addRipple
    }));

    return (
        <StyledCanvas ref={canvasRef} />
    );
});

const useRippleCanvas = () => {
    const canvasRef = useRef(null);
    const ripples = useRef([]);
    const requestRef = useRef();

    const draw = useCallback((ctx) => {
        if (ripples.current.length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            requestRef.current = null;
            return;
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ripples.current = ripples.current.filter((ripple) => {
            ripple.radius += ripple.speed;
            ripple.speed *= 0.96;
            ripple.opacity -= 0.01;

            if (ripple.opacity <= 0) return false;

            ctx.beginPath();

            ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
            ctx.lineWidth = Math.max(0.5, 2 * ripple.opacity);

            const segments = 3;
            const gapSize = 0.8;
            const segmentLength = (Math.PI * 2) / segments;

            for (let i = 0; i < segments; i++) {
                const startAngle = (i * segmentLength) + ripple.rotation;
                const endAngle = startAngle + segmentLength - gapSize;

                // Move to the start of the arc to prevent connecting lines
                ctx.moveTo(
                    ripple.x + Math.cos(startAngle) * ripple.radius,
                    ripple.y + Math.sin(startAngle) * ripple.radius
                );
                ctx.arc(ripple.x, ripple.y, ripple.radius, startAngle, endAngle);
            }

            ctx.stroke();
            return true;
        });

        requestRef.current = requestAnimationFrame(() => draw(ctx));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Handle High DPI screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        if (ripples.current.length > 0) {
            requestRef.current = requestAnimationFrame(() => draw(ctx));
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [draw]);

    const addRipple = (x, y) => {
        ripples.current.push({
            x, y,
            radius: 2,
            opacity: 0.6,
            speed: 2,
            rotation: Math.random() * Math.PI * 2,
        });

        if (!requestRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            requestRef.current = requestAnimationFrame(() => draw(ctx));
        }
    };

    return { canvasRef, addRipple };
};

export default memo(CanvasRipples);