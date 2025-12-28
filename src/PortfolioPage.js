import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppNavBar from './components/AppNavBar';
import Hero from './components/Hero';
import Certifications from './components/Certifications';
import ProjectHighlights from './components/ProjectHighlights';
import Projects from './components/Projects';
import Footer from './components/Footer';
import { motion, useScroll, useTransform, useSpring, cubicBezier } from "framer-motion";
import CustomizedSpeedDial from './components/CustomizedSpeedDial';
import { styled, useTheme, useColorScheme } from '@mui/material/styles';
import { AnimateProvider } from './components/AnimateContext';
import getActivesection from './functions/getActivesection';
import { GrainOverlay } from './components/GrainOverlay';


const bgimport = import.meta.glob('./pics/background*.*', {
  eager: true,
  query: '?url'
});
const bgraw = Object.values(bgimport).map((v, i) => (v.default))


export default function PortfolioPage({ }) {
  const [activesection, setActivesection] = useState({});

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef({});

  const handleViewport = (section, inview) => {
    setActivesection(prev => ({ ...prev, [section]: inview }));
  };

  const handleScrollsection = (section) => () => {
    //e.stopPropagation();
    sectionRef.current[section].scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    <Hero refProps={sectionRef} handleViewport={handleViewport}
      handleScrollsection={handleScrollsection} />,
    <Projects refProps={sectionRef} handleViewport={handleViewport} />,
    <ProjectHighlights refProps={sectionRef} handleViewport={handleViewport} />,
    <Certifications refProps={sectionRef} handleViewport={handleViewport} />
  ];

  return (
    <AnimateProvider>
      <AppNavBar activesection={activesection} />
      <Box
        ref={scrollContainerRef}
        sx={(theme) => ({
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          //backgroundColor: (theme.vars || theme).palette.text.primary,
          backgroundImage: (theme.vars || theme).palette.background.image,
          backgroundSize: 'cover',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        })}>
        <GrainOverlay opacity={0.07} />
        {sections.map((v, i) => (
          <Page key={i} containerRef={scrollContainerRef} i={i} activesection={activesection}>
            {v}
          </Page>
        ))}
      </Box>
      <Footer activesection={activesection} />
      <CustomizedSpeedDial handleScrollsection={handleScrollsection} activesection={activesection} />
    </AnimateProvider>
  );
}

function Page({ containerRef, i, activesection, children, ...props }) {

  const ref = useRef(null);

  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();

  const colormode = systemMode || mode;

  const lightoverlay = [0, 0, 0.6, 0.6];
  const darkoverlay = [0, 0.9, 0.6, 0.8];

  const bglight = bgraw.map((v, i) => (
    `linear-gradient(rgba(${(theme.vars || theme).palette.background.defaultChannel}/${lightoverlay[i]}), 
    rgba(${(theme.vars || theme).palette.background.defaultChannel}/${lightoverlay[i]})), 
    url(${v})`
  ))

  const bgdark = bgraw.map((v, i) => (
    `linear-gradient(rgba(${(theme.vars || theme).palette.background.defaultChannel}/${darkoverlay[i]}), 
    rgba(${(theme.vars || theme).palette.background.defaultChannel}/${darkoverlay[i]})), 
    url(${v})`
  ))

  const section = getActivesection(activesection);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.005
  });

  const y = useTransform(smoothProgress, [0, 1], [100, -100],
    { ease: cubicBezier(0.76, 0, 0.24, 1) });

  const rotateX = useTransform(smoothProgress, [0.1, 0.8, 1], [-10, 0, 10], { ease: (t) => t });
  const x = useTransform(smoothProgress, [0.1, 0.8, 1], [-50, 0, -50], { ease: (t) => t });
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.5, 1, 0.5, 0], { ease: (t) => t });

  return (
    <Box
      component={'section'}
      ref={ref}
      style={{
        height: "100dvh",
        width: "100dvw",
        scrollSnapAlign: "start",
        overflow: "hidden",
        //perspective: '1200px',
        //background: 'rgba(250, 250, 250, 0.1)',
        backdropFilter: 'blur(12px)',
      }}
      {...props}
    >
      <motion.div
        style={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          y,
          //backfaceVisibility: "hidden",
          //transformStyle: "preserve-3d",
          backgroundImage: colormode == 'light' ? bglight[i] : bgdark[i],
          //backdropFilter: 'blur(12px) saturate(180%)',
          backgroundSize: 'cover',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};