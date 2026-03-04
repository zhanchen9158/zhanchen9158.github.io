import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    motion, AnimatePresence, useMotionValue,
    useSpring, useTransform,
} from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import GlassOverlay from './GlassOverlay';
import SvgGlow from './SvgGlow';
import SvgSplitColor, { SvgSplitShadow, SvgBorder } from './SvgSplitColor';
import GrainOverlay from './GrainOverlay';
import hexToRgba from '../functions/hexToRgba';


const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

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
        cardcolors: ['#010B13', '#d8ecfd', '#7fbdf5'],
        circlecolors: ['#f0dc56', '#f5e78e', '#faf3c7'],
        border: '#90CAF9',
        mainicon: 'languages',
        icons: [
            { file: 'java', name: 'Java' },
            { file: 'javascript', name: 'JavaScript' },
            { file: 'python', name: 'Python' },
            { file: 'csharp', name: 'C#' },
            { file: 'sql', name: 'SQL' }
        ],
    },
    {
        id: 2,
        title: 'Frontend',
        size: 'small',
        color: '#9c27b0', underlayercolor: '#852197',
        cardcolors: ['#0f0311', '#f4def8', '#9b59b6'],
        circlecolors: ['#7bbfcc', '#a7d5dd', '#d3eaee'],
        border: '#ce93d8',
        mainicon: 'frontend',
        icons: [
            { file: 'react', name: 'React' },
            { file: 'onnx', name: 'ONNX Runtime Web' },
            { file: 'materialui', name: 'Material UI' },
            { file: 'html', name: 'HTML' },
            { file: 'css', name: 'CSS' },
            { file: 'vite', name: 'Vite' },
            { file: 'emotion', name: 'Emotion' },
            { file: 'framermotion', name: 'Framer Motion' }
        ],
    },
    {
        id: 3,
        title: 'Backend',
        size: 'small',
        color: '#00897b', underlayercolor: '#00665C',
        cardcolors: ['#001412', '#d6fffb', '#79e0ee'],
        circlecolors: ['#f0dc56', '#f5e78e', '#faf3c7'],
        border: '#A5D6A7',
        mainicon: 'backend',
        icons: [
            { file: 'springboot', name: 'Spring Boot' },
            { file: 'nodejs', name: 'Node.js' },
            { file: 'hibernate', name: 'Hibernate' },
            { file: 'mysql', name: 'MySQL' },
            { file: 'mongodb', name: 'MongoDB' },
            { file: 'elasticsearch', name: 'Elasticsearch' }
        ],
    },
    {
        id: 4,
        title: 'Tools/Cloud',
        size: 'medium',
        color: '#f57c00', underlayercolor: '#CC6600',
        cardcolors: ['#140b00', '#ffebd6', '#ffd1a3'],
        circlecolors: ['#7bbfcc', '#a7d5dd', '#d3eaee'],
        border: '#FFCC80',
        mainicon: 'cloud',
        icons: [
            { file: 'aws', name: 'AWS' },
            { file: 'pytorch', name: 'PyTorch' },
            { file: 'huggingface', name: 'Hugging Face' },
            { file: 'docker', name: 'Docker' },
            { file: 'git', name: 'Git' },
            { file: 'jwt', name: 'JWT' },
            { file: 'cloudarchitecture', name: 'Cloud Architecture' },
            { file: 'microservice', name: 'Microservice' },
            { file: 'restapi', name: 'REST API' }
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
      `
}));

const GridContainer = styled(MotionBox)(({ theme }) => ({
    padding: theme.spacing(4), display: 'grid', gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, 200px)',
    gridTemplateAreas: `
        "a a b c"
        "a a d d"
      `,
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

    if (lesserThanSm) {
        return (
            <GridContainerSm
                variants={containerVars}
                initial={animationConfig.hidden}
                whileInView={animationConfig.visible}
                viewport={{ once: false, amount: 0.5 }}
            >
                <BentoGrid />
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
            <BentoGrid />
        </GridContainer>
    );
}

const BentoGrid = memo(function BentoGrid() {
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
        <AnimatePresence>
            {SKILLS_DATA.map((item, _) => (
                <AnimatedGridItem
                    key={item.id}
                    item={item}
                    selectedId={selectedId} lastSelectedId={lastSelectedId}
                    handleItemSelect={handleItemSelect}
                    handleGridAnimationComplete={handleGridAnimationComplete}
                />
            ))}

            {selectedId && (
                <AnimatedModal
                    selectedItem={selectedItem}
                    handleItemSelect={handleItemSelect}
                />
            )}
        </AnimatePresence>
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

const itemVars = {
    hidden: {
        opacity: 1,
    },
    visible: {
        opacity: 1,
        transition: {
            //delay: 0.65,
            duration: 1.85,
            ease: [0.33, 1, 0.68, 1],
        }
    },
    static: { opacity: 1, transition: { duration: 0 } },
};

const AnimatedGridItem = memo(function AnimatedGridItem({ item, selectedId, lastSelectedId,
    handleItemSelect, handleGridAnimationComplete }) {

    return (
        <GridItemContainer
            //variants={itemVars}
            custom={item.id}
            layoutId={`skillgriditem-${item.id}`}
            layout
            onLayoutAnimationComplete={() => handleGridAnimationComplete(item.id)}
            onClick={() => handleItemSelect(item.id)}
            whileHover={{
                zIndex: 99,
            }}
            sx={{
                gridArea: gridMap[item.id] || 'a',
                zIndex: (selectedId === item.id || lastSelectedId === item.id) ? 10 : 1,
            }}
        >
            <AnimatedGridItem3D item={item} handleGridAnimationComplete={handleGridAnimationComplete} />
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
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
    zIndex: 0,
    pointerEvents: 'none',
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

const hover = 0.5;
const HOVERBG_CONFIG = { duration: hover, ease: 'easeOut' };
const HOVERCONTENT_CONFIG = { duration: 2.5 * hover, ease: 'easeOut' };

const item3dVars = {
    initial: {
        z: 0,
        scale: 1,
        transition: HOVERBG_CONFIG,
    },
    hover: {
        z: 60,
        scale: 1.02,
        transition: HOVERCONTENT_CONFIG,
    },
    rest: {
        z: 0,
        scale: 1,
        transition: HOVERBG_CONFIG,
    },
    static: { z: 0, scale: 1 },
};

const griditemhoverVars = {
    initial: {
        opacity: 0,
        transition: HOVERBG_CONFIG,
    },
    hover: ({ o = 1, d = hover } = {}) => ({
        opacity: o,
        transition: { duration: d, ease: 'easeOut' },
    }),
    rest: {
        opacity: 0,
        transition: HOVERBG_CONFIG,
    },
    static: { opacity: 1, },
};

const SPRING3D_CONFIG = { stiffness: 150, damping: 20, mass: 0.1 };

const AnimatedGridItem3D = memo(function AnimatedGridItem3D({ item }) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const containerRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [-12, 12]), SPRING3D_CONFIG);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [12, -12]), SPRING3D_CONFIG);

    const handleMouseEnter = useCallback((e) => {
        containerRef.current = e.currentTarget.getBoundingClientRect();
    }, []);

    const handleMouseMove = useCallback((e) => {
        const dimension = containerRef.current;
        if (!dimension) return;

        const { left, top, width, height } = dimension;
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        e.currentTarget.style.setProperty('--mouse-x', `${mouseX}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${mouseY}px`);

        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    }, [x, y]);

    const handleMouseLeave = useCallback((e) => {
        x.set(0);
        y.set(0);
        //e.currentTarget.style.setProperty('--mouse-x', `0px`);
        //e.currentTarget.style.setProperty('--mouse-y', `0px`);
    }, [x, y]);

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

    return (
        <GridItem3D
            onMouseEnter={lesserThanSm ? null : handleMouseEnter}
            onMouseMove={lesserThanSm ? null : handleMouseMove}
            onMouseLeave={lesserThanSm ? null : handleMouseLeave}
            style={{
                rotateX: lesserThanSm ? 0 : rotateX,
                rotateY: lesserThanSm ? 0 : rotateY,
            }}
            variants={item3dVars}
            initial={animationConfig.initial}
            animate={animationConfig.rest}
            whileInView={animationConfig.visible}
            whileHover={animationConfig.hover}
        >
            <GridItemBorder
                variants={griditemhoverVars}
            />
            <GridItemBg
                variants={griditemhoverVars}
            >
                <GrainOverlay opacity={0.15} bgcolor='#ffffff' contrast='200%' />
            </GridItemBg>
            <Spotlight
                variants={griditemhoverVars}
            />
            <AnimatedGridItemContent item={item} animationConfig={animationConfig}
                shadowX={rotateX} shadowY={rotateY}
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
    //overflow: 'hidden',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    WebkitFontSmoothing: "antialiased",
    //zIndex: 2,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const TextHover = styled(MotionBox)(({ theme, align = 'auto' }) => ({
    position: 'relative',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    alignSelf: align,
}));

const TextClip = styled(MotionBox)({
    overflow: 'hidden',
    display: 'block',
    lineHeight: 1.2,
});

const Header = styled(MotionBox)(({ theme, textcolor = '#000000' }) => ({
    position: 'relative',
    fontWeight: 600,
    lineHeight: 0.9,
    fontFamily: 'Fraunces',
    textTransform: 'uppercase',
    fontSize: '26px',
    color: textcolor,
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('md')]: {
        fontSize: '24px',
    },
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const SubHeader = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    textTransform: 'uppercase',
    letterspacing: '0.15em',
    fontFamily: 'Antonio',
    fontSize: '22px',
    color: 'rgb(255,255,255)',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const TextShadow = styled(MotionBox)(({ theme, color = '#000000',
    top = '100%', height = '40%'
}) => ({
    position: 'absolute',
    top: top, left: 0,
    width: '100%', height: height,
    backgroundColor: color,
    filter: 'blur(12px)',
    pointerEvents: 'none',
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
}));

const pagedelay = 1.6;

const itemcontentVars = {
    initial: {
        z: 0,
        transition: HOVERBG_CONFIG,
    },
    hover: {
        z: 60,
        transition: HOVERCONTENT_CONFIG,
    },
    rest: {
        z: 0,
        transition: HOVERBG_CONFIG,
    },
    static: { z: 0, },
};

const texthoverVars = {
    initial: {
        z: 0,
    },
    hover: (i = 0) => ({
        z: 90,
        transition: {
            delay: i * 0.35,
            ...HOVERBG_CONFIG
        },
    }),
    rest: {
        z: 0,
        transition: HOVERBG_CONFIG,
    },
    static: { z: 0, transition: { duration: 0 } },
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

const textshadowVars = {
    initial: {
        opacity: 0, z: 0,
        scale: 1,
    },
    hover: (i) => ({
        opacity: 0.35, z: -100,
        scale: 1.10,
        transition: {
            delay: i * 0.45,
            ...HOVERBG_CONFIG
        },
    }),
    static: { opacity: 0, z: 0, scale: 1 },
};

const textVars = {
    initial: {
        opacity: 0,
        y: '100%',
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.35 + pagedelay + 0.2,
            type: "spring", stiffness: 160, damping: 20,
        }
    }),
    static: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const AnimatedGridItemContent = memo(function AnimatedGridItemContent({ item, animationConfig,
    shadowX, shadowY
}) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <GridItemContent
            variants={itemcontentVars}
        >
            <TextHover
                variants={texthoverVars}
                align={'flex-start'}
            >
                <TextShadow
                    variants={textshadowVars}
                    top={'80%'} height={'40%'}
                    style={{
                        x: lesserThanSm ? 0 : shadowY,
                        y: lesserThanSm ? 0 : shadowX,
                    }}
                />
                <Header
                    textcolor={item.color}
                    variants={headerVars}
                >
                    {item.title}
                </Header>
            </TextHover>
            {item.id == 1 && !lesserThanSm && item.icons.map((v, i) => (
                <TextHover
                    key={i}
                    custom={i}
                    variants={texthoverVars}
                >
                    <TextShadow
                        custom={i}
                        variants={textshadowVars}
                        top={'80%'} height={'20%'}
                        style={{
                            x: lesserThanSm ? 0 : shadowY,
                            y: lesserThanSm ? 0 : shadowX,
                        }}
                    />
                    <TextClip>
                        <SubHeader
                            custom={i}
                            variants={textVars}
                        >
                            {v.name}
                        </SubHeader>
                    </TextClip>
                </TextHover>
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

const ModalContent = styled(MotionBox)(({ theme, bgcolor }) => ({
    position: 'relative',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    //background: bgcolor,
    //backdropFilter: 'blur(20px) saturate(180%)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    perspective: '1000px',
    transformStyle: "preserve-3d",
    willChange: 'transform, opacity',
    backfaceVisibility: "hidden",
    isolation: 'isolate',
}));

const ModalBg = styled(MotionBox)(({ theme, bgcolor }) => ({
    position: 'absolute',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    background: bgcolor,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    //willChange: 'transform, opacity',
    backfaceVisibility: "hidden",
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

const layoutduration = 0.5;

const modalVars = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            opacity: { duration: 0.3 }
        }
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

const AnimatedModal = memo(function AnimatedModal({ selectedItem, handleItemSelect }) {

    return (
        <Modal
            variants={modalVars}
            initial='initial'
            animate='animate'
            exit='initial'
            onClick={() => handleItemSelect(null)}
        >
            <ModalBg
                bgcolor={hexToRgba(selectedItem.cardcolors[1], 0.15)}
            />
            <ModalContent
                layoutId={`skillgriditem-${selectedItem.id}`}
                layout
                transition={{
                    layout: {
                        duration: layoutduration,
                        ease: "easeOut"
                    },
                }}
            //bgcolor={hexToRgba(selectedItem.cardcolors[1], 0.7)}
            >


                <GrainOverlay />
                {/*<SvgSplitShadow />*/}
                {/*<SvgSplitColor color={selectedItem.cardcolors[0]} />*/}
                {/*<SvgBorder
                    glowColor={selectedItem.cardcolors[2]}
                    borderColor={selectedItem.cardcolors[0]}
                />*/}
                <ModalTitle

                    sx={{
                        color: selectedItem.color,
                    }}
                >
                    <TitleGlow
                        variants={titleglowVars}
                        initial='initial'
                        animate='animate'
                        sx={{
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

const radius = 170;
const centerX = 170;
const centerY = 170;

const getRadialPositions = (count) => {
    return Array.from({ length: count }).map((_, i) => {
        const angle = (i * (360 / count) - 90) * (Math.PI / 180);
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        };
    });
};

const ICON_LAYOUTS = SKILLS_DATA.reduce((acc, skill) => {
    acc[skill.title] = getRadialPositions(skill.icons.length);
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
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: 'inherit',
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

    const positions = ICON_LAYOUTS[content.title] || [];

    const positionedIcons = useMemo(() => {
        if (!content.icons) return [];

        return content.icons.map((icon, i) => ({
            ...icon,
            ...positions[i]
        }));
    }, [content.title]);

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
                {hoveredIcon &&
                    <CenterIcon icon={hoveredIcon} content={content}
                        animationConfig={animationConfig}
                    />
                }
                {positionedIcons.map((icon, i) => (
                    <AnimatedIcon key={i} icon={icon} i={i}
                        content={content} handleHovered={handleHovered}
                    />
                ))}
            </CardContentContainer>
        </StyledCard>
    );
});

const CenterIconContainer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -100%)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backfaceVisibility: "hidden",
}));

const HoverGlow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    borderRadius: 'inherit',
    filter: 'blur(12px)',
    backfaceVisibility: "hidden",
}));

const CenterAvatarContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: 56, height: 56,
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backfaceVisibility: "hidden",
}));

const AnimatedText = styled(MotionTypography)(({ theme }) => ({
    position: 'absolute',
    top: '170%',
    pt: theme.spacing(1),
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: `0.07em`,
    textTransform: 'uppercase',
    fontFamily: 'DM Serif Display',
    textAlign: 'center',
    backfaceVisibility: "hidden",
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
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
        opacity: 1, scale: 2,
        transition: { delay: 0.35 }
    },
    static: { opacity: 1, scale: 1.5, transition: { duration: 0 } },
};

const centerAvatarVars = {
    initial: { opacity: 0, scale: 1.5, y: -50 },
    animate: {
        opacity: 1, scale: 1.5, y: 0,
        transition: centerTransition
    },
    static: { opacity: 1, scale: 1.5, y: 0, transition: { duration: 0 } },
};

const centerTextVars = {
    initial: { opacity: 0, scale: 1.5, y: 50 },
    animate: {
        opacity: 1, scale: 1.5, y: 0,
        transition: centerTransition
    },
    static: { opacity: 1, scale: 1.5, y: 0, transition: { duration: 0 } },
};

const CenterIcon = memo(function CenterIcon({ icon, content, animationConfig }) {

    return (
        <CenterIconContainer
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
            <CenterAvatarContainer
                variants={centerAvatarVars}
            >
                <GlassOverlay />
                <StyledAvatar
                    src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                    alt={icon.name}
                />
            </CenterAvatarContainer>
            <AnimatedText
                variants={centerTextVars}
                sx={{
                    color: content.color,
                }}
            >
                {icon.name}
            </AnimatedText>
        </CenterIconContainer >
    );
});

const IconContainer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    backfaceVisibility: "hidden",
}));

const AvatarContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: 56, height: 56,
    borderRadius: 'inherit',
    backfaceVisibility: "hidden",
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
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

const StyledAvatar = styled('img')(({ theme }) => ({
    width: 48, height: 48,
    background: 'transparent',
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 40, height: 40,
    },
    pointerEvents: 'none',
    zIndex: 2,
}));

const IconText = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    pt: theme.spacing(1),
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Cormorant Garamond',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
    },
    pointerEvents: 'none',
}));

const iconTransition = { type: "spring", stiffness: 160, damping: 10 };

const entranceVars = {
    initial: {
        opacity: 0, scale: 0.4, y: 0,
    },
    animate: (i) => ({
        opacity: 1, scale: 1, y: 0,
        transition: {
            delay: layoutduration + 0.08 * i,
            ...iconTransition
        }
    }),
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { delay: 0, duration: 0.15 }
    },
    static: { opacity: 1, scale: 1, y: 0 },
};

const AnimatedIcon = memo(function AnimatedIcon({ icon, i, content, handleHovered }) {

    const scaleValue = useMotionValue(1);

    const springScale = useSpring(scaleValue, {
        stiffness: 260,
        damping: 10,
        restDelta: 0.001
    });

    const inverseOpacity = useTransform(springScale, [1, 1.1], [0.8, 0.4]);

    const { manual, system } = useAnimateContext();
    const isNormal = ((system || manual) === 'normal');

    const handleHover = useCallback((scale) => {
        if (!isNormal) return;
        scaleValue.set(scale);
    }, [isNormal]);

    const animationConfig = useMemo(() => {
        return {
            animate: isNormal ? 'animate' : "static",
        };
    }, [isNormal]);

    return (
        <IconContainer
            whileHover={{ zIndex: 5 }}
            onHoverStart={() => handleHovered(icon)}
            onHoverEnd={() => handleHovered(null)}
            style={{
                x: icon.x, y: icon.y,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <AvatarContainer
                variants={entranceVars}
                custom={i}
                initial='initial'
                animate={animationConfig.animate}

            >
                <HoverShadow
                    style={{
                        scale: springScale,
                        opacity: inverseOpacity,
                    }}
                />
                <HoverWrapper
                    onHoverStart={() => handleHover(1.1)}
                    onHoverEnd={() => handleHover(1)}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        scale: springScale,
                    }}
                >
                    {/*<HoverGlow
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    sx={{
                        backgroundColor: content.cardcolors[1],
                    }}
                />*/}
                    <GlassOverlay />
                    <StyledAvatar
                        src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                        alt={icon.name}
                    />
                    <IconText
                        sx={{
                            color: content.color,
                        }}
                    >
                        {icon.name}
                    </IconText>
                </HoverWrapper>
            </AvatarContainer>
        </IconContainer>
    );
});