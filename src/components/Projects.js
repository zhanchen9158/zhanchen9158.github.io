import React, { useState, useRef, forwardRef, useCallback, useEffect, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import marketintelligence from '../pics/marketintelligence.webp';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.webp';
import {
  motion, useMotionValue, useSpring, AnimatePresence,
  useAnimation, useInView
} from "motion/react";
import { styled, useTheme } from '@mui/material/styles';
import { useAnimateContext } from './AnimateContext';
import GrainOverlay from './GrainOverlay';
import GlassOverlay, { BevelGlassOverlay, BorderSheen } from './GlassOverlay';


const PROJECTSINFO = [
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
      'On-device predictive AI model build on PyTorch and ONNX, achieving a <2% sMAPE to ensure high-fidelity capture of complex market patterns.',
      'Full-stack financial analytics application that ingests real-time market data to forecast trends.',
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
      'HuggingFace', 'Node.js', 'JavaScript', 'React', 'AWS',
    ],
    descriptions: [
      'Client-side Retrieval-Augmented Generation AI for real-time Question Answering of papers.',
      'Knowledge retrieval portal for searching scientific literature.',
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
      'Node.js', 'JavaScript', 'HuggingFace', 'React', 'AWS',
    ],
    descriptions: [
      'Quantized, web-based Grouped-Query Attention Transformer to deliver a low-latency, stateful chat-driven interface for recipe and nutritional retrieval.',
      'Elastically scalable meal planning solution utilizing AWS cloud infrastructure, aggregating data sources to provide a holistic user experience for recipe and nutritional retrieval.',
    ],
    link: 'https://mealplanner0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    id: 4,
    img: artexplorer,
    header: 'Art Explorer',
    tech: ['React', 'JavaScript', 'AWS',],
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
  display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
  height: `100dvh`,
  overflow: 'hidden',
}));

function Projects({ refProps, handleViewport }) {
  const [hoveredProj, setHoveredProj] = useState(null);

  const handleHovering = useCallback((v) => {
    setHoveredProj(v);
  }, []);

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const isNormal = mode === 'normal';

    return {
      gridcontainer: isNormal ? "visible" : "static",

      carouselentrance: isNormal ? 'visible' : 'static',
      carouselrotate: isNormal ? 'animate' : 'static',

      headerinitial: isNormal ? 'initial' : 'static',
      headerexit: isNormal ? 'exit' : 'static',

      animate: !isNormal ? "static" : (hoveredProj ? "hidden" : "initial"),
      bloom: !isNormal ? "static" : (hoveredProj ? "hidden" : "hidden"),
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
      <ProjectsCarousel
        hoveredProj={hoveredProj}
        handleHovering={handleHovering}
        animationConfig={animationConfig}
      />
      <HoveredAnimation hoveredProj={hoveredProj} animationConfig={animationConfig} />
    </SectionContainer >
  );
}

const CarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%', //height: 'auto'
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexDirection: 'column',
  marginTop: theme.spacing(12),
  gap: theme.spacing(1),
  //zIndex: 1,
}));

const CarouselContent = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  //flexWrap: 'wrap',
  gap: theme.spacing(4),
  backfaceVisibility: "hidden",
}));

const CARD_RADIUS = 32;

const CarouselRotationAnimation = styled(MotionBox)(({ theme }) => ({
  width: '400px', height: CARDH + 50,
  borderRadius: `${CARD_RADIUS}px`,
  backfaceVisibility: "hidden",
  [theme.breakpoints.down('sm')]: {
    width: '300px', height: CARDHsm + 50,
  },
}));

const TRANSITIONCONFIG = {
  headeranimation: 8,
  headerrotate: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
  headerhover: { duration: 0.6, ease: "easeOut" },

  carouselduration: 1.2,
  cardscaleduration: 1.2,
  hover: { delay: 0.3, duration: 0.5, ease: "easeInOut" },
};

const carouselentranceVars = {
  hidden: {
    opacity: 0.6, filter: 'blur(4px)',
  },
  visible: {
    opacity: 1, filter: 'blur(0px)',
    transition: {
      delay: 1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.5,
    }
  },
  static: {
    opacity: 1, filter: 'blur(0px)',
  },
};

const carouselrotateVars = {
  initial: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.9,
    filter: 'blur(4px)',
  }),
  animate: {
    opacity: 1, scale: 1,
    x: 0,
    zIndex: 1,
    filter: 'blur(0px)',
    transition: {
      duration: TRANSITIONCONFIG.carouselduration,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: (direction) => ({
    opacity: 0, scale: 0.9,
    x: direction < 0 ? 100 : -100,
    zIndex: 0,
    filter: 'blur(4px)',
  }),
  static: {
    opacity: 1, scale: 1,
    x: 0,
    filter: 'blur(0px)',
  },
};

const projlength = PROJECTSINFO.length;
const getIndex = (i) => (i + projlength) % projlength;

const ProjectsCarousel = memo(function ProjectsCarousel({ hoveredProj,
  handleHovering, animationConfig }) {
  const [[index, direction], setIndex] = useState([0, 0]);

  const prevIndex = getIndex(index - 1);
  const nextIndex = getIndex(index + 1);

  const paginate = useCallback((newIndex) => {
    if (index === newIndex) return;

    setIndex(prev => {
      const diff = newIndex - prev[0];
      return [newIndex, diff > 0 ? 1 : -1]
    });
  }, [index]);

  return (
    <CarouselContainer>
      <AnimatedProjectHeader proj={PROJECTSINFO[index]}
        hoveredProj={hoveredProj} animationConfig={animationConfig}
      />
      <CarouselContent
        variants={carouselentranceVars}
        initial="hidden"
        whileInView={animationConfig.carouselentrance}
        viewport={{ once: false, amount: 0.5 }}
      >
        <AnimatePresence mode='popLayout' custom={direction}>
          {[prevIndex, index, nextIndex].map((projindex, i) => (
            <CarouselRotationAnimation
              key={`${PROJECTSINFO[projindex].id}-${projindex}`}
              custom={direction}
              variants={carouselrotateVars}
              initial='initial'
              animate='animate'
              exit='exit'
            >
              <AnimatedCarouselItem //key={PROJECTSINFO[projindex].id}
                projindex={projindex} i={i}
                hoveredProj={hoveredProj} handleHovering={handleHovering}
                animationConfig={animationConfig}
              />
            </CarouselRotationAnimation>
          ))}
        </AnimatePresence>
      </CarouselContent>
      <PaginationControls currentIndex={index} paginate={paginate}
        direction={direction} total={projlength} />
    </CarouselContainer>
  );
});

const StyledCardHeader = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  //marginTop: theme.spacing(8),
  fontFamily: 'DM Serif Display, sans-serif',
  fontSize: 'clamp(20px, 3vw, 32px)',
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase', fontStyle: 'italic',
  textAlign: 'center',
  WebkitFontSmoothing: 'antialiased',
  backfaceVisibility: "hidden",
  color: 'rgba(255, 255, 255, 0.8)',
  textShadow: `
    0 8px 12px rgba(0, 0, 0, 0.3),   
    0 2px 2px rgba(0, 0, 0, 0.1)     
  `,
  backgroundImage: `linear-gradient(
    120deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.8) 50%, 
    rgba(255,255,255,0) 100%
  )`,
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
}));

const CardHeaderUnderline = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '60%', height: '2px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
  transformOrigin: 'center',
  backfaceVisibility: "hidden",
}));

const headerVars = {
  initial: {
    backgroundPosition: '-100% 0%',
    letterSpacing: '0.12em',
    opacity: 0, scale: 1,
    y: -10,
    transition: TRANSITIONCONFIG.headerrotate
  },
  visible: {
    backgroundPosition: '-100% 0%',
    letterSpacing: '0.12em',
    opacity: 0.9, scale: 1,
    y: 0,
    transition: TRANSITIONCONFIG.headerrotate
  },
  animate: {
    backgroundPosition: '100% 0%',
    letterSpacing: '0.2em',
    opacity: 1,
    scale: 1.02,
    y: -10,
    transition: {
      backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
      letterSpacing: TRANSITIONCONFIG.headerhover,
      scale: TRANSITIONCONFIG.headerhover,
      y: TRANSITIONCONFIG.headerhover,
    }
  },
  exit: {
    backgroundPosition: '-100% 0%',
    letterSpacing: '0.12em',
    opacity: 0, scale: 1,
    y: 10,
    transition: TRANSITIONCONFIG.headerrotate,
  },
  static: {
    backgroundPosition: '-100% 0%',
    letterSpacing: '0.12em',
    opacity: 0.9, scale: 1,
    y: 0,
  },
};

const underlineVars = {
  initial: {
    opacity: 1, scaleX: [0.5, 1],
    transition: {
      duration: TRANSITIONCONFIG.headeranimation,
      repeat: Infinity, repeatType: "mirror", ease: "easeInOut"
    }
  },
  animate: {
    opacity: 0, scaleX: 0,
    transition: TRANSITIONCONFIG.headerhover,
  },
};

const AnimatedProjectHeader = memo(function AnimatedProjectHeader({ proj,
  hoveredProj, animationConfig }) {

  return (
    <React.Fragment>
      <AnimatePresence mode='wait'>
        <StyledCardHeader
          key={proj.id}
          variants={headerVars}
          initial={animationConfig.headerinitial}
          animate={hoveredProj ? "animate" : "visible"}
          exit={animationConfig.headerexit}
        >
          {proj.header}
        </StyledCardHeader>
      </AnimatePresence>
      <CardHeaderUnderline
        variants={underlineVars}
        initial="initial"
        animate={hoveredProj ? "animate" : "initial"}
      />
    </React.Fragment>
  );
});

const CarouselItem = styled(MotionBox)(({ theme, isActive }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  backfaceVisibility: "hidden",
  isolation: 'isolate',
  zIndex: isActive ? 10 : 1,
}));

const AnimatedCarouselItem = motion(forwardRef(function AnimatedCarouselItem({ projindex,
  i, hoveredProj, handleHovering, animationConfig }, ref) {

  const isActive = useMemo(() => i === 1, [i]);

  return (
    <CarouselItem
      ref={ref}
      layout
      transition={{
        duration: TRANSITIONCONFIG.carouselduration,
        ease: [0.22, 1, 0.36, 1],
      }}
      isActive={isActive}
    >
      <ProjectCard projinfo={PROJECTSINFO[projindex]} isActive={isActive}
        hoveredProj={hoveredProj} handleHovering={handleHovering}
        animationConfig={animationConfig}
      />
    </CarouselItem>
  );
}));

const CardContainer = styled(MotionBox)(({ theme, isActive }) => ({
  position: 'relative',
  width: '100%', height: CARDH,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
  isolation: 'isolate',
  [theme.breakpoints.down('sm')]: {
    height: CARDHsm,
  },
  '@media (max-height: 600px)': {
    height: CARDHsm,
  },
  cursor: isActive ? 'none' : 'default',
}));

const RestBorder = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
  borderRadius: "inherit",
  zIndex: 0,
  pointerEvents: "none",
  backfaceVisibility: 'hidden',
}));

const BorderGlow = styled(MotionBox)(({ theme }) => {
  const color = (theme.vars || theme).palette.primary.lightChannel;

  return {
    position: "absolute", inset: 0,
    borderRadius: "inherit",
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
    border: "1px solid transparent",
    background: `
      linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05)) border-box,
      linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)) padding-box
    `,
    mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box",
    WebkitMaskComposite: "destination-out",
    pointerEvents: "none",
    backfaceVisibility: "hidden",
  };
});

const BORDERWIDTH = 2;

const HoverBorder = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: -BORDERWIDTH,
  borderRadius: `${CARD_RADIUS + BORDERWIDTH + 1}px`,
  zIndex: -2,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "destination-out",
  padding: `${BORDERWIDTH + 1}px`,
  pointerEvents: "none",
  backfaceVisibility: 'hidden',
}));

const HueRotateLayer = styled(MotionBox)(({ theme, bg }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: bg,
  maskImage: 'radial-gradient(circle at top left, white 50%, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(circle at top left, white 50%, transparent 70%)',
  willChange: "opacity",
  backfaceVisibility: 'hidden',
}));

const BgWrapper = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
  borderRadius: "inherit",
  zIndex: -1,
  backfaceVisibility: "hidden",
}));

const GlassSheen = styled(MotionBox)(({ theme, opacity = 1,
  bgcolor, coloropacity = 0, sheencolor = '255,255,255' }) => {
  const color = theme.palette.mode === 'dark'
    ? `rgba(255,255,255, ${coloropacity})`
    : `rgba(255,255,255, ${coloropacity})`;

  return {
    position: "absolute", inset: 0,
    borderRadius: "inherit",
    backgroundColor: bgcolor || color,
    background: `
      linear-gradient(135deg, rgba(${sheencolor}, 0.4), rgba(${sheencolor}, 0.05)) border-box,
      linear-gradient(rgba(${sheencolor}, 0.2), rgba(${sheencolor}, 0.05)) padding-box
    `,
    mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) border-box",
    WebkitMaskComposite: "destination-out",
    opacity: opacity,
    zIndex: 1,
    pointerEvents: "none",
    backfaceVisibility: "hidden",
  };
});

const GlassBg = styled(MotionBox)(({ theme, opacity = 1,
  bgcolor, coloropacity = 0.3 }) => {
  const color = theme.palette.mode === 'dark'
    ? `rgba(22, 28, 36, ${coloropacity + 0.1})`
    : `rgba(22, 28, 36, ${coloropacity})`;

  return {
    position: "absolute", inset: 0,
    borderRadius: "inherit",
    backgroundColor: bgcolor || color,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.1), // Bright inner edge
      0 4px 24px -1px rgba(0, 0, 0, 0.2)        // Soft outer drop
    `,
    opacity: opacity,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    backfaceVisibility: "hidden",
  };
});

const BloomBg = styled(MotionBox)(({ theme, bg }) => ({
  position: "absolute", inset: 0,
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
  //overflow: 'hidden',
  maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
}));

const CardContent = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  padding: theme.spacing(2, 0),
  display: 'flex', flexDirection: 'column',
  justifyContent: 'space-start', alignItems: 'center',
  gap: theme.spacing(1),
  boxSizing: 'border-box',
  backfaceVisibility: "hidden",
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const HoverContent = styled(MotionBox)(({ theme, hover = false }) => ({
  position: 'relative',
  width: '100%', //height: '100%',
  //borderRadius: 'inherit',
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  padding: !hover ? theme.spacing(2, 0) : theme.spacing(2, 4),
  gap: theme.spacing(4),
  backfaceVisibility: "hidden",
}));

const CardImageContainer = styled(MotionBox)(({ theme, isActive = false }) => ({
  position: isActive ? 'absolute' : 'relative',
  top: isActive ? 0 : 'auto',
  height: '150px',
  aspectRatio: 16 / 9,
  borderRadius: '20px',
  boxShadow: `
    2px 4px 3px rgba(0, 0, 0, 0.15),
    4px 8px 10px rgba(0, 0, 0, 0.1),
    8px 16px 20px rgba(0, 0, 0, 0.05)
  `,
  filter: isActive ? 'blur(4px)' : 'blur(0px)',
  backfaceVisibility: "hidden",
}));

const CardImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
  opacity: 0.9,
  backfaceVisibility: "hidden",
}));

const CardText = styled(Box)(({ theme }) => {
  const glowColor = theme.palette.mode === 'dark'
    ? '255, 209, 176'
    : '255, 209, 176';

  return {
    paddingBottom: theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Fraunces, sans-serif',
    lineHeight: 1.6,
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '0.03em',
    textAlign: 'center',
    textShadow: `
      0 2px 4px rgba(0, 0, 0, 0.3),   
      0 2px 12px rgba(${glowColor}, 0.5)
    `,
    backfaceVisibility: "hidden",
  }
});

const TechStackContainer = styled(MotionBox)(({ theme }) => ({
  width: '100%',
  display: 'flex', justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  boxSizing: 'border-box',
  backfaceVisibility: "hidden",
}));

const TechChipHover = styled(MotionBox)(({ theme }) => {
  const glowColor = theme.palette.mode === 'dark'
    ? `214, 138, 122`
    : `214, 138, 122`;

  return {
    position: 'relative',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'Fraunces, sans-serif',
    letterSpacing: '0.02em',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadow: `
      0 1px 2px rgba(0, 0, 0, 0.5),       
      0 0 6px rgba(${glowColor}, 0.9),
      0 0 15px rgba(${glowColor}, 0.4)
    `,
    backfaceVisibility: "hidden",
  };
});

const InActiveHeader = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: 'min-content',
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.1,
  whiteSpace: 'pre-wrap',
  fontFamily: 'Cormorant Garamond, sans-serif',
  fontSize: '30px',
  fontWeight: 800, fontStyle: 'italic',
  letterSpacing: '0.12em',
  textTransform: 'capitalize',
  textAlign: 'center',
  WebkitFontSmoothing: 'antialiased',
  backfaceVisibility: "hidden",
  color: 'rgba(255, 255, 255, 1)',
  textShadow: `
    0 8px 12px rgba(0, 0, 0, 0.3),   
    0 2px 2px rgba(0, 0, 0, 0.1)     
  `,
}));

const ZBASE = { scale: 1 };
const ZHOVER = { scale: 1.2 };

const cardcontainerVars = {
  initial: {
    opacity: 1, ...ZBASE,
    transition: TRANSITIONCONFIG.hover,
  },
  hover: {
    opacity: 1, ...ZHOVER,
    transition: TRANSITIONCONFIG.hover,
  },
  hidden: {
    opacity: 0, ...ZBASE,
  },
  static: {
    opacity: 1, ...ZBASE,
  }
};

const borderwrapperVars = {
  initial: ({ io, ho } = {}) => ({
    opacity: io,
    transition: TRANSITIONCONFIG.hover,
  }),
  hover: ({ io, ho } = {}) => ({
    opacity: ho,
    transition: TRANSITIONCONFIG.hover,
  }),
  hidden: { opacity: 0, },
  static: { opacity: 0, }
};

const pulseVars = {
  initial: ({ oa, ob, d } = {}) => ({ opacity: oa }),
  animate: ({ oa, ob, d } = {}) => ({
    opacity: [oa, ob, oa],
    transition: { duration: d, repeat: Infinity, ease: "easeInOut" }
  }),
  hidden: { opacity: 0, },
  static: { opacity: 0.3, }
};

const bgwrapperVars = {
  initial: ({ io, ho } = { io: 1, ho: 1 }) => ({
    opacity: io,
    transition: TRANSITIONCONFIG.hover,
  }),
  hover: ({ io, ho } = { io: 1, ho: 1 }) => ({
    opacity: ho,
    transition: TRANSITIONCONFIG.hover,
  }),
  hidden: { opacity: 0, },
  static: { opacity: 1, }
};

const glassbgVars = {
  initial: {
    opacity: 0,
    transition: TRANSITIONCONFIG.hover,
  },
  hover: {
    opacity: 1,
    transition: TRANSITIONCONFIG.hover,
  },
  hidden: { opacity: 0, },
  static: { opacity: 1, }
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
  }
};

const cardVars = {
  initial: {
    opacity: 1,
    transition: TRANSITIONCONFIG.hover,
  },
  hover: {
    opacity: 1,
    transition: TRANSITIONCONFIG.hover,
  },
  hidden: {
    opacity: 0,
    transition: TRANSITIONCONFIG.hover,
  },
  static: { opacity: 1, }
};

const hovercontentVars = {
  initial: {
    opacity: 0, scale: 1.15,
    transition: {
      opacity: { duration: 0.75, ease: 'linear' },
      scale: { duration: 1, ease: 'easeIn' },
    }
  },
  animate: (d) => ({
    opacity: 1, scale: 1,
    transition: { duration: d, ease: 'linear' },
  }),
  exit: {
    opacity: 0, scale: 1.1,
    transition: TRANSITIONCONFIG.hover,
  },
  static: { opacity: 1, scale: 1 },
};

const itemVars = {
  initial: { opacity: 0, y: 0, scale: 0.7 },
  active: {
    opacity: 1,
    y: 0,
    scale: 1, rotate: 0,
  },
  inactive: ({ floatingValues } = {}) => ({
    opacity: floatingValues.opacity,
    y: floatingValues.y,
    scale: 0.7,
    rotate: floatingValues.rotate,
    transition: {
      y: {
        duration: floatingValues.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: -floatingValues.delay
      },
      rotate: {
        duration: floatingValues.duration + 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: -floatingValues.delay
      }
    }
  }),
  staticactive: { opacity: 1, x: 0, scale: 1 },
  staticinactive: { opacity: 1, x: 0, scale: 0.7 },
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

const random = (min, max) => Math.random() * (max - min) + min;
const round = (num) => Math.round(num * 100) / 100;

const getFloatingValues = () => {
  const xy1 = 5; const xy2 = 3;

  const ySeed = Math.random() > 0.5;
  const y1 = ySeed
    ? Math.round(random(xy2, xy1))
    : Math.round(random(-xy1, -xy2));
  const y2 = ySeed
    ? Math.round(random(-xy1, -xy2))
    : Math.round(random(xy2, xy1));

  const rotateSeed = Math.random() > 0.5;
  const rotate = rotateSeed
    ? [1, -1, 1]
    : [-1, 1, -1];

  return {
    opacity: [0.6, round(random(0.65, 0.7)), 0.6],
    y: [y1, y2, y1],
    rotate: rotate,
    duration: round(random(8, 12)),
    delay: round(random(0, 4)),
  };
};

const ProjectCard = memo(function ProjectCard({ projinfo, isActive,
  hoveredProj, handleHovering, animationConfig }) {

  const cardRef = useRef(null);
  const activeProj = useMemo(() => isActive && hoveredProj, [isActive, hoveredProj]);

  useEffect(() => {
    if (!activeProj && cardRef.current) {
      cardRef.current.scrollTop = 0;
    }
  }, [activeProj]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (isActive) window.open(projinfo.link, '_blank', 'noopener,noreferrer');
  }, [projinfo.link])

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
      duration: Math.floor(Math.random() * 5) + 5,
    };
  }, []);

  const floatingValues = useMemo(() => getFloatingValues(), [projinfo.id]);

  return (
    <CardContainer
      variants={cardcontainerVars}
      initial="initial"
      animate={hoveredProj ? (isActive ? 'hover' : 'hidden') : 'initial'}
      isActive={isActive}
    >
      {/*<RestBorder
        custom={{ io: 1, ho: 0 }}
        variants={borderwrapperVars}
      >
        <BorderSheen
          custom={{ oa: 0.8, ob: 0.3, d: borderConfig.duration }}
          variants={pulseVars}
          initial='initial'
          animate={isActive ? 'hidden' : 'animate'}
        />
      </RestBorder>*/}
      <HoverBorder
        custom={{ io: 0, ho: 1 }}
        variants={borderwrapperVars}
      >
        <HueRotateLayer
          variants={pulseVars}
          custom={{ oa: 0.9, ob: 0.4, d: borderConfig.duration }}
          initial='initial'
          animate={isActive ? 'animate' : 'initial'}
          bg={borderConfig.gradientA}
        />
        <HueRotateLayer
          variants={pulseVars}
          custom={{ oa: 0.4, ob: 0.9, d: borderConfig.duration }}
          initial='initial'
          animate={isActive ? 'animate' : 'initial'}
          bg={borderConfig.gradientB}
        />
      </HoverBorder>
      <BgWrapper
        key={'hoverbg'}
        variants={bgwrapperVars}
        custom={{ io: 0, ho: 1 }}
      >
        <GlassSheen opacity={0.4} />
        <GlassBg
          variants={glassbgVars}
        />
        <GlassOverlay opacity={0.4} />
      </BgWrapper>
      <BloomBg
        variants={bloomVars}
        bg={borderConfig.gradientA}
      />
      <StyledCard
        variants={cardVars}
      >
        <CardContent
          ref={cardRef}
          onMouseEnter={() => isActive ? handleHovering(projinfo) : null}
          onMouseLeave={() => handleHovering(null)}
          onClick={handleClick}
        >
          {isActive ?
            <AnimatePresence mode='popLayout'>
              {!hoveredProj ?
                <HoverContent
                  key='cardrestcontent'
                  custom={1}
                  variants={hovercontentVars}
                  initial='initial'
                  animate={'animate'}
                  exit='initial'
                >
                  <CardImageContainer
                    isActive={true}
                  >
                    <GlassSheen opacity={0.4} sheencolor={'0,0,0'} />
                    <CardImage src={projinfo.img} />
                  </CardImageContainer>
                  <TechStackContainer>
                    {projinfo.tech.map((t, i) => (
                      <AnimatedTechChip
                        key={i}
                        i={i}
                        isActive={isActive}
                        text={t}
                        animationConfig={animationConfig}
                      />
                    ))}
                  </TechStackContainer>
                </HoverContent>
                :
                <HoverContent
                  key='cardhovercontent'
                  custom={1.2}
                  variants={hovercontentVars}
                  initial='initial'
                  animate={'animate'}
                  exit='initial'
                  hover={true}
                >
                  {projinfo.descriptions.map((description, i) => (
                    <CardText key={i}>
                      {description}
                    </CardText>
                  ))}
                  <TechStackContainer>
                    {projinfo.tech.map((t, i) => (
                      <TechChipHover>{t}</TechChipHover>
                    ))}
                  </TechStackContainer>
                </HoverContent>
              }
            </AnimatePresence>
            :
            <HoverContent>
              <CardImageContainer
                custom={{ floatingValues }}
                variants={itemVars}
                initial={'initial'}
                animate={isActive ? 'active' : 'inactive'}
                exit={'initial'}
              >
                <CardImage src={projinfo.img} />
              </CardImageContainer>
              <InActiveHeader>{projinfo.header}</InActiveHeader>
            </HoverContent>
          }
        </CardContent>
      </StyledCard>
    </CardContainer>
  )
});

const TechChipWrapper = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  padding: theme.spacing(1, 1),
  backfaceVisibility: "hidden",
}));

const TechChip = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  borderRadius: 'inherit',
  fontSize: '20px',
  fontWeight: 600,
  fontFamily: 'Fraunces, sans-serif',
  letterSpacing: '0.02em',
  textAlign: 'center',
  color: '#ffffff',
  textShadow: `
    0 4px 6px rgba(0, 0, 0, 0.3),   
    0 1px 1px rgba(0, 0, 0, 0.1)     
  `,
  backfaceVisibility: "hidden",
}));

const chipwaveVars = {
  animate: (i) => ({
    y: [0, -8, 0, 0, 0],
    scale: [1, 1.05, 1, 1, 1],
    transition: {
      delay: i * 0.4,
      duration: 12,
      times: [0, 0.16, 0.33, 0.33, 1],
      repeat: Infinity,
      ease: "easeInOut",
    }
  }),
  static: { y: 0, scale: 1 }
};

const techchipVars = {
  initial: { opacity: 0, y: 15, scale: 0.95 },
  animate: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      delay: i * 0.06 + 0.4,
      duration: 0.8,
      ease: [0.175, 0.885, 0.32, 1.275]
    }
  }),
  static: { opacity: 1, y: 0, scale: 1 }
};

function AnimatedTechChip({ i, isActive, text, animationConfig }) {
  const chipRef = useRef(null);

  const inView = useInView(chipRef, { once: false, amount: 0.1 });

  return (
    <TechChipWrapper
      custom={i}
      variants={chipwaveVars}
      initial={'static'}
      whileInView={animationConfig.pulse}
    >
      <TechChip
        key={inView ? "in-view" : "not-in-view"}
        ref={chipRef}
        custom={i}
        variants={techchipVars}
        initial="initial"
        animate={inView || isActive ? "animate" : "static"}
      >
        {text}
      </TechChip>
    </TechChipWrapper>
  );
};

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
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Playfair Display',
  lineHeight: 1.1,
  fontSize: '14px',
  fontWeight: 500,
}));

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  top: '50%', left: '50%',
  width: '100%',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  zIndex: -1,
  backfaceVisibility: "hidden",
  pointerEvents: 'none',
}));

const ImageOverlay = styled(MotionBox)(({ theme, opacity = 0.1 }) => ({
  position: 'absolute', inset: 0,
  background: '#000000',
  borderRadius: 'inherit',
  opacity: opacity,
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
    scale: 0.7,
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
  initial: { opacity: 0, scale: 1.1, x: '-50%', y: '-50%', },
  animate: ({ o } = { o: 1 }) => ({
    opacity: o, scale: 1, x: '-50%', y: '-50%',
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }),
  exit: {
    opacity: 0, scale: 1.05, x: '-50%', y: '-50%',
    transition: { duration: 1.5, ease: [0.33, 1, 0.68, 1] }
  },
  static: { opacity: 0, scale: 1, x: '-50%', y: '-50%', },
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

  if (!hoveredProj) return <AnimatePresence />;

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
        key={'projects-bgimage'}
        custom={{ o: 0.8 }}
        variants={imageVars}
        initial='initial'
        animate={animationConfig.image}
        exit='exit'
      >
        <ImageOverlay />
        <StyledImage src={hoveredProj.img} />
      </ImageContainer>
    </AnimatePresence>
  )
});

const DotSize = 12; const Gap = 1.5;
const ActiveDotSize = DotSize * 1;
const DotGap = DotSize * Gap;
const DOT_DISTANCE = DotSize * (1 + Gap);

const NavDock = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  gap: theme.spacing(DotGap / 8),
  marginTop: theme.spacing(4),
}));

const NavDotWrapper = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: DotSize, height: DotSize,
  borderRadius: '50%',
  cursor: 'pointer',
  zIndex: 0,
}));

const NavDot = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  cursor: 'inherit',
}));

const StartingDot = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', left: 0,
  width: ActiveDotSize, height: ActiveDotSize,
  borderRadius: ActiveDotSize,
  background: '#fff',
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
  pointerEvents: 'none',
  zIndex: 1,
}));

const ActiveDot = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', left: 0,
  width: ActiveDotSize, height: ActiveDotSize,
  borderRadius: ActiveDotSize / 2,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 100%)',
  boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
  zIndex: 2,
}));

const navdotVars = {
  initial: {
    scale: 0.75,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  hover: {
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  static: { scale: 1, },
};

const PaginationControls = memo(function PaginationControls({ currentIndex, paginate,
  direction, total = 4 }) {

  const prevIndexRef = useRef(currentIndex);
  const prevIndex = prevIndexRef.current;

  const distance = Math.abs(currentIndex - prevIndex);

  const stretchValue = distance === 0 ? 1 : 1 + (distance * 0.7);
  const targetWidth = distance === 0 ? DotSize : DotSize + (distance * DOT_DISTANCE * 0.8);

  const startLeft = prevIndex * DOT_DISTANCE;
  const endLeft = currentIndex * DOT_DISTANCE;

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  return (
    <NavDock>
      {[...Array(total)].map((_, i) => (
        <NavDotWrapper
          key={i}
          initial='initial'
          whileHover='hover'
          onClick={() => paginate(i)}
        >
          <NavDot
            variants={navdotVars}
          >
            <GlassSheen />
          </NavDot>
        </NavDotWrapper>
      ))}
      <StartingDot
        key={currentIndex}
        initial={{
          opacity: 0.8,
          x: prevIndexRef.current * DOT_DISTANCE,
          ScaleX: 1,
        }}
        animate={{
          opacity: [0.8, 0.6, 0],
          x: prevIndexRef.current * DOT_DISTANCE,
          scaleX: [1, stretchValue, 0.2],
        }}
        transition={{
          opacity: { duration: 1.5, times: [0, 0.7, 1], ease: "easeInOut" },
          scaleX: { duration: 1.5, times: [0, 0.2, 1], ease: "easeInOut" }
        }}
        style={{
          originX: direction > 0 ? 0 : 1,
        }}
      />
      <ActiveDot
        initial={false}
        animate={{
          left: direction > 0
            ? [startLeft, startLeft + (distance * DOT_DISTANCE * 0.2), endLeft]
            : [startLeft, endLeft, endLeft],
          width: [DotSize, targetWidth, DotSize + currentIndex * 0.001],
        }}
        transition={{
          duration: 1,
          times: [0, 0.5, 1],
          ease: ["linear", [0.42, 0, 1, 1]]
        }}
      />
    </NavDock>
  );
});

export default memo(Projects);