import React, { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import marketintelligence from '../pics/marketintelligence.webp';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.webp';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';
import GrainOverlay from './GrainOverlay';
import GlassOverlay, { BevelGlassOverlay, BorderSheen } from './GlassOverlay';
import glassbg from '../pics/glassbg.webp';


const projectInfo = [
  {
    id: 1,
    img: marketintelligence,
    header: 'Market Intelligence',
    tech: [
      'Long-Horizon Time Series Forecasting', 'Neural Hierarchical Interpolation for Time Series',
      'Dual-Residual Learning Framework',
      'Python', 'Node.js', 'PyTorch', 'ONNX', 'React', 'JavaScript', 'AWS', 'Docker',
    ],
    descriptions: [
      'Full-stack financial analytics application that ingests real-time market data to forecast trends.',
      'On-device predictive AI model build on PyTorch and ONNX, achieving a <2% sMAPE to ensure high-fidelity capture of complex market patterns.',
    ],
    link: 'https://marketintelligence0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    id: 2,
    img: researchdigest,
    header: 'Research Digest',
    tech: [
      'Bi-Encoder Text Embedding Transformer', 'Retrieval-Augmented Generation',
      'Lightweight Embedding Alignment Framework', 'Semantic Search',
      'HuggingFace', 'React', 'Node.js', 'JavaScript', 'AWS',
    ],
    descriptions: [
      'Knowledge retrieval portal for searching scientific literature.',
      'Client-side Retrieval-Augmented Generation-based real-time Question Answering of papers.',
      'Optimized performances using multi-threading to offload heavy model inference computations, preserving UI responsiveness.',
    ],
    link: 'https://researchdigest0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    id: 3,
    img: mealplanner,
    header: 'Meal Planner',
    tech: [
      'Auto-Regressive Transformer Decoder', 'Probabilistic Next-Token Prediction',
      'MobileLLM Architecture', 'Edge AI Deployment',
      'Node.js', 'React', 'JavaScript', 'HuggingFace', 'AWS',
    ],
    descriptions: [
      'Elastically scalable meal planning solution utilizing AWS cloud infrastructure, aggregating data sources to provide a holistic user experience for recipe and nutritional retrieval.',
      'Quantized, web-based Grouped-Query Attention Transformer to deliver a low-latency, stateful chat-driven interface for recipe and nutritional retrieval.'
    ],
    link: 'https://mealplanner0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    id: 4,
    img: artexplorer,
    header: 'Art Explorer',
    tech: [],
    descriptions: [
      'Artwork search engine presenting information on artists, art descriptions, and comprehensive historical details.',
    ],
    link: 'https://artexplorer0.s3.us-east-2.amazonaws.com/index.html'
  },
];

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const header = '70px';
const CARDH = 450;
const CARDHsm = 350;

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100dvw', height: `100dvh`,
  overflow: 'hidden',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1),
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  width: '100%', //height: 'auto'
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 1,
}));

export default function Projects({ refProps, handleViewport }) {
  const [page, setPage] = useState(1);
  const [hoveredProj, setHoveredProj] = useState(null);

  const handleHovering = useCallback((v) => {
    setHoveredProj(v);
  }, []);

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));
  const lesserThanSm = useMediaQuery(theme.breakpoints.down('sm'));

  const perpage = lesserThanSm ? 1
    : lesserThanMd
      ? 2 : 3;
  const maxpage = Math.ceil(projectInfo.length / perpage);

  const handlePageChange = useCallback((_, v) => {
    setPage(v);
  }, []);

  const currentPage = useMemo(() =>
    projectInfo.slice((page - 1) * perpage, page * perpage),
    [page, perpage]
  );

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const isNormal = mode === 'normal';

    return {
      gridcontainer: isNormal ? "visible" : "static",

      animate: !isNormal ? "static" : (hoveredProj ? "hidden" : "initial"),
      hover: isNormal ? "hover" : "static",

      pulse: isNormal ? "animate" : "static",

      image: isNormal ? "animate" : "static",
    };
  }, [mode, hoveredProj]);

  return (
    <SectionContainer
      //ref={el => refProps.current['projects'] = el}
      onViewportEnter={() => handleViewport('projects', true)}
      onViewportLeave={() => handleViewport('projects', false)}
      viewport={{ amount: 0.5 }}
      id="projects"
      maxWidth="lg"
    >
      <ContentBox>
        <ProjectsGrid currentPage={currentPage} page={page} perpage={perpage}
          hoveredProj={hoveredProj}
          handleHovering={handleHovering}
          animationConfig={animationConfig}
        />
        <Pagination count={maxpage} page={page} onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', }} />
      </ContentBox>
      <HoveredAnimation hoveredProj={hoveredProj} animationConfig={animationConfig} />
    </SectionContainer >
  );
}

const GRIDGAP = 4;

const GridContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(GRIDGAP),
}));

const StyledGridItem = styled(MotionBox)(({ theme }) => ({
  width: `calc(33.33% - ${theme.spacing(GRIDGAP)})`, height: CARDH + 50,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: '32px',
  backfaceVisibility: "hidden",
  isolation: 'isolate',
  '& .MuiPaper-root': {
    border: `none`,
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(50% - ${theme.spacing(GRIDGAP)})`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  '@media (max-height: 600px)': {
    height: CARDHsm + 50,
  },
}));

const containerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.45,
    },
  },
  static: { opacity: 1, },
};

const itemVars = {
  hidden: {
    opacity: 0,
    y: 20,
    clipPath: "inset(0% -10% 100% -10%)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% -10% 0% -10%)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  static: { opacity: 1, y: 0, clipPath: "inset(0% -10% 0% -10%)", },
};

const ProjectsGrid = memo(function ProjectsGrid({ currentPage, page, perpage, hoveredProj,
  handleHovering, animationConfig }) {

  return (
    <GridContainer container key={`${page}-${perpage}`} spacing={2}
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.gridcontainer}
      viewport={{ once: false, amount: 0.5 }}
    >
      <AnimatePresence mode='wait'>
        {currentPage.map((v, i) => (
          <StyledGridItem
            key={v.id}
            size={{ xs: 12, sm: 6, md: 4 }}
            variants={itemVars}
          >
            <ProjectCard v={v}
              hoveredProj={hoveredProj}
              handleHovering={handleHovering} animationConfig={animationConfig}
            />
          </StyledGridItem>
        ))}
      </AnimatePresence>
    </GridContainer>
  );
});

const CardContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%', height: CARDH,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
  isolation: 'isolate',
  '@media (max-height: 600px)': {
    height: CARDHsm,
  },
}));

const RestBorder = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
  borderRadius: "inherit",
  zIndex: 0,
  pointerEvents: "none",
  backfaceVisibility: 'hidden',
}));

const CardGlow = styled(MotionBox)(({ theme }) => {
  const color = (theme.vars || theme).palette.primary.mainChannel;

  return {
    position: "absolute", inset: 0,
    borderRadius: "inherit",
    boxShadow: `0 0 10px rgba(${color} / 0.8)`,
    border: `1px solid rgba(${color} / 0.75)`,
    background: 'transparent',
    backfaceVisibility: "hidden",
  };
});

const BORDERWIDTH = 1.5;

const HoverBorder = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: -BORDERWIDTH,
  borderRadius: "inherit",
  zIndex: -2,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "destination-out",
  padding: `${BORDERWIDTH}px`,
  pointerEvents: "none",
  backfaceVisibility: 'hidden',
}));

const HueRotateLayer = styled(MotionBox)(({ theme, bg }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: bg,
  willChange: "opacity",
  backfaceVisibility: 'hidden',
}));

const blursize = 4;

const RestBg = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
  borderRadius: "inherit",
  background: `
      radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)
    `,
  boxShadow: `
      inset 0 1px 1px rgba(255, 255, 255, 0.15), 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1)
    `,
  //backdropFilter: 'blur(2px)',
  //WebkitBackdropFilter: 'blur(2px)',
  zIndex: -1,
  overflow: 'hidden',
  backfaceVisibility: "hidden",
  "&::before": {
    content: '""',
    position: "absolute", inset: -blursize,
    backgroundImage: `url(${glassbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: `blur(${blursize}px)`,
  }
}));

const HoverBg = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: `rgba(${(theme.vars || theme).palette.background.defaultChannel} / 0.15)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  //boxShadow: `inset 0 0 1px rgba(255, 255, 255, 0.3), 
  //  inset 0 0 20px rgba(255, 255, 255, 0.05)`,
  //boxShadow: `0 10px 20px rgba(15,15,15, 0.05), 0 6px 6px rgba(15,15,15, 0.08)`,
  zIndex: -1,
  backfaceVisibility: "hidden",
}));

const BloomBg = styled(MotionBox)(({ theme, bg }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: bg,
  maskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  WebkitMaskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  zIndex: 0,
  "--inner": "0%",
  "--outer": "0%",
  backfaceVisibility: "hidden",
}));

const StyledCard = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  //transformStyle: "preserve-3d",
  backfaceVisibility: "hidden",
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
}));

const CardContent = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  padding: theme.spacing(2),
  display: 'flex', flexDirection: 'column',
  justifyContent: 'space-start', alignItems: 'center',
  gap: theme.spacing(1),
  boxSizing: 'border-box',
  cursor: 'none',
  backfaceVisibility: "hidden",
}));

const CardImageContainer = styled(MotionBox)(({ theme }) => ({
  height: '150px',
  position: 'relative',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  boxShadow: `
    2px 4px 3px rgba(0, 0, 0, 0.15),
    4px 8px 10px rgba(0, 0, 0, 0.1),
    8px 16px 20px rgba(0, 0, 0, 0.05)
  `,
  backfaceVisibility: "hidden",
}));

const CardImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
}));

const StyledCardHeader = styled(MotionBox)(({ theme }) => ({
  paddingTop: theme.spacing(2), //paddingBottom: theme.spacing(1),
  fontFamily: 'Lora, sans-serif',
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  textAlign: 'center',
  backfaceVisibility: "hidden",
  background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
  boxShadow: `0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.3)`,
}));

const TechStackContainer = styled(MotionBox)(({ theme }) => ({
  width: '100%',
  display: 'flex', justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  boxSizing: 'border-box',
  backfaceVisibility: "hidden",
}));

const TechChip = styled(motion.span)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Fraunces, sans-serif',
  letterSpacing: '0.02em',
  textAlign: 'center',
  color: '#ffffff',
  backfaceVisibility: "hidden",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  justifyContent: 'center',
  textAlign: 'center',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  '& .MuiListItemText-primary': {
    fontFamily: 'Fraunces, sans-serif',
    lineHeight: 1.5,
    fontSize: '18px',
    fontWeight: 500,
    textAlign: 'center',
  },
}));

const ZBASE = { scale: 1 };
const ZHOVER = { scale: 1.1 };

const cardcontainerVars = {
  initial: {
    opacity: 1, ...ZBASE,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  hover: {
    opacity: 1, ...ZHOVER,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0, ...ZBASE,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  static: {
    opacity: 1, ...ZBASE,
    transition: { duration: 0 }
  }
};

const borderwrapperVars = {
  initial: ({ io, ho } = {}) => ({
    opacity: io,
  }),
  hover: ({ io, ho } = {}) => ({
    opacity: ho,
    transition: { duration: 0.4 }
  }),
  hidden: { opacity: 0, },
  static: { opacity: 0, }
};

const restborderVars = {
  initial: ({ oa, ob, d } = {}) => ({ opacity: oa }),
  animate: ({ oa, ob, d } = {}) => ({
    opacity: [oa, ob, oa],
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  })
};

const bordersheenVars = {
  initial: {
    opacity: 0.3,
  },
  animate: ({ d } = { d: 10 }) => ({
    opacity: [0.3, 0.8, 0.3],
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  }),
  static: {
    opacity: 0,
  }
};

const hoverbgVars = {
  initial: ({ io, ho } = { io: 1, ho: 1 }) => ({
    opacity: io,
  }),
  hover: ({ io, ho } = { io: 1, ho: 1 }) => ({
    opacity: ho,
    transition: { duration: 0.3, ease: "easeOut" }
  }),
  hidden: {
    opacity: 0,
    transition: { duration: 0.3 }
  },
  static: {
    opacity: 1,
    transition: { duration: 0 }
  }
};

const bloomVars = {
  initial: {
    opacity: 0,
    "--inner": "0%", "--outer": "100%",
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  },
  hover: {
    opacity: 1,
    "--inner": ["0%", "0%", "100%"],
    "--outer": ["0%", "100%", "100%"],
    transition: {
      duration: 1,
      times: [0, 0.5, 0.85]
    }
  },
  hidden: {
    opacity: 0,
    "--inner": "0%", "--outer": "0%",
  },
  static: {
    opacity: 0,
    "--inner": "0%", "--outer": "0%",
    transition: { duration: 0 }
  }
};

const cardVars = {
  initial: {
    opacity: 1, ...ZBASE,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  hover: {
    opacity: 1, ...ZHOVER,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0, ...ZBASE,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  static: {
    opacity: 1, ...ZBASE,
    transition: { duration: 0 }
  }
};

const techchipcontainerVars = {
  initial: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.25,
      staggerChildren: 0.35,
    },
  },
  static: { opacity: 1 },
};

const techchipVars = {
  initial: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      mass: 0.5
    }
  },
  static: { scale: 1, opacity: 1 },
};

const paletteA = ['#70d6ff', '#ae97ff', '#9792ff'];
const paletteB = ['#ff97c1', '#ffb38a', '#ffd670'];

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ProjectCard = memo(function ProjectCard({ v, hoveredProj, handleHovering, animationConfig }) {

  const cardRef = useRef(null);
  const activeProj = useMemo(() => hoveredProj && hoveredProj.header === v.header, [hoveredProj]);

  useEffect(() => {
    if (!activeProj && cardRef.current) {
      cardRef.current.scrollTop = 0;
    }
  }, [activeProj]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();

    window.open(v.link, '_blank', 'noopener,noreferrer');
  }, [v.link])

  const borderConfig = useMemo(() => {

    const generateLayerData = (palette) => {
      const colors = shuffle(palette);
      const s1 = Math.floor(Math.random() * 20);
      const s2 = Math.floor(Math.random() * (70 - 30) + 30);
      const s3 = Math.floor(Math.random() * (100 - 80) + 80);

      return `linear-gradient(${Math.floor(Math.random() * 360)}deg, 
        ${colors[0]} ${s1}%, 
        ${colors[1]} ${s2}%, 
        ${colors[2]} ${s3}%)`;
    };

    return {
      gradientA: generateLayerData(paletteA),
      gradientB: generateLayerData(paletteB),
      duration: Math.floor(Math.random() * 10) + 10,
    };
  }, []);

  return (
    <CardContainer
      variants={cardcontainerVars}
      initial="initial"
      animate={activeProj ? 'hover' : animationConfig.animate}
      whileHover={animationConfig.hover}
    >
      <RestBorder
        custom={{ io: 1, ho: 0 }}
        variants={borderwrapperVars}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <BorderSheen
          custom={{ d: borderConfig.duration }}
          variants={bordersheenVars}
          initial='initial'
          animate='animate'
        />
      </RestBorder>
      <HoverBorder
        custom={{ io: 0, ho: 1 }}
        variants={borderwrapperVars}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <HueRotateLayer
          variants={restborderVars}
          custom={{ oa: 0.9, ob: 0.4, d: borderConfig.duration }}
          animate={animationConfig.pulse}
          bg={borderConfig.gradientA}
        />
        <HueRotateLayer
          variants={restborderVars}
          custom={{ oa: 0.4, ob: 0.9, d: borderConfig.duration }}
          animate={animationConfig.pulse}
          bg={borderConfig.gradientB}
        />
      </HoverBorder>
      <RestBg
        variants={hoverbgVars}
        custom={{ io: 0.4, ho: 0 }}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <BevelGlassOverlay />
      </RestBg>
      <HoverBg
        variants={hoverbgVars}
        custom={{ io: 0, ho: 1 }}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <GrainOverlay opacity={0.2} contrast='200%' />
      </HoverBg>
      <BloomBg
        variants={bloomVars}
        animate={activeProj ? 'hover' : animationConfig.animate}
        bg={borderConfig.gradientA}
      />
      <StyledCard
        ref={cardRef}
        variants={cardVars}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <CardContent
          onMouseEnter={() => handleHovering(v)}
          onMouseLeave={() => handleHovering(null)}
          onClick={handleClick}
        >
          {!hoveredProj &&
            <CardImageContainer>
              <CardImage src={v.img} />
            </CardImageContainer>
          }
          <StyledCardHeader>{v.header}</StyledCardHeader>
          {hoveredProj &&
            <motion.div>
              {v.descriptions.map((description, i) => (
                <StyledListItem key={i}>
                  <StyledListItemText primary={description} />
                </StyledListItem>
              ))}
            </motion.div>
          }
          <TechStackContainer
            variants={techchipcontainerVars}
            initial='initial'
            whileInView={'visible'}
          >
            {v.tech.map((t, i) => (
              <TechChip
                key={i}
                variants={techchipVars}
              >
                {!hoveredProj && <BevelGlassOverlay opacity={0.45} />}
                <GrainOverlay opacity={0.1} bgcolor='#ffffff' contrast='200%' />
                {t}
              </TechChip>
            ))}
          </TechStackContainer>
        </CardContent>
      </StyledCard>
    </CardContainer>
  )
});

const AnimatedToolTip = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '70px', height: '70px',
  top: 0, left: 0,
  willChange: 'transform,opacity',
  backfaceVisibility: "hidden",
  borderRadius: '50%',
  pointerEvents: 'none',
  padding: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Playfair Display',
  lineHeight: 1.1,
  fontSize: '14px',
  fontWeight: 500,
}));

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  zIndex: -1,
  backfaceVisibility: "hidden",
  pointerEvents: 'none',
}));

const ImageOverlay = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: 0,
  background: (theme.vars || theme).palette.background.default,
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
}));

const TOOLTIPCONFIG = { stiffness: 450, damping: 40, mass: 0.5 };

const tooltipVars = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

const imageVars = {
  initial: { opacity: 0, scale: 1.1 },
  animate: ({ o } = { o: 1 }) => ({
    opacity: o, scale: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }),
  exit: { opacity: 0, scale: 1.05 },
  static: { opacity: 0, scale: 1 },
};

const HoveredAnimation = memo(function HoveredAnimation({ hoveredProj, animationConfig }) {

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const sx = useSpring(mouseX, TOOLTIPCONFIG);
  const sy = useSpring(mouseY, TOOLTIPCONFIG);

  useEffect(() => {
    if (!hoveredProj) return;

    const updateMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', updateMouse, { passive: true });
    return () => window.removeEventListener('mousemove', updateMouse);
  }, [hoveredProj, mouseX, mouseY]);

  if (!hoveredProj) return null;

  return (
    <AnimatePresence mode='wait'>
      <AnimatedToolTip
        variants={tooltipVars}
        initial='initial'
        animate='animate'
        exit='initial'
        style={{
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          zIndex: 1000,
        }}
      >
        View <br /> Project
      </AnimatedToolTip>
      <ImageContainer
        custom={{ o: 1 }}
        variants={imageVars}
        initial='initial'
        animate={animationConfig.image}
        exit='exit'
      >
        <ImageOverlay
          custom={{ o: 0.1 }}
          variants={imageVars}
        />
        <StyledImage src={hoveredProj.img} />
      </ImageContainer>
    </AnimatePresence>
  )
});