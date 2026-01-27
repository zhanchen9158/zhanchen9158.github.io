import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    motion, AnimatePresence, useMotionValue,
    useSpring, useTransform, useAnimation,
} from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import Avatar from '@mui/material/Avatar';
import SvgGlow from './SvgGlow';
import SvgGlassOverlay from './SvgGlassOverlay';
import SvgSplitColor, { SvgSplitShadow, SvgBorder } from './SvgSplitColor';
import hexToRgba from '../functions/hextoRgba';


const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const icons = import.meta.glob('../icons/skills/*.svg', {
    eager: true,
    query: '?url'
});

const skills = [
    {
        id: 1,
        title: 'Languages',
        size: 'large', color: '#2196f3',
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
        size: 'small', color: '#9c27b0',
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
        size: 'small', color: '#00897b',
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
        size: 'medium', color: '#f57c00',
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
      `
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

        return skills.find(i => i.id == selectedId) || {};
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
            {skills.map((item, _) => (
                <AnimatedGridItem
                    key={`animatedgriditem-${item.title}`}
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
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    perspective: '1000px',
    transformStyle: "preserve-3d",
    willChange: 'transform, opacity',
}));

const Header = styled(Typography)(({ theme }) => ({
    position: 'relative',
    fontWeight: 800,
    letterSpacing: `-0.05em`,
    lineHeight: 0.9,
    fontFamily: 'Playfair Display',
    alignSelf: 'self-start',
    color: 'rgba(0,0,0,1)',
    '&::after': {
        content: 'attr(data-text)',
        position: 'absolute',
        top: '100%', left: 0,
        width: '100%', height: '40%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        filter: 'blur(12px)',
        pointerEvents: 'none',
    }
}));

const SubHeader = styled(MotionTypography)(({ theme }) => ({
    position: 'relative',
    textTransform: 'uppercase',
    tracking: '0.1em',
    opacity: 0.6,
    fontFamily: 'Instrument Serif',
    color: 'rgba(255,255,255,1)',
    '&::after': {
        content: 'attr(data-text)',
        position: 'absolute',
        top: '90%', left: 0,
        width: '100%', height: '20%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
    }
}));

const itemVars = {
    hidden: (i) => ({
        opacity: 0,
        scale: 1,
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
        opacity: 1,
        scale: 1,
        x: 0, y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.35,
            delayChildren: 0.6,
        }
    },
    static: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0 } },
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
            onClick={() => handleItemSelect(item.id)}
            onLayoutAnimationComplete={() => handleGridAnimationComplete(item.id)}
            whileHover={{ scale: 0.98 }}
            sx={{
                gridArea: gridMap[item.id] || 'a',
                zIndex: (selectedId == item.id || lastSelectedId == item.id) ? 10 : 1,
            }}
        >
            <AnimatedGridItem3D item={item}>
                <Header variant="h4">{item.title}</Header>
                {item.id == 1 && !lesserThanSm && item.icons.map((v, i) => (
                    <SubHeader
                        key={`languages-${i}`}
                        variants={textVars}
                        variant="h5"
                    >
                        {v.name}
                    </SubHeader>
                ))}
            </AnimatedGridItem3D>
        </GridItemContainer>
    );
});

const SPRING3D_CONFIG = { stiffness: 150, damping: 20 };

const GridItem3D = styled(MotionBox)(({ theme }) => ({
    borderRadius: 'inherit',
    cursor: 'pointer',
    width: '100%', height: '100%',
    transformStyle: "preserve-3d",
    willChange: "transform",
    outline: "1px solid transparent",
    backfaceVisibility: "hidden",
}));

const GridItemLight = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    transform: 'translateZ(0px)',
    zIndex: 0
}));

const GridItemContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%', height: '100%',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: (theme.vars || theme).palette.text.primary,
    overflow: 'hidden',
    transform: "translateZ(60px)",
    transformStyle: "preserve-3d",
    [theme.breakpoints.down('md')]: {
        borderRadius: theme.spacing(3),
        padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4),
    },
}));

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
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current;

        const mouseX = (e.clientX - left) / width - 0.5;
        const mouseY = (e.clientY - top) / height - 0.5;

        x.set(mouseX);
        y.set(mouseY);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <GridItem3D
            ref={containerRef}
            onMouseEnter={lesserThanSm ? null : handleMouseEnter}
            onMouseMove={lesserThanSm ? null : handleMouseMove}
            onMouseLeave={lesserThanSm ? null : handleMouseLeave}
            style={{
                rotateX: lesserThanSm ? 0 : rotateX,
                rotateY: lesserThanSm ? 0 : rotateY,
            }}
            sx={{
                bgcolor: item.color,
                border: `1px solid ${item.border}`,
            }}
        >
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
    willChange: 'transform, opacity',
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
    transformStyle: "preserve-3d",
    willChange: 'transform, opacity',
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
    transform: "translateZ(30px)",
}));

const TitleGlow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: '10%', left: 0,
    width: '100%', height: '90%',
    filter: 'blur(12px)',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
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

const titleVars = {
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
            transition={{ layout: { duration: 0.3 } }}
            onClick={() => handleItemSelect(null)}
        >
            <ModalContent
                layoutId={`skillgriditem-${selectedItem.id}`}
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
                        variants={titleVars}
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
    transformStyle: "preserve-3d",
    perspective: '1000px',
}));

const CardContentContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: 'inherit',
    transformStyle: "preserve-3d",
}));

const cardcontentVars = {
    initial: {
        opacity: 0, scale: 1.2, y: -20,
        //filter: "blur(8px) brightness(1.2)"
    },
    animate: {
        opacity: 1, scale: 1, y: 0,
        //filter: "blur(0px) brightness(1)",
        transition: {
            delay: 0.35,
            type: 'spring', stiffness: 80, damping: 10,
        }
    },
    static: { opacity: 1, scale: 1, y: 0, }
};

const AnimatedCard = memo(function AnimatedCard({ content = {} }) {
    const [hoveredIcon, setHoveredIcon] = useState(null);

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

    const positionedIcons = useMemo(() => {
        if (!content.icons) return [];

        return content.icons.map((icon, i) => {
            const angle = (i * (360 / content.icons.length) - 90) * (Math.PI / 180);
            return {
                ...icon,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            };
        });
    }, [content.icons, radius, centerX, centerY]);

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
                    <AnimatedIcon key={`animatedicon-${icon.name}`} icon={icon} i={i}
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
}));

const HoverGlow = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    borderRadius: 'inherit',
    filter: 'blur(12px)',
}));

const CenterAvatarContainer = styled(MotionBox)(({ theme }) => ({
    position: 'relative',
    width: 56, height: 56,
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
    display: 'flex', justifyContent: 'center', alignItems: 'center',
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
    initial: { opacity: 0, scale: 2, y: -50 },
    animate: {
        opacity: 1, scale: 1.5, y: 0,
        transition: centerTransition
    },
    static: { opacity: 1, scale: 1.5, y: 0, transition: { duration: 0 } },
};

const centerTextVars = {
    initial: { opacity: 0, scale: 2, y: 50 },
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
    transformStyle: "preserve-3d",
}));

const AvatarContainer = styled(MotionBox)(({ theme }) => ({
    width: 56, height: 56,
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    position: 'relative',
    background: 'rgba(255,255,255,0.8)',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
    cursor: 'pointer',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48, height: 48,
    background: 'transparent',
    borderRadius: 'inherit',
    [theme.breakpoints.down('sm')]: {
        width: 40, height: 40,
    },
    pointerEvents: 'none',
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

const iconVars = {
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
    hover: {
        scale: 1.1, y: -6,
        transition: iconTransition
    },
    static: { opacity: 1, scale: 1, y: 0 },
};

const AnimatedIcon = memo(function AnimatedIcon({ icon, i, content, handleHovered }) {
    const [entranceDone, setEntranceDone] = useState(false);

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const controls = useAnimation();

    useEffect(() => {
        controls.start("animate").then(() => {
            setEntranceDone(true);
        });
    }, []);

    const animationConfig = useMemo(() => {
        const isNormal = (mode === 'normal');

        return {
            animate: isNormal ? (entranceDone ? 'visible' : 'animate') : "static",
        };
    }, [mode, entranceDone, controls]);

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
                variants={iconVars}
                custom={i}
                initial='initial'
                animate={animationConfig.animate}
                whileHover='hover'
                whileTap={{ scale: 0.95 }}
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
            </AvatarContainer>
        </IconContainer>
    );
});