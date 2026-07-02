import React, {
    useEffect, useLayoutEffect, useState, useRef,
    useCallback, useMemo, memo
} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    motion, AnimatePresence, useMotionValue, useMotionValueEvent,
    useSpring, useTransform, animate, useInView,
} from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import { useStateContext } from './StateContext';
import GlassOverlay from './GlassOverlay';
import SvgGlow from './SvgGlow';
import SvgSplitColor, { SvgSplitShadow, SvgBorder } from './SvgSplitColor';
import GrainOverlay from './GrainOverlay';
import hexToRgba from '../functions/hexToRgba';
import wireframe1 from '../pics/wireframe1.webp';
import wireframe2 from '../pics/wireframe2.webp';
import wireframe3 from '../pics/wireframe3.webp';
import wireframe4 from '../pics/wireframe4.webp';
import modalbgretinal from '../pics/hudretinal.webp';
import { getWindowWidth } from '../functions/getWindowDim';
import ionizationmask from '../pics/ionizationmask2.webp';


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
                file: 'threejs', name: 'Threejs',
                desc: 'Immersive 3D experience via WebGL and GLSL.'
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
                file: 'emotion', name: 'Emotion',
                desc: 'Component-driven, themable UIs with strict design system fidelity.'
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
    shadowhoverstart: { delay: 1, duration: 2.5 * hover, ease: 'easeOut' },
    hoverend: { duration: hover, ease: 'easeOut' },

    layoutbg: {
        delay: layoutduration, duration: modalbootupduration, ease: 'easeOut'
    },
    layoutbganimate: {
        duration: layoutduration + 0.8, ease: 'easeOut'
    },
    layoutanimate: { duration: layoutduration, ease: 'easeOut' },
};

export default function SkillsCard() {

    const { manual, system, lesserThanSm } = useAnimateContext();
    const mode = system || manual;

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            hidden: isNormal ? 'hidden' : "static",
            visible: isNormal ? 'visible' : "static",
        };
    }, [mode]);

    const { windowDimRef, mouseX, mouseY } = useAnimateContext();

    if (lesserThanSm) {
        return (
            <GridContainerSm
                variants={containerVars}
                initial={animationConfig.hidden}
                whileInView={animationConfig.visible}
                viewport={{ once: false, amount: 0.5 }}
            >
                <BentoGrid
                    globalMouseX={mouseX}
                    globalMouseY={mouseY}
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
            <BentoGrid
                globalMouseX={mouseX}
                globalMouseY={mouseY}
            />
        </GridContainer>
    );
}

const BentoGrid = memo(function BentoGrid({ globalMouseX, globalMouseY }) {
    const [lastSelectedId, setLastSelectedId] = useState(null);

    const { activeSkillsId, setActiveSkillsId } = useStateContext();

    const selectedItem = useMemo(() => {
        if (!activeSkillsId) return {};

        return SKILLS_DATA.find(i => i.id === activeSkillsId) || {};
    }, [activeSkillsId]);

    const selectedIdRef = useRef(activeSkillsId);
    useEffect(() => { selectedIdRef.current = activeSkillsId; }, [activeSkillsId]);

    const handleItemSelect = useCallback((id) => {
        if (id === null) {
            setLastSelectedId(selectedIdRef.current);
        }
        setActiveSkillsId(id);
    }, []);

    const lastSelectedIdRef = useRef(lastSelectedId);
    useEffect(() => { lastSelectedIdRef.current = lastSelectedId; }, [lastSelectedId]);
    const handleGridAnimationComplete = useCallback((id) => {
        if (id === lastSelectedIdRef.current) setLastSelectedId(null);
    }, []);

    return (
        <>
            {SKILLS_DATA.map((item, _) => (
                <AnimatedGridItem
                    key={item.id}
                    item={item}
                    selectedId={activeSkillsId} lastSelectedId={lastSelectedId}
                    handleItemSelect={handleItemSelect}
                    handleGridAnimationComplete={handleGridAnimationComplete}
                    globalMouseX={globalMouseX}
                    globalMouseY={globalMouseY}
                />
            ))}

            {activeSkillsId && (
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
    const [isEntrancing, setIsEntrancing] = useState(true);
    const timerRef = useRef(null);

    const handleViewportEnter = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsEntrancing(false);
        }, 1000);
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

    const itemRef = useRef(null);
    const rectRef = useRef(null);

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

    return (
        <GridItemContainer
            //variants={itemVars}
            ref={itemRef}
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
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
            onViewportEnter={handleViewportEnter}
            onViewportLeave={handleViewportLeave}
            viewport={{ once: false, amount: 0.2 }}
            style={{
                gridArea: gridMap[item.id] || 'a',
                zIndex: (selectedId === item.id || lastSelectedId === item.id) ? 10 : 1,
            }}
        >
            <AnimatedGridItem3D item={item}
                globalMouseX={globalMouseX}
                globalMouseY={globalMouseY}
                itemRef={itemRef} rectRef={rectRef}
                hoverProgress={hoverProgress}
                tiltStrength={tiltStrength}
                isEntrancing={isEntrancing}
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

const GridItemBorder = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    inset: `-${BORDER}px`,
    background: `radial-gradient(
        300px circle at var(--mouse-x) var(--mouse-y), 
        #ffffff, 
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

const AnimatedGridItem3D = memo(function AnimatedGridItem3D({ item, globalMouseX, globalMouseY,
    itemRef, rectRef, hoverProgress, tiltStrength, isEntrancing
}) {

    const { manual, system, lesserThanSm } = useAnimateContext();
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

    const { windowDimRef } = useAnimateContext();

    const localX = useTransform(globalMouseX, (latestX) => {
        if (!windowDimRef.current || !itemRef.current || !rectRef.current) return 0;
        const rect = rectRef.current;

        const pixelX = latestX * windowDimRef.current.w;

        const isInside = pixelX >= rect.left && pixelX <= rect.right;
        if (!isInside) return 0;

        const relativeX = pixelX - rect.left;
        const value = (relativeX / rect.width) - 0.5;

        return Math.max(-0.5, Math.min(0.5, value));
    });

    const localY = useTransform(globalMouseY, (latestY) => {
        if (!windowDimRef.current || !itemRef.current || !rectRef.current) return 0;
        const rect = rectRef.current;

        const pixelY = latestY * windowDimRef.current.h;

        const isInside = pixelY >= rect.top && pixelY <= rect.bottom;
        if (!isInside) return 0;

        const relativeY = pixelY - rect.top;
        const value = (relativeY / rect.height) - 0.5;

        return Math.max(-0.5, Math.min(0.5, value));
    });

    const springX = useSpring(useTransform(localY, [-0.5, 0.5], [12, -12]), SPRINGCONFIG.griditem3d);
    const springY = useSpring(useTransform(localX, [-0.5, 0.5], [-12, 12]), SPRINGCONFIG.griditem3d);

    const rotateX = useTransform([springX, tiltStrength], ([val, s]) => val * s);
    const rotateY = useTransform([springY, tiltStrength], ([val, s]) => val * s);

    const mousePX = useTransform(globalMouseX, (v) => {
        if (!windowDimRef.current || !rectRef.current) return '0px';
        const pixelX = (v * windowDimRef.current.w) - rectRef.current.left;
        return `${pixelX}px`;
    });

    const mousePY = useTransform(globalMouseY, (v) => {
        if (!windowDimRef.current || !rectRef.current) return '0px';
        const pixelY = (v * windowDimRef.current.h) - rectRef.current.top;
        return `${pixelY}px`;
    });

    return (
        <GridItem3D
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
        >
            {/*<GridItemBorder
                variants={griditemhoverVars}
            />*/}
            <Spotlight
                variants={griditemhoverVars}
            />
            <GridItemBg
                variants={griditemhoverVars}
            />
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
const wireframez = 90;

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

const textcontainerVars = {
    initial: {
        z: 0,
    },
    hover: {
        z: 30,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    rest: {
        z: 0,
        transition: TRANSITIONCONFIG.hoverstart,
    },
    static: { z: 0 },
};

const textshadowVars = {
    initial: {
        z: 0, opacity: 1,
    },
    hover: {
        z: 0, opacity: 0,
        transition: TRANSITIONCONFIG.shadowhoverstart,
    },
    rest: {
        z: 0, opacity: 1,
        transition: TRANSITIONCONFIG.shadowhoverstart,
    },
    static: { z: 0, opacity: 1, },
};

const texthoverVars = {
    initial: {
        z: 0,
    },
    hover: (z = 90) => ({
        z: z,
        transition: TRANSITIONCONFIG.hoverstart
    }),
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

    const { lesserThanSm, lesserThanMd } = useAnimateContext();

    const color = useMemo(() => hexToRgba(item.color, 0.9), [item.color]);
    const textalign = useMemo(() =>
        lesserThanSm ? 'center'
            : lesserThanMd ? 'flex-end' : 'flex-start'
        , [lesserThanSm, lesserThanMd])

    return (
        <GridItemContent
            variants={itemcontentVars}
        >
            <TextContainer
                variants={textcontainerVars}
                align={textalign}
            >
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
                    <ProjectionBeamRight
                        variants={projectionbeamwidthVars}
                        hexcolor={item.color}
                    />
                    {item.title}
                </TextShadow>
                <TextHover
                    custom={120}
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
                <TextContainer
                    variants={textcontainerVars}
                >
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
                        custom={90}
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

const GLYPHS = `アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌ
  フムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン
  01234567789ABCDEFGHIJKLMNOPQRSTUVWXYZ_&*+!?@#`;

const randomGlyphs = (count = 5) => Array.from({ length: count }, () =>
    GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
).join("");

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

const ModalBg = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    backfaceVisibility: "hidden",
}));

const WireframeAnimate = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    transformStyle: "preserve-3d",
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
    //zIndex: -1,
}));

const IonizationLayer = styled(MotionBox)({
    position: 'fixed', inset: 0,
    zIndex: 10,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity, mask-size',
    transform: 'translateZ(0)',

    maskImage: `url(${ionizationmask})`,
    maskRepeat: 'repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskSize: '100px',
});

const MaskedImage = styled(MotionBox)(({ theme }) => ({
    width: '100%', height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const Wireframe = styled(MotionBox)(({ theme }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    backgroundSize: '90% 90%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    outline: "1px solid transparent",
    transformStyle: "preserve-3d",
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
    maskImage: `
        linear-gradient(to right, transparent 10%, black 20%, black 80%, transparent 90%), 
        linear-gradient(to bottom, transparent 10%, black 20%, black 80%, transparent 90%)`,
    WebkitMaskImage: `
        linear-gradient(to right, transparent 10%, black 20%, black 80%, transparent 90%), 
        linear-gradient(to bottom, transparent 10%, black 20%, black 80%, transparent 90%)`,
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
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

const ModalBgRetinal = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: '50%', left: '50%',
    width: '150px', height: '150px',
    borderRadius: 'inherit',
    backgroundImage: `url(${modalbgretinal})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transformOrigin: 'center center',
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

const scale = 1.4;
const ionizationVars = {
    initial: {
        opacity: 0, scale: scale,
        rotate: -5, z: wireframez, filter: "blur(8px) brightness(200%)",
    },
    animate: {
        opacity: [0, 1, 0], scale: 1,
        rotate: 0, z: wireframez, filter: "blur(0px) brightness(100%)",
        transition: {
            ...TRANSITIONCONFIG.layoutbganimate,
            opacity: {
                duration: 6 * hover,
                times: [0, 0.17, 1]
            },
        },
    },
    rest: {
        opacity: [0, 1, 0], scale: scale,
        rotate: -5, z: wireframez, filter: "blur(8px) brightness(200%)",
        transition: {
            ...TRANSITIONCONFIG.layoutbganimate,
            times: [0, 0.4, 1]
        },
    },
    static: { opacity: 0, scale: 1, rotate: 0, z: 0, filter: 'blur(0px) brightness(100%)' },
};

const wireframeVars = {
    initial: {
        opacity: 0, scale: scale, z: wireframez,
        transition: TRANSITIONCONFIG.layoutbganimate,
    },
    animate: {
        opacity: [0, 0, 0.6],
        scale: 1,
        z: wireframez,
        transition: {
            ...TRANSITIONCONFIG.layoutbganimate,
            times: [0, 0.3, 1]
        }
    },
    rest: {
        opacity: [0.6, 0, 0], scale: scale, z: wireframez,
        transition: {
            ...TRANSITIONCONFIG.layoutbganimate,
            times: [0, 0.4, 1]
        }
    },
    static: { opacity: 0, scale: 1, z: 0, },
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

    const { lesserThanSm } = useAnimateContext();
    const windowWidth = getWindowWidth();
    const responsivescale = useTransform(windowWidth, (w) => {
        if (!lesserThanSm) return 1;
        return Math.min(w / 400, 1);
    });

    const wireframeimage = useMemo(() => {
        return selectedItem.id === 1
            ? `url(${wireframe1})`
            : selectedItem.id === 2
                ? `url(${wireframe2})`
                : selectedItem.id === 3
                    ? `url(${wireframe3})`
                    : `url(${wireframe4})`
    }, []);

    return (
        <ModalBg
            variants={modalbgVars}
        >
            <GrainOverlay
                bgcolor={'#000000'}
                contrast={'200%'}
                opacity={0.75}
                zIndex={0}
            />
            {!lesserThanSm &&
                <WireframeAnimate
                    initial='initial'
                    animate='animate'
                    exit='rest'
                >
                    <IonizationLayer
                        variants={ionizationVars}
                    >
                        <MaskedImage
                            style={{ backgroundImage: wireframeimage }}
                        />
                    </IonizationLayer>
                    <Wireframe
                        variants={wireframeVars}
                        style={{ backgroundImage: wireframeimage }}
                    />
                </WireframeAnimate>
            }
            <ModalBgRetinal
                style={{
                    x: '-50%',
                    y: '-50%',
                    opacity: opacity,
                    rotate: rotation,
                    scale: responsivescale
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

    const generatePath = (startx, starty, midx, endx, endy) => {
        return `M ${startx} ${starty} L ${midx} ${starty} L ${midx} ${endy} L ${endx} ${endy}`;
    };

    const mobile = Array.from({ length: count }).map((_, i) => {
        const colGap = 130;
        const rowHeight = 70;
        const verticalOffset = (count / 2) * rowHeight / 2;

        const col = i % 2;
        const row = Math.floor(i / 2);

        const jitterX = (Math.random() - 0.5) * jitterAmount;
        const jitterY = (Math.random() - 0.5) * jitterAmount;
        const colOffset = col === 0 ? 0 : 20;

        const startx = centerX;
        const starty = centerY;
        const endx = centerX + (col === 0 ? -colGap : colGap) + jitterX;
        const endy = (centerY - verticalOffset) + (row * rowHeight) + colOffset + jitterY;
        const midx = startx + (endx - startx) / 2;

        return {
            startx, starty, midx, endx, endy,
            pathdata: generatePath(startx, starty, midx, endx, endy)
        };
    });

    const notmobile = Array.from({ length: count }).map((_, i) => {
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

        return {
            startx, starty, midx, endx, endy,
            pathdata: generatePath(startx, starty, midx, endx, endy)
        };
    });

    return { mobile, notmobile };
};

const NODE_LAYOUTS = SKILLS_DATA.reduce((acc, skill) => {
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

const ResponsiveContainer = styled(MotionBox)(({ theme }) => ({
    //position: 'relative',
    width: `${nodeRadius * 2}px`,
    height: `${nodeRadius * 2}px`,
    borderRadius: 'inherit',
    transformOrigin: 'center center',
    transformStyle: 'preserve-3d',
    backfaceVisibility: "hidden",
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

    const { manual, system, lesserThanSm } = useAnimateContext();
    const mode = system || manual;

    const positions = useMemo(() => {
        const ismobile = lesserThanSm ? 'mobile' : 'notmobile';
        return NODE_LAYOUTS[content.title][ismobile] || []
    }, []);

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

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            initial: isNormal ? 'initial' : "static",
            animate: isNormal ? 'animate' : "static",
        };
    }, [mode]);

    const lastHoverTime = useRef(0);
    const HOVER_THRESHOLD = 80;

    const handleHovered = useCallback((v) => {
        const now = performance.now();
        if (now - lastHoverTime.current < HOVER_THRESHOLD) {
            return;
        }
        lastHoverTime.current = now;

        setHoveredIcon((prev) => {
            if (lesserThanSm && prev?.name === v?.name) return null;
            return v;
        });
    }, []);

    const windowWidth = getWindowWidth();
    const responsivescale = useTransform(windowWidth, (w) => {
        if (lesserThanSm) return 1;

        return Math.min(w / (nodeRadius * 4), 1);
    });

    return (
        <StyledCard>
            <CardContentContainer
                variants={cardcontentVars}
                initial={animationConfig.initial}
                animate={animationConfig.animate}
            >
                <ResponsiveContainer
                    style={{ scale: responsivescale }}
                >
                    {!lesserThanSm &&
                        <CircuitLines
                            positionsConfig={positionsConfig}
                            transitionsConfig={transitionsConfig}
                        />
                    }
                    {positionsConfig.map((icon, i) => (
                        <AnimatedIcon key={i} icon={icon} i={i}
                            handleHovered={handleHovered}
                            transition={transitionsConfig[i]}
                        />
                    ))}
                </ResponsiveContainer>
                {hoveredIcon &&
                    <CenterIcon icon={hoveredIcon} content={content}
                        handleHovered={handleHovered}
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
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
    cursor: 'default',
}));

const Bracket = styled(MotionSpan)(({ theme }) => ({
    height: '1.2em',
    display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#FF4500',
    lineHeight: '1.2em',
    verticalAlign: 'middle',
}));

const WordRow = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
});

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

const AnimatedIcon = memo(function AnimatedIcon({ icon, i,
    handleHovered, transition }) {

    const { manual, system, lesserThanSm } = useAnimateContext();
    const isNormal = ((system || manual) === 'normal');

    const animationConfig = useMemo(() => {
        return {
            animate: isNormal ? 'animate' : "static",
        };
    }, [isNormal]);

    const { textX, textY, align } = useMemo(() => {
        if (lesserThanSm) {
            const x = icon.endx < icon.startx
                ? '50%' : '-50%';
            const align = icon.endx < icon.startx
                ? 'left' : 'right';

            return {
                textX: x, textY: 0, align: align
            };
        }

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

        return { textX: x, textY: y, align: 'center' };
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
                        textAlign: align,
                    }}
                >
                    {icon.name.split(' ').map((word, i, array) => (
                        <WordRow
                            style={{
                                justifyContent: align
                            }}
                        >
                            {i === 0 && <Bracket>[</Bracket>}
                            <WordBlock key={i}>
                                {word.split('').map((char, i) => (
                                    <FallingLetter
                                        key={i}
                                        char={char}
                                        color={icon.color}
                                        delay={i * 200}
                                    />
                                ))}
                            </WordBlock>
                            {i === array.length - 1 && <Bracket>]</Bracket>}
                        </WordRow>
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
    pointerEvents: 'none',
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
    pointerEvents: 'none',
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

const CenterIcon = memo(function CenterIcon({ icon, content, handleHovered, animationConfig }) {

    const handleTap = useCallback((e, v) => {
        e.stopPropagation();
        handleHovered(v);
    }, []);

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
                tap-interactive="true"
                variants={centertextVars}
                onTap={(e) => handleTap(e, null)}
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