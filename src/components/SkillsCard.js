import React, { useEffect, useState, useMemo, memo } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { duration, styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimation } from "motion/react";
import Box from '@mui/material/Box';
import { useAnimateContext } from './AnimateContext';
import Avatar from '@mui/material/Avatar';
import SvgGlow from './SvgGlow';
import SvgGlassOverlay from './SvgGlassOverlay';
import SvgSplitColor from './SvgSplitColor';


const icons = import.meta.glob('../icons/skills/*.svg', {
    eager: true,
    query: '?url'
});

const skills = [
    {
        id: 1,
        title: 'Languages',
        size: 'large', color: '#2196f3',
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

const GridContainerSm = styled(Box)(({ theme }) => ({
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

const GridContainer = styled(Box)(({ theme }) => ({
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
    static: { opacity: 1, transition: { duration: 0 } },
};

export default function SkillsCard() {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    if (lesserThanSm) {
        return (
            <GridContainerSm
                component={motion.div}
                variants={containerVars}
                initial="hidden"
                whileInView={mode == 'normal' ? "visible" : "static"}
                viewport={{ once: false, amount: 0.5 }}
            >
                <BentoGrid />
            </GridContainerSm>
        )
    }

    return (
        <GridContainer
            component={motion.div}
            variants={containerVars}
            initial="hidden"
            whileInView={mode == 'normal' ? "visible" : "static"}
            viewport={{ once: false, amount: 0.5 }}
        >
            <BentoGrid />
        </GridContainer>
    );
}

const GridItem = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    perspective: '1000px',
}));

const Header = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    letterSpacing: `-0.05em`,
    lineHeight: 0.9,
    fontFamily: 'Geist',
    alignSelf: 'self-start',
    color: 'rgba(0,0,0,1)',
    //transform: "translateZ(60px)",
    //transformStyle: "preserve-3d",
    filter: "drop-shadow(0 20px 10px rgba(0,0,0,0.6))"
}));

const SubHeader = styled(Typography)(({ theme }) => ({
    textTransform: 'uppercase',
    tracking: '0.1em',
    opacity: 0.6,
    fontFamily: 'Instrument Serif',
    color: 'rgba(255,255,255,1)',
    //transform: "translateZ(30px)",
    //transformStyle: "preserve-3d",
    filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))"
}));

const Modal = styled(Box)(({ theme }) => ({
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center',

}));

const ModalContent = styled(Box)(({ theme }) => ({
    width: '80%', maxWidth: 600, height: 400,
    borderRadius: theme.spacing(4), padding: theme.spacing(4),
    color: 'rgba(0,0,0,1)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(0),
    },
    perspective: '1000px',

}));

const itemVars = {
    hidden: ({ i }) => ({
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
            duration: 0.25,
            type: "spring",
            damping: 20,
            stiffness: 160,
        }
    },
    static: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0 } },
};

function BentoGrid() {
    const [selectedId, setSelectedId] = useState(null);
    const [lastSelectedId, setLastSelectedId] = useState(null);

    const gridMap = { 1: 'a', 2: 'b', 3: 'c', 4: 'd' };

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const selectedItem = useMemo(() => {
        if (!selectedId) return {};

        return skills.find(i => i.id == selectedId) || {};
    }, [selectedId]);

    const handleItemSelect = (id) => () => {
        if (id == null) {
            setLastSelectedId(selectedId);
        }
        setSelectedId(id);
    }

    const handleGridAnimationComplete = (id) => () => {
        if (id == lastSelectedId) setLastSelectedId(null);
    }

    return (
        <React.Fragment>
            {skills.map((item, i) => (
                <GridItem
                    key={item.id}
                    component={motion.div}
                    variants={itemVars}
                    custom={{ i: item.id }}
                    layoutId={`skillgriditem-${item.id}`}
                    onClick={handleItemSelect(item.id)}
                    onLayoutAnimationComplete={handleGridAnimationComplete(item.id)}
                    whileHover={{ scale: 0.98 }}
                    sx={{
                        gridArea: gridMap[item.id] || 'a',
                        zIndex: (selectedId == item.id || lastSelectedId == item.id) ? 10 : 1,
                    }}
                >
                    <GridItem3D item={item}>
                        <Header variant="h4">{item.title}</Header>
                        {item.id == 1 && !lesserThanSm && item.icons.map((v, i) => (
                            <SubHeader
                                key={`languages-${i}`}
                                component={motion.div}
                                variants={textVars}
                                variant="h5"
                            >
                                {v.name}
                            </SubHeader>
                        ))}
                    </GridItem3D>
                </GridItem>
            ))}

            <AnimatePresence>
                {selectedId && (
                    <Modal
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        onClick={handleItemSelect(null)}
                    >
                        <ModalContent
                            component={motion.div}
                            layoutId={`skillgriditem-${selectedItem.id}`}
                            sx={{
                                bgcolor: 'rgba(250,250,250,1)',
                            }}
                        >
                            <SvgSplitColor color={selectedItem.color}
                                transform="translateZ(30px)" transformStyle="preserve-3d"
                            />
                            <AnimateCard>
                                <AnimateCardContent content={selectedItem} />
                            </AnimateCard>
                        </ModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
};

const AnimatedGridItem = styled(Box)(({ theme }) => ({
    borderRadius: 'inherit',
    cursor: 'pointer',
    width: '100%', height: '100%'
}));

const GridItemContent = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: (theme.vars || theme).palette.text.primary,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        borderRadius: theme.spacing(3),
        padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4),
    },
    position: 'relative',
    width: '100%', height: '100%'
}));

function GridItem3D({ item, children }) {

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <AnimatedGridItem
            component={motion.div}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
                outline: "1px solid transparent",
                backfaceVisibility: "hidden",
            }}
            sx={{
                bgcolor: item.color,
                //border: `1px solid ${item.border}`,
            }}
        >
            {!lesserThanSm &&
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    transform: 'translateZ(0px)',
                    zIndex: 0
                }}>
                    <SvgGlow opacity={0.6} />
                </Box>
            }
            <GridItemContent
                style={{
                    transform: "translateZ(60px)",
                    transformStyle: "preserve-3d",
                }}
            >
                {children}
            </GridItemContent>
        </AnimatedGridItem>
    );
};

const StyledCard = styled(Box)(({ theme }) => ({
    width: '80%', maxWidth: 600, height: 400,
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
    transform: "translateZ(60px)",
    transformStyle: "preserve-3d",
}));

const cardVars = {
    hidden: { opacity: 0, },
    visible: {
        opacity: 1,
    },
    static: { opacity: 1, transition: { duration: 0 } },
};

function AnimateCard({ children, }) {

    return (
        <StyledCard
            component={motion.div}
            variants={cardVars}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
        >
            {children}
        </StyledCard>
    );
};

const iconduration = 0.45;
const radius = 150;
const centerX = 150;
const centerY = 150;
const totalcircle = 3;
const circles = Array.from({ length: totalcircle }, (_, i) => ({
    id: i,
    radius: radius * (i + 1) / totalcircle,
}));

const circleVars = {
    hidden: {
        opacity: 0, pathLength: 1,
    },
    dashed: ({ i, duration }) => ({
        opacity: 1,
        strokeOpacity: (i + 1) * 0.4,
        strokeDasharray: "4 4",
        strokeDashoffset: [0, -8],
        transition: {
            strokeDashoffset: {
                repeat: Infinity,
                ease: "linear",
                duration: 1.5 * (totalcircle - i)
            },
            opacity: {
                duration: duration,
                delay: i * duration,
                ease: "easeInOut"
            },
        }
    }),
    solid: ({ i, duration }) => ({
        opacity: 1,
        pathLength: 1,
        transition: {
            opacity: {
                duration: duration,
                delay: i * duration,
                ease: "easeInOut"
            },
            pathLength: {
                duration: duration,
                delay: i * duration,
                ease: "easeInOut"
            },
        }
    }),
    success: ({ duration }) => ({
        strokeWidth: [1.5, 3, 1.5],
        transition: {
            delay: (totalcircle * duration),
            duration: 0.8,
            ease: "easeInOut"
        }
    }),
    static: { opacity: 1, pathLength: 1, strokeOpacity: 1, strokeWidth: 1.5, transition: { duration: 0 } }
};

const AnimateCircles = memo(({ total, colors }) => {

    const duration = (total * iconduration) / totalcircle;

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    return (
        <React.Fragment>
            {circles.map((v, i) => (
                <motion.circle
                    key={`circle-${i}`}
                    custom={{ i, duration }}
                    variants={circleVars}
                    initial={'hidden'}
                    animate={mode == 'normal' ? ['solid', 'success'] : "static"}
                    cx={centerX}
                    cy={centerY}
                    r={v.radius}
                    fill="none"
                    stroke={colors[i]}
                    style={{ rotate: -90, }}
                />
            ))}
        </React.Fragment>
    );
});

const CardContentContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: 'inherit',
}));

const CardContentCenter = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontFamily: 'Archivo',
}));

const CardContentCircles = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'visible'
}));

function AnimateCardContent({ content = {} }) {

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
        <CardContentContainer id='test'>
            <CardContentCenter>
                {content.title}
            </CardContentCenter>
            <CardContentCircles
                component={'svg'}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            >
                <AnimateCircles total={positionedIcons.length} colors={content.circlecolors} />
            </CardContentCircles>
            {positionedIcons.map((icon, i) => (
                <AnimateIcon icon={icon} i={i} />
            ))}
        </CardContentContainer>
    );
};

const iconVars = {
    hidden: { opacity: 0, scale: 0.9, },
    entrance: (i) => ({
        opacity: 1, scale: [0.9, 1.1, 1],
        transition: {
            delay: i * iconduration,
            scale: {
                delay: i * iconduration,
                duration: iconduration,
                times: [0, 0.5, 1],
                ease: "easeInOut"
            },
            opacity: { delay: i * iconduration, duration: iconduration }
        }
    }),
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 160, damping: 20 }
    },
    static: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0 } },
};

const AvatarContainer = styled(Box)(({ theme }) => ({
    width: 56, height: 56,
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
        width: 48, height: 48,
    },
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    position: 'relative',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48, height: 48,
    background: 'transparent',
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
        width: 40, height: 40,
    },
}));

const IconText = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    pt: theme.spacing(1),
    whiteSpace: 'nowrap',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Instrument Sans',
    textAlign: 'center',
    opacity: 0.8,
    color: 'rgba(0,0,0,1)',
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
    },
}));

function AnimateIcon({ icon, i }) {

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const controls = useAnimation();

    useEffect(() => {
        controls.start("entrance").then(() => {
            controls.set("visible");
        });
    }, [controls]);

    return (
        <Box
            key={`icon-${i}`}
            sx={{
                position: 'absolute',
                transform: `translate(${icon.x}px, ${icon.y}px) translate(-50%, -50%)`
            }}
        >
            <AvatarContainer
                component={motion.div}
                custom={i}
                variants={iconVars}
                initial={'hidden'}
                animate={mode == 'normal' ? controls : "static"}
                whileHover={{
                    scale: 1.1,
                    y: -6,
                    transition: { type: "spring", stiffness: 160, damping: 20 }
                }}
                whileTap={{ scale: 0.95 }}
            >
                <SvgGlassOverlay i={i} />
                <StyledAvatar src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                    alt={icon.name} />
                <IconText>
                    {icon.name}
                </IconText>
            </AvatarContainer>
        </Box>
    );
};