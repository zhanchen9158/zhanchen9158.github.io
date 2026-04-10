import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
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
import GrainOverlay from './components/GrainOverlay';
import entrancehero from './pics/entrancehero1.webp';
import entrancehero2 from './pics/entrancehero2.webp';
import entrancehero3 from './pics/entrancehero3.webp';
import entrancebg1 from './pics/entrancebg1.webp';
import entrancebg2 from './pics/entrancebg2.webp';
import svggrit from './pics/ionizationmask.webp';


const MotionBox = motion(Box);

const ScrollContainer = styled(Box)(({ theme }) => ({
  width: '100dvw', height: "100dvh",
  overflowY: "auto",
  scrollSnapType: "y mandatory",
  backgroundColor: '#0f1011',
}));

export default function PortfolioPage({ }) {
  const [activesection, setActivesection] = useState({});

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef({});

  const handleViewport = useCallback((section, inview) => {
    setActivesection(prev => ({ ...prev, [section]: inview }));
  }, []);

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
      <AnimatedAppBar activesection={activesection} />
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
            i={i} activesection={activesection}
          >
            {v.component}
          </Page>
        ))}
      </ScrollContainer>
      <Footer activesection={activesection} />
      <CustomizedSpeedDial handleScrollsection={handleScrollsection} activesection={activesection} />
    </AnimateProvider>
  );
}

const WindowGlass = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.01) 100%),
    linear-gradient(115deg, 
      transparent 10%, 
      rgba(255,255,255,0.08) 12%, transparent 15%,   /* Streak 1 (Thin) */
      transparent 25%, 
      rgba(255,255,255,0.06) 30%, transparent 35%,   /* Streak 2 */
      transparent 45%, 
      rgba(255,255,255,0.1) 50%, transparent 55%,    /* Streak 3 (Brightest) */
      transparent 70%, 
      rgba(255,255,255,0.04) 75%, transparent 80%,   /* Streak 4 (Soft) */
      transparent 90%
    )
  `,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const HeroBlurBg = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 30,
  backgroundImage: `url(${entrancehero})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const HeroBg = styled(MotionBox)(({ theme }) => ({
  position: 'fixed', inset: 0,
  zIndex: 20,
  backgroundImage: `url(${entrancehero2})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const IonizedLayer = styled(MotionBox)({
  position: 'fixed', inset: 0,
  zIndex: 10,
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
  willChange: 'transform, opacity, mask-size',
  transform: 'translateZ(0)',

  maskImage: `url(${svggrit})`,
  maskRepeat: 'repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  //maskSize: '100px',
});

const MaskedImage = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const HeroEntrance = memo(function HeroEntrance({ }) {
  const [isMounted, setIsMounted] = useState(true);

  const handleAnimationComplete = useCallback(() => {
    setIsMounted(false);
  }, []);

  return (
    <AnimatePresence>
      {isMounted && (
        <>
          <WindowGlass
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 8, ease: 'easeInOut' }}
          />
          <HeroBlurBg
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <HeroBg
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: [1, 0.2, 0],
            }}
            transition={{
              delay: 2,
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeInOut",
            }}
          />
          <IonizedLayer
            initial={{
              opacity: 1,
              scale: 1,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: 2,
            }}
            transition={{
              delay: 2.5,
              duration: 6,
              times: [0, 0.4, 1],
              ease: "easeIn"
            }}
            onAnimationComplete={handleAnimationComplete}
            style={{ maskSize: '100px' }}
          >
            <MaskedImage
              style={{ backgroundImage: `url(${entrancehero3})` }}
            />
          </IonizedLayer>
        </>
      )}
    </AnimatePresence>
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

const Page = memo(function Page({ id, sectionRef, containerRef, i, activesection, children, ...props }) {

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

  const rotateX = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [8, 0, 0, 12],
    { ease: gradualEase }
  );

  const opacity = useTransform(
    smoothProgress,
    [0.05, 0.35, 0.65, 0.95],
    [0, 1, 1, 0],
    { ease: gradualEase }
  );

  const y = useTransform(smoothProgress, [0.1, 0.45, 0.55, 0.9], ["0%", "0%", "0%", "-15%"]);

  const containerScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 3], { ease: gradualEase });

  const bgScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [2, 1, 1, 0.8], { ease: gradualEase });

  const contentY = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [30, 0, 0, -50]);

  return (
    <ScrollPageContainer
      ref={pageRef}
      sx={{
        zIndex: 4 - i,
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
        transition={{ duration: 6, ease: 'easeInOut' }}
        style={{
          scale: bgScale,
          backgroundImage: i === 1 ? `url(${entrancebg1})` : i === 2 ? `url(${entrancebg2})` : 'none',
        }}
      />
      <ScrollBackground
        style={{
          scale: bgScale,
        }}
        sx={(theme) => ({
          backgroundImage: (theme.vars || theme).palette.background.images[i],
        })}
      />
    </>
  );
});