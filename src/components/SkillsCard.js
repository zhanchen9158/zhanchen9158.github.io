import React, {
    useEffect, useLayoutEffect, useState, useRef,
    useCallback, useMemo, memo
} from 'react';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    motion, AnimatePresence, useMotionValue, useMotionValueEvent,
    useSpring, useTransform, animate, useInView,
    time
} from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import GlassOverlay from './GlassOverlay';
import SvgGlow from './SvgGlow';
import SvgSplitColor, { SvgSplitShadow, SvgBorder } from './SvgSplitColor';
import GrainOverlay from './GrainOverlay';
import hexToRgba from '../functions/hexToRgba';
import wireframe1 from '../pics/wireframe1.webp';
import wireframe2 from '../pics/wireframe2.webp';
import wireframe3 from '../pics/wireframe3.webp';
import wireframe4 from '../pics/wireframe4.webp';
import modalbg from '../pics/hudbg.webp';
import modalbgretinal from '../pics/hudretinal.webp';


const MotionBox = motion.create(Box);
const MotionSvg = motion.create('svg');
const MotionPath = motion.create('path');
const MotionCircle = motion.create('circle');
const MotionText = motion.create('text');
const MotionSpan = motion.create('span');

const icons = import.meta.glob('../icons/skills/*.svg', {
    eager: true,
    query: '?url'
});

const SKILLS_DATA = [
    {
        id: 1,
        title: 'Languages',
        size: 'large',
        color: '#2196f3', underlayercolor: '#0A6FC2',
        shuttlecolor: '#64C8FF',
        cardcolors: ['#010B13', '#d8ecfd', '#7fbdf5'],
        circlecolors: ['#f0dc56', '#f5e78e', '#faf3c7'],
        border: '#90CAF9',
        mainicon: 'languages',
        icons: [
            {
                file: 'java', name: 'Java',
                desc: 'Scalable, secure microservices with Spring Boot and Hibernate.'
            },
            {
                file: 'javascript', name: 'JavaScript',
                desc: 'Dynamic, high-performance full-stack applications with React and JavaScript.'
            },
            {
                file: 'python', name: 'Python',
                desc: 'Robust data processing pipelines and machine learning models via PyTorch.'
            },
            {
                file: 'csharp', name: 'C#',
                desc: 'Efficient, maintainable applications leveraging C# and .NET technologies.'
            },
            {
                file: 'sql', name: 'SQL',
                desc: 'Scalable, efficient relational SQL data structures.'
            }
        ],
    },
    {
        id: 2,
        title: 'Frontend',
        size: 'small',
        color: '#9c27b0', underlayercolor: '#852197',
        shuttlecolor: '#FF6464',
        cardcolors: ['#0f0311', '#f4def8', '#9b59b6'],
        circlecolors: ['#7bbfcc', '#a7d5dd', '#d3eaee'],
        border: '#ce93d8',
        mainicon: 'frontend',
        icons: [
            {
                file: 'react', name: 'React',
                desc: 'Responsive, dynamic web applications with a focus on React optimization.'
            },
            {
                file: 'onnx', name: 'ONNX Runtime Web',
                desc: 'Performance-driven On-Device machine learning inference.'
            },
            {
                file: 'emotion', name: 'Emotion',
                desc: 'Component-driven, themable UIs with strict design system fidelity.'
            },
            {
                file: 'framermotion', name: 'Framer Motion',
                desc: 'Fluid, motion-rich user experience balanced with performance optimization.'
            },
            {
                file: 'vite', name: 'Vite',
                desc: 'Optimized production asset delivery and streamlined development feedback loops.'
            },
            {
                file: 'materialui', name: 'Material UI',
                desc: 'Consistent, accessible design implementation with Material UI.'
            },
            {
                file: 'html', name: 'HTML',
                desc: 'Semantic, accessible HTML foundations for scalable web applications.'
            },
            {
                file: 'css', name: 'CSS',
                desc: 'Sophisticated, adaptive styling and layout for modern design system specifications.'
            },
        ],
    },
    {
        id: 3,
        title: 'Backend',
        size: 'small',
        color: '#00897b', underlayercolor: '#00665C',
        shuttlecolor: '#FF6464',
        cardcolors: ['#001412', '#d6fffb', '#79e0ee'],
        circlecolors: ['#f0dc56', '#f5e78e', '#faf3c7'],
        border: '#A5D6A7',
        mainicon: 'backend',
        icons: [
            {
                file: 'springboot', name: 'Spring Boot',
                desc: 'Resilient, scalable backend services with Spring Boot ecosystem.'
            },
            {
                file: 'nodejs', name: 'Node.js',
                desc: 'Event-driven, non-blocking network services with robust API design.'
            },
            {
                file: 'hibernate', name: 'Hibernate',
                desc: 'Robust data-persistence architectures leverageing Hibernate/JPA.'
            },
            {
                file: 'mysql', name: 'MySQL',
                desc: 'High-availability relational data architectures and optimized querying patterns.'
            },
            {
                file: 'mongodb', name: 'MongoDB',
                desc: 'Flexible, high-performance data systems powering data-intensive features.'
            },
            {
                file: 'elasticsearch', name: 'Elasticsearch',
                desc: 'Low-latency search infrastructures for real-time data retrieval and analytics.'
            }
        ],
    },
    {
        id: 4,
        title: 'Tools/Cloud',
        size: 'medium',
        color: '#f57c00', underlayercolor: '#CC6600',
        shuttlecolor: '#BE963C',
        cardcolors: ['#140b00', '#ffebd6', '#ffd1a3'],
        circlecolors: ['#7bbfcc', '#a7d5dd', '#d3eaee'],
        border: '#FFCC80',
        mainicon: 'cloud',
        icons: [
            {
                file: 'aws', name: 'AWS',
                desc: 'Highly available, secure, and operationally efficient cloud solutions.'
            },
            {
                file: 'pytorch', name: 'PyTorch',
                desc: 'End-to-end deep learning pipelines for high-throughput predictive workloads alongside model precision.'
            },
            {
                file: 'huggingface', name: 'Hugging Face',
                desc: 'Optimized inferencing with research-grade model architectures.'
            },
            {
                file: 'docker', name: 'Docker',
                desc: 'Immutable infrastructure with optimized resource orchestration.'
            },
            {
                file: 'git', name: 'Git',
                desc: 'Distributed version control system for efficient code management.'
            },
            {
                file: 'jwt', name: 'JWT',
                desc: 'Secure, granular Claims-Based Authorization & Authentication ecosystems.'
            },
            {
                file: 'cloudarchitecture', name: 'Cloud Architecture',
                desc: 'High-availability, cloud-native ecosystems with rigorous operational governance.'
            },
            {
                file: 'microservice', name: 'Micro Service',
                desc: 'Modular, service-oriented ecosystems with system resilience and independent service scalability.'
            },
            {
                file: 'restapi', name: 'REST API',
                desc: 'Resource-oriented RESTful APIs for consistent and predictable service integration.'
            }
        ],
    },
];

const GridContainerSm = styled(MotionBox)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4), display: 'grid', gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateRows: 'repeat(4, 50px)',
    gridTemplateAreas: `
        "a"
        "b"
        "c"
        "d"
    `,
    backfaceVisibility: 'hidden',
}));

const GridContainer = styled(MotionBox)(({ theme }) => ({
    padding: theme.spacing(4), display: 'grid', gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, 200px)',
    gridTemplateAreas: `
        "a a b c"
        "a a d d"
    `,
    backfaceVisibility: 'hidden',
}));

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            //staggerChildren: 0.4,
        },
    },
    static: { opacity: 1 },
};

const SPRINGCONFIG = {
    bg: { stiffness: 50, damping: 20, mass: 0.5 },
    parallax: { stiffness: 50, damping: 20, mass: 0.5 },
    griditem3d: { stiffness: 150, damping: 20, mass: 0.1 },
};

const ringdelay = 2.2;
const hover = 0.5;
const layoutduration = 0.8;
const modalbootupduration = 2;
const TRANSITIONCONFIG = {
    ringentrance: { duration: 2, ease: [0.16, 1, 0.3, 1] },
    canvasentrance: { duration: 2, delay: 4, ease: 'easeOut' },

    hoverbgstart: { duration: 5 * hover, ease: 'easeOut' },
    hoverbgend: { duration: 2 * hover, ease: 'easeOut' },

    hoverstart: { duration: 2.5 * hover, ease: 'easeOut' },
    hoverend: { duration: hover, ease: 'easeOut' },

    layoutbg: {
        delay: layoutduration, duration: modalbootupduration, ease: 'easeOut'
    },
    layoutbgimage: {
        delay: layoutduration, duration: modalbootupduration, ease: 'easeOut'
    },
    layoutanimate: { duration: layoutduration, ease: 'easeOut' },
};

export default function SkillsCard() {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            hidden: isNormal ? 'hidden' : "static",
            visible: isNormal ? 'visible' : "static",
        };
    }, [mode]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            x.set(e.clientX / window.innerWidth);
            y.set(e.clientY / window.innerHeight);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [x, y]);

    if (lesserThanSm) {
        return (
            <GridContainerSm
                variants={containerVars}
                initial={animationConfig.hidden}
                whileInView={animationConfig.visible}
                viewport={{ once: false, amount: 0.5 }}
            >
                <BentoGrid
                    globalMouseX={x}
                    globalMouseY={y}
                />
            </GridContainerSm>
        )
    }

    return (
        <GridContainer
            variants={containerVars}
            initial={animationConfig.hidden}
            whileInView={animationConfig.visible}
            viewport={{ once: false, amount: 0.5 }}
        >
            <ParallaxShapes
                mouseX={x}
                mouseY={y}

            />
            <BentoGrid
                globalMouseX={x}
                globalMouseY={y}
            />
        </GridContainer>
    );
}

const ParallaxContainer = styled(MotionBox)(({ theme }) => ({
    position: 'fixed', inset: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: -1,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const RingContainer = styled(MotionBox)(({ theme }) => ({
    //position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    perspective: '1000px',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const r = 50;
const RING_CONFIGS = [
    {
        id: 'outer', order: 2,
        radius: 72, strokeWidth: 1, glow: 3,
        r: r, windowr: r - 1.5,
        windowdasharray: "2, 1, 4, 2",
        datar: r - 2.5,
        rotX: [30, -30], rotY: [-30, 30], rotZ: 45,
        z: [0, -150],
        opacity: [0, 0.25],
    },
    {
        id: 'middle', order: 1,
        radius: 45, strokeWidth: 3, glow: 5,
        r: r, windowr: r - 3,
        windowdasharray: "2, 1, 4, 2",
        datar: r - 5,
        rotX: [-40, 40], rotY: [-40, 40], rotZ: 90,
        z: [0, 0],
        opacity: [0, 0.5],
    },
    {
        id: 'inner', order: 0,
        radius: 18, strokeWidth: 6, glow: 10,
        r: r, windowr: r - 7,
        windowdasharray: "3, 15, 5, 20",
        datar: r - 14,
        rotX: [-50, 50], rotY: [50, -50], rotZ: 180,
        z: [0, 150],
        opacity: [0, 0.75],
    }
];

const ParallaxShapes = memo(function ParallaxShapes({ mouseX, mouseY }) {

    const ringRef = useRef(null);
    const isInView = useInView(ringRef, { amount: 0.1, margin: "100px" });

    const masterTransform = useTransform(
        [mouseX, mouseY],
        ([latestX, latestY]) => {
            const dx = latestX - 0.5;
            const dy = latestY - 0.5;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const parallaxFactor = distance / 0.707;
            const direction = latestX > 0.5 ? 1 : -1;

            return { parallaxFactor, direction };
        }
    );

    const entranceProgress = useMotionValue(0);
    const animationRef = useRef(null);
    const timerRef = useRef(null);
    const handleViewportEnter = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationRef.current) animationRef.current.stop();

        const delay = ringdelay * 1000;
        timerRef.current = setTimeout(() => {
            animationRef.current = animate(entranceProgress, 1, {
                ...TRANSITIONCONFIG.ringentrance,
                onComplete: () => {
                    animationRef.current = null;
                }
            });
        }, delay);
    }, []);
    const handleViewportLeave = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationRef.current) animationRef.current.stop();
        entranceProgress.set(0);
    }, []);
    const springScale = useSpring(
        useTransform(entranceProgress, [0, 1], [0.1, 1]),
        SPRINGCONFIG.parallax
    );

    useEffect(() => {
        if (isInView) {
            handleViewportEnter();
        } else {
            handleViewportLeave();
        }
    }, [isInView]);


    return (
        <ParallaxContainer>
            <SvgDefs />
            <PlexusCanvas
                mouseX={mouseX}
                mouseY={mouseY}
                isInView={isInView}
            />
            <RingContainer
                ref={ringRef}
            >
                {RING_CONFIGS.map((config) => (
                    <Parallax3dRing
                        key={config.id}
                        config={config}
                        mouseX={mouseX} mouseY={mouseY}
                        masterTransform={masterTransform}
                        entranceProgress={entranceProgress}
                        springScale={springScale}
                        isInView={isInView}
                    />
                ))}
            </RingContainer>
        </ParallaxContainer>
    );
});

const StyledCanvas = styled('canvas')(({ theme }) => ({
    position: 'fixed', inset: 0,
    zIndex: -5,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const TAU = 6.283;
const NODE_SIZE = [1, 2, 2.1, 3, 4];
const NODE_COLORS = [
    '#FFFFFF',
    '#FF6464',
    '#FF6464',
    '#BE963C',
    '#64C8FF',
];
const determineProperties = (zValue) => {
    if (zValue < 0.2) return { color: NODE_COLORS[0], size: NODE_SIZE[0] };
    if (zValue < 0.4) return { color: NODE_COLORS[1], size: NODE_SIZE[1] };
    if (zValue < 0.6) return { color: NODE_COLORS[2], size: NODE_SIZE[2] };
    if (zValue < 0.8) return { color: NODE_COLORS[3], size: NODE_SIZE[3] };
    return { color: NODE_COLORS[4], size: NODE_SIZE[4] };
};
const getApproxDist = (dx, dy) => {
    dx = Math.abs(dx);
    dy = Math.abs(dy);
    return (dx > dy) ? (dx + 0.337 * dy) : (dy + 0.337 * dx);
};
const createParticle = (width, height) => {
    const zValue = Math.random();
    let x = Math.random() * width;
    let y = Math.random() * height;
    const { color, size } = determineProperties(zValue);

    let speed = 0;
    if (size === 1) { speed = 0; }
    else if (size === 2) { speed = 0.4; }
    else if (size === 2.1) { speed = 0.3; }
    else if (size === 3) { speed = 0.2; }
    else { speed = 0.0005; }

    const centerX = width >> 1;
    const centerY = height >> 1;
    const vmin = Math.min(width, height) / 100;
    const innerRadius = (RING_CONFIGS.find(ring => ring.id === 'inner')?.radius / 2 || 9) * vmin;
    const outerRadius = (RING_CONFIGS.find(ring => ring.id === 'outer')?.radius / 2 || 36) * vmin;

    const dx = centerX - x;
    const dy = centerY - y;
    const dist = getApproxDist(dx, dy);
    let unitX = dist > 0 ? dx / dist : 0;
    let unitY = dist > 0 ? dy / dist : 0;

    let vx = (Math.random() - 0.5) * speed;
    let vy = (Math.random() - 0.5) * speed;

    let orbitRadius = 0;
    let orbitAngle = 0;

    if (size === 2 || size === 3) {
        vx = unitX * speed;
        vy = unitY * speed;
    } else if (size === 2.1) {
        const angle = Math.random() * TAU;
        unitX = -unitX; unitY = -unitY;

        x = centerX + Math.cos(angle) * innerRadius;
        y = centerY + Math.sin(angle) * innerRadius;
        vx = unitX * speed;
        vy = unitY * speed;
    } else if (size === 4) {
        const minOrb = innerRadius + 5 * vmin;
        const maxOrb = outerRadius - 5 * vmin;
        orbitRadius = minOrb + Math.random() * (maxOrb - minOrb);
        orbitAngle = Math.random() * TAU;

        x = centerX + Math.cos(orbitAngle) * orbitRadius;
        y = centerY + Math.sin(orbitAngle) * orbitRadius;
        vx = -Math.sin(orbitAngle) * speed;
        vy = Math.cos(orbitAngle) * speed;
        unitX = -Math.cos(orbitAngle);
        unitY = -Math.sin(orbitAngle);
    }

    let pulseSpeed = 0.001, pulseMag = 0.1, tailLen = 15, tAlpha = 0.4;
    if (size === 2 || size === 2.1) {
        pulseSpeed = 0.002; pulseMag = 0.2; tailLen = 20; tAlpha = 0.6;
    } else if (size === 3) {
        pulseSpeed = 0.0015; pulseMag = 0.15; tailLen = 15; tAlpha = 0.3;
    }

    return {
        x, y, vx, vy, unitX, unitY, size, color, zValue, speed,
        pulseSpeed, pulseMag, tailLen, tAlpha,
        centerX, centerY, vmin, innerRadius, outerRadius,
        orbitRadius, orbitAngle
    };
};

const resetShuttle = (p, width, height) => {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { p.x = 0; p.y = Math.random() * height; }
    if (side === 1) { p.x = width; p.y = Math.random() * height; }
    if (side === 2) { p.x = Math.random() * width; p.y = 0; }
    if (side === 3) { p.x = Math.random() * width; p.y = height; }

    const dx = p.centerX - p.x;
    const dy = p.centerY - p.y;
    const dist = getApproxDist(dx, dy);
    p.unitX = dx / dist;
    p.unitY = dy / dist;
    p.vx = dist > 0 ? p.unitX * p.speed : 0;
    p.vy = dist > 0 ? p.unitY * p.speed : 0;
};

const resetShuttle2 = (p, width, height) => {
    const angle = Math.random() * TAU;

    p.x = p.centerX + Math.cos(angle) * p.innerRadius;
    p.y = p.centerY + Math.sin(angle) * p.innerRadius;

    const dx = p.x - p.centerX;
    const dy = p.y - p.centerY;
    const dist = getApproxDist(dx, dy);
    p.unitX = dx / dist;
    p.unitY = dy / dist;
    p.vx = dist > 0 ? p.unitX * p.speed : 0;
    p.vy = dist > 0 ? p.unitY * p.speed : 0;
};

const drawShuttleShape = (ctx, p, radius, alpha, time) => {

    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    if (p.size === 1) {
        ctx.arc(p.x, p.y, radius, 0, TAU);
    }
    else if (p.size === 3) {
        ctx.moveTo(p.x + p.unitX * radius * 1.5, p.y + p.unitY * radius * 1.5);
        ctx.lineTo(p.x + p.unitY * radius, p.y - p.unitX * radius);
        ctx.lineTo(p.x - p.unitX * radius, p.y - p.unitY * radius);
        ctx.lineTo(p.x - p.unitY * radius, p.y + p.unitX * radius);
        ctx.closePath();
    } else if (p.size === 2 || p.size === 2.1) {
        ctx.moveTo(p.x + p.unitX * p.size * 2, p.y + p.unitY * p.size * 2);
        ctx.lineTo(p.x - p.unitX * p.size + p.unitY * p.size, p.y - p.unitY * p.size - p.unitX * p.size);
        ctx.lineTo(p.x - p.unitX * p.size - p.unitY * p.size, p.y - p.unitY * p.size + p.unitX * p.size);
        ctx.closePath();
    } else if (p.size === 4) {
        ctx.globalAlpha = alpha * 0.5;
        ctx.arc(p.x, p.y, radius, 0, TAU);
        ctx.fill();

        const baseRadius = radius * 1.2;
        const spin1 = Math.abs(Math.sin(time * 0.001 + p.zValue * 10));
        const spin2 = Math.abs(Math.cos(time * 0.0005 + p.zValue * 10));

        ctx.lineWidth = 0.8;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha * 0.8;

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, baseRadius, baseRadius * spin1, 0, 0, TAU);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, baseRadius * spin2, baseRadius, 0, 0, TAU);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        return;
    }

    ctx.fill();
    ctx.globalAlpha = 1.0;
};

const drawShuttleTrail = (ctx, p, pulse, radius) => {
    if (p.speed >= 0.2) {
        const dynamicTailLen = p.tailLen * pulse;
        const endX = Math.round(p.x - p.unitX * dynamicTailLen);
        const endY = Math.round(p.y - p.unitY * dynamicTailLen);

        const grad = ctx.createLinearGradient(p.x, p.y, endX, endY);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineCap = 'butt';

        if (p.size === 2 || p.size === 2.1) {
            const offset = p.size * 0.9;
            const nx = p.unitY * offset;
            const ny = -p.unitX * offset;

            ctx.globalAlpha = p.tAlpha * pulse * 0.3;
            ctx.lineWidth = p.size * 1.2;
            ctx.beginPath();
            ctx.moveTo(p.x + nx, p.y + ny); ctx.lineTo(endX + nx, endY + ny);
            ctx.moveTo(p.x - nx, p.y - ny); ctx.lineTo(endX - nx, endY - ny);
            ctx.stroke();

            ctx.globalAlpha = p.tAlpha * pulse;
            ctx.lineWidth = p.size * 0.3;
            ctx.stroke();

        } else {
            const plumeWidth = radius * 1.5;
            const rx = p.unitY * plumeWidth;
            const ry = -p.unitX * plumeWidth;

            ctx.globalAlpha = p.tAlpha * pulse;
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(p.x + rx, p.y + ry);
            ctx.lineTo(p.x - rx, p.y - ry);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = radius * 0.5;
            ctx.globalAlpha = p.tAlpha * pulse * 1.2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

const canvasVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITIONCONFIG.canvasentrance },
    static: { opacity: 1 },
};

const PlexusCanvas = memo(function PlexusCanvas({
    mouseX, mouseY,
    nodeCount = 20, threshold = 180,
    isInView = true
}) {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const particlesRef = useRef([]);
    const thresholdSq = threshold * threshold;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const init = () => {
            particlesRef.current = Array.from({ length: nodeCount }, () =>
                createParticle(width, height)
            );
        };

        const animate = () => {
            if (!isInView) return;

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            const currentMouseX = mouseX.get() * width;
            const currentMouseY = mouseY.get() * height;

            const time = performance.now();

            const particles = particlesRef.current;
            const len = particles.length;

            for (let i = 0; i < len; i++) {
                const p = particles[i];
                if (p.size === 1) {

                }
                else if (p.size === 2 || p.size === 3) {
                    const dx = p.centerX - p.x;
                    const dy = p.centerY - p.y;
                    const distSq = dx * dx + dy * dy;
                    const innerlimit = (p.innerRadius - p.vmin) * (p.innerRadius - p.vmin);

                    if (distSq < innerlimit) {
                        resetShuttle(p, width, height);
                    } else {
                        p.x += p.unitX * p.speed;
                        p.y += p.unitY * p.speed;
                    }
                }
                else if (p.size === 2.1) {
                    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                        resetShuttle2(p, width, height);
                    } else {
                        p.x += p.vx;
                        p.y += p.vy;
                    }
                }
                else if (p.size === 4) {
                    p.orbitAngle += p.speed;

                    p.x = p.centerX + Math.cos(p.orbitAngle) * p.orbitRadius;
                    p.y = p.centerY + Math.sin(p.orbitAngle) * p.orbitRadius;

                    p.unitX = -Math.cos(p.orbitAngle);
                    p.unitY = -Math.sin(p.orbitAngle);
                } else {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                }

                const pulse = 1 + Math.sin((time * p.pulseSpeed) + (p.zValue * 10)) * p.pulseMag;
                const dynamicAlpha = Math.min(((1 - p.zValue) * 0.8 + 0.2) * pulse, 1.0);
                const currentRadius = (p.size === 3) ? (p.size * pulse) : p.size;

                drawShuttleShape(ctx, p, currentRadius, dynamicAlpha, time);
                drawShuttleTrail(ctx, p, pulse, currentRadius);

                const mDx = p.x - currentMouseX;
                const mDy = p.y - currentMouseY;
                const mDistSq = mDx * mDx + mDy * mDy;

                if (mDistSq < thresholdSq) {
                    const lineAlpha = (1 - (mDistSq / thresholdSq)) * 0.4;
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = lineAlpha;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(currentMouseX, currentMouseY);
                    ctx.stroke();
                }

                ctx.globalAlpha = 1.0;
            };

            requestRef.current = requestAnimationFrame(animate);
        };

        if (isInView) {
            window.addEventListener('resize', resize);
            resize();
            animate();
        }

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(requestRef.current);
        };
    }, [isInView, mouseX, mouseY, nodeCount, threshold]);

    return (
        <motion.div
            variants={canvasVars}
            initial={'hidden'}
            animate={isInView ? 'visible' : 'hidden'}
        >
            <StyledCanvas
                ref={canvasRef}
            />
        </motion.div>
    );
});

const RingLayer = styled(MotionBox)(({ theme, config }) => ({
    position: 'absolute', //inset: 0,
    width: `${config.radius}vmin`,
    height: `${config.radius}vmin`,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    borderRadius: '50%',
    transformStyle: 'preserve-3d',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const Parallax3dRing = memo(function Parallax3dRing({ config,
    mouseX, mouseY,
    masterTransform, entranceProgress,
    springScale, isInView
}) {

    const rotateX = useSpring(
        useTransform(mouseY, [0, 1], config.rotX),
        SPRINGCONFIG.parallax
    );
    const rotateY = useSpring(
        useTransform(mouseX, [0, 1], config.rotY),
        SPRINGCONFIG.parallax
    );

    const rotateZ = useSpring(useTransform(
        [masterTransform, entranceProgress],
        ([{ parallaxFactor, direction }, progress]) => {
            const parallaxDeg = parallaxFactor * direction * (-config.rotZ);
            const entranceOffset = (1 - progress) * -180;
            return entranceOffset + parallaxDeg;
        }
    ), SPRINGCONFIG.parallax);
    const inverseZ = useTransform(rotateZ, (v) => -v);
    const shadowZ = useTransform(
        [rotateX, rotateY, rotateZ],
        ([rx, ry, rz]) => {
            const tiltAngle = Math.atan2(ry, rx) * (180 / Math.PI);
            const finalAngle = tiltAngle - rz;

            return finalAngle + 45;
        }
    );

    const entranceOpacity = useSpring(useTransform(
        entranceProgress, [0, 1], [0, 1]
    ), SPRINGCONFIG.parallax);

    const shadowOpacity = useSpring(useTransform(
        masterTransform,
        ({ parallaxFactor, direction }) => {
            const [minOpacity, maxOpacity] = [0, 0.9];
            const parallaxOpacity = minOpacity + parallaxFactor * (maxOpacity - minOpacity);
            return parallaxOpacity;
        }
    ), SPRINGCONFIG.parallax);

    return (
        <RingLayer
            config={config}
            style={{
                rotateX,
                rotateY,
                rotateZ,
                scale: springScale,
                '--inverse-z': inverseZ,
                '--shadow-z': shadowZ,
            }}
        >
            {[...Array(3)].map((_, i) => (
                <ParallaxRing
                    key={i}
                    config={config}
                    entranceOpacity={entranceOpacity}
                    shadowOpacity={shadowOpacity}
                    isInView={isInView}
                    i={i}
                />
            ))}
        </RingLayer>
    );
});

const RingStack = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    willChange: 'transform',
    shapeRendering: 'geometricPrecision',
    transform: 'translateZ(0)',
}));

const RingSvg = styled('svg')({
    width: '100%', height: '100%',
    overflow: 'visible',
    backfaceVisibility: 'hidden',
});

const Ring3DHull = styled('circle')({
    vectorEffect: 'non-scaling-stroke',
    backfaceVisibility: 'hidden',
});

const RingGlint = styled('circle')({
    filter: `drop-shadow(0 0 2px white)`,
    //mixBlendMode: 'plus-lighter',
    backfaceVisibility: 'hidden',
});

const RingEtching = styled('circle')({
    filter: 'blur(0.5px)',
    //mixBlendMode: 'overlay',
    backfaceVisibility: 'hidden',
});

const RingRibs = styled('circle')({
    mixBlendMode: 'overlay',
    backfaceVisibility: 'hidden',
});

const RingBeacons = styled('circle')({
    filter: 'blur(1px)',
    backfaceVisibility: 'hidden',
    animation: 'beaconPulse 2s infinite ease-in-out',
    '@keyframes beaconPulse': {
        '0%, 100%': {
            opacity: 0.2,
        },
        '50%': {
            opacity: 1,
        },
    },
});

const RingWindows = styled('circle')(({ theme, i = 0, isInView = true }) => ({
    opacity: 0,
    backfaceVisibility: 'hidden',
    animation: isInView
        ? `startupFlicker 1.5s ${4 + i * 0.5}s ease-out forwards`
        : 'none',
    '@keyframes startupFlicker': {
        '0%': { opacity: 0 },
        '10%, 15%': { opacity: 1 },
        '20%, 25%': { opacity: 0 },
        '40%': { opacity: 1, filter: 'brightness(5)', },
        '100%': { opacity: 1, filter: 'brightness(1)', },
    },
}));

const RingDataTube = styled('circle')({
    backfaceVisibility: 'hidden',
    animation: 'dataFlow 3s linear infinite',
    '@keyframes dataFlow': {
        'from': {
            strokeDashoffset: 50,
        },
        'to': {
            strokeDashoffset: 0,
        },
    },
});

const getVisualStroke = (base, radius) => (base * 50) / radius;

const ParallaxRing = memo(function ParallaxRing({ config,
    entranceOpacity, shadowOpacity, isInView, i
}) {

    const gradientId = `ringGradient-${config.id}`;
    const hullColor = useMemo(() => {
        return i === 0 ? `url(#${gradientId})` : `rgba(30, 40, 50, ${0.8 - i * 0.1})`;
    }, [i, gradientId]);
    const strokeGradient = useMemo(() => {
        return `url(#${gradientId})`;
    }, [gradientId]);

    return (
        <RingStack
            style={{
                z: i * -10,
                opacity: entranceOpacity,
            }}
        >
            <RingSvg viewBox="0 0 100 100">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(40, 44, 52, 1)" />
                        <stop offset="45%" stopColor="rgba(200, 220, 255, 1)" />
                        <stop offset="50%" stopColor="rgba(255, 255, 255, 1)" />
                        <stop offset="55%" stopColor="rgba(200, 220, 255, 1)" />
                        <stop offset="100%" stopColor="rgba(70, 75, 90, 1)" />
                    </linearGradient>
                </defs>
                {i === 1 &&
                    <circle     //glow
                        cx="50" cy="50" r={config.r}
                        fill="none"
                        stroke="url(#strokeGlow)"
                        strokeWidth={config.glow}
                    />
                }
                <circle         //RingStructure
                    cx="50" cy="50" r={config.r}
                    fill="none"
                    stroke={strokeGradient}
                    strokeWidth={config.strokeWidth}
                />
                <Ring3DHull
                    cx="50" cy="50" r={config.r}
                    fill="none"
                    stroke={hullColor}
                    strokeWidth={i === 0 ? config.strokeWidth : config.strokeWidth * 1.5}
                />
                {i > 0 && (
                    <circle     //RingStackDepth
                        cx="50" cy="50" r={config.r}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={config.strokeWidth}
                        style={{
                            opacity: 0.4 + i * 0.1,
                        }}
                    />
                )}
                <RingRibs
                    cx="50" cy="50" r={config.r}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={config.strokeWidth + 0.5}
                    strokeDasharray="1, 4"
                />
                <circle         //RingPlating
                    cx="50" cy="50" r={config.r}
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.5)"
                    strokeWidth={config.strokeWidth + 0.1}
                    strokeDasharray="17, 35"
                />
                <RingGlint
                    cx="50" cy="50" r={config.r}
                    fill="none"
                    stroke="url(#glintGradient)"
                    strokeWidth={getVisualStroke(2, config.radius)}
                    strokeLinecap="round"
                    style={{
                        transform: 'rotate(calc(var(--inverse-z) * 1deg))',
                        transformOrigin: 'center'
                    }}
                />
                {i === 0 &&
                    <>
                        <RingEtching
                            cx="50" cy="50" r={config.r}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.7)"
                            strokeWidth={0.2}
                            strokeDasharray="2, 11"
                        />
                        <RingBeacons
                            cx="50" cy="50" r={config.r}
                            fill="none"
                            stroke="#ff3e3e"
                            strokeWidth={1.2}
                            strokeDasharray="1, 5, 1, 4, 1, 314"
                            strokeDashoffset='1'
                            strokeLinecap="round"
                        />
                        <RingWindows
                            cx="50" cy="50" r={config.windowr}
                            fill="none"
                            stroke="rgba(255, 200, 50, 0.6)"
                            strokeWidth={0.3}
                            strokeDasharray={config.windowdasharray}
                            i={config.order}
                            isInView={isInView}
                        />
                        <RingDataTube
                            cx="50" cy="50" r={config.datar}
                            fill="none"
                            stroke="rgba(0, 255, 255, 0.2)"
                            strokeWidth={0.2}
                            strokeDasharray="1, 9"
                        />
                        <MotionCircle    //RingShadowOverlay
                            cx="50" cy="50" r={config.r}
                            fill="none"
                            stroke="url(#shadowGradient)"
                            strokeWidth={getVisualStroke(2, config.radius)}
                            strokeLinecap="round"
                            style={{
                                opacity: shadowOpacity,
                                transform: 'rotate(calc(var(--shadow-z) * 1deg))',
                                transformOrigin: 'center'
                            }}
                        />
                    </>
                }
            </RingSvg>
        </RingStack>
    );
});

const BentoGrid = memo(function BentoGrid({ globalMouseX, globalMouseY }) {
    const [selectedId, setSelectedId] = useState(null);
    const [lastSelectedId, setLastSelectedId] = useState(null);

    const selectedItem = useMemo(() => {
        if (!selectedId) return {};

        return SKILLS_DATA.find(i => i.id == selectedId) || {};
    }, [selectedId]);

    const handleItemSelect = useCallback((id) => {
        if (id == null) {
            setLastSelectedId(selectedId);
        }
        setSelectedId(id);
    }, [selectedId]);

    const handleGridAnimationComplete = useCallback((id) => {
        if (id == lastSelectedId) setLastSelectedId(null);
    }, [lastSelectedId]);

    return (
        <>
            {SKILLS_DATA.map((item, _) => (
                <AnimatedGridItem
                    key={item.id}
                    item={item}
                    selectedId={selectedId} lastSelectedId={lastSelectedId}
                    handleItemSelect={handleItemSelect}
                    handleGridAnimationComplete={handleGridAnimationComplete}
                    globalMouseX={globalMouseX}
                    globalMouseY={globalMouseY}
                />
            ))}

            {selectedId && (
                <AnimatedModal
                    key={'animatedmodal'}
                    selectedItem={selectedItem}
                    handleItemSelect={handleItemSelect}
                />
            )}
        </>
    );
});

const gridMap = { 1: 'a', 2: 'b', 3: 'c', 4: 'd' };

const GridItemContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    borderRadius: '32px',
    cursor: 'pointer',
    perspective: '1000px',
    transformStyle: "preserve-3d",
    willChange: 'transform',
    backfaceVisibility: "hidden",
    isolation: 'isolate',
}));

const AnimatedGridItem = memo(function AnimatedGridItem({ item, selectedId, lastSelectedId,
    handleItemSelect, handleGridAnimationComplete, globalMouseX, globalMouseY }) {

    return (
        <GridItemContainer
            //variants={itemVars}
            custom={item.id}
            layoutId={`skillgriditem-${item.id}`}
            layout
            onLayoutAnimationComplete={() => handleGridAnimationComplete(item.id)}
            transition={{
                layout: TRANSITIONCONFIG.layoutanimate,
            }}
            onClick={() => handleItemSelect(item.id)}
            whileHover={{
                zIndex: 99,
            }}
            style={{
                gridArea: gridMap[item.id] || 'a',
                zIndex: (selectedId === item.id || lastSelectedId === item.id) ? 10 : 1,
            }}
        >
            <AnimatedGridItem3D item={item}
                globalMouseX={globalMouseX}
                globalMouseY={globalMouseY}
            />
        </GridItemContainer>
    );
});

const GridItem3D = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    borderRadius: 'inherit',
    cursor: 'pointer',
    width: '100%', height: '100%',
    background: 'transparent',
    transformStyle: "preserve-3d",
    willChange: "transform",
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
}));

const BORDER = 1.5;

const GridItemBorder = styled(MotionBox)(({ theme, color = '#ffffff' }) => ({
    position: 'absolute',
    inset: `-${BORDER}px`,
    background: `radial-gradient(
        300px circle at var(--mouse-x) var(--mouse-y), 
        ${color}, 
        transparent 60%
    ) no-repeat`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: `${BORDER}px`,
    borderRadius: 'inherit',
    zIndex: 2,
    backfaceVisibility: "hidden",
    pointerEvents: 'none',
    //outline: "2px solid transparent",
    //boxShadow: '0 0 2px transparent',
    border: `${BORDER}px solid transparent`,
}));

const GridItemBg = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    outline: "1px solid transparent",
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
    zIndex: 0,
}));

const Scanline = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    overflow: 'hidden',
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
    '&::after': {
        content: '""',
        position: 'absolute', inset: 0,
        background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(255, 255, 255, 0) 55%,
            transparent 100%
        )`,
        animation: `scanlineMove 16s linear infinite`,
    },
    '@keyframes scanlineMove': {
        '0%': {
            transform: 'translateY(-55%)',
        },
        '100%': {
            transform: 'translateY(55%)'
        },
    },
}));

const Spotlight = styled(motion.div)({
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    background: `radial-gradient(
        circle at var(--mouse-x) var(--mouse-y), 
        rgba(255, 255, 255, 0.15), 
        transparent 80%
    )`,
    zIndex: 3,
    pointerEvents: 'none',
});

const item3dVars = {
    initial: {
        z: 0,
        scale: 1,
        transition: TRANSITIONCONFIG.hoverend,
    },
    hover: {
        z: 60,
        scale: 1.02,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    rest: {
        z: 0,
        scale: 1,
        transition: TRANSITIONCONFIG.hoverend,
    },
    static: { z: 0, scale: 1 },
};

const griditemhoverVars = {
    initial: {
        opacity: 0,
        transition: TRANSITIONCONFIG.hoverend,
    },
    hover: ({ o = 1, d = hover } = {}) => ({
        opacity: o,
        transition: { duration: d, ease: 'easeOut' },
    }),
    rest: {
        opacity: 0,
        transition: TRANSITIONCONFIG.hoverend,
    },
    static: { opacity: 1, },
};

const AnimatedGridItem3D = memo(function AnimatedGridItem3D({ item, globalMouseX, globalMouseY }) {
    const [isEntrancing, setIsEntrancing] = useState(true);
    const timerRef = useRef(null);

    const handleViewportEnter = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsEntrancing(false);
        }, 2000);
    }, []);

    const handleViewportLeave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsEntrancing(true);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            initial: isNormal ? 'initial' : 'static',
            rest: isNormal ? 'rest' : 'static',
            hover: isNormal ? 'hover' : 'static',

            hidden: isNormal ? 'hidden' : "static",
            visible: isNormal ? 'visible' : "static",
        };
    }, [mode]);

    const itemRef = useRef(null);
    const rectRef = useRef(null);

    const localX = useTransform(globalMouseX, (latestX) => {
        if (!itemRef.current || !rectRef.current) return 0;
        const rect = rectRef.current;

        const pixelX = latestX * window.innerWidth;

        const isInside = pixelX >= rect.left && pixelX <= rect.right;
        if (!isInside) return 0;

        const relativeX = pixelX - rect.left;
        const value = (relativeX / rect.width) - 0.5;

        return Math.max(-0.5, Math.min(0.5, value));
    });

    const localY = useTransform(globalMouseY, (latestY) => {
        if (!itemRef.current || !rectRef.current) return 0;
        const rect = rectRef.current;

        const pixelY = latestY * window.innerHeight;

        const isInside = pixelY >= rect.top && pixelY <= rect.bottom;
        if (!isInside) return 0;

        const relativeY = pixelY - rect.top;
        const value = (relativeY / rect.height) - 0.5;

        return Math.max(-0.5, Math.min(0.5, value));
    });

    const springX = useSpring(useTransform(localY, [-0.5, 0.5], [12, -12]), SPRINGCONFIG.griditem3d);
    const springY = useSpring(useTransform(localX, [-0.5, 0.5], [-12, 12]), SPRINGCONFIG.griditem3d);

    const tiltStrength = useMotionValue(0);

    const hoverProgress = useMotionValue(0);
    const handleMouseEnter = useCallback(() => {
        if (isEntrancing) return;
        hoverProgress.set(1);
        if (itemRef.current) {
            rectRef.current = itemRef.current.getBoundingClientRect();
        }
        animate(tiltStrength, 1, { duration: 0.3, ease: "easeOut" });
    }, [isEntrancing]);

    const handleMouseLeave = useCallback(() => {
        hoverProgress.set(0);
        animate(tiltStrength, 0, { duration: 0.5, ease: "easeInOut" });
    }, []);

    const rotateX = useTransform([springX, tiltStrength], ([val, s]) => val * s);
    const rotateY = useTransform([springY, tiltStrength], ([val, s]) => val * s);

    const mousePX = useTransform(globalMouseX, (v) => {
        if (!rectRef.current) return '0px';
        const pixelX = (v * window.innerWidth) - rectRef.current.left;
        return `${pixelX}px`;
    });

    const mousePY = useTransform(globalMouseY, (v) => {
        if (!rectRef.current) return '0px';
        const pixelY = (v * window.innerHeight) - rectRef.current.top;
        return `${pixelY}px`;
    });

    return (
        <GridItem3D
            ref={itemRef}
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
            style={{
                rotateX: lesserThanSm ? 0 : rotateX,
                rotateY: lesserThanSm ? 0 : rotateY,
                '--mouse-x': mousePX,
                '--mouse-y': mousePY
            }}
            variants={item3dVars}
            initial={animationConfig.initial}
            animate={animationConfig.rest}
            whileInView={animationConfig.visible}
            whileHover={isEntrancing ? undefined : animationConfig.hover}
            onViewportEnter={handleViewportEnter}
            onViewportLeave={handleViewportLeave}
            viewport={{ once: false, amount: 0.2 }}
        >
            {/*<GridItemBorder
                variants={griditemhoverVars}
            />
            <Spotlight
                variants={griditemhoverVars}
            />*/}
            <GridItemBg
                variants={griditemhoverVars}
            >
                <Scanline />
            </GridItemBg>
            <AnimatedGridItemContent item={item} animationConfig={animationConfig}
                hoverProgress={hoverProgress}
            />
        </GridItem3D>
    );
});

const GridItemContent = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: '100%', height: '100%',
    borderRadius: 'inherit',
    padding: theme.spacing(4, 2),
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column-reverse',
    justifyContent: 'space-between', alignItems: 'center',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    WebkitFontSmoothing: "antialiased",
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const WireframeBg = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    outline: "1px solid transparent",
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
}));

const TextContainer = styled(MotionBox)(({ theme, align = 'auto' }) => ({
    position: 'relative',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    alignSelf: align,
}));

const TextHover = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const TextClip = styled(MotionBox)({
    overflow: 'hidden',
    display: 'block',
    lineHeight: 1.2,
});

const HeaderStyle = {
    fontWeight: 600,
    lineHeight: 0.9,
    fontFamily: 'Fraunces',
    textTransform: 'uppercase',
    fontSize: 'clamp(24px, 2.2vw + 17px, 26px)',
    whiteSpace: 'nowrap',
};

const SubHeaderStyle = {
    textTransform: 'uppercase',
    letterspacing: '0.15em',
    fontFamily: 'Antonio',
    fontSize: '22px',
    color: 'rgb(255,255,255)',
    whiteSpace: 'nowrap',
};

const TextShadow = styled(MotionBox)(({ theme, textstyle }) => ({
    position: 'absolute', inset: 0,
    ...textstyle,
    color: 'transparent',
    pointerEvents: 'none',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const ProjectionBeam = styled(MotionBox)({
    position: 'absolute',
    pointerEvents: 'none',
    contain: 'strict',
    transformStyle: 'flat',
    backfaceVisibility: 'hidden',
});

const ProjectionBeamTop = styled(ProjectionBeam)(({ theme, hexcolor = '#ffffff' }) => ({
    top: 0, left: '50%',
    width: '100%', height: 0,
    background: `linear-gradient(to bottom, ${hexcolor}, transparent)`,
    transform: 'translateX(-50%) rotateX(90deg)',
    transformOrigin: 'top',
    willChange: 'height',
    clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
}));

const ProjectionBeamBottom = styled(ProjectionBeam)(({ theme, hexcolor = '#ffffff' }) => ({
    bottom: 0, left: '50%',
    width: '100%', height: 0,
    background: `linear-gradient(to top, ${hexcolor}, transparent)`,
    transform: 'translateX(-50%) rotateX(-90deg)',
    transformOrigin: 'bottom',
    willChange: 'height',
    clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
}));

const ProjectionBeamLeft = styled(ProjectionBeam)(({ theme, hexcolor = '#ffffff' }) => ({
    top: 0, left: 0,
    width: 0, height: '100%',
    background: `linear-gradient(to right, ${hexcolor}, transparent)`,
    transform: 'rotateY(-90deg)',
    transformOrigin: 'left',
    willChange: 'width',
    clipPath: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)',
}));

const ProjectionBeamRight = styled(ProjectionBeam)(({ theme, hexcolor = '#ffffff' }) => ({
    top: 0, right: 0,
    width: 0, height: '100%',
    background: `linear-gradient(to left, ${hexcolor}, transparent)`,
    transform: 'rotateY(90deg)',
    transformOrigin: 'right',
    willChange: 'width',
    clipPath: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)',
}));

const Header = styled(MotionBox)(({ theme, textcolor = '#000000' }) => ({
    position: 'relative',
    ...HeaderStyle,
    color: textcolor,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const SubHeader = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    ...SubHeaderStyle,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const pagedelay = 1.6;

const itemcontentVars = {
    initial: {
        z: 0,
        transition: TRANSITIONCONFIG.hoverend,
    },
    hover: {
        z: 0,
        transition: {
            ...TRANSITIONCONFIG.hoverstart,
            staggerChildren: 0.15
        },
    },
    rest: {
        z: 0,
        transition: TRANSITIONCONFIG.hoverend,
    },
    visible: {
        transition: {
            delayChildren: pagedelay + 0.2,
            staggerChildren: 0.35
        }
    },
    static: { z: 0, },
};

const wireframeVars = {
    initial: {
        opacity: 0, z: 0,
        transition: TRANSITIONCONFIG.hoverbgend,
    },
    hover: {
        opacity: [0, 0.4, 0.2, 0.5, 0.4, 0.6],
        z: 60,
        transition: {
            z: TRANSITIONCONFIG.hoverbgstart,
            opacity: {
                ...TRANSITIONCONFIG.hoverbgstart,
                times: [0, 0.1, 0.2, 0.3, 0.4, 1]
            }
        }
    },
    rest: {
        opacity: 0, z: 0,
        transition: TRANSITIONCONFIG.hoverbgend,
    },
    static: { opacity: 0, z: 0, },
};

const projectionbeamheightVars = {
    initial: {
        opacity: 0, height: 0,
    },
    hover: {
        opacity: 0.2, height: '150px',
        transition: TRANSITIONCONFIG.hoverstart
    },
    static: { opacity: 0, height: 0 }
};

const projectionbeamwidthVars = {
    initial: {
        opacity: 0, width: 0,
    },
    hover: {
        opacity: 0.2, width: '150px',
        transition: TRANSITIONCONFIG.hoverstart
    },
    static: { opacity: 0, width: 0 }
};

const textshadowVars = {
    initial: {
        z: 0,
    },
    hover: {
        z: 0,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    static: { z: 0 },
};

const texthoverVars = {
    initial: {
        z: 0,
    },
    hover: {
        z: 150,
        transition: TRANSITIONCONFIG.hoverstart
    },
    rest: {
        z: 0,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    static: { z: 0 },
};

const headerVars = {
    initial: {
        textShadow: '2px 0px 0px rgba(255, 0, 0, 1), -2px 0px 0px rgba(0, 0, 255, 1)',
    },
    visible: {
        textShadow: '0px 0px 0px rgba(255, 0, 0, 0), 0px 0px 0px rgba(0, 0, 255, 0)',
        transition: {
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            delay: pagedelay - 0.2
        }
    },
    static: { textShadow: '0px 0px 0px rgba(255, 0, 0, 0), 0px 0px 0px rgba(0, 0, 255, 0)', },
};

const subheadershadowVars = {
    initial: {
        opacity: 0,
    },
    rest: {
        opacity: 1,
    },
    visible: {
        opacity: [0, 0, 1],
        transition: {
            duration: 0.7,
            times: [0, 0.8, 1],
            ease: 'easeOut',
        }
    },
    static: { opacity: 1 },
};

const subheaderVars = {
    initial: {
        opacity: 0,
        y: '100%',
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: 'easeIn',
        }
    },
    static: { opacity: 1, y: 0 },
};

const AnimatedGridItemContent = memo(function AnimatedGridItemContent({ item, animationConfig,
    hoverProgress
}) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const color = useMemo(() => hexToRgba(item.color, 0.9), [item.color]);

    const griditemRef = useRef(null);
    const griditemwidthRef = useRef(0);

    useLayoutEffect(() => {
        if (!griditemRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                griditemwidthRef.current = entry.contentRect.width;
            }
        });

        observer.observe(griditemRef.current);

        return () => observer.disconnect();
    }, []);

    const bgimage = useMemo(() => {
        return item.id === 1
            ? `url(${wireframe1})`
            : item.id === 2
                ? `url(${wireframe2})`
                : item.id === 3
                    ? `url(${wireframe3})`
                    : `url(${wireframe4})`
    }, []);

    return (
        <GridItemContent
            ref={griditemRef}
            variants={itemcontentVars}
        >
            {!lesserThanSm &&
                <>
                    <WireframeBg
                        variants={wireframeVars}
                        style={{
                            backgroundImage: bgimage,
                        }}
                    />
                    <LeaderLines
                        item={item}
                        griditemwidthRef={griditemwidthRef}
                        hoverProgress={hoverProgress}
                    />
                </>
            }
            <TextContainer align={'flex-start'} >
                <TextShadow
                    variants={textshadowVars}
                    style={{
                        textShadow: `
                            -1px 0px 0px rgba(255,0,0,0.5), 
                            1px 0px 0px rgba(0,255,255,0.5),
                            0px 0px 4px ${color}
                        `,
                    }}
                    textstyle={HeaderStyle}
                >
                    <ProjectionBeamTop
                        variants={projectionbeamheightVars}
                        hexcolor={item.color}
                    />
                    {/*<ProjectionBeamBottom
                        variants={projectionbeamheightVars}
                        hexcolor={item.color}
                    />
                    <ProjectionBeamLeft
                        variants={projectionbeamwidthVars}
                        hexcolor={item.color}
                    />*/}
                    <ProjectionBeamRight
                        variants={projectionbeamwidthVars}
                        hexcolor={item.color}
                    />
                    {item.title}
                </TextShadow>
                <TextHover
                    variants={texthoverVars}
                >
                    <Header
                        textcolor={item.color}
                        variants={headerVars}
                    >
                        {item.title}
                    </Header>
                </TextHover>
            </TextContainer>
            {item.id == 1 && !lesserThanSm && item.icons.map((v, i) => (
                <TextContainer>
                    <TextShadow
                        custom={i}
                        variants={textshadowVars}
                        style={{
                            textShadow: `
                                -1px 0px 0px rgba(255,0,0,0.5), 
                                1px 0px 0px rgba(0,255,255,0.5),
                                0px 0px 4px #ffffff
                            `,
                        }}
                        textstyle={SubHeaderStyle}
                    >
                        <MotionBox
                            variants={subheadershadowVars}
                        >
                            {v.name}
                        </MotionBox>
                    </TextShadow>
                    <TextHover
                        key={i}
                        custom={i}
                        variants={texthoverVars}
                    >
                        <TextClip>
                            <SubHeader
                                custom={i}
                                variants={subheaderVars}
                            >
                                {v.name}
                            </SubHeader>
                        </TextClip>
                    </TextHover>
                </TextContainer>
            ))}
        </GridItemContent>
    );
});

const StyledLeaderLine = styled(MotionSvg)({
    position: 'absolute',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    overflow: 'visible',
});

const StyledGlyphs = styled(MotionText)({
    position: 'absolute',
    fontSize: '8px',
    fontFamily: 'Spectral',
    letterSpacing: '1px',
    userSelect: 'none',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
});

const leaderlineVars = {
    initial: {
        pathLength: 0,
        opacity: 0,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    hover: {
        pathLength: 1,
        opacity: [0, 1, 0.2, 1, 0.6, 1],
        transition: {
            pathLength: TRANSITIONCONFIG.hoverstart,
            opacity: {
                ...TRANSITIONCONFIG.hoverstart,
                times: [0, 0.1, 0.4, 0.6, 0.8, 1]
            }
        }
    },
    rest: {
        pathLength: 0,
        opacity: 0,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    static: { pathLength: 1, opacity: 1 },
};

const GLYPHS = `アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌ
  フムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン
  01234567789ABCDEFGHIJKLMNOPQRSTUVWXYZ_&*+!?@#`;

const randomGlyphs = (count = 5) => Array.from({ length: count }, () =>
    GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
).join("");

const generateHudLines = (count = 4, width) => {
    return [...Array(count)].map((_, i) => {
        const isLeftSide = Math.random() > 0.5 ? true : false;
        const leftVal = isLeftSide
            ? Math.floor(Math.random() * (21)) + 20
            : Math.floor(Math.random() * (21)) + 70;

        const sectionHeight = 60 / count;
        const sectionStart = 20 + (i * sectionHeight);
        const topVal = sectionStart + (Math.random() * (sectionHeight * 0.8));
        const zVal = Math.floor(Math.random() * 20) + 50;

        const direction = leftVal < 50 ? -1 : 1;
        const length = width / 3 + Math.random() * 30;
        const bend = Math.random() > 0.5 ? 1 : -1;
        const endX = (length + 15) * direction;
        const bendY = bend * 10;
        const pathData = `M 0,0 L ${length * direction},0 L ${endX},${bendY}`;

        const glyphlength = Math.floor(Math.random() * 5) + 5;
        const glyph = randomGlyphs(glyphlength);

        return {
            id: `hud-line-${i}`,
            top: `${topVal}%`,
            left: `${leftVal}%`,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.2,
            z: zVal,
            direction: direction,
            endX: endX,
            bendY: bendY,
            pathData: pathData,
            glyphtext: glyph,
        };
    });
};

const LeaderLines = memo(function LeaderLines({ item, griditemwidthRef, hoverProgress }) {
    const [hudLines, setHudLines] = useState([]);

    const activeVariant = useMemo(() => hudLines.length > 0 ? 'hover' : 'rest', [hudLines]);

    useMotionValueEvent(hoverProgress, "change", (latest) => {
        if (latest === 1 && griditemwidthRef.current) {
            setHudLines(generateHudLines(4, griditemwidthRef.current));
        } else if (latest === 0) {
            setHudLines([]);
        }
    });

    return (
        <>
            {hudLines.map((line) => (
                <StyledLeaderLine
                    key={line.id}
                    width="100" height="100"
                    style={{
                        top: line.top,
                        left: line.left,
                        scale: line.scale,
                        opacity: line.opacity,
                        z: line.z,
                    }}
                    initial='initial'
                    animate={activeVariant}
                    exit='initial'
                >
                    <MotionPath
                        d={line.pathData}
                        fill="none"
                        stroke={item.shuttlecolor}
                        strokeWidth="1.5"
                        variants={leaderlineVars}
                    />
                    <StyledGlyphs
                        x={line.endX + (line.direction === 1 ? 5 : -5)}
                        y={line.bendY + (line.bendY > 0 ? 3 : -3)}
                        fill={item.shuttlecolor}
                        textAnchor={line.direction === 1 ? "start" : "end"}
                        dominantBaseline="middle"
                        variants={leaderlineVars}
                    >
                        {line.glyphtext}
                    </StyledGlyphs>
                </StyledLeaderLine>
            ))}
        </>
    );
});

const Modal = styled(MotionBox)(({ theme }) => ({
    position: 'fixed', inset: 0,
    zIndex: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backfaceVisibility: "hidden",
}));

const ModalContent = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    //perspective: '1000px',
    //transformStyle: "preserve-3d",
    willChange: 'transform, opacity',
    backfaceVisibility: "hidden",
    isolation: 'isolate',
}));

const ModalTitle = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2), left: theme.spacing(2),
    whiteSpace: 'nowrap',
    fontWeight: 800,
    letterSpacing: `0.05em`,
    lineHeight: 0.9,
    fontFamily: 'Cormorant Garamond',
    textTransform: 'uppercase',
    fontSize: '30px',
}));

const TitleGlow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: '10%', left: 0,
    width: '100%', height: '90%',
    filter: 'blur(12px)',
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
    //willChange: 'transform, opacity',
}));

const modalVars = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
};

const titleglowVars = {
    initial: { opacity: 0.4, scale: 0.4 },
    animate: {
        opacity: 1, scale: 1,
        transition: {
            duration: 2, ease: 'easeOut'
        },
    },
    static: { opacity: 1, scale: 1 },
};

const generateBootupLogs = (count = 5, wordlength = 15, dotlen) => {

    const letterstagger = Math.random() * 0.05 + 0.1;

    return [...Array(count)].map((_, i) => {
        const glyphlength = Math.floor(Math.random() * wordlength / 2) + Math.floor(wordlength / 3);
        const glyph = randomGlyphs(glyphlength);
        const dotlength = dotlen
            ? Math.floor(Math.random() * dotlen) + 2
            : wordlength - glyphlength;

        return {
            text: glyph + '.'.repeat(dotlength),
            length: glyphlength + dotlength,
            stagger: letterstagger
        };
    });
};

const AnimatedModal = memo(function AnimatedModal({ selectedItem, handleItemSelect }) {

    const handleModalClick = useCallback((e) => {
        const isInteractive = e.target.closest('[tap-interactive="true"]');
        if (isInteractive) {
            return;
        }
        handleItemSelect(null);
    }, []);

    return (
        <Modal
            variants={modalVars}
            initial='initial'
            animate='animate'
            exit='initial'
            onClick={handleModalClick}
        >
            <AnimatedModalBg
                selectedItem={selectedItem}
            />
            <ModalContent
                layoutId={`skillgriditem-${selectedItem.id}`}
                layout
                transition={{
                    layout: TRANSITIONCONFIG.layoutanimate
                }}
            >
                <ModalTitle
                    sx={{
                        color: selectedItem.color,
                    }}
                >
                    <TitleGlow
                        variants={titleglowVars}
                        initial='initial'
                        animate='animate'
                        style={{
                            background: hexToRgba(selectedItem.cardcolors[1], 0.4),
                        }}
                    />
                    {selectedItem.title}
                </ModalTitle>
                <AnimatedCard content={selectedItem} />
            </ModalContent>
        </Modal>
    );
});

const ModalBg = styled(MotionBox)(({ theme, bgcolor }) => ({
    position: 'absolute',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    //background: bgcolor,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    //willChange: 'transform, opacity',
    backfaceVisibility: "hidden",
}));

const ModalBootupText = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    width: 'fit-content', height: 'fit-content',
    display: 'flex', justifyContent: 'center',
    userSelect: 'none',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const BootupWord = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    fontSize: '8px',
    fontFamily: 'Spectral',
    letterSpacing: '1px',
    lineHeight: 2,
    userSelect: 'none',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const BootupLetter = styled(MotionSpan)(({
    display: 'inline-block',
    width: '0.8em',
    textAlign: 'center',
    userSelect: 'none',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));


const ModalBgImage = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    backgroundImage: `url(${modalbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const ModalBgRetinal = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: '50%', left: '50%',
    width: '150px', height: '150px',
    borderRadius: 'inherit',
    backgroundImage: `url(${modalbgretinal})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const modalbgVars = {
    initial: {
        opacity: 0,
        transition: TRANSITIONCONFIG.layoutanimate
    },
    animate: {
        opacity: 1,
        transition: TRANSITIONCONFIG.layoutanimate
    },
};

const modalbgimageVars = {
    initial: {
        opacity: 0,
        transition: TRANSITIONCONFIG.layoutbg
    },
    animate: {
        opacity: [0, 0.6, 0.2, 0.6, 0.4, 0.6],
        transition: {
            ...TRANSITIONCONFIG.layoutbg,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
    },
};

const bootuptextVars = {
    initial: {
        opacity: 0,
        transition: TRANSITIONCONFIG.layoutanimate
    },
    animate: (wordstagger = 3) => ({
        opacity: 1,
        transition: {
            when: "beforeChildren",
            ...TRANSITIONCONFIG.layoutanimate,
            staggerChildren: wordstagger,
        }
    }),
};

const bootupwordVars = {
    initial: {
        opacity: 0,
        transition: TRANSITIONCONFIG.layoutanimate
    },
    animate: ({ length, stagger } = {}) => ({
        opacity: [0, 0.8, 0.2, 0.8, 0.4, 0.8],
        transition: {
            staggerChildren: stagger || 0.2,
            opacity: {
                duration: length * stagger || 3,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                ease: 'easeOut',
            }
        }
    }),
};

const bootupletterVars = {
    initial: {
        opacity: 0,
    },
    animate: (stagger = 0.2) => ({
        opacity: 1,
        transition: {
            duration: stagger,
            ease: 'easeOut',
        }
    }),
};

const AnimatedModalBg = memo(function AnimatedModalBg({ selectedItem }) {

    const rotation = useMotionValue(0);
    const opacity = useMotionValue(0);

    const runRetinalBootup = useCallback(async (delay = 0, totalduration = 2.5) => {

        const runOpacity = async () => {
            opacity.set(0);
            await animate(opacity, 1, {
                delay: delay,
                duration: 0.1,
                ease: "linear"
            }).finished;
            await animate(opacity, 0, {
                delay: 1.4 * totalduration,
                duration: 0.2 * totalduration,
                ease: "easeOut"
            }).finished;
        };

        const runRotate = async () => {

            const rotate = (target, delay, duration, ease) =>
                animate(rotation, target, { delay: delay, duration: duration, ease: ease }).finished;

            await rotate(-20, delay, 0.12 * totalduration, "easeOut");

            await rotate(135, 0, 0.48 * totalduration, "easeInOut");
            await rotate(130, 0, 0.04 * totalduration, "linear");
            await rotate(135, 0, 0.04 * totalduration, "linear");

            await rotate(360, 0, 0.72 * totalduration, "easeInOut");
        };

        await Promise.all([runOpacity(), runRotate()]);
    }, []);

    useEffect(() => {
        runRetinalBootup(layoutduration + 0.2, 3);
    }, []);

    const bootupLogsLeft = useMemo(() => generateBootupLogs(6, 12, 3), []);
    const bootupLogsRight = useMemo(() => generateBootupLogs(6, 12, 3), []);

    return (
        <ModalBg
            variants={modalbgVars}
            bgcolor={hexToRgba(selectedItem.cardcolors[1], 0.15)}
        >
            {/*<GrainOverlay />*/}
            <ModalBgImage
                variants={modalbgimageVars}
            />
            <ModalBgRetinal
                style={{
                    x: '-50%',
                    y: '-50%',
                    opacity: opacity,
                    rotate: rotation
                }}
            />
            <ModalBootupText
                custom={bootupLogsLeft[0]?.length * bootupLogsLeft[0]?.stagger}
                variants={bootuptextVars}
                sx={{
                    bottom: 0,
                    paddingBottom: '16px', paddingLeft: '16px',
                    flexDirection: 'column-reverse', alignItems: 'flex-start',
                    color: selectedItem.cardcolors[1],
                }}
            >
                {bootupLogsLeft.map((text, i) => (
                    <BootupWord
                        key={i}
                        custom={{ length: text.length, stagger: text.stagger }}
                        variants={bootupwordVars}
                    >
                        {text.text?.split('').map((letter, i) => (
                            <BootupLetter
                                key={i}
                                custom={text.stagger}
                                variants={bootupletterVars}
                            >
                                {letter}
                            </BootupLetter>
                        ))}
                    </BootupWord>
                ))}
            </ModalBootupText>
            <ModalBootupText
                custom={bootupLogsRight[0]?.length * bootupLogsRight[0]?.stagger}
                variants={bootuptextVars}
                sx={{
                    top: 0, right: 0,
                    paddingTop: '16px', paddingRight: '16px',
                    flexDirection: 'column', alignItems: 'flex-start',
                    direction: 'rtl',
                    color: selectedItem.cardcolors[1],
                }}
            >
                {bootupLogsRight.map((text, i) => (
                    <BootupWord
                        key={i}
                        custom={{ length: text.length, stagger: text.stagger }}
                        variants={bootupwordVars}
                    >
                        {text.text?.split('').map((letter, i) => (
                            <BootupLetter
                                key={i}
                                custom={text.stagger}
                                variants={bootupletterVars}
                            >
                                {letter}
                            </BootupLetter>
                        ))}
                    </BootupWord>
                ))}
            </ModalBootupText>
        </ModalBg>
    );
});

const startRadius = 90;
const nodeRadius = 170;
const centerX = 170;
const centerY = 170;

const getPositionsConfig = (count, jitterAmount = 20) => {
    return Array.from({ length: count }).map((_, i) => {
        const angle = (i * (360 / count) - 90) * (Math.PI / 180);

        const jitterX = Math.sin(i * 12.34) * jitterAmount;
        const jitterY = Math.cos(i * 56.78) * jitterAmount;

        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        const startx = centerX + startRadius * cosAngle;
        const starty = centerY + startRadius * sinAngle;
        const endx = centerX + (nodeRadius * cosAngle) + jitterX;
        const endy = centerY + (nodeRadius * sinAngle) + jitterY;

        const midx = startx + (endx - startx) / 2;
        const pathdata = `M ${startx} ${starty} L ${midx} ${starty} L ${midx} ${endy} L ${endx} ${endy}`;

        return {
            startx: startx,
            starty: starty,
            endx: endx,
            endy: endy,
            pathdata: pathdata,
            midx: midx,
        };
    });
};

const ICON_LAYOUTS = SKILLS_DATA.reduce((acc, skill) => {
    acc[skill.title] = getPositionsConfig(skill.icons.length);
    return acc;
}, {});

const StyledCard = styled(Box)(({ theme }) => ({
    width: '90%', maxWidth: 675, height: 450,
    borderRadius: 'inherit', padding: theme.spacing(4),
    color: 'rgba(0,0,0,1)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(0),
    },
}));

const CardContentContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: `${nodeRadius * 2}px`,
    height: `${nodeRadius * 2}px`,
    borderRadius: 'inherit',
    backfaceVisibility: "hidden",
    perspective: '1000px',
    transformStyle: 'preserve-3d',
}));

const cardcontentVars = {
    initial: {
        opacity: 0, scale: 1.2, y: -20,
    },
    animate: {
        opacity: 1, scale: 1, y: 0,
        transition: {
            delay: layoutduration,
            type: 'spring', stiffness: 80, damping: 10,
        }
    },
    static: { opacity: 1, scale: 1, y: 0, }
};

const AnimatedCard = memo(function AnimatedCard({ content = {} }) {
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const positions = ICON_LAYOUTS[content.title] || [];

    const positionsConfig = useMemo(() => {
        if (!content.icons) return [];

        return content.icons.map((icon, i) => ({
            ...icon,
            ...positions[i],
            color: content.cardcolors[1],
        }));
    }, [content.title]);

    const transitionsConfig = useMemo(() =>
        Array.from({ length: positionsConfig.length }, () =>
        ({
            delay: layoutduration + 0.2 + Math.random(),
            duration: 1.8 + Math.random(),
            ease: 'easeOut',
        }),
        ), []);

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            initial: isNormal ? 'initial' : "static",
            animate: isNormal ? 'animate' : "static",
        };
    }, [mode]);

    const handleHovered = useCallback((v) => {
        setHoveredIcon(v);
    }, [setHoveredIcon])

    return (
        <StyledCard>
            <CardContentContainer
                variants={cardcontentVars}
                initial={animationConfig.initial}
                animate={animationConfig.animate}
            >
                <CircuitLines
                    positionsConfig={positionsConfig}
                    transitionsConfig={transitionsConfig}
                />
                {positionsConfig.map((icon, i) => (
                    <AnimatedIcon key={i} icon={icon} i={i}
                        handleHovered={handleHovered}
                        transition={transitionsConfig[i]}
                    />
                ))}
                {hoveredIcon &&
                    <CenterIcon icon={hoveredIcon} content={content}
                        animationConfig={animationConfig}
                    />
                }
            </CardContentContainer>
        </StyledCard>
    );
});

const CircuitLinesContainer = styled(MotionSvg)(({ theme }) => ({
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    overflow: 'visible',
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
}));

const circuitVars = {
    initial: {
        pathLength: 0, opacity: 0
    },
    animate: (transition = {}) => ({
        pathLength: 1,
        opacity: 1,
        transition: transition
    }),
    static: { pathLength: 1, opacity: 1 }
};

const circuitendVars = {
    initial: {
        opacity: 0
    },
    animate: (transition = {}) => ({
        opacity: [0, 0.2, 1],
        transition: {
            ...transition,
            times: [0, 0.8, 1]
        }
    }),
    static: { opacity: 1 }
};

const CircuitLines = memo(function CircuitLines({ positionsConfig, transitionsConfig }) {

    return (
        <CircuitLinesContainer>
            {positionsConfig.map((v, i) => (
                <>
                    <MotionPath
                        key={i}
                        custom={transitionsConfig[i]}
                        variants={circuitVars}
                        d={v.pathdata}
                        fill="none"
                        stroke={v.color}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                    <circle
                        key={`s-${i}`}
                        cx={v.startx}
                        cy={v.starty}
                        r={2}
                        fill="none"
                        stroke={v.color}
                        strokeWidth={1}
                    />
                    <MotionCircle
                        key={`e-${i}`}
                        custom={transitionsConfig[i]}
                        variants={circuitendVars}
                        cx={v.endx}
                        cy={v.endy}
                        r={2}
                        fill={v.color}
                    />
                </>
            ))}
        </CircuitLinesContainer>
    );
});

const NodeContainer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    //borderRadius: '50%',
    backfaceVisibility: "hidden",
}));

const NodeEntrance = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    borderRadius: 'inherit',
    backfaceVisibility: "hidden",
}));

const HoverShadow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: '10%', left: '10%',
    width: '100%', height: '100%',
    borderRadius: 'inherit',
    background: 'radial-gradient(circle, rgb(0,0,0), transparent 70%)',
    filter: 'blur(8px)',
    opacity: 'inherit',
    backfaceVisibility: "hidden",
    zIndex: -1,
}));

const HoverWrapper = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: '100%', height: '100%',
    borderRadius: 'inherit',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    background: 'rgb(250,250,250)',
    backfaceVisibility: "hidden",
    cursor: 'pointer',
    zIndex: 1,
}));

const IconText = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    display: 'flex', flexDirection: 'column',
    fontSize: 'clamp(16px, 2vw + 1rem, 18px)',
    fontWeight: 'bold',
    fontFamily: 'Spectral',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
    cursor: 'default',
}));

const WordBlock = styled('div')(({
    display: 'flex',
    justifyContent: 'center',
}));

const entranceVars = {
    initial: {
        opacity: 0,
    },
    animate: (transition = {}) => ({
        opacity: 1,
        transition: {
            ...transition,
        }
    }),
    static: { opacity: 1, },
};

const AnimatedIcon = memo(function AnimatedIcon({ icon, i, handleHovered, transition }) {

    const { manual, system } = useAnimateContext();
    const isNormal = ((system || manual) === 'normal');

    const animationConfig = useMemo(() => {
        return {
            animate: isNormal ? 'animate' : "static",
        };
    }, [isNormal]);

    const { textX, textY } = useMemo(() => {
        const horizontalTextAlignment = icon.startx - icon.midx !== 0;

        let x = 0;
        let y = 0;

        if (horizontalTextAlignment) {
            x = (icon.endx < icon.midx) ? '-50%' : '50%';
            y = 0;
        } else {
            x = 0;

            const isPointingUp = icon.endy < icon.starty;
            if (isPointingUp) {
                y = '-50%';
            } else {
                y = '50%';
            }
        }

        return { textX: x, textY: y };
    }, [icon.endx, icon.midx, icon.startx, icon.endy]);

    const handleTap = useCallback((e, v) => {
        e.stopPropagation();
        handleHovered(v);
    }, []);

    return (
        <NodeContainer
            tap-interactive="true"
            whileHover={{ zIndex: 5 }}
            onTap={(e) => handleTap(e, icon)}
            onHoverStart={() => handleHovered(icon)}
            onHoverEnd={() => handleHovered(null)}
            style={{
                x: icon.endx,
                y: icon.endy,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            <NodeEntrance
            //custom={transition}
            //variants={entranceVars}
            //initial='initial'
            //animate={animationConfig.animate}
            >
                <IconText
                    style={{
                        translateX: textX,
                        translateY: textY,
                    }}
                >
                    {icon.name.split(' ').map((word, i) => (
                        <WordBlock key={i} >
                            {word.split('').map((char, i) => (
                                <FallingLetter
                                    key={i}
                                    char={char}
                                    color={icon.color}
                                    delay={i * 200}
                                />
                            ))}
                        </WordBlock>
                    ))}
                </IconText>
            </NodeEntrance>
        </NodeContainer>
    );
});

const AnimatedLetter = styled(MotionSpan)(({
    display: 'inline-block',
    width: '0.8em',
    textAlign: 'center',
}));

const letterentranceVars = {
    initial: ({ direction, height }) => ({
        opacity: 0,
        y: direction * 15 * (height + 1)
    }),
    animate: ({ direction, height }) => ({
        opacity: 1,
        y: direction * 15 * height,
        transition: { duration: 0.3 }
    }),
    static: { opacity: 1, y: 0 },
};

const FallingLetter = ({ char, color, delay }) => {
    const [displayChar, setDisplayChar] = useState('');
    const [height, setHeight] = useState(4);
    const [isLocked, setIsLocked] = useState(false);

    const direction = useMemo(() => (Math.random() > 0.5 ? 1 : -1), []);

    useEffect(() => {
        const timeoutIds = [];

        const sequence = Array.from({ length: 5 }).map((_, i) => {
            if (i === 4) return { char: char, delay: i * 300 };
            return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], delay: i * 300 };
        });


        sequence.forEach((step, index) => {
            const id = setTimeout(() => {
                setDisplayChar(step.char);
                setHeight(4 - index);
                if (index === sequence.length - 1) setIsLocked(true);
            }, delay + step.delay);

            timeoutIds.push(id);
        });

        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, [char, delay]);

    return (
        <AnimatedLetter
            custom={{ direction: direction, height: height }}
            variants={letterentranceVars}
            initial="initial"
            animate="animate"
            style={{
                color: isLocked ? color : '#acd9ec',
            }}
        >
            {displayChar}
        </AnimatedLetter>
    );
};

const CenterContainer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backfaceVisibility: "hidden",
}));

const HoverGlow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    filter: 'blur(12px)',
    backfaceVisibility: "hidden",
}));

const CenterIconContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: 56, height: 56,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    borderRadius: 'inherit',
    opacity: 0.6,
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
    backfaceVisibility: "hidden",
}));

const StyledIcon = styled('img')(({ theme }) => ({
    width: 48, height: 48,
    background: 'transparent',
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 40, height: 40,
    },
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
}));

const AnimatedText = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    fontSize: '18px',
    letterSpacing: `0.07em`,
    textTransform: 'Capitalize',
    fontFamily: 'DM Serif Display',
    color: '#ffffff',
    textAlign: 'center',
    backfaceVisibility: "hidden",
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
    textShadow: `
        0 0 4px rgba(0, 0, 0, 0.8),
        1px 0 0 rgba(255, 0, 255, 0.7), 
        -1px 0 0 rgba(0, 255, 255, 0.7)
    `,
}));

const centerTransition = { type: "spring", stiffness: 300, damping: 20 };

const centerVars = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { delay: 0 }
    },
    static: { opacity: 1, transition: { duration: 0 } },
};

const centerGlowVars = {
    initial: { opacity: 0, scale: 1 },
    animate: {
        opacity: 0.2, scale: 2,
        transition: { delay: 0.35 }
    },
    static: { opacity: 1, scale: 1.5, transition: { duration: 0 } },
};

const centericonVars = {
    initial: { opacity: 0, scale: 1.5, y: -50 },
    animate: {
        opacity: 0.6, scale: 1.5, y: 0,
        transition: centerTransition
    },
    static: { opacity: 1, scale: 1.5, y: 0, transition: { duration: 0 } },
};

const centertextVars = {
    initial: { opacity: 0, scale: 1.5, y: 50 },
    animate: {
        opacity: 1, scale: 1.5, y: 0,
        transition: centerTransition
    },
    static: { opacity: 1, scale: 1.5, y: 0, transition: { duration: 0 } },
};

const CenterIcon = memo(function CenterIcon({ icon, content, animationConfig }) {

    return (
        <CenterContainer
            variants={centerVars}
            initial={animationConfig.initial}
            animate={animationConfig.animate}
        >
            <HoverGlow
                variants={centerGlowVars}
                sx={{
                    background: content.cardcolors[2],
                }}
            />
            <CenterIconContainer
                variants={centericonVars}
            >
                <GlassOverlay />
                <StyledIcon
                    src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                    alt={icon.name}
                />
            </CenterIconContainer>
            <AnimatedText
                variants={centertextVars}
            >
                {icon.desc}
            </AnimatedText>
        </CenterContainer >
    );
});

const SvgDefs = memo(function SvgDefs() {
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <radialGradient
                    id="strokeGlow"
                    cx="0.5" cy="0.5" r="0.5"
                    fx="0.5" fy="0.5"
                    gradientUnits="objectBoundingBox"
                >
                    <stop offset="85%" stopColor="rgba(0, 210, 255, 1)" />
                    <stop offset="100%" stopColor="rgba(0, 210, 255, 0)" />
                </radialGradient>
                <radialGradient
                    id="glintGradient"
                    cx="15" cy="15" r="15"
                    fx="15" fy="15"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>
                <radialGradient
                    id="shadowGradient"
                    gradientUnits="objectBoundingBox"
                    cx="0.15" cy="0.15"
                    fx="0.15" fy="0.15"
                    r="0.8"
                >
                    <stop offset="0%" stopColor="rgba(0, 0, 0, 1)" />
                    <stop offset="60%" stopColor="rgba(0, 0, 0, 1)" />
                    <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>
            </defs>
        </svg>
    );
});