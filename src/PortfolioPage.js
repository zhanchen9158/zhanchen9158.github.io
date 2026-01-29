import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import AnimatedAppBar from './components/AnimatedAppBar';
import Hero from './components/Hero';
import Certifications from './components/Certifications';
import ProjectHighlights from './components/ProjectHighlights';
import Projects from './components/Projects';
import Footer from './components/Footer';
import { motion, useScroll, useTransform, useSpring, cubicBezier, animate } from "motion/react";
import CustomizedSpeedDial from './components/CustomizedSpeedDial';
import { styled, useTheme, useColorScheme } from '@mui/material/styles';
import { AnimateProvider } from './components/AnimateContext';
import getActivesection from './functions/getActivesection';
import GrainOverlay from './components/GrainOverlay';


const MotionBox = motion(Box);

const bgimport = import.meta.glob('./pics/background*.*', {
  eager: true,
  query: '?url'
});
const bgraw = Object.values(bgimport).map((v, i) => (v.default))

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
      block: 'start',
    });
  }, []);

  const sections = [
    <Hero refProps={sectionRef} handleViewport={handleViewport}
      handleScrollsection={handleScrollsection} />,
    <Projects refProps={sectionRef} handleViewport={handleViewport} />,
    <ProjectHighlights refProps={sectionRef} handleViewport={handleViewport} />,
    <Certifications refProps={sectionRef} handleViewport={handleViewport} />
  ];

  return (
    <AnimateProvider>
      <AnimatedAppBar activesection={activesection} />
      <ScrollContainer
        ref={scrollContainerRef}
      >
        <GrainOverlay opacity={0.07} />
        {sections.map((v, i) => (
          <Page key={i} containerRef={scrollContainerRef} i={i} activesection={activesection}>
            {v}
          </Page>
        ))}
      </ScrollContainer>
      <Footer activesection={activesection} />
      <CustomizedSpeedDial handleScrollsection={handleScrollsection} activesection={activesection} />
    </AnimateProvider>
  );
}

const overlayOpacity = {
  light: [0, 0, 0, 0.1],
  dark: [0, 0.8, 0, 0.2]
};

const PageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: "100dvw", height: "100dvh",
  scrollSnapAlign: "start",
  scrollMarginTop: '0px',
  perspective: "1000px",
  transformStyle: "preserve-3d",
  overflow: "hidden",
  //backdropFilter: 'blur(1px)',
}));

const ScrollPage = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: "100dvw", height: "100dvh",
  transformOrigin: "center center",
  willChange: "transform, opacity",
  transformStyle: "preserve-3d",
  backfaceVisibility: "hidden",
  WebkitFontSmoothing: "antialiased",
}));

const ScrollContent = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  display: "flex", alignItems: "center", justifyContent: "center",
  willChange: "transform, opacity",
}));

const Page = memo(function Page({ containerRef, i, activesection, children, ...props }) {

  const ref = useRef(null);

  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();

  const colormode = systemMode || mode;
  const section = getActivesection(activesection);

  const currentBg = useMemo(() => {
    const overlay = (colormode === 'light' && section !== 'highlights')
      ? overlayOpacity.light : overlayOpacity.dark;
    const channel = (theme.vars || theme).palette.background.defaultChannel;
    return `linear-gradient(rgba(${channel}/${overlay[i]}), rgba(${channel}/${overlay[i]})), url(${bgraw[i]})`;
  }, [colormode, section, i]);

  const { scrollYProgress } = useScroll({
    target: ref,
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

  const y = useTransform(smoothProgress, [0.55, 0.9], ["0%", "-15%"]);

  const containerScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 3], { ease: gradualEase });

  const bgScale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [2, 1, 1, 0.8], { ease: gradualEase });

  const contentY = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [30, 0, 0, -50]);

  return (
    <PageContainer
      ref={ref}
      sx={{
        zIndex: 4 - i,
      }}
      {...props}
    >
      <ScrollPage
        style={{
          y,
          scale: containerScale,
          rotateX,
          opacity,
        }}
      >
        <AnimatedBackground
          backgroundImage={currentBg}
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
    </PageContainer>
  );
});

const ScrollBackground = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -1,
  willChange: "transform, opacity",
}));

const AnimatedBackground = memo(function AnimatedBackground({ backgroundImage, bgScale }) {
  return (
    <ScrollBackground
      style={{
        backgroundImage: backgroundImage,
        scale: bgScale,
      }}
    />
  );
});