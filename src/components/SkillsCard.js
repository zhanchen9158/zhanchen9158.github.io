import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    motion, AnimatePresence, useMotionValue,
    useSpring, useTransform, cubicBezier,
} from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import SvgGlow from './SvgGlow';
import SvgGlassOverlay from './SvgGlassOverlay';
import SvgSplitColor, { SvgSplitShadow, SvgBorder } from './SvgSplitColor';
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
    //transformStyle: "preserve-3d",
    willChange: 'transform',
    backfaceVisibility: "hidden",
    isolation: 'isolate',
}));

const GridItemContainerShadow = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    zIndex: -1,
    backfaceVisibility: "hidden",
    boxShadow: '0 10px 20px rgba(0,0,0,0.15), 0 6px 6px rgba(0,0,0,0.24)',
    pointerEvents: 'none',
}));

const Header = styled(Box)(({ theme }) => ({
    position: 'relative',
    fontWeight: 600,
    lineHeight: 0.9,
    fontFamily: 'Playfair Display',
    fontSize: '24px',
    alignSelf: 'self-start',
    color: 'rgb(0,0,0)',
    [theme.breakpoints.down('md')]: {
        fontSize: '22px',
    },
}));

const SubHeader = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    textTransform: 'uppercase',
    tracking: '0.1em',
    opacity: 0.6,
    fontFamily: 'Instrument Serif',
    fontSize: '22px',
    color: 'rgb(255,255,255)',
    backfaceVisibility: "hidden",
}));

const TextShadow = styled(Box)(({ theme, color = '#000000', opacity = 0.5,
    top = '100%', height = '40%'
}) => ({
    position: 'absolute',
    top: top, left: 0,
    width: '100%', height: height,
    backgroundColor: color,
    filter: 'blur(8px)',
    opacity: opacity,
    pointerEvents: 'none',
}));

const itemVars = {
    hidden: (i) => ({
        x: i == 1
            ? -120
            : i == 3
                ? 120 : 0,
        y: i == 2
            ? -120
            : i == 4
                ? 120 : 0,
    }),
    visible: {
        x: 0, y: 0,
        transition: {
            delay: 0.35,
            duration: 0.65,
            ease: cubicBezier(0.45, 0, 0.55, 1),
            staggerChildren: 0.35,
            delayChildren: 0.6,
        }
    },
    static: { x: 0, y: 0, transition: { duration: 0 } },
};

const textVars = {
    hidden: {
        opacity: 0,
        x: -20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring", stiffness: 160, damping: 20,
        }
    },
    static: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0 } },
};

const AnimatedGridItem = memo(function AnimatedGridItem({ item, selectedId, lastSelectedId,
    handleItemSelect, handleGridAnimationComplete }) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <GridItemContainer
            variants={itemVars}
            custom={item.id}
            layoutId={`skillgriditem-${item.id}`}
            layout
            onClick={() => handleItemSelect(item.id)}
            onLayoutAnimationComplete={() => handleGridAnimationComplete(item.id)}
            //whileHover={{ scale: 0.98 }}
            sx={{
                gridArea: gridMap[item.id] || 'a',
                zIndex: (selectedId == item.id || lastSelectedId == item.id) ? 10 : 1,
            }}
        >
            <GridItemContainerShadow />
            <AnimatedGridItem3D item={item}>
                <Header>
                    <TextShadow />
                    {item.title}
                </Header>
                {item.id == 1 && !lesserThanSm && item.icons.map((v, i) => (
                    <SubHeader
                        key={i}
                        variants={textVars}
                    >
                        <TextShadow
                            opacity={0.3}
                            top={'90%'} height={'20%'}
                        />
                        {v.name}
                    </SubHeader>
                ))}
            </AnimatedGridItem3D>
        </GridItemContainer>
    );
});

const SPRING3D_CONFIG = { stiffness: 150, damping: 20 };

const GridItem3D = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    borderRadius: 'inherit',
    cursor: 'pointer',
    width: '100%', height: '100%',
    background: 'transparent',
    transformStyle: "preserve-3d",
    transform: 'translateZ(0)',
    willChange: "transform",
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
}));

const GridItemBg = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    transform: 'translateZ(0)',
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
    zIndex: 0,
    pointerEvents: 'none',
}));

const GridItemUnderlayer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    inset: '-2%',
    borderRadius: 'inherit',
    transform: 'translateZ(-30px)',
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
    zIndex: -1,
    pointerEvents: 'none',
}));

const GridItemLight = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    //zIndex: 1
}));

const GridItemContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%', height: '100%',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column-reverse',
    justifyContent: 'space-between', alignItems: 'center',
    color: (theme.vars || theme).palette.text.primary,
    overflow: 'hidden',
    transform: "translateZ(60px) rotate(0.001deg)",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    //WebkitFontSmoothing: "antialiased",
    //zIndex: 2,
    [theme.breakpoints.down('md')]: {
        borderRadius: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4),
    },
}));

const underlayerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 4, ease: 'easeOut'
        }
    },
    static: { opacity: 1, transition: { duration: 0 } },
};

const AnimatedGridItem3D = memo(function AnimatedGridItem3D({ item, children }) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const containerRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, SPRING3D_CONFIG);
    const mouseYSpring = useSpring(y, SPRING3D_CONFIG);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);

    const handleMouseEnter = useCallback((e) => {
        containerRef.current = e.currentTarget.getBoundingClientRect();
    }, []);

    const handleMouseMove = useCallback((e) => {
        const dimension = containerRef.current;
        if (!dimension) return;

        const { left, top, width, height } = dimension;

        x.set((e.clientX - left) / width - 0.5);
        y.set((e.clientY - top) / height - 0.5);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <GridItem3D
            onMouseEnter={lesserThanSm ? null : handleMouseEnter}
            onMouseMove={lesserThanSm ? null : handleMouseMove}
            onMouseLeave={lesserThanSm ? null : handleMouseLeave}
            style={{
                rotateX: lesserThanSm ? 0 : rotateX,
                rotateY: lesserThanSm ? 0 : rotateY,
            }}
        >
            <GridItemBg
                sx={{
                    bgcolor: item.color,
                    //border: `1px solid ${item.border}`,
                }}
            />
            {!lesserThanSm &&
                <GridItemUnderlayer
                    variants={underlayerVars}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: false, amount: 0.5 }}
                    sx={{
                        bgcolor: item.underlayercolor,
                        //border: `1px solid ${item.border}`,
                    }}
                />
            }
            {!lesserThanSm &&
                <GridItemLight>
                    <SvgGlow opacity={0.6} />
                </GridItemLight>
            }
            <GridItemContent>
                {children}
            </GridItemContent>
        </GridItem3D>
    );
});

const Modal = styled(MotionBox)(({ theme }) => ({
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backfaceVisibility: "hidden",
}));

const ModalContent = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: '80%', maxWidth: 675, height: 450,
    borderRadius: '32px', padding: 0,
    color: 'rgba(0,0,0,1)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    perspective: '1000px',
    //transformStyle: "preserve-3d",
    willChange: 'transform, opacity',
    backfaceVisibility: "hidden",
    isolation: 'isolate',
}));

const ModalTitle = styled(Box)(({ theme }) => ({
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
        transition: {
            layout: { duration: 0.3, ease: "easeOut" },
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
            animate='animate'
            exit='initial'
            transition={{ layout: { duration: 0.3 } }}
            onClick={() => handleItemSelect(null)}
        >
            <ModalContent
                layoutId={`skillgriditem-${selectedItem.id}`}
                layout
                sx={{
                    backgroundColor: selectedItem.cardcolors[1],
                }}
            >
                <SvgSplitShadow />
                <SvgSplitColor color={selectedItem.cardcolors[0]}
                    transform="translateZ(30px)" transformStyle="preserve-3d"
                />
                <SvgBorder
                    glowColor={selectedItem.cardcolors[2]}
                    borderColor={selectedItem.cardcolors[0]}
                />
                <ModalTitle
                    sx={{
                        color: selectedItem.cardcolors[1],
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
    borderRadius: theme.spacing(4), padding: theme.spacing(4),
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
            delay: 0.35,
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
                    <AnimatedIcon key={icon.file} icon={icon} i={i}
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
                <SvgGlassOverlay />
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
            delay: 0.35 + 0.08 * i,
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
                    <SvgGlassOverlay i={i} />
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