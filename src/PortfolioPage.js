import React, { useState, useRef, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import AppNavBar from './components/AppNavBar';
import Hero from './components/Hero';
import Certifications from './components/Certifications';
import ProjectHighlights from './components/ProjectHighlights';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ScrollTop from './components/ScrollTop';

export default function PortfolioPage({ appbarshow, toggleAppbaron, showscrolltop, toggleScrolltop }) {

  const sectionRef = useRef({});

  const scrollCallback = (section) => {
    toggleAppbaron();
    sectionRef.current[section].scrollIntoView({ behavior: 'smooth' });
    if (section != 'hero')
      toggleScrolltop(true);
  };

  return (
    <React.Fragment>
      <AppNavBar scrollCallback={scrollCallback} appbarshow={appbarshow} />
      <Hero refProps={sectionRef} scrollCallback={scrollCallback} />
      <Divider />
      <div>
        <Projects refProps={sectionRef} />
        <Divider />
        <ProjectHighlights refProps={sectionRef} />
        <Divider />
        <Certifications refProps={sectionRef} />
        <Footer />
        <ScrollTop showscrolltop={showscrolltop}>
          <Fab onClick={() => scrollCallback('hero')} size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </div>
    </React.Fragment>
  );
}
