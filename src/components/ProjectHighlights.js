import React, {
  useState, useRef, useEffect, useLayoutEffect,
  useCallback, useMemo, memo
} from "react";
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
      subheader: isNormal && activeImage ? "hidden" : "initial",

      textshadow: !isNormal ? "static" : (activeImage ? "hidden" : "animate"),
      hover: isNormal ? "hover" : "static",

      blur: isNormal && activeImage ? "blur" : "static",

      floating: isNormal ? "floating" : "static",
    };
  }, [mode, activeImage]);

  return (
    <GalleryContainer>
      <TextLiquidFilter />
      <AnimatedImages activeImage={activeImage}
        animationConfig={animationConfig} handleActivatingImage={handleActivatingImage}
      />
      {Object.values(highlights).map((v, i) => (
        <AnimatedList key={v.id}
          proj={v} proji={i} animationConfig={animationConfig}
          activeImage={activeImage}
          handleActivatingImage={handleActivatingImage}
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

const HeaderLayer = styled(MotionBox)(({ theme }) => ({
  //position: 'absolute',
  paddingBottom: '0.2em',
  marginBottom: '-0.2em',
  gridArea: '1 / 1',
  fontFamily: 'Antonio',
  fontSize: 'clamp(100px, 10vw, 120px)',
  fontWeight: 800,
  lineHeight: 1.1, letterSpacing: '0.05rem',
  color: 'transparent',
  backgroundImage: 'linear-gradient(180deg, #F8FAFC 0%, #94A3B8 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  alignSelf: 'center', textAlign: 'center',
  WebkitFontSmoothing: 'antialiased',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(60px, 20vw, 100px)',
  },
  backfaceVisibility: 'hidden',
}));

const HeaderWord = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
}));

const SubHeaderContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  display: 'inline-block',
  cursor: 'pointer',
  zIndex: 5,
  backfaceVisibility: 'hidden',
}));

const SubHeaderBase = ({ theme }) => ({
  width: 'fit-content',
  display: 'inline-block',
  borderRadius: '8px',
  fontFamily: 'Cormorant Garamond',
  fontSize: 'clamp(28px, 2vw, 32px)',
  fontWeight: 600,
  fontStyle: 'italic',
  letterSpacing: '0.25em',
  pointerEvents: 'none',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
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

const SubHeaderText = styled(MotionBox)(({ theme }) => ({
  ...SubHeaderBase({ theme }),
  position: 'relative',
  color: '#E2E8F0',
}));

const SubHeaderShadow = styled(MotionBox)(({ theme }) => ({
  ...SubHeaderBase({ theme }),
  position: 'absolute',
  color: 'transparent',
  textShadow: `
    0 0 10px rgba(255, 255, 255, 0.4),
    0 0 20px rgba(255, 255, 255, 0.2)
  `,
}));

const listItemDelay = 0.45;

const TRANSITIONCONFIG = {
  listItemDelay: 0.45,

  activeimage: { duration: 1.2, ease: "easeInOut", },
};

const containerVars = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: listItemDelay,
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
    // 1. Vertical Bobbing (Returns to start)
    y: ["0%", "-3.5%", "1%", "-4.5%", "1.5%", "-3%", "0%"],

    // 2. Continuous Sweep (Moves down to 400%, then back up to 0%)
    backgroundPosition: ["0% 0%", "0% 400%", "0% 0%"],

    scaleY: [1, 1.05, 1, 1.05, 1],

    transition: {
      y: {
        duration: 35, // Very slow movement
        repeat: Infinity,
        ease: "easeInOut",
      },
      backgroundPosition: {
        duration: 25, // Slow sweep
        repeat: Infinity,
        // The custom array of easings creates the variable-speed "flow"
        ease: "easeInOut",
      },
      scaleY: {
        duration: 25, // Matches the sweep duration
        repeat: Infinity,
        ease: "easeInOut",
      }
    },
  },
  hidden: { opacity: 0, transition: TRANSITIONCONFIG.activeimage, },
  static: {
    y: 0,
    backgroundPosition: "0% 0%"
  },
};

const subheaderblurVars = {
  initial: {
    opacity: 0,
    transition: TRANSITIONCONFIG.activeimage,
  },
  hover: {
    opacity: 0,
    transition: TRANSITIONCONFIG.activeimage,
  },
  hidden: {
    opacity: 1,
    transition: TRANSITIONCONFIG.activeimage,
  },
  static: { opacity: 1, },
};

const subheaderVars = {
  initial: {
    opacity: 1,
    x: 0, y: 0,
    scale: 1,
    transition: TRANSITIONCONFIG.activeimage,
  },
  hover: {
    opacity: 1,
    x: 0, y: -10,
    scale: 1.2,
    transition: TRANSITIONCONFIG.activeimage,
  },
  hidden: { opacity: 0, x: 0, y: 0, scale: 1, transition: TRANSITIONCONFIG.activeimage, },
  static: { opacity: 1, x: 0, y: 0, scale: 1 },
};

const AnimatedList = memo(function AnimatedList({ proj, proji, animationConfig,
  activeImage, handleActivatingImage }) {

  const hoverProgress = useMotionValue(0);

  const staticOpacity = useTransform(hoverProgress, [0, 1], [0.4, 0]);

  const filterValue = useTransform(
    hoverProgress,
    [0, 1],
    ['url(#liquid-ripple-text) opacity(0)', 'url(#liquid-ripple-text) opacity(0.6)']
  );

  return (
    <ListContainer
    //variants={containerVars}
    //initial="hidden"
    //whileInView={animationConfig.visible}
    //viewport={{ once: false, amount: 0.2 }}
    >
      <ListContent
        i={proji}
        initial='initial'
        whileHover={activeImage ? 'initial' : 'hover'}
        onHoverStart={() => animate(hoverProgress, 1, { duration: 0.4, ease: "easeOut" })}
        onHoverEnd={() => animate(hoverProgress, 0, { duration: 0.3, ease: "easeIn" })}
      >
        <ListBorder
          i={proji}
          variants={borderVars}
          initial='initial'
          whileInView={!activeImage ? 'animate' : 'hidden'}
        />
        <HeaderWrapper
          animate={{ opacity: activeImage ? 0 : 1 }}
          transition={TRANSITIONCONFIG.activeimage}
          style={{
            left: proji % 2 === 0 ? 'auto' : '10%',
            right: proji % 2 === 0 ? '10%' : 'auto',
          }}
        >
          <HeaderLayer style={{ opacity: staticOpacity }}>
            {proj.projtitle.split(' ').map((w, i) => (
              <HeaderWord key={i}>{w}</HeaderWord>
            ))}
          </HeaderLayer>
          <HeaderLayer style={{ filter: filterValue }}>
            {proj.projtitle.split(' ').map((w, i) => (
              <HeaderWord key={i}>{w}</HeaderWord>
            ))}
          </HeaderLayer>
        </HeaderWrapper>
        {proj.items.map((item, itemi) => {
          const isSelected = activeImage?.image === item.image;
          return (
            <SubHeaderContainer
              key={item.id}
              initial='initial'
              animate={isSelected ? 'hover' : animationConfig.subheader}
              onClick={() => handleActivatingImage(activeImage ? null : item)}
            >
              <SubHeaderBlur
                variants={subheaderblurVars}
              >
                {item.title}
              </SubHeaderBlur>
              <SubHeaderShadow
                variants={subheaderVars}
              >
                {item.title}
              </SubHeaderShadow>
              <SubHeaderText
                variants={subheaderVars}
                style={{
                  filter: isSelected ? 'url(#liquid-ripple-text)' : 'none'
                }}
              >
                <LetterWave
                  text={item.title}
                  proji={proji}
                  itemi={itemi}
                />
              </SubHeaderText>
            </SubHeaderContainer>
          )
        })}
      </ListContent>
    </ListContainer >
  )
});

const LetterContainer = styled(MotionBox)({
  position: 'relative',
  display: 'inline-block',
  zIndex: 2,
  backfaceVisibility: 'hidden',
});

const AnimatedLetter = styled(MotionBox)({
  display: 'inline-block',
  whiteSpace: 'pre',
  transformOrigin: "center",
  backfaceVisibility: 'hidden',
});

const lettercontainerVars = {
  visible: ({ proji, itemi }) => ({
    transition: {
      delayChildren: itemi * listItemDelay + 0.5,
      staggerChildren: 0.1,
      staggerDirection: (proji % 2 === 0) ? 1 : -1,
    }
  })
};

const letterVars = {
  visible: {
    opacity: [0.9, 1, 1, 0.9],
    scale: [1, 1.4, 1],
    y: [0, -12, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.5, 1],
      ease: "easeInOut",
    }
  },
  static: {
    opacity: 0.9,
    scale: 1,
    y: 0
  }
};

const LetterWave = memo(function LetterWave({ text, proji, itemi, isBlur = false }) {
  return (
    <LetterContainer
      variants={lettercontainerVars}
      custom={{ proji, itemi }}
      initial="static"
      whileInView="visible"
    >
      {text.split('').map((l, letteri) => (
        <AnimatedLetter
          key={letteri}
          variants={letterVars}
        >
          {l === " " ? "\u00A0" : l}
        </AnimatedLetter>
      ))}
    </LetterContainer>
  )
});

const Modal = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 1,
  backfaceVisibility: "hidden",
}));

const ThumbnailContainer = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  top: '50%', left: '50%',
  width: '90%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  zIndex: -1,
  pointerEvents: 'none',
  backfaceVisibility: "hidden",
}));

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  height: '140px',
  flexGrow: 1,
  minWidth: '200px',
  maxWidth: '350px',
  borderRadius: '24px',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
  backfaceVisibility: "hidden",
}));

const ImageEntrance = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  overflow: 'hidden',
  backgroundColor: 'rgba(255,255,255,0.05)',
  maskImage: 'radial-gradient(circle, black 50%, transparent 100%)',
  filter: 'url(#liquid-emerge-thumbnail)',
  backfaceVisibility: "hidden",
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  display: 'block',
  borderRadius: 'inherit',
  objectFit: 'cover',
  filter: 'brightness(0.6) contrast(1.2) saturate(1.4) grayscale(0.2)',
  opacity: 0.6,
  backfaceVisibility: "hidden",
}));

const BgUnderlay = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: '-5%',
  backgroundColor: (theme.vars || theme).palette.highlights.overlay,
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: -1,
  backfaceVisibility: "hidden",
}));

const ImageLayer = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: '-5%',
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'url(#liquid-ripple-bg)',
  backfaceVisibility: "hidden",
}));

const rippleduration = 8;
const bgduration = rippleduration / 4;
const BG_TRANSITION = { duration: bgduration, ease: 'easeInOut' };

const thumbnailVars = {
  initial: ({ i, col } = {}) => ({
    opacity: 0.4,
    y: col % 2 === 0 ? -100 : 100,
    transition: BG_TRANSITION
  }),
  animate: ({ i, col } = {}) => ({
    opacity: 1,
    y: i % 2 === 0 ? -50 : 50,
    transition: BG_TRANSITION
  }),
};

const thumbnailentranceVars = {
  initial: {
    opacity: 0,
    y: 120,          // Start deep below
    rotateX: 45,     // Tilted back
    scale: 0.9,
  },
  animate: (i) => ({
    opacity: 1,
    y: 0,            // Rise to surface
    rotateX: 0,      // Flatten out
    scale: 1,
    transition: {
      duration: 2.2,
      ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic-bezier for a "buoyant" feel
      // Stagger the entrance based on index for a ripple effect across the grid
      delay: i * 0.05
    }
  }),
};

const bgunderlayVars = {
  initial: { opacity: 0, transition: BG_TRANSITION },
  animate: {
    opacity: 1,
    transition: BG_TRANSITION
  },
};

const bgVars = {
  inactive: {
    opacity: 0, zIndex: 0,
    transition: BG_TRANSITION,
    transitionEnd: { display: "none" }
  },
  active: (o = 0.6) => ({
    opacity: o, zIndex: 1,
    display: "block",
    transition: BG_TRANSITION
  }),
};

const getImages = () => {
  return Object.values(highlights).flatMap(project =>
    project.items
  );
};
const imgarr = getImages();

const getColumns = (containerRef, itemRef) => {
  if (!containerRef.current || !itemRef.current) return 1;

  const containerWidth = containerRef.current.offsetWidth + 32;
  const itemWidth = itemRef.current.offsetWidth + 32;
  const columns = Math.max(1, Math.floor(containerWidth / itemWidth));

  return columns;
};

const AnimatedImages = memo(function AnimatedImages({ activeImage, animationConfig, handleActivatingImage }) {
  const [columns, setColumns] = useState(1);

  const rippleParams = useMemo(() => ({
    randomScale: Math.round(getRandom(20, 50)),
    randomFreq: getRandom(0.02, 0.04).toFixed(3)
  }), [activeImage]);

  const emergeprogress = useMotionValue(0);
  const rippleProgress = useMotionValue(0);

  const triggerEmerge = useCallback(() => {
    emergeprogress.set(0);
    animate(emergeprogress, 1, {
      duration: 4.2,
      ease: [0.2, 0.65, 0.3, 0.9],
    });
  }, []);

  const triggerRipple = useCallback(() => {
    rippleProgress.set(0);
    animate(rippleProgress, 1, {
      duration: rippleduration,
      ease: [0.16, 1, 0.3, 1],
    });
  }, []);

  useEffect(() => {
    triggerRipple();
  }, [activeImage]);

  const containerRef = useRef(null);
  const itemRef = useRef(null);
  useLayoutEffect(() => {
    const updateColumns = () => {
      const cols = getColumns(containerRef, itemRef);
      setColumns(cols);
    };

    updateColumns();

    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return (
    <Modal style={{ pointerEvents: activeImage ? 'auto' : 'none' }}>
      <ThumbnailLiquidFilter progress={emergeprogress} />
      <BgLiquidFilter progress={rippleProgress} rippleParams={rippleParams} />
      <ThumbnailContainer
        ref={containerRef}
        //animate={{ opacity: !activeImage ? 1 : 0 }}
        style={{ x: '-50%', y: '-50%' }}
      >
        {imgarr.map((v, i) => {
          const col = i % columns;

          return (
            <ImageContainer
              key={v.id}
              ref={(el) => { if (el) itemRef.current = el; }}
              custom={{ i, col }}
              variants={thumbnailVars}
              initial='initial'
              animate={!activeImage ? 'animate' : 'initial'}
            >
              <ImageEntrance
                custom={i}
                variants={thumbnailentranceVars}
                initial='initial'
                animate='initial'
                whileInView={'animate'}
                onViewportEnter={() => triggerEmerge()}
                viewport={{ once: false, amount: 0.2 }}
              >
                <StyledImage
                  src={v.image}
                  alt={v.title}
                />
              </ImageEntrance>
            </ImageContainer>
          )
        })}
      </ThumbnailContainer>
      <BgUnderlay
        variants={bgunderlayVars}
        initial='initial'
        animate={activeImage ? 'animate' : 'initial'}
      />
      <AnimatePresence>
        {activeImage && (
          <ImageLayer
            key="active-full-screen"
            custom={0.6}
            variants={bgVars}
            initial="inactive"
            animate={'active'}
            exit='inactive'
            style={{ backgroundImage: `url(${activeImage?.image})` }}
            onClick={() => handleActivatingImage(null)}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
});

const StyledSvg = styled('svg')(({ theme }) => ({
  position: 'absolute',
  width: 0, height: 0,
  willChange: 'filter, opacity',
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
          scale='8'
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feColorMatrix
          in="displaced"
          type="matrix"
          values="1 0 0 0 0 
                  0 1 0 0 0.05 
                  0 0 1 0 0.1 
                  0 0 0 1 0"
        />
      </filter>
    </StyledSvg>
  );
});

const ThumbnailLiquidFilter = memo(function ThumbnailLiquidFilter({ progress }) {
  const matrixValues = useTransform(
    progress,
    [0, 1],
    [
      "0.1 0 0 0 -0.2  0 0.8 0 0 -0.1  0 0 2.0 0 0.1  0 0 0 1 0",
      "1.0 0 0 0 0  0 1.0 0 0 0  0 0 1.0 0 0  0 0 0 1 0"
    ]
  );

  return (
    <StyledSvg>
      <filter id='liquid-emerge-thumbnail' colorInterpolationFilters="sRGB"
        x="-10%" y="-10%" width="110%" height="110%"
      >
        <motion.feColorMatrix
          type="matrix"
          values={matrixValues}
        />
      </filter>
    </StyledSvg>
  );
});

const BgLiquidFilter = memo(function LiquidFilter({ progress, rippleParams }) {

  const { randomScale, randomFreq } = rippleParams;

  const scale = useTransform(progress, [0, 0.2, 1], [0, randomScale, 0]);
  const frequency = useTransform(progress, [0, 1], [randomFreq, 0.01]);

  return (
    <StyledSvg>
      <filter id="liquid-ripple-bg" x="-10%" y="-10%" width="110%" height="110%">
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