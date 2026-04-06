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
import { PROJECT_HIGHLIGHTS } from "../pics/assets";
import getRandom from '../functions/getRandom';
import CanvasRipples from "./CanvasRipples";
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

  const ripplesRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isInView || !isNormal || !ripplesRef.current) return;

    const dist = Math.hypot(
      e.clientX - lastPos.current.x,
      e.clientY - lastPos.current.y
    );

    // Only trigger if we've moved enough (saves CPU)
    if (dist > 45 && ripplesRef.current) {
      ripplesRef.current.addRipple(e.clientX, e.clientY);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const { onEnter, onLeave } = useSectionReporting('highlights', handleViewport);

  return (
    <SectionContainer
      ref={containerRef}
      onViewportEnter={onEnter}
      onViewportLeave={onLeave}
      viewport={{ amount: 0.5 }}
      id="highlights"
      maxWidth="lg"
      onMouseMove={handleMouseMove}
    >
      {isInView && isNormal && <CanvasRipples ref={ripplesRef} />}
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

  const hoveredId = useMotionValue(null);

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
      <AnimatedImages
        animationConfig={animationConfig}
        activeImage={activeImage} handleActivatingImage={handleActivatingImage}
        hoveredId={hoveredId}
      />
      {Object.values(highlights).map((v, i) => (
        <AnimatedList key={v.id}
          proj={v} proji={i} animationConfig={animationConfig}
          activeImage={activeImage}
          handleActivatingImage={handleActivatingImage}
          hoveredId={hoveredId}
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
  activeImage, handleActivatingImage, hoveredId, entryTimeRef }) {

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
            hoveredId={hoveredId}
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
  activeImage, handleActivatingImage, hoveredId, entryTimeRef }) {

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
      hoveredId.set(null);
      return;
    }

    const currentTime = Date.now();
    const waitPeriod = 1000;
    if (currentTime - entryTimeRef.current < waitPeriod) return;

    hoveredId.set(`hovered-${item.id}`);
    animate(SubheaderProgress, 1, TRANSITIONCONFIG.texthoverstart);
  }, [activeImage]);

  const handleHoverEnd = useCallback(() => {
    if (activeImage) {
      hoveredId.set(null);
      return;
    }

    hoveredId.set(null);
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
      onClick={() => handleActivatingImage(!activeImage ? item : null)}
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

const Modal = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 1,
  backfaceVisibility: "hidden",
}));

const ImageGrid = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  top: '50%', left: '50%',
  width: '90%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  //filter: 'url(#liquid-emerge-image)',
  zIndex: -1,
  pointerEvents: 'none',
  backfaceVisibility: "hidden",
}));

const BgImageUnderlay = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: '-5%',
  backgroundColor: (theme.vars || theme).palette.highlights.overlay,
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: -1,
  backfaceVisibility: "hidden",
}));

const BgImageLayer = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: '-5%',
  originX: 0.5, originY: 0.5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'url(#liquid-ripple-bg)',
  backfaceVisibility: "hidden",
}));

const bgunderlayVars = {
  initial: { opacity: 0, transition: TRANSITIONCONFIG.imageactiveimage },
  animate: {
    opacity: 1,
    transition: TRANSITIONCONFIG.imageactiveimage
  },
};

const bgVars = {
  inactive: {
    opacity: 0, zIndex: 0,
    transition: TRANSITIONCONFIG.imageactiveimage,
    transitionEnd: { display: "none" }
  },
  active: (o = 0.6) => ({
    opacity: o, zIndex: 1,
    display: "block",
    transition: TRANSITIONCONFIG.imageactiveimage
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

const AnimatedImages = memo(function AnimatedImages({ activeImage, animationConfig,
  handleActivatingImage, hoveredId }) {
  const [columns, setColumns] = useState(1);

  const rippleParams = useMemo(() => ({
    randomScale: Math.round(getRandom(20, 50)),
    randomFreq: getRandom(0.02, 0.04).toFixed(3)
  }), [activeImage]);

  const rippleProgress = useMotionValue(0);

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
      <BgLiquidFilter progress={rippleProgress} rippleParams={rippleParams} />
      <ImageGrid
        ref={containerRef}
        //onViewportEnter={() => triggerEmerge()}
        style={{ x: '-50%', y: '-50%' }}
      >
        <RippleEffect />
        {imgarr.map((v, i) => (
          <ImageItem
            key={v.id}
            itemRef={itemRef}
            v={v} i={i}
            columns={columns}
            hoveredId={hoveredId}
            activeImage={activeImage}
          />
        ))}
      </ImageGrid>
      <BgImageUnderlay
        variants={bgunderlayVars}
        initial='initial'
        animate={activeImage ? 'animate' : 'initial'}
      />
      <AnimatePresence>
        {activeImage && (
          <BgImageLayer
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

const RippleContainer = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '100%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
}));

const RippleItem = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '20vmax', height: '20vmax',
  borderRadius: '50%',
}));

const FragmentedRipple = styled(MotionBox)(({ theme, thickness = 1.5,
  degree = '135deg', mag = '40%' }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    padding: `${thickness}px`,
    background: `linear-gradient(${degree}, 
      rgba(255,255,255,1), 
      rgba(255,255,255,0) ${mag}
    )`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
  }));

const ripplesVars = {
  animate: {
    transition: {
      staggerChildren: 1.2
    },
  },
};

const rippleVars = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 3,
    opacity: [0.8, 0],
    transition: {
      duration: calculatedDuration,
      ease: "easeOut",
    },
  },
};

const RippleEffect = memo(function RippleEffect() {
  const ripples = [
    [{ d: '90deg', m: '20%' }, { d: '270deg', m: '60%' }],
    [{ d: '45deg', m: '40%' }, { d: '270deg', m: '20%' }],
    [{ d: '90deg', m: '25%' }, { d: '-30deg', m: '20%' }, { d: '240deg', m: '25%' }]
  ];

  return (
    <RippleContainer
      variants={ripplesVars}
      initial='initial'
      whileInView="animate"
    >
      {ripples.map((ripple, i) => (
        <RippleItem
          key={i}
          variants={rippleVars}
        >
          {ripple.map((prop, _) => (
            <FragmentedRipple
              degree={prop.d}
              mag={prop.m}
              thickness={2}
            />
          ))}
        </RippleItem>
      ))}
    </RippleContainer>
  );
});

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  height: '140px',
  flexGrow: 1,
  minWidth: '200px',
  maxWidth: '350px',
  borderRadius: '24px',
  backfaceVisibility: "hidden",
}));

const ImageEntrance = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '100%', height: '100%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
}));

const DriftWrapper = styled(MotionBox)(({ theme, p = {} }) => {

  const {
    totalduration,
    delay
  } = p;

  return {
    position: 'relative',
    width: '100%', height: '100%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    borderRadius: 'inherit',
    animation: `bokendrift ${totalduration}s ${delay}s ease-in-out infinite`,
    '@keyframes bokendrift': {
      '0%': {
        transform: 'translate(0, 0)',
      },
      '25%': {
        transform: `translate(var(--drift-x), var(--drift-y))`,

      },
      '100%': {
        transform: 'translate(0, 0)',
      },
    },
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
  }
});

const UnHoveredImage = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: -1,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const Bokeh = styled(MotionBox)(({ theme, p = {} }) => {

  const {
    totalduration,
    animationduration,
    delay,
    opacity,
    color = '255,255,255'
  } = p;

  const sharedStyles = {
    content: '""',
    position: 'absolute',
    inset: '-1px',
    borderRadius: '50%',
    background: 'transparent',
    filter: 'blur(0.5px)',
    zIndex: 1,
    //mixBlendMode: 'screen',
  };

  return {
    position: 'absolute',
    top: '50%', left: '50%',
    width: '100%', height: '100%',
    borderRadius: '50%',
    background: `radial-gradient(circle, 
      rgba(${color}, 1) 0%, 
      rgba(${color}, 0.9) 60%, 
      rgba(${color}, 0.2) 100%
    )`,
    border: '0.5px solid rgba(255, 255, 255, 0.2)',
    zIndex: -1,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    transform: `translate(-50%, -50%) rotate(var(--bokeh-angle))`,
    animation: `lensShift ${totalduration}s ${delay}s ease-in-out infinite backwards`,
    '@keyframes lensShift': {
      '0%': {
        transform: `translate(-50%, -50%) rotate(var(--bokeh-angle)) scale(0.1)`,
        opacity: 0,
      },
      '5%': { opacity: opacity },
      '20%': { opacity: opacity },
      '25%': {
        transform: `translate(-50%, -50%) rotate(var(--bokeh-angle)) scale(1.4)`,
        opacity: 0,
      },
      '100%': {
        transform: `translate(-50%, -50%) rotate(var(--bokeh-angle)) scale(1.4)`,
        opacity: 0,
      },
    },

    '&::before': {
      ...sharedStyles,
      borderRight: '1.5px solid rgba(255, 60, 100, 0.8)',
      boxShadow: 'inset -4px 0 6px rgba(255, 60, 100, 0.6)',
      animation: `fringePulse ${totalduration}s ${delay}s ease-in-out infinite`,
    },
    '&::after': {
      ...sharedStyles,
      borderLeft: '1.5px solid rgba(0, 200, 255, 0.8)',
      boxShadow: 'inset 4px 0 6px rgba(0, 200, 255, 0.6)',
      animation: `fringePulse ${totalduration}s ${delay}s ease-in-out infinite`,
    },
    '@keyframes fringePulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '25%': { transform: 'scale(1.05)' },
    },
  }
});

const HoveredImage = styled(MotionBox)(({ theme }) => ({
  //position: 'absolute',
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  zIndex: 1,
  backfaceVisibility: "hidden",
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  display: 'block',
  borderRadius: 'inherit',
  objectFit: 'cover',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
  filter: 'brightness(0.6) contrast(1.2) saturate(1.4) grayscale(0.2)',
  backfaceVisibility: "hidden",
}));

const imageVars = {
  initial: ({ i, col } = {}) => ({
    opacity: 0.4,
    y: col % 2 === 0 ? -100 : 100,
    transition: TRANSITIONCONFIG.imageactiveimage
  }),
  animate: ({ i, col } = {}) => ({
    opacity: 1,
    y: i % 2 === 0 ? -50 : 50,
    transition: TRANSITIONCONFIG.imageactiveimage
  }),
};

const imageentranceVars = {
  initial: {
    opacity: 0,
  },
  animate: (i) => ({
    opacity: 1,
    transition: {
      duration: 2.4,
      ease: [0.2, 0.65, 0.3, 0.9],
      delay: i * 0.08,
    }
  }),
};

const imageunhoveredVars = {
  initial: {
    opacity: 1, scale: 1,
    transition: TRANSITIONCONFIG.imagehoverstart,
  },
  animate: {
    opacity: 0, scale: 10,
    transition: TRANSITIONCONFIG.imagehoverend,
  },
};

const imagehoveredVars = {
  initial: {
    opacity: 0, scale: 0.5,
    filter: 'blur(4px)',
    '--stop-1': '0%',
    '--stop-2': '10%',
    transition: TRANSITIONCONFIG.imagehoverend
  },
  animate: {
    opacity: 0.6, scale: 1,
    filter: 'blur(0px)',
    '--stop-1': '40%',
    '--stop-2': '95%',
    transition: {
      ...TRANSITIONCONFIG.imagehoverstart,
      '--stop-2': {
        duration: 1.8,
        delay: 0.1
      }
    },
  },
};

const particlecolor = [
  '255, 250, 240'
];
const duration = 20;
const total = imgarr.length;
const indices = Array.from({ length: total }, (_, i) => i);
const schedule = indices.sort(() => Math.random() - 0.5);
const particles = Array.from({ length: imgarr.length }).map((_, i) => {
  const randomColor = particlecolor[Math.floor(Math.random() * particlecolor.length)];

  return {
    id: i,
    size: Math.round(Math.random() * 5 + 20),
    top: Math.round(Math.random() * 25 + 50),
    left: Math.round(Math.random() * 50 + 25),
    color: randomColor,
    opacity: +(Math.random() * 0.4 + 0.5).toFixed(2),
    totalduration: 4 * duration,
    animationduration: duration,
    delay: (schedule[i] / total) * 4 * duration,
  };
});

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight * 2.5;

const ImageItem = memo(function ImageItem({ itemRef, v, i,
  columns, hoveredId, activeImage }) {

  const p = particles[i] ||
  {
    size: 20,
    top: 50, left: 50,
    color: '255, 250, 230',
    opacity: 0.5, angle: 0,
    duration: 10, delay: 0,
  };
  const col = i % columns;
  const hoveredcontrols = useAnimation();

  useMotionValueEvent(hoveredId, "change", (latest) => {
    const isHovered = latest === `hovered-${v.id}`;
    hoveredcontrols.start(isHovered ? 'animate' : 'initial');
  });

  const bokehRef = useRef(null);
  const driftRef = useRef(null);
  useLayoutEffect(() => {
    const getDrift = () => {
      if (!bokehRef.current) return;
      const rect = bokehRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const angleRad = Math.atan2(y - centerY, x - centerX);
      const angleDeg = angleRad * (180 / Math.PI);
      console.log(y, centerY, angleDeg);
      bokehRef.current.style.setProperty('--bokeh-angle', `${angleDeg}deg`);

      if (!driftRef.current) return;
      const mag = 30;
      const dist = Math.hypot(y - centerY, x - centerX) || 1;
      const ux = (x - centerX) / dist * mag;
      const uy = (y - centerY) / dist * mag;

      driftRef.current.style.setProperty('--drift-x', `${ux}px`);
      driftRef.current.style.setProperty('--drift-y', `${uy}px`);
    };

    getDrift();

    window.addEventListener('resize', getDrift);
    return () => window.removeEventListener('resize', getDrift);
  }, []);

  return (
    <ImageContainer
      ref={(el) => { if (el) itemRef.current = el; }}
      custom={{ i, col }}
      variants={imageVars}
      initial='initial'
      animate={!activeImage ? 'animate' : 'initial'}
    >
      <ImageEntrance
        custom={i}
        variants={imageentranceVars}
        initial='initial'
        animate='initial'
        whileInView={'animate'}
        viewport={{ once: false, amount: 0.2 }}
      >
        <DriftWrapper
          ref={driftRef}
          p={p}
        >
          <UnHoveredImage
            variants={imageunhoveredVars}
            initial={'initial'}
            animate={hoveredcontrols}
            style={{
              width: p.size, height: p.size,
              top: `${p.top}%`, left: `${p.left}%`,
              x: '-50%', y: '-50%',
              transformOrigin: 'center',
            }}
          >
            <Bokeh
              ref={bokehRef}
              p={p}
            />
          </UnHoveredImage>
          <HoveredImage
            variants={imagehoveredVars}
            initial='initial'
            animate={hoveredcontrols}
            style={{
              transformOrigin: `${p.left}% ${p.top}%`,
              maskImage: `radial-gradient(circle at ${p.left}% ${p.top}%, black var(--stop-1), transparent var(--stop-2))`,
              WebkitMaskImage: `radial-gradient(circle at ${p.left}% ${p.top}%, black var(--stop-1), transparent var(--stop-2))`,
            }}
          >
            <StyledImage
              src={v.image}
              alt={v.title}
            />
          </HoveredImage>
        </DriftWrapper>
      </ImageEntrance>
    </ImageContainer>
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

const ImageLiquidFilter = memo(function ImageLiquidFilter({ progress }) {
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
      <filter id='liquid-emerge-image' colorInterpolationFilters="sRGB"
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