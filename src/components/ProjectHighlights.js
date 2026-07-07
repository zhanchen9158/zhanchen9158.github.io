import React, {
  useState, useRef, useEffect, useLayoutEffect,
  useCallback, useMemo, memo
} from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import {
  motion, useMotionValue, useSpring,
  useTransform, AnimatePresence, animate,
  useAnimation, useMotionValueEvent, useInView
} from "motion/react";
import { useAnimateContext } from './AnimateContext';
import { useStateContext } from './StateContext';
import { PROJECT_HIGHLIGHTS } from "../pics/assets";
import getRandom from '../functions/getRandom';
import useSectionReporting from '../functions/useSectionReporting';


const highlights = {
  marketintelligence: {
    id: 1,
    projtitle: 'Market Intelligence',
    items:
      [
        {
          id: 1,
          title: 'sMAPE Based Forecasting',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.forecast,
        },
        {
          id: 2,
          title: 'Financial Data Visualization',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.chart,
        },
        {
          id: 3,
          title: 'Technical Analysis Platform',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.analysis,
        },
        {
          id: 4,
          title: 'Financial Quote Retrieval',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.ticker,
        },
      ],
  },
  researchdigest: {
    id: 2,
    projtitle: 'Research Digest',
    items:
      [
        {
          id: 5,
          title: 'A.I. Question Answering',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.aiqa,
        },
        {
          id: 6,
          title: 'Daily Fresh Research Feed',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.daily,
        },
        {
          id: 7,
          title: 'Topical Clustering',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.list,
        },
        {
          id: 8,
          title: 'Advanced Research Querying',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.search,
        },
      ],
  },
  mealplanner: {
    id: 3,
    projtitle: 'Meal Planner',
    items:
      [
        {
          id: 9,
          title: 'GQA Language Model A.I. Assistant',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.aichat,
        },
        {
          id: 10,
          title: 'Interactive Cooking Procedures',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.recipe,
        },
        {
          id: 11,
          title: 'Dynamic Nutrient Aggregation',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.totalnut,
        },
        {
          id: 12,
          title: 'Advanced Recipe Querying',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.search,
        },
      ],
  },
};

const header = 70;

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  //marginTop: header,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  height: '100dvh',
  overflow: 'hidden',
}));

export default function ProjectHighlights({ refProps, handleViewport }) {

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    amount: 0.5,
    once: false
  });

  const { manual, system } = useAnimateContext();
  const isNormal = (system || manual) === 'normal';

  const { onEnter, onLeave } = useSectionReporting('highlights', handleViewport);

  return (
    <SectionContainer
      ref={containerRef}
      onViewportEnter={onEnter}
      onViewportLeave={onLeave}
      viewport={{ amount: 0.5 }}
      id="highlights"
      maxWidth="lg"
    >
      <HoverGallery />
    </SectionContainer>
  );
}

const GalleryContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '80%', height: `calc(100dvh - ${header * 2}px)`,
  paddingTop: theme.spacing(4),
  display: 'flex', flexDirection: 'column',
  justifyContent: 'flex-start',
  //perspective: '1000px',
  overflowY: 'scroll',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  '&::-webkit-scrollbar': { display: 'none' },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  //boxSizing: 'border-box',
}));

const GalleryBackdrop = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  background: 'transparent',
  zIndex: 999,
}));

function HoverGallery({ }) {
  const { highlightImage, handleActivatingHighlightImage } = useStateContext();

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const isNormal = mode === 'normal';

    return {
      active: isNormal && highlightImage ? "active" : "inactive",

      visible: isNormal ? "visible" : "static",

      header: isNormal ? "animate" : "static",
      subheader: isNormal && highlightImage ? "hidden" : "initial",

      textshadow: !isNormal ? "static" : (highlightImage ? "hidden" : "animate"),
      hover: isNormal ? "hover" : "static",

      blur: isNormal && highlightImage ? "blur" : "static",

      floating: isNormal ? "floating" : "static",
    };
  }, [mode, highlightImage]);

  const entryTimeRef = useRef(0);

  const handleViewportEnter = useCallback(() => {
    entryTimeRef.current = Date.now();
  }, []);

  return (
    <GalleryContainer
      onViewportEnter={handleViewportEnter}
      viewport={{ once: false, amount: 0.2 }}
    >
      <TextLiquidFilter />
      {highlightImage !== null && (
        <GalleryBackdrop
          onTap={() => handleActivatingHighlightImage(null)}
        />
      )}
      {Object.values(highlights).map((v, i) => (
        <AnimatedList key={v.id}
          proj={v} proji={i} animationConfig={animationConfig}
          activeImage={highlightImage}
          handleActivatingImage={handleActivatingHighlightImage}
          entryTimeRef={entryTimeRef}
        />
      ))}
    </GalleryContainer>
  );
};

const ListContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%', //height: '80%',
  backfaceVisibility: 'hidden',
}));

const ListContent = styled(MotionBox)(({ theme, i }) => ({
  position: 'relative',
  width: '100%', //height: '80%',
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center',
  alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
  paddingLeft: i % 2 === 0 ? theme.spacing(6) : theme.spacing(2),
  paddingRight: i % 2 !== 0 ? theme.spacing(6) : theme.spacing(2),
  gap: theme.spacing(4),
  marginBottom: theme.spacing(6),
  backfaceVisibility: 'hidden',
}));

const ListBorder = styled(MotionBox)(({ theme, i }) => ({
  position: 'absolute',
  left: i % 2 === 0 ? 0 : 'auto',
  right: i % 2 !== 0 ? 0 : 'auto',
  top: '10%',
  width: '2px', height: '80%',
  borderRadius: '4px',
  background: `linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(100, 210, 255, 0.8) 50%, 
    rgba(255, 255, 255, 0.1) 100%
  )`,
  backgroundSize: '100% 400%',
  zIndex: 1,
  backfaceVisibility: 'hidden',
}));

const HeaderWrapper = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none', userSelect: 'none',
  zIndex: 1,
  backfaceVisibility: 'hidden',
}));

const HeaderBase = ({ theme }) => ({
  paddingBottom: '0.2em',
  marginBottom: '-0.2em',
  gridArea: '1 / 1',
  fontFamily: 'Lora',
  fontSize: 'clamp(80px, 10vw, 100px)',
  fontStyle: 'italic',
  fontWeight: 800,
  lineHeight: 1.1, letterSpacing: '0.05rem',
  color: '#050B14',
  WebkitFontSmoothing: 'antialiased',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(60px, 20vw, 80px)',
  },
  backfaceVisibility: 'hidden',
});

const HeaderStatic = styled(MotionBox)(({ theme }) => ({
  ...HeaderBase({ theme }),
  backgroundColor: '#050B14',
  backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.05) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0px 1px 1px rgba(255,255,255,0.1)',
}));

const HeaderRipple = styled(MotionBox)(({ theme }) => ({
  ...HeaderBase({ theme }),
}));

const HeaderWord = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
}));

//svg filter ripple
const listItemDelay = 0.45;
const rippleduration = 8;
const bgduration = rippleduration / 4;

//entrance ripple
const vmax = Math.max(window.innerWidth, window.innerHeight);
const speedPxPerSecond = 40;
const distanceToTravel = (0.6 * vmax) - (0.2 * vmax);
const calculatedDuration = distanceToTravel / speedPxPerSecond;

const TRANSITIONCONFIG = {
  listItemDelay: 0.45,

  texthoverstart: { duration: 1.2, ease: "easeOut" },
  texthoverend: { duration: 0.8, ease: "easeIn" },
  textactiveimage: { duration: 1.2, ease: "easeInOut", },

  imagehoverstart: {
    duration: 1.2,
    ease: [0.2, 0.65, 0.3, 0.9],
  },
  imagehoverend: {
    duration: 0.6,
    ease: [0.3, 0, 0.7, 0.3],
  },
  imageactiveimage: { duration: bgduration, ease: 'easeInOut' },
};

const containerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.35,
      duration: calculatedDuration / 4,
    },
  },
  static: { opacity: 1 },
};

const borderVars = {
  initial: {
    y: 0,
    backgroundPosition: "0% 0%"
  },
  animate: {
    y: ["0%", "-3.5%", "1%", "-4.5%", "1.5%", "-3%", "0%"],

    backgroundPosition: ["0% 0%", "0% 400%", "0% 0%"],

    scaleY: [1, 1.05, 1, 1.05, 1],

    transition: {
      y: {
        duration: 35,
        repeat: Infinity,
        ease: "easeInOut",
      },
      backgroundPosition: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      },
      scaleY: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      }
    },
  },
  hidden: { opacity: 0, transition: TRANSITIONCONFIG.textactiveimage, },
  static: {
    y: 0,
    backgroundPosition: "0% 0%"
  },
};

const AnimatedList = memo(function AnimatedList({ proj, proji, animationConfig,
  activeImage, handleActivatingImage, entryTimeRef }) {

  const HeaderProgress = useMotionValue(0);
  const staticHeader = useTransform(HeaderProgress, [0, 1], [0.5, 0]);
  const hoveredHeader = useTransform(
    HeaderProgress,
    [0, 1],
    ['url(#liquid-ripple-text) opacity(0)', 'url(#liquid-ripple-text) opacity(0.4)']
  );

  return (
    <ListContainer
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.visible}
      viewport={{ once: false, amount: 0.2 }}
    >
      <ListContent
        i={proji}
        initial='initial'
        whileHover={activeImage ? 'initial' : 'hover'}
        onHoverStart={() => animate(HeaderProgress, 1, TRANSITIONCONFIG.texthoverstart)}
        onHoverEnd={() => animate(HeaderProgress, 0, TRANSITIONCONFIG.texthoverend)}
      >
        <ListBorder
          i={proji}
          variants={borderVars}
          initial='initial'
          whileInView={!activeImage ? 'animate' : 'hidden'}
        />
        <HeaderWrapper
          animate={{ opacity: !activeImage ? 1 : 0 }}
          transition={TRANSITIONCONFIG.textactiveimage}
          style={{
            left: proji % 2 === 0 ? 'auto' : '10%',
            right: proji % 2 === 0 ? '10%' : 'auto',
            textAlign: proji % 2 === 0 ? 'right' : 'left',
          }}
        >
          <HeaderStatic style={{ opacity: staticHeader }}>
            {proj.projtitle.split(' ').map((w, i) => (
              <HeaderWord key={i}>{w}</HeaderWord>
            ))}
          </HeaderStatic>
          <HeaderRipple style={{ filter: hoveredHeader }}>
            {proj.projtitle.split(' ').map((w, i) => (
              <HeaderWord key={i}>{w}</HeaderWord>
            ))}
          </HeaderRipple>
        </HeaderWrapper>
        {proj.items.map((item, itemi) => (
          <SubHeaderItem
            key={item.id}
            item={item} itemi={itemi}
            animationConfig={animationConfig}
            activeImage={activeImage}
            handleActivatingImage={handleActivatingImage}
            entryTimeRef={entryTimeRef}
          />
        ))}
      </ListContent>
    </ListContainer >
  )
});

const SubHeaderContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  display: 'inline-block',
  padding: theme.spacing(0, 1),
  cursor: 'pointer',
  zIndex: 5,
  backfaceVisibility: 'hidden',
}));

const SubHeaderBase = ({ theme }) => ({
  borderRadius: '8px',
  fontFamily: 'Spectral',
  fontSize: 'clamp(28px, 2vw, 32px)',
  fontWeight: 600,
  fontStyle: 'italic',
  letterSpacing: '0.25em',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(26px, 1vw, 30px)',
  },
});

const SubHeaderBlur = styled(MotionBox)(({ theme }) => ({
  ...SubHeaderBase({ theme }),
  position: 'absolute',
  color: '#E2E8F0',
  filter: 'blur(4px)',
}));

const SubHeaderRipple = styled(MotionBox)(({ theme }) => ({
  ...SubHeaderBase({ theme }),
  position: 'absolute',
  color: '#E2E8F0',
  textShadow: `
    0px 1px 2px rgba(0, 0, 0, 0.8),
    0px 4px 8px rgba(0, 0, 0, 0.6),
    0px 12px 24px rgba(0, 0, 0, 0.4)
  `,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}));

const SubHeaderText = styled(MotionBox)(({ theme }) => ({
  ...SubHeaderBase({ theme }),
  position: 'relative',
  color: '#E2E8F0',
  textShadow: `
    0px 1px 2px rgba(0, 0, 0, 0.6),
    0px 4px 8px rgba(0, 0, 0, 0.4)
  `,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}));

const subheaderblurVars = {
  initial: {
    opacity: 0,
    transition: TRANSITIONCONFIG.textactiveimage,
  },
  hover: {
    opacity: 0,
    transition: TRANSITIONCONFIG.textactiveimage,
  },
  hidden: {
    opacity: 1,
    transition: TRANSITIONCONFIG.textactiveimage,
  },
  static: { opacity: 1, },
};

const subheaderVars = {
  initial: {
    opacity: 1,
    x: 0, y: 0,
    scale: 1,
    transition: TRANSITIONCONFIG.textactiveimage,
  },
  hover: {
    opacity: 1,
    x: 0, y: -10,
    scale: 1.2,
    transition: TRANSITIONCONFIG.textactiveimage,
  },
  hidden: { opacity: 0, x: 0, y: 0, scale: 1, transition: TRANSITIONCONFIG.textactiveimage, },
  static: { opacity: 1, x: 0, y: 0, scale: 1 },
};

const SubHeaderItem = memo(function SubHeaderItem({ item, itemi, animationConfig,
  activeImage, handleActivatingImage, entryTimeRef }) {
  const { highlightHovered } = useStateContext();

  const isSelected = activeImage?.image === item.image;
  const SubheaderProgress = useMotionValue(0);
  const staticSubheader = useTransform(SubheaderProgress, [0, 1], [1, 0]);
  const hoveredSubheader = useTransform(
    SubheaderProgress,
    [0, 1],
    ['url(#liquid-ripple-text) opacity(0)', 'url(#liquid-ripple-text) opacity(1)']
  );

  useEffect(() => {
    if (!activeImage) {
      animate(SubheaderProgress, 0, TRANSITIONCONFIG.textactiveimage);
    }
  }, [activeImage]);

  const handleHoverStart = useCallback(() => {
    if (activeImage) {
      highlightHovered.current = null;
      return;
    }

    const currentTime = Date.now();
    const waitPeriod = 1000;
    if (currentTime - entryTimeRef.current < waitPeriod) return;

    highlightHovered.current = item.image;
    animate(SubheaderProgress, 1, TRANSITIONCONFIG.texthoverstart);
  }, [activeImage]);

  const handleHoverEnd = useCallback(() => {
    if (activeImage) {
      highlightHovered.current = null;
      return;
    }

    highlightHovered.current = null;
    animate(SubheaderProgress, 0, TRANSITIONCONFIG.texthoverend);
  }, [activeImage]);

  const opacityValue = useMotionValue(0);

  const handleViewportEnter = useCallback(() => {
    opacityValue.set(0);
    setTimeout(() => {
      animate(opacityValue, 1, TRANSITIONCONFIG.texthoverstart);
    }, 1000)
  }, []);

  return (
    <SubHeaderContainer
      initial='initial'
      animate={isSelected ? 'hover' : animationConfig.subheader}
      onTap={(event) => {
        event.stopPropagation();

        if (!activeImage) {
          handleActivatingImage(item);
        }
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onViewportEnter={handleViewportEnter}
      style={{ opacity: opacityValue }}
    >
      <SubHeaderBlur
        variants={subheaderblurVars}
      >
        {item.title}
      </SubHeaderBlur>
      <SubHeaderRipple
        variants={subheaderVars}
        style={{
          filter: hoveredSubheader
        }}
      >
        {item.title}
      </SubHeaderRipple>
      <SubHeaderText
        variants={subheaderVars}
      >
        <motion.div
          style={{
            opacity: staticSubheader
          }}
        >
          {item.title}
        </motion.div>
      </SubHeaderText>
    </SubHeaderContainer>
  )
});

const StyledSvg = styled('svg')(({ theme }) => ({
  position: 'absolute',
  width: 0, height: 0,
  willChange: 'filter, opacity',
  backfaceVisibility: "hidden",
}));

const TextLiquidFilter = memo(function TextLiquidFilter() {

  return (
    <StyledSvg>
      <filter id="liquid-ripple-text" x="-10%" y="-10%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.015"
          numOctaves="1"
          result="noise"
        >
          <animate
            attributeName="baseFrequency"
            values="0.01 0.015; 0.015 0.02; 0.01 0.015"
            dur="15s"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale='12'
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feColorMatrix
          in="displaced"
          type="matrix"
          values="1 0 0 0 0 
                  0 1 0 0 0.02 
                  0 0 1 0 0.1 
                  0 0 0 1 0"
        />
      </filter>
    </StyledSvg>
  );
});