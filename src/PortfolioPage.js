import React, { useState, useRef, useEffect, useCallback, useMemo, memo, lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import AnimatedAppBar from './components/AnimatedAppBar';
import Hero from './components/Hero';
import Certifications from './components/Certifications';
import ProjectHighlights from './components/ProjectHighlights';
import Projects from './components/Projects';
import Footer from './components/Footer';
import {
  motion, useScroll, useTransform, useSpring, cubicBezier, animate,
  AnimatePresence
} from "motion/react";
import CustomizedSpeedDial from './components/CustomizedSpeedDial';
import { styled } from '@mui/material/styles';
import { AnimateProvider } from './components/AnimateContext';
import { useStateContext } from './components/StateContext';
import GrainOverlay from './components/GrainOverlay';

import loadingbg from './pics/loadingbg.webp';
import entrancehero from './pics/entrancehero1.webp';
import entrancehero2 from './pics/entrancehero2.webp';
import entrancehero3 from './pics/entrancehero3.webp';
import entrancebg1 from './pics/entrancebg1.webp';
import bg1 from './pics/bg1.webp';
import ionizationmask from './pics/ionizationmask.webp';
import hyperstream from './pics/hyperstream.webp';
import Preloader from './components/Preloader';

const Floating3DCanvas = lazy(() => import('./components/Floating3DCanvas'));


const MotionBox = motion(Box);

const ScrollContainer = styled(Box)(({ theme }) => ({
  width: '100dvw', height: "100dvh",
  overflowY: "auto",
  scrollSnapType: "y mandatory",
  backgroundColor: '#0f1011',
}));

export default function PortfolioPage() {
  const { sectionRef, handleViewport } = useStateContext();

  const scrollContainerRef = useRef(null);

  const handleScrollsection = useCallback((section) => {
    sectionRef.current[section].scrollIntoView({
      behavior: 'auto',
      block: 'end',
    });
  }, []);

  const sections = useMemo(() => ([
    {
      id: 'introduction',
      component: <Hero refProps={sectionRef} handleViewport={handleViewport}
        handleScrollsection={handleScrollsection} />,
    },
    {
      id: 'projects',
      component: <Projects refProps={sectionRef} handleViewport={handleViewport} />,
    },
    {
      id: 'highlights',
      component: <ProjectHighlights refProps={sectionRef} handleViewport={handleViewport} />,
    },
    {
      id: 'certifications',
      component: <Certifications refProps={sectionRef} handleViewport={handleViewport} />,
    },
  ]), []);

  return (
    <AnimateProvider>
      <Preloader />
      <AnimatedAppBar />
      <Animated3dCanvas />
      <HeroEntrance />
      <ScrollContainer
        ref={scrollContainerRef}
      >
        <GrainOverlay bgcolor='#000000' />
        {sections.map((v, i) => (
          <Page key={v.id}
            id={v.id}
            sectionRef={sectionRef}
            containerRef={scrollContainerRef}
            i={i}
          >
            {v.component}
          </Page>
        ))}
      </ScrollContainer>
      <Footer />
      <CustomizedSpeedDial handleScrollsection={handleScrollsection} />
    </AnimateProvider>
  );
}

const CanvasContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  backfaceVisibility: 'hidden',
}));

const Animated3dCanvas = memo(function Animated3dCanvas() {

  const { activesection, handleScroll, handleTouchStart, handleTouchEnd,
    cert, handleCertSelect, certCoordRef, CERT_DATA } = useStateContext();

  const handleClick = useCallback(() => {
    if (cert !== null) {
      handleCertSelect(null);
    }
  }, [cert?.id]);

  return (
    <CanvasContainer
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <Floating3DCanvas
        activeId={cert?.id}
        coordRef={certCoordRef}
        handleSelect={handleCertSelect}
        certData={CERT_DATA}
        activesection={activesection}
      />
    </CanvasContainer>
  )
});

const RadialHyperstream = styled(MotionBox)({
  position: 'fixed', inset: 0,
  zIndex: 5,
  backgroundImage: `url(${hyperstream})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
});

const HeroBg = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 20,
  backgroundImage: `url(${entrancehero2})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const IonizationLayer = styled(MotionBox)({
  position: 'fixed', inset: 0,
  zIndex: 10,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
  willChange: 'transform, opacity, mask-size',
  transform: 'translateZ(0)',
  maskImage: `url(${ionizationmask})`,
  maskRepeat: 'repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  maskSize: '100px',
});

const MaskedImage = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const InitializingBg = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  gap: '12px',
  background: '#08050f',
  color: '#fff2d9',
  fontFamily: 'sans-serif',
  zIndex: 40,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const Header = styled(MotionBox)(({ theme }) => ({
  margin: 0,
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: '2px'
}));

const Subheader = styled(MotionBox)(({ theme }) => ({
  fontSize: '1rem',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  opacity: 0.7,
}));

const initDuration = 3;

const HeroEntrance = memo(function HeroEntrance({ }) {
  const [isMounted, setIsMounted] = useState(true);

  const handleAnimationComplete = useCallback(() => {
    setIsMounted(false);
  }, []);

  return (
    <>
      {isMounted && (
        <>
          <RadialHyperstream
            initial={{
              scale: 1,
              opacity: 1,
            }}
            animate={{
              scale: 1.5,
              opacity: 0,
            }}
            transition={{
              delay: initDuration - 1,
              duration: 3.5,
              ease: "easeOut",
            }}
          />
          <HeroBg
            initial={{
              opacity: 1,
              filter: 'brightness(100%)',
            }}
            animate={{
              opacity: [1, 0.2, 0],
              filter: 'brightness(200%)',
            }}
            transition={{
              delay: initDuration,
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeInOut",
            }}
          />
          <IonizationLayer
            initial={{
              opacity: 1,
              scale: 1,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: 2,
            }}
            transition={{
              delay: initDuration + 2,
              duration: 6,
              times: [0, 0.4, 1],
              ease: "easeIn"
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            <MaskedImage
              style={{ backgroundImage: `url(${entrancehero3})` }}
            />
          </IonizationLayer>
          <InitializingBg
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: initDuration,
              times: [0, 0.5, 1],
              ease: "easeIn",
            }}
          >
            <Header
              initial={{
                opacity: 1,
              }}
              animate={{
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: initDuration / 2,
                times: [0, 0.5, 1],
                ease: "easeIn",
              }}
            >
              Portfolio
            </Header>
            <Subheader
              initial={{
                opacity: 1,
              }}
              animate={{
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: initDuration / 2,
                times: [0, 0.5, 1],
                ease: "easeIn",
              }}
            >
              Loading...
            </Subheader>
          </InitializingBg>
        </>
      )}
    </>
  );
});

const ScrollPageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: "100dvw", height: "100dvh",
  scrollSnapAlign: "start",
  perspective: "1000px",
  transformStyle: 'preserve-3d',
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  overflow: "hidden",
  //backdropFilter: 'blur(1px)',
}));

const PageAnchor = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0, left: 0,
  width: '1px', height: '1px',
  visibility: 'hidden'
}));

const ScrollPage = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: "100dvw", height: "100dvh",
  transformOrigin: "center center",
  WebkitFontSmoothing: "antialiased",
  backfaceVisibility: 'hidden',
}));

const ScrollContent = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  display: "flex", alignItems: "center", justifyContent: "center",
  backfaceVisibility: 'hidden',
}));

const Page = memo(function Page({ id, sectionRef, containerRef, i, children, ...props }) {

  const pageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 15,
    damping: 25,
    mass: 1.5,
    restDelta: 0.001
  });

  const gradualEase = cubicBezier(0.45, 0, 0.55, 1);

  const rotateXValue = useMemo(() =>
    id === 'certifications' ? [0, 0] : [8, 0]
    , [id]);
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [rotateXValue[0], 0, 0, rotateXValue[1]],
    { ease: gradualEase }
  );

  const opacity = useTransform(
    smoothProgress,
    [0.05, 0.35, 0.65, 0.95],
    [0, 1, 1, 0],
    { ease: gradualEase }
  );

  const y = useTransform(smoothProgress, [0.1, 0.45, 0.55, 0.9], ["0%", "0%", "0%", "-15%"]);

  const scaleValue = useMemo(() =>
    id === 'certifications' ? [1, 1] : [0.8, 2]
    , [id]);
  const containerScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1],
    [scaleValue[0], 1, 1, scaleValue[1]], { ease: gradualEase });

  const bgScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1],
    [2, 1, 1, 0.8], { ease: gradualEase });

  const contentY = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [30, 0, 0, -50]);

  return (
    <ScrollPageContainer
      ref={pageRef}
      style={{
        zIndex: 4 - i,
        pointerEvents: id === 'certifications' ? 'none' : 'auto',
      }}
      {...props}
    >
      <PageAnchor
        ref={(el) => (sectionRef.current[id] = el)}
      />
      <ScrollPage
        style={{
          y,
          scale: containerScale,
          rotateX,
          opacity,
        }}
      >
        <AnimatedBackground
          i={i}
          bgScale={bgScale}
        />
        <ScrollContent
          style={{
            y: contentY
          }}
        >
          {children}
        </ScrollContent>
      </ScrollPage>
    </ScrollPageContainer>
  );
});

const EntranceBg = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  //zIndex: -1,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const ScrollBackground = styled(MotionBox)(({ theme }) => ({
  position: 'absolute', inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -1,
  backfaceVisibility: 'hidden',
}));

const entrancebg = [];
const AnimatedBackground = memo(function AnimatedBackground({ i, bgScale }) {

  return (
    <>
      <EntranceBg
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
        style={{
          scale: bgScale,
          backgroundImage: i === 1 ? `url(${entrancebg1})` || 'none'
            : 'none',
        }}
      />
      <ScrollBackground
        style={{
          scale: bgScale,
        }}
        sx={(theme) => ({
          backgroundImage: i === 1 ? `url(${bg1})` || 'none'
            : 'none',
        })}
      />
    </>
  );
});