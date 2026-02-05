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
  researchdigest: {
    id: 1,
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
    id: 2,
    projtitle: 'Meal Planner',
    items:
      [
        {
          id: 9,
          title: 'A.I. Assistant',
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
  marketintelligence: {
    id: 3,
    projtitle: 'Market Intelligence',
    items:
      [
        {
          id: 1,
          title: 'Multivariate Quantile function based Forecasting',
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
      ref={el => refProps.current['highlights'] = el}
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

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
      onMouseMove={handleMouseMove}
    >
      <HoverOverlay
        variants={overlayVars}
        initial="inactive"
        animate={animationConfig.active}
      />
      {Object.values(highlights).map((v, i) => (
        <AnimatedList key={v.id}
          proj={v} i={i} animationConfig={animationConfig}
          activeImage={activeImage}
          handleActivatingImage={handleActivatingImage} />
      ))}
      <FloatingImage image={activeImage} mouseX={mouseX} mouseY={mouseY}
        animationConfig={animationConfig}
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
  background: `linear-gradient(
    180deg, 
    #FFFFFF 0%, 
    #f1f4f8 50%, 
    #E2E8F0 100%
  )`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  //color: '#E2E8F0',
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

const listItemDelay = 0.35;

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
  visible: ({ i, itemi }) => ({
    opacity: 1,
    transition: {
      delayChildren: itemi * listItemDelay,
      staggerChildren: 0.03 + ((itemi * 7) % 5) * 0.01,
      staggerDirection: (i % 2 === 0) ? 1 : -1,
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
      duration: 0.5 + ((i * 3) % 4) * 0.1,
      ease: [0.33, 1, 0.68, 1],
    }
  })
};

const AnimatedList = memo(function AnimatedList({ proj, i, animationConfig,
  activeImage, handleActivatingImage }) {

  return (
    <ListContainer
      i={i}
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.visible}
      viewport={{ once: false, amount: 0.2 }}
    >
      <ListBorder
        i={i}
        variants={borderVars}
      />
      <Header
        i={i}
        variants={driftVars}
        custom={i}
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
            onHoverStart={() => handleActivatingImage(item.image)}
            onHoverEnd={() => handleActivatingImage(null)}
            whileHover={{
              zIndex: 50,
              transition: { duration: 0.35, ease: "easeOut" }
            }}
          >
            <SubHeaderBlur
              variants={subheaderBlurVars}
              initial="initial"
              animate={animationConfig.blur}
              whileHover={{ opacity: 0 }}
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
                custom={{ i, itemi }}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: false, amount: 0.2 }}
              >
                {item.title.split('').map((l, letteri) => (
                  <AnimatedLetter
                    key={letteri}
                    custom={i}
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

const glowborder = 3;

const BackgroundImage = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: '-5%',
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'url(#liquid-ripple)',
  willChange: 'filter',
  zIndex: 1,
}));

const BgOverlay = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: (theme.vars || theme).palette.highlights.overlay,
  zIndex: -1,
}));

const ImageModal = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  pointerEvents: "none",
  width: '100%', height: '100%',
  zIndex: 10,
  background: 'transparent',
  willChange: "transform, opacity",
}));

const ImageShadowContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: '30px',
  width: '50%', //height: 'auto',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  zIndex: -1,
  willChange: 'transform, opacity',
  [theme.breakpoints.down('lg')]: {
    width: '80%',
  },
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const FloatingShadow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 30, 60, 0.6)',
  filter: 'blur(8px)',
  borderRadius: 'inherit',
  willChange: 'transform, opacity',
}));

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '50%', //height: 'auto',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  willChange: "transform, opacity",
  [theme.breakpoints.down('lg')]: {
    width: '80%',
  },
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const ImageBorder = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  backfaceVisibility: 'hidden',
  zIndex: -1,
  outline: `${glowborder}px solid ${(theme.vars || theme).palette.highlights.glow}`,
}));

const ImageGlow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  inset: `-${glowborder}px`,
  borderRadius: 'inherit',
  boxShadow: `0 0 25px ${(theme.vars || theme).palette.highlights.glow}`,
  zIndex: -1,
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  mixBlendMode: 'plus-lighter',
}));

const GlowShadow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '5px',
  top: 'calc(100% + 30px)', left: theme.spacing(3),
  background: (theme.vars || theme).palette.highlights.glow,
  filter: 'blur(10px)',
  borderRadius: 'inherit',
  //willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  zIndex: -1,
}));

const ImageShadow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '25%',
  top: '105%', left: theme.spacing(3),
  background: '#001e3c',
  filter: 'blur(10px)',
  opacity: 0.25,
  borderRadius: 'inherit',
  willChange: 'transform, opacity',
  zIndex: -2,
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
}));

const rippleduration = 8;

const bgoverlayVars = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: rippleduration / 4 }
  },
  exit: { opacity: 0 }
};

const bgVars = {
  initial: {
    opacity: 0, scale: 1.1
  },
  animate: {
    opacity: 0.4, scale: 1,
    transition: { duration: rippleduration / 4, ease: "easeOut", }
  },
  exit: { opacity: 0 }
};

const imageVars = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: (opacity = 1) => ({
    opacity: opacity,
    scale: 1,
    transition: {
      opacity: { duration: 0.6 },
      scale: { type: "spring", stiffness: 100, damping: 20 }
    }
  }),
};

const glowVars = {
  initial: {
    scaleX: 0,
    opacity: 0, originX: 0.5
  },
  animate: {
    scaleX: 1, opacity: 1,
    transition: {
      delay: 0.35,
      duration: 0.8,
      ease: "easeInOut"
    }
  },
};

const FloatingShadowVars = {
  floating: {
    x: ["0%", "5%", "-3%", "0%"],
    y: ["0%", "-2%", "5%", "0%"],
    transition: {
      duration: shadowduration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function FloatingImage({ image, mouseX, mouseY, animationConfig }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const offsetX = 20;
  const offsetY = 20;

  const rippleParams = useMemo(() => ({
    randomScale: Math.round(getRandom(20, 50)),
    randomFreq: getRandom(0.02, 0.04).toFixed(3)
  }), [image]);

  const boundsRef = useRef({ vw: window.innerWidth, vh: window.innerHeight });
  const sizeRef = useRef({ width: 300, height: 169 });

  useEffect(() => {
    const updateBounds = () => {
      boundsRef.current = {
        vw: window.innerWidth,
        vh: window.innerHeight
      };
    };

    window.addEventListener('resize', updateBounds);
    updateBounds();
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const rippleProgress = useMotionValue(0);

  useEffect(() => {
    setIsLoaded(false);
    rippleProgress.set(0);
    animate(rippleProgress, 1, {
      duration: rippleduration,
      ease: [0.16, 1, 0.3, 1],
    });
  }, [image]);

  const handleImageLoad = (e) => {
    sizeRef.current = {
      width: e.currentTarget.offsetWidth,
      height: e.currentTarget.offsetHeight
    };
    setIsLoaded(true);
  };

  const clampedX = useTransform(mouseX, (x) => {
    const { vw } = boundsRef.current;
    const { width } = sizeRef.current;
    const maxX = vw - width;
    return Math.max(0, Math.min(x - offsetX, maxX));
  });

  const clampedY = useTransform(mouseY, (y) => {
    const { vh } = boundsRef.current;
    const { height } = sizeRef.current;
    const maxY = vh - height;
    return Math.max(0, Math.min(y - offsetY, maxY));
  });

  const imageX = useTransform(clampedX, (v) => v * 0.85);
  const imageY = useTransform(clampedY, (v) => v * 0.85);
  //const shadowX = useTransform(clampedX, (v) => v * 0.92);
  //const shadowY = useTransform(clampedY, (v) => v * 0.92);

  const springConfig = { stiffness: 200, damping: 25, mass: 0.2 };

  const edgeX = useSpring(imageX, springConfig);
  const edgeY = useSpring(imageY, springConfig);
  //const sX = useSpring(shadowX, springConfig);
  //const sY = useSpring(shadowY, springConfig);

  return (
    <AnimatePresence>
      {image && (
        <LiquidFilter progress={rippleProgress} rippleParams={rippleParams} />
      )}
      {image && (
        <React.Fragment>
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
            sx={{ backgroundImage: `url(${image})` }}
          />
        </React.Fragment>
      )}
      {image && (
        <ImageModal
          variants={imageVars}
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          exit="initial"
        >
          {/*<ImageShadowContainer
            key={`shadowcontainer-${image}`}
            style={{
              x: sX,
              y: sY,
            }}
            variants={imageVars}
            custom={0.4}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FloatingShadow
              key={`shadow-${image}`}
              variants={FloatingShadowVars}
              animate={animationConfig.floating}
            />
          </ImageShadowContainer>*/}
          <ImageContainer
            key={image}
            onLoad={handleImageLoad}
            style={{
              x: edgeX,
              y: edgeY,
            }}
            variants={imageVars}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            exit="initial"
          >
            <ImageBorder
              variants={glowVars}
            />
            <ImageGlow
              variants={glowVars}
            />
            <GlowShadow
              variants={glowVars}
            />
            {/*<ImageShadow />*/}
            <StyledImage
              src={image}
            />
          </ImageContainer>
        </ImageModal>
      )}
    </AnimatePresence>
  );
}

const LiquidFilter = memo(function LiquidFilter({ progress, rippleParams }) {

  const { randomScale, randomFreq } = rippleParams;

  const scale = useTransform(progress, [0, 0.2, 1], [0, randomScale, 0]);
  const frequency = useTransform(progress, [0, 1], [randomFreq, 0.01]);

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
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
    </svg>
  );
});