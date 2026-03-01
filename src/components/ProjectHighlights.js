import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import {
  motion, useMotionValue, useSpring,
  useTransform, AnimatePresence, animate
} from "motion/react";
import { useAnimateContext } from './AnimateContext';
import { PROJECT_HIGHLIGHTS } from "../pics/assets";
import getRandom from '../functions/getRandom';


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

const shadowduration = 30;
const driftduration = 60;

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

  return (
    <SectionContainer
      //ref={el => refProps.current['highlights'] = el}
      onViewportEnter={() => handleViewport('highlights', true)}
      onViewportLeave={() => handleViewport('highlights', false)}
      viewport={{ amount: 0.5 }}
      id="highlights"
      maxWidth="lg"
    >
      <HoverGallery />
    </SectionContainer>
  );
}

const GalleryContainer = styled(Box)(({ theme }) => ({
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

const HoverOverlay = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '100dvw', height: '100dvh',
  top: 0, left: 0,
  pointerEvents: 'none',
  zIndex: 5,
  backgroundColor: (theme.vars || theme).palette.background.default,
}));

const overlayVars = {
  inactive: { opacity: 0, },
  active: { opacity: 0.2, },
};

function HoverGallery({ }) {
  const [activeImage, setActiveImage] = useState(null);

  const handleActivatingImage = useCallback((v) => {
    setActiveImage(v);
  }, []);

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const isNormal = mode === 'normal';

    return {
      active: isNormal && activeImage ? "active" : "inactive",

      visible: isNormal ? "visible" : "static",

      header: isNormal ? "animate" : "static",
      subheader: isNormal && activeImage ? "hidden" : "static",

      textshadow: !isNormal ? "static" : (activeImage ? "hidden" : "animate"),
      hover: isNormal ? "hover" : "static",

      blur: isNormal && activeImage ? "blur" : "static",

      floating: isNormal ? "floating" : "static",
    };
  }, [mode, activeImage]);

  return (
    <GalleryContainer
      component={'section'}
    >
      <HoverOverlay
        variants={overlayVars}
        initial="inactive"
        animate={animationConfig.active}
      />
      {Object.values(highlights).map((v, i) => (
        <AnimatedList key={v.id}
          proj={v} proji={i} animationConfig={animationConfig}
          activeImage={activeImage}
          handleActivatingImage={handleActivatingImage} />
      ))}
      <FloatingImage image={activeImage}
        animationConfig={animationConfig} handleActivatingImage={handleActivatingImage}
      />
    </GalleryContainer>
  );
};

const ListContainer = styled(MotionBox)(({ theme, i }) => ({
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
  width: '2px',
  height: '80%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  transformOrigin: 'center',
  //willChange: 'transform',
  backfaceVisibility: 'hidden',
}));

const Header = styled(MotionBox)(({ theme, i }) => ({
  position: 'absolute',
  left: i % 2 === 0 ? 'auto' : '10%',
  right: i % 2 === 0 ? '10%' : 'auto',
  fontFamily: 'Antonio',
  fontSize: 'clamp(100px, 10vw, 120px)',
  fontWeight: 800,
  lineHeight: 0.9, letterSpacing: '-5px',
  color: '#0F172A',
  alignSelf: 'center', textAlign: 'center',
  pointerEvents: 'none', userSelect: 'none',
  zIndex: -1,
  opacity: 0.3,
  mixBlendMode: 'overlay',
  WebkitFontSmoothing: 'antialiased',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(60px, 20vw, 100px)',
  },
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
}));

const HeaderWord = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
}));

const SubHeaderContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  //willChange: 'transform, opacity',
  cursor: 'pointer',
  width: 'fit-content',
  backfaceVisibility: 'hidden',
}));

const SubHeader = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  fontWeight: 800,
  fontFamily: 'Playfair Display',
  letterSpacing: '2px',
  fontSize: 'clamp(24px, 26px, 26px)',
  color: '#E2E8F0',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(20px, 24px, 24px)',
  },
  display: 'inline-block',
  //willChange: 'transform, opacity',
  width: 'fit-content',
  pointerEvents: 'none',
}));

const ShadowContainer = styled(MotionBox)(({ theme, top = '70%', height = '30%' }) => ({
  position: 'absolute',
  width: '100%', height: height,
  top: top,
  borderRadius: '25%',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  zIndex: -1,
}));

const TextShadow = styled(MotionBox)(({ theme }) => ({
  //position: 'absolute',
  width: '100%', height: '100%',
  //top: top, left: theme.spacing(1),
  backgroundColor: 'rgba(0, 30, 60, 0.6)',
  filter: 'blur(8px)',
  //background: 'linear-gradient(to bottom, rgba(0, 30, 60, 0.6) 0%, rgba(0, 30, 60, 0) 100%)',
  //boxShadow: '0 0 30px 10px rgba(0, 30, 60, 0.4)',
  borderRadius: 'inherit',
  //willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  opacity: 'inherit',
  //zIndex: -1,
}));

const SubHeaderBlur = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontFamily: 'Playfair Display',
  letterSpacing: '2px',
  fontSize: 'clamp(24px, 26px, 26px)',
  color: '#CBD5E1',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(20px, 24px, 24px)',
  },
  display: 'inline-block',
  width: 'fit-content',
  filter: 'blur(4px)',
}));

const LetterMask = styled(MotionBox)({
  position: 'relative',
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
  zIndex: 2,
});

const AnimatedLetter = styled(MotionBox)({
  display: 'inline-block',
  whiteSpace: 'pre',
  transformOrigin: "bottom left",
  willChange: 'transform',
});

const listItemDelay = 0.45;

const containerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: listItemDelay,
    },
  },
  static: { opacity: 1, transition: { duration: 0 } },
};

const borderVars = {
  hidden: { scaleY: 0, },
  visible: {
    scaleY: 1,
    transition: {
      duration: 5,
      ease: "easeOut",
    },
  },
  static: { opacity: 1, transition: { duration: 0 } },
};

const subheaderContainerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  static: { opacity: 1, transition: { duration: 0 } },
};

const subheaderTextVars = {
  hover: {
    opacity: 1,
    x: 0, y: -10,
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut", repeat: 0 }
  },
  hidden: { opacity: 0 },
  static: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

const driftVars = {
  animate: (i) => ({
    x: [0, 25, 50, 25, 0],
    y: [0, -10, 0, 10, 0],
    opacity: [0.2, 0.1, 0.2, 0.3, 0.2],
    scale: [1, 0.9, 1, 1.1, 1],
    transition: {
      delay: i * -2.71,
      duration: driftduration + ((i * 17) % 11),
      repeat: Infinity,
      ease: "easeInOut",
    }
  }),
  hover: {
    opacity: 0.5,
    x: 0, y: -10,
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut", repeat: 0 }
  },
  hidden: { opacity: 0 },
  static: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

const shadowopacityVars = {
  initial: { opacity: 0 },
  animate: {
    opacity: 0.4,
    transition: { delay: 2.5, duration: 2.5 }
  },
}

const subheaderBlurVars = {
  initial: { opacity: 0 },
  blur: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    }
  },
  static: { opacity: 0, transition: { duration: 0 } },
};

const lettermaskVars = {
  hidden: {
    opacity: 0,
  },
  visible: ({ proji, itemi }) => ({
    opacity: 1,
    transition: {
      delayChildren: itemi * listItemDelay + 0.5,
      staggerChildren: 0.07 + ((itemi * 7) % 5) * 0.01,
      staggerDirection: (proji % 2 === 0) ? 1 : -1,
    }
  })
};

const letterVars = {
  hidden: {
    y: "110%", rotate: 15,
  },
  visible: (i) => ({
    y: 0, rotate: 0,
    transition: {
      duration: 0.5 + (3 - i) * 0.1,
      ease: [0.33, 1, 0.68, 1],
    }
  })
};

const AnimatedList = memo(function AnimatedList({ proj, proji, animationConfig,
  activeImage, handleActivatingImage }) {

  return (
    <ListContainer
      i={proji}
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.visible}
      viewport={{ once: false, amount: 0.2 }}
    >
      <ListBorder
        i={proji}
        variants={borderVars}
      />
      <Header
        i={proji}
        variants={driftVars}
        custom={proji}
        initial={animationConfig.header}
        animate={animationConfig.header}
      >
        {proj.projtitle.split(' ').map((w, i) => (
          <HeaderWord key={i}>{w}</HeaderWord>
        ))}
      </Header>
      {proj.items.map((item, itemi) => {
        const isHovered = activeImage === item.image;
        return (
          <SubHeaderContainer
            key={item.id}
            variants={subheaderContainerVars}
            onClick={() => handleActivatingImage(isHovered ? null : item.image)}
            animate={{
              zIndex: isHovered ? 50 : 1,
              transition: { duration: 0.35, ease: "easeOut" }
            }}
          >
            <SubHeaderBlur
              variants={subheaderBlurVars}
              initial="initial"
              animate={isHovered ? 'initial' : animationConfig.blur}
            > {item.title}</SubHeaderBlur>
            <SubHeader
              variants={subheaderTextVars}
              animate={isHovered ? 'hover' : animationConfig.subheader}
            >
              <ShadowContainer
              //variants={driftVars}
              //custom={itemi}
              //initial='animate'
              //animate={isHovered ? 'hover' : animationConfig.textshadow}
              >
                <TextShadow
                  variants={shadowopacityVars}
                  initial='initial'
                  whileInView='animate'
                />
              </ShadowContainer>
              <LetterMask
                variants={lettermaskVars}
                custom={{ proji, itemi }}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: false, amount: 0.2 }}
              >
                {item.title.split('').map((l, letteri) => (
                  <AnimatedLetter
                    key={letteri}
                    custom={itemi}
                    variants={letterVars}
                  >
                    {l === " " ? "\u00A0" : l}
                  </AnimatedLetter>
                ))}
              </LetterMask>
            </SubHeader>
          </SubHeaderContainer>
        )
      })}
    </ListContainer>
  )
});

const BgOverlay = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: (theme.vars || theme).palette.highlights.overlay,
  zIndex: -1,
}));

const BackgroundImage = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: '-5%',
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'url(#liquid-ripple)',
  willChange: 'filter, opacity',
  zIndex: 1,
}));

const rippleduration = 8;

const bgoverlayVars = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: rippleduration / 4 }
  },
  exit: { opacity: 0, transition: { duration: rippleduration / 4 } }
};

const bgVars = {
  initial: {
    opacity: 0, scale: 1.1
  },
  animate: {
    opacity: 0.4, scale: 1,
    transition: { duration: rippleduration / 4, ease: "easeOut", }
  },
  exit: { opacity: 0, transition: { duration: rippleduration / 4 } }
};

const FloatingImage = memo(function FloatingImage({ image, animationConfig, handleActivatingImage }) {

  const rippleParams = useMemo(() => ({
    randomScale: Math.round(getRandom(20, 50)),
    randomFreq: getRandom(0.02, 0.04).toFixed(3)
  }), [image]);

  const rippleProgress = useMotionValue(0);

  useEffect(() => {
    rippleProgress.set(0);
    animate(rippleProgress, 1, {
      duration: rippleduration,
      ease: [0.16, 1, 0.3, 1],
    });
  }, [image]);

  return (
    <AnimatePresence>
      <LiquidFilter progress={rippleProgress} rippleParams={rippleParams} />
      {image && (
        <motion.div key={image}>
          <BgOverlay
            variants={bgoverlayVars}
            initial='initial'
            animate='animate'
            exit='exit'
          />
          <BackgroundImage
            //key={`bg-${image}`}
            variants={bgVars}
            initial='initial'
            animate='animate'
            exit='exit'
            onClick={() => handleActivatingImage(null)}
            sx={{ backgroundImage: `url(${image})` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const StyledSvg = styled('svg')(({ theme }) => ({
  position: 'absolute',
  width: 0, height: 0
}));

const LiquidFilter = memo(function LiquidFilter({ progress, rippleParams }) {

  const { randomScale, randomFreq } = rippleParams;

  const scale = useTransform(progress, [0, 0.2, 1], [0, randomScale, 0]);
  const frequency = useTransform(progress, [0, 1], [randomFreq, 0.01]);

  return (
    <StyledSvg>
      <filter id="liquid-ripple" x="-10%" y="-10%" width="110%" height="110%">
        <motion.feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves="1"
          result="noise"
        />
        <motion.feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </StyledSvg>
  );
});