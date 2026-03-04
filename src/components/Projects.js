import React, { useState, useRef, forwardRef, useCallback, useEffect, useMemo, memo } from 'react';
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
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  height: `100dvh`,
  overflow: 'hidden',
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(7),
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  width: '100%', //height: 'auto'
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 1,
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

      animate: !isNormal ? "static" : (hoveredProj ? "hidden" : "initial"),
      hover: isNormal ? "hover" : "static",

      glowpulse: isNormal ? "animate" : "static",
      bordersheen: isNormal ? "animate" : "static",

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
  gap: theme.spacing(2),
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

const projlength = PROJECTSINFO.length;
const getIndex = (i) => (i + projlength) % projlength;

const ProjectsCarousel = memo(function ProjectsCarousel({ hoveredProj,
  handleHovering, animationConfig }) {
  const [index, setIndex] = useState(0);

  const prevIndex = getIndex(index - 1);
  const nextIndex = getIndex(index + 1);

  const paginate = useCallback((newDirection) => {
    setIndex((prev) => getIndex(prev + newDirection));
  }, [index]);

  return (
    <CarouselContainer>
      <CarouselContent>
        <AnimatePresence mode='popLayout'>
          {[prevIndex, index, nextIndex].map((projindex, i) => (
            <AnimatedCarouselItem key={PROJECTSINFO[projindex].id}
              projindex={projindex} i={i}
              hoveredProj={hoveredProj} handleHovering={handleHovering}
              animationConfig={animationConfig}
            />
          ))}
        </AnimatePresence>
      </CarouselContent>
      <button onClick={() => paginate(1)}>{">"}</button>
    </CarouselContainer>
  );
});

const CARD_RADIUS = 32;

const CarouselItem = styled(MotionBox)(({ theme, isActive }) => ({
  width: '350px', height: CARDH + 50,
  borderRadius: `${CARD_RADIUS}px`,
  backfaceVisibility: "hidden",
  isolation: 'isolate',
  [theme.breakpoints.down('sm')]: {
    width: '300px', height: CARDHsm + 50,
  },
  zIndex: isActive ? 10 : 1,
}));

const CarouselEntrance = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
}));

const itemVars = {
  initial: { opacity: 0, x: 50, scale: 0.7 },
  active: {
    opacity: 1,
    x: 0, y: 0,
    scale: 1,
  },

  inactive: ({ floatingValues } = {}) => ({
    opacity: floatingValues.opacity,
    x: floatingValues.x, y: floatingValues.y,
    scale: floatingValues.scale,
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
  staticinactive: { opacity: 1, x: 0, scale: 0.8 },
};

const carouselentranceVars = {
  hidden: {
    opacity: 0.6, filter: 'blur(4px)',
  },
  visible: ({ isActive } = {}) => ({
    opacity: 1, filter: 'blur(0px)',
    transition: {
      delay: isActive ? 1 : 0.8,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }
  }),
  static: ({ isActive } = {}) => ({
    opacity: isActive ? 1 : 0.6, filter: 'blur(0px)',
  }),
};

const random = (min, max) => Math.random() * (max - min) + min;
const round = (num) => Math.round(num * 100) / 100;

const getFloatingValues = () => {
  const xy1 = 5; const xy2 = 3;

  const xSeed = Math.random() > 0.5;
  const x1 = xSeed
    ? Math.round(random(xy2, xy1))
    : Math.round(random(-xy1, -xy2));
  const x2 = xSeed
    ? Math.round(random(-xy1, -xy2))
    : Math.round(random(xy2, xy1));

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
    x: [x1, x2, x1],
    y: [y1, y2, y1],
    scale: [0.7, round(random(0.75, 0.85)), 0.7],
    rotate: rotate,
    duration: round(random(8, 12)),
    delay: round(random(0, 4)),
  };
};

const TRANSITIONCONFIG = {
  carouselduration: 1.2,

  cardscaleduration: 1.2,

};

const AnimatedCarouselItem = motion(forwardRef(function AnimatedCarouselItem({ projindex,
  i, hoveredProj, handleHovering, animationConfig }, ref) {

  const isActive = useMemo(() => i === 1, [i]);
  const floatingValues = useMemo(() => getFloatingValues(), [projindex]);

  return (
    <CarouselItem
      ref={ref}
      custom={{ floatingValues }}
      variants={itemVars}
      layout
      initial={'initial'}
      animate={isActive ? 'active' : 'inactive'}
      exit={'initial'}
      transition={{
        duration: TRANSITIONCONFIG.carouselduration,
        ease: [0.22, 1, 0.36, 1],
      }}
      isActive={isActive}
    >
      <CarouselEntrance
        custom={{ isActive: isActive }}
        variants={carouselentranceVars}
        initial="hidden"
        whileInView={'visible'}
        viewport={{ once: false, amount: 0.5 }}
      >
        <ProjectCard projinfo={PROJECTSINFO[projindex]} isActive={isActive}
          hoveredProj={hoveredProj} handleHovering={handleHovering}
          animationConfig={animationConfig}
        />
      </CarouselEntrance>
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
  willChange: "opacity",
  backfaceVisibility: 'hidden',
}));

const RestBg = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
  borderRadius: "inherit",
  //backdropFilter: 'blur(2px)',
  //WebkitBackdropFilter: 'blur(2px)',
  overflow: 'hidden',
  zIndex: -1,
  backfaceVisibility: "hidden",
}));

const GlassBg = styled(MotionBox)(({ theme, opacity = 1, bgcolor, coloropacity = 0.2, blur = 0 }) => {
  const color = `rgba(${(theme.vars || theme).palette.background.defaultChannel} / ${coloropacity})`;

  return {
    position: "absolute", inset: -blur,
    borderRadius: "inherit",
    backgroundColor: bgcolor || color,
    backgroundImage: `url(${glassbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: `blur(${blur}px)`,
    opacity: opacity,
    backfaceVisibility: "hidden",
  };
});

const HoverBg = styled(MotionBox)(({ theme }) => ({
  position: "absolute", inset: 0,
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
  overflow: 'hidden',
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
  backfaceVisibility: "hidden",
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const HoverContent = styled(MotionBox)(({ theme }) => ({
  width: '100%', //height: '100%',
  //borderRadius: 'inherit',
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  gap: theme.spacing(1),
  backfaceVisibility: "hidden",
}));

const CardImageContainer = styled(Box)(({ theme }) => ({
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

const StyledCardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0), //paddingBottom: theme.spacing(1),
  fontFamily: 'Lora, sans-serif',
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  textAlign: 'center',
  backfaceVisibility: "hidden",
  background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
  //boxShadow: `0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.3)`,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  justifyContent: 'center',
  textAlign: 'center',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  '& .MuiListItemText-primary': {
    fontFamily: 'Fraunces, sans-serif',
    lineHeight: 1.6,
    fontSize: '18px',
    fontWeight: 400,
    textAlign: 'center',
  },
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

const ZBASE = { scale: 1 };
const ZHOVER = { scale: 1.2 };

const cardcontainerVars = {
  initial: ({ isActive } = {}) => ({
    opacity: 1, ...ZBASE,
    transition: {
      delay: isActive ? 0 : 0.35,
      duration: TRANSITIONCONFIG.cardscaleduration, ease: "easeInOut"
    }
  }),
  hover: {
    opacity: 1, ...ZHOVER,
    transition: { duration: TRANSITIONCONFIG.cardscaleduration, ease: "easeInOut" }
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

const borderpulseVars = {
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
    //transition: { delay: isActive ? 5 : 0 }
  }),
  hover: ({ io, ho } = { io: 1, ho: 1 }) => ({
    opacity: ho,
    transition: { duration: 0.3, ease: "easeOut" }
  }),
  hidden: {
    opacity: 0,
    //transition: { duration: 0.3, ease: "easeOut" }
  },
  static: {
    opacity: 1,
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
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  hover: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  static: {
    opacity: 1,
    transition: { duration: 0 }
  }
};

const hovercontentVars = {
  initial: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
  static: { opacity: 1, },
};

const techchipcontainerVars = {
  initial: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.25,
      staggerChildren: 0.06,
      staggerDirection: 1,
    },
  },
  static: { opacity: 1 },
};

const techchipVars = {
  initial: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.175, 0.885, 0.32, 1.275],
    }
  },
  static: { opacity: 1, y: 0, scale: 1 },
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
      duration: Math.floor(Math.random() * 10) + 10,
    };
  }, []);

  return (
    <CardContainer
      custom={{ isActive: isActive }}
      variants={cardcontainerVars}
      initial="initial"
      animate={activeProj ? 'hover' : animationConfig.animate}
      whileHover={isActive ? animationConfig.hover : 'initial'}
      isActive={isActive}
    >
      <RestBorder
        custom={{ io: 1, ho: 0 }}
        variants={borderwrapperVars}
      //animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <BorderSheen
          custom={{ d: borderConfig.duration }}
          variants={borderpulseVars}
          initial='initial'
          animate={animationConfig.bordersheen}
        />
      </RestBorder>
      <HoverBorder
        custom={{ io: 0, ho: 1 }}
        variants={borderwrapperVars}
      //animate={activeProj ? 'hover' : animationConfig.animate}
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
        custom={{ io: 0.6, ho: 0, isActive: isActive }}
        //animate={activeProj ? 'hover' : animationConfig.animate}
        isActive={isActive}
      >
        <GlassBg
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: TRANSITIONCONFIG.carouselduration }}
          bgcolor={'#ffffff'} blur={4}
        />
      </RestBg>
      <HoverBg
        variants={hoverbgVars}
        custom={{ io: 0, ho: 1 }}
      //animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <GlassBg opacity={0.4} blur={4} />
      </HoverBg>
      <BloomBg
        variants={bloomVars}
        //animate={activeProj ? 'hover' : animationConfig.animate}
        bg={borderConfig.gradientA}
      />
      <StyledCard
        variants={cardVars}
        animate={activeProj ? 'hover' : animationConfig.animate}
      >
        <CardContent
          ref={cardRef}
          onMouseEnter={() => isActive ? handleHovering(projinfo) : null}
          onMouseLeave={() => handleHovering(null)}
          onClick={handleClick}
        >
          <AnimatePresence>
            {!hoveredProj ?
              <HoverContent
                variants={hovercontentVars}
                initial='initial'
                animate='animate'
                exit='initial'
              >
                <CardImageContainer>
                  <CardImage src={projinfo.img} />
                </CardImageContainer>
                <StyledCardHeader>{projinfo.header}</StyledCardHeader>
              </HoverContent>
              :
              <HoverContent
                variants={hovercontentVars}
                initial='initial'
                animate='animate'
                exit='initial'
              >
                <StyledCardHeader>{projinfo.header}</StyledCardHeader>
                {projinfo.descriptions.map((description, i) => (
                  <StyledListItem key={i}>
                    <StyledListItemText primary={description} />
                  </StyledListItem>
                ))}
              </HoverContent>
            }
          </AnimatePresence>
          <TechStackContainer
            //key={hoveredProj ? 'hidden' : 'visible'}
            variants={techchipcontainerVars}
            initial='initial'
            animate={!hoveredProj ? 'visible' : 'static'}
          >
            {projinfo.tech.map((t, i) => (
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
  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
  background: '#000000',
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
  exit: {
    opacity: 0, scale: 1.05,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
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

export default memo(Projects);