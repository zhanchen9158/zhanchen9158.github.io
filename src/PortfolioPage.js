import React, { useState, useRef, useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import Hero from './components/Hero';
import Certifications from './components/Certifications';
import ProjectHighlights from './components/ProjectHighlights';
import Projects from './components/Projects';
import Footer from './components/Footer';
import { motion, useScroll, useTransform } from "framer-motion";
import CustomizedSpeedDial from './components/CustomizedSpeedDial';


export default function PortfolioPage({ }) {
  const [activesection, setActivesection] = useState({});

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef({});

  const handleViewport = (section, inview) => {
    setActivesection(prev => ({ ...prev, [section]: inview }));
  };

  const handleScrollsection = (section) => (e) => {
    e.stopPropagation();
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
    <React.Fragment>
      <AppNavBar activesection={activesection} />
      <div
        ref={scrollContainerRef}
        style={{
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}>
        {sections.map((v, i) => (
          <Page key={i} containerRef={scrollContainerRef}>
            {v}
          </Page>
        ))}
      </div>
      <Footer activesection={activesection}/>
      <CustomizedSpeedDial handleScrollsection={handleScrollsection} activesection={activesection} />
    </React.Fragment>
  );
}

function Page({ containerRef, children, ...props }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-90, 0, 90]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [-500, 0, -500]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      style={{
        height: "100dvh",
        width: "100dvw",
        scrollSnapAlign: "start",
        perspective: "1200px",
        overflow: "hidden",
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
          rotateX,
          z,
          opacity,
          //backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};