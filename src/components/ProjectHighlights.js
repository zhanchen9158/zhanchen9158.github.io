import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import {
  motion, useMotionValue, useSpring,
  useTransform, AnimatePresence
} from "motion/react";
import { useAnimateContext } from './AnimateContext';
import WaterBackground from "./WaterBackground";

import AreaChartIcon from '@mui/icons-material/AreaChart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { PROJECT_HIGHLIGHTS } from "../pics/assets";


const highlights = {
  marketintelligence: {
    id: 1,
    projtitle: 'Market Intelligence',
    items:
      [
        {
          id: 1,
          icon: <AreaChartIcon />,
          title: 'Multivariate Quantile function based Forecasting',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.forecast,
        },
        {
          id: 2,
          icon: <QueryStatsIcon />,
          title: 'Financial Data Visualization',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.chart,
        },
        {
          id: 3,
          icon: <NewspaperIcon />,
          title: 'Technical Analysis Platform',
          description: '',
          image: PROJECT_HIGHLIGHTS.marketintelligence.analysis,
        },
        {
          id: 4,
          icon: <TroubleshootIcon />,
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
          icon: <AreaChartIcon />,
          title: 'A.I. Question Answering',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.aiqa,
        },
        {
          id: 6,
          icon: <QueryStatsIcon />,
          title: 'Daily Fresh Research Feed',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.daily,
        },
        {
          id: 7,
          icon: <NewspaperIcon />,
          title: 'Topical Clustering',
          description: '',
          image: PROJECT_HIGHLIGHTS.researchdigest.list,
        },
        {
          id: 8,
          icon: <TroubleshootIcon />,
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
          icon: <AreaChartIcon />,
          title: 'A.I. Assistant',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.aichat,
        },
        {
          id: 10,
          icon: <QueryStatsIcon />,
          title: 'Interactive Cooking Procedures',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.recipe,
        },
        {
          id: 11,
          icon: <NewspaperIcon />,
          title: 'Dynamic Nutrient Aggregation',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.totalnut,
        },
        {
          id: 12,
          icon: <TroubleshootIcon />,
          title: 'Advanced Recipe Querying',
          description: '',
          image: PROJECT_HIGHLIGHTS.mealplanner.search,
        },
      ],
  },
};

const header = '70px';

const shadowduration = 30;
const driftduration = 40;

const MotionContainer = motion(Container);
const MotionBox = motion(Box);
const MotionImage = motion('img');

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  marginTop: header,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `calc(100dvh - ${header})`,
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
      <WaterBackground shadowDuration={shadowduration} driftDuration={driftduration * 3} />
      <HoverGallery />
    </SectionContainer>
  );
}

const GalleryContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80%', height: '100dvh',
  display: 'flex', flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingBottom: theme.spacing(2),
  //perspective: '1000px',
  overflowY: 'scroll',
  paddingLeft: '50px',
  paddingRight: '50px',
  marginLeft: '-50px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    paddingLeft: '20px',
    marginLeft: '0',
  },
  '&::-webkit-scrollbar': { display: 'none' },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
}));

const HoverOverlay = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '100dvw', height: '100dvh',
  top: 0, left: 0,
  pointerEvents: 'none',
  zIndex: 5,
  backgroundColor: 'rgba(225, 225, 225, 0.4)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
  }),
}));

const overlayVars = {
  inactive: { opacity: 0, },
  active: { opacity: 0.5, },
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
      animate: !isNormal ? "static" : (activeImage ? "hidden" : "animate"),
      hover: isNormal ? "hover" : "static",
      blur: isNormal && activeImage ? "blur" : "static",

      floating: isNormal ? "floating" : "static",
    };
  }, [mode, activeImage]);

  return (
    <GalleryContainer
      component={'section'}
      onMouseMove={handleMouseMove}
      sx={{
        paddingTop: header,
      }}
    >
      <HoverOverlay
        variants={overlayVars}
        initial="inactive"
        animate={animationConfig.active}
      />
      {Object.values(highlights).map((v, _) => (
        <AnimatedList key={v.id}
          proj={v} animationConfig={animationConfig}
          activeImage={activeImage}
          handleActivatingImage={handleActivatingImage} />
      ))}
      <FloatingImage image={activeImage} mouseX={mouseX} mouseY={mouseY}
        animationConfig={animationConfig}
      />
    </GalleryContainer>
  );
};

const ListContainer = styled(MotionBox)(({ theme }) => ({
  width: '100%', //height: '80%',
  display: 'flex', flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Header = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  fontFamily: 'cormorant garamond',
  fontSize: '1.5rem',
  fontStyle: 'italic',
  fontWeight: 'bold',
  color: 'rgba(255,255,255,1)',
  alignSelf: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
  position: 'relative',
  display: 'inline-block',
  width: 'fit-content',
  cursor: 'pointer',
}));

const SubHeaderContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  transformStyle: "preserve-3d", willChange: 'transform',
  cursor: 'pointer',
  width: 'fit-content',
}));

const SubHeader = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  borderRadius: '8px',
  fontWeight: 'bold',
  fontFamily: 'fraunces',
  letterSpacing: '2px',
  fontSize: '1.5rem',
  color: 'rgba(255,255,255,1)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
  display: 'inline-block',
  willChange: 'transform, opacity',
  width: 'fit-content',
  pointerEvents: 'none',
}));

const TextShadow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '30%',
  top: '80%', left: theme.spacing(3),
  background: 'rgba(0, 30, 60, 0.25)',
  filter: 'blur(8px)',
  borderRadius: '50%',
  willChange: 'transform, opacity',
  opacity: 'inherit',
}));

const SubHeaderBlur = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  borderRadius: '8px',
  fontWeight: 'bold',
  fontFamily: 'fraunces',
  letterSpacing: '2px',
  fontSize: '1.5rem',
  color: 'rgba(255,255,255,1)',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
  display: 'inline-block',
  willChange: 'opacity',
  width: 'fit-content',
  filter: 'blur(4px)',
}));

const containerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.35,
    },
  },
  static: { opacity: 1, transition: { duration: 0 } },
};

const subheaderContainerVars = {
  hidden: { opacity: 0, x: 100, },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  static: { opacity: 1, x: 0, transition: { duration: 0 } },
};

const subheaderTextVars = {
  animate: (itemi) => ({
    x: [0, '2%', '4%', '2%', 0],
    y: [0, '-3%', '0%', '3%', 0],
    opacity: 1,
    scale: 1,
    rotate: [0, 0.5, -0.5, 0.2, 0],
    transition: {
      delay: itemi * -0.8,
      duration: driftduration + (itemi % 3),
      repeat: Infinity,
      ease: "easeInOut",
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    }
  }),
  hover: {
    opacity: 1,
    x: 0, y: -10,
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut", repeat: 0 }
  },
  hidden: { opacity: 0 },
  static: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

const subheaderShadowVars = {
  animate: {
    x: [0, '3%', '5%', '3%', 0],
    y: [0, '-2%', '0%', '2%', 0],
    opacity: 0.6,
    scale: 1,
    transition: {
      duration: shadowduration,
      repeat: Infinity,
      ease: "easeInOut",
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    }
  },
  hover: {
    opacity: 1,
    x: 0, y: -20,
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut", repeat: 0 }
  },
  hidden: { opacity: 0 },
  static: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

const subheaderBlurVars = {
  initial: { opacity: 0 },
  blur: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    }
  },
  static: { opacity: 0, transition: { duration: 0 } },
};

const AnimatedList = memo(function AnimatedList({ proj, animationConfig,
  activeImage, handleActivatingImage }) {

  return (
    <ListContainer
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.visible}
      viewport={{ once: false, amount: 0.2 }}
    >
      <Header>
        <TextShadow
          variants={subheaderShadowVars}
          initial="animate"
          animate={animationConfig.animate}
        />
        {proj.projtitle}
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
              whileHover={{
                opacity: 0,
              }}
            > {item.title}</SubHeaderBlur>
            <SubHeader
              variants={subheaderTextVars}
              custom={itemi}
              initial="animate"
              animate={isHovered ? 'hover' : animationConfig.animate}
              whileHover={animationConfig.hover}
            >
              <TextShadow variants={subheaderShadowVars} />
              <span style={{ position: 'relative', zIndex: 2 }}>
                {item.title}
              </span>
            </SubHeader>
          </SubHeaderContainer>
        )
      })}
    </ListContainer>
  )
});

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

const glowborder = 5;
const glowcolor = '#BE6FFE';

const ImageBorder = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: `calc(100% + ${glowborder}px)`, height: `calc(100% + ${glowborder}px)`,
  inset: `-${glowborder / 2}px`,
  borderRadius: 'inherit',
  zIndex: -1,
  willChange: 'transform, opacity',
  background: glowcolor,
}));

const ImageGlow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: `calc(100% + ${glowborder * 2}px)`, height: `calc(100% + ${glowborder * 2}px)`,
  inset: `-${glowborder}px`,
  borderRadius: 'inherit',
  filter: 'blur(15px)',
  zIndex: -1,
  willChange: 'transform, opacity',
  background: glowcolor,
  mixBlendMode: 'plus-lighter',
}));

const GlowShadow = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '5px',
  top: 'calc(100% + 30px)', left: theme.spacing(3),
  background: glowcolor,
  filter: 'blur(10px)',
  borderRadius: 'inherit',
  willChange: 'transform, opacity',
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
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
}));

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
      ease: "easeOut"
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

  useEffect(() => {
    setIsLoaded(false);
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
    <AnimatePresence mode="wait">
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
            <ImageShadow />
            <StyledImage
              src={image}
            />
          </ImageContainer>
        </ImageModal>
      )}
    </AnimatePresence>
  );
}