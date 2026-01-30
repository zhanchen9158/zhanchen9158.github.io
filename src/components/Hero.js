import React, { useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ScrollDown from './ScrollDown';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from "motion/react";
import SkillsCard from './SkillsCard';


const NAVIGATION_DATA = [
  {
    id: 1,
    title: 'Projects',
    scrollId: 'projects',
  },
  {
    id: 2,
    title: 'Project Highlights',
    scrollId: 'highlights',
  },
  {
    id: 3,
    title: 'Certifications',
    scrollId: 'certifications',
  }
];

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const header = '70px';
const scrolldown = 80;

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  marginTop: header,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100dvw', height: `calc(100dvh - ${header})`,
  overflow: 'hidden',
}));

const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingBottom: `${1.5 * scrolldown}px`,
  [theme.breakpoints.down('md')]: {
    paddingBottom: `${0.9 * scrolldown}px`,
  }
}));

export default function Hero({ refProps, handleViewport, handleScrollsection }) {

  return (
    <SectionContainer
      id="introduction"
      ref={el => refProps.current['introduction'] = el}
      onViewportEnter={() => handleViewport('introduction', true)}
      onViewportLeave={() => handleViewport('introduction', false)}
      viewport={{ amount: 0.5 }}
      maxWidth="lg"
    >
      <PageContainer>
        <SkillsCard />
        <AnimatedNavigation handleScrollsection={handleScrollsection} />
        {/*<ScrollDown
          sx={{
            //height: { xs: `${0.9 * scrolldown}px`, md: `${1.5 * scrolldown}px` },
            transform: { xs: 'scale(0.9)', md: 'scale(1)' },
          }}
        />*/}
      </PageContainer>
    </SectionContainer>
  );
}

const NavigationBox = styled(MotionBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(2),
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    paddingTop: 0,
    gap: theme.spacing(2)
  },
}));

const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const AnimatedNavigation = memo(function AnimatedNavigation({ handleScrollsection }) {

  const wordOffsets = useMemo(() => {
    let count = 0;
    return NAVIGATION_DATA.map(v => {
      const currentOffset = count;
      count += v.title.length;
      return currentOffset;
    });
  }, []);

  return (
    <NavigationBox
      variants={containerVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {NAVIGATION_DATA.map((v, i) => (
        <AnimatedWord
          key={v.id}
          item={v}
          offset={wordOffsets[i]}
          handleScrollsection={handleScrollsection}
        />
      ))}
    </NavigationBox>
  );
});

const WordWrapper = styled(MotionBox)(({ theme }) => ({
  display: 'inline-block',
}));

const HoverWord = styled(MotionBox)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  color: 'white',
  fontFamily: 'Cormorant Garamond',
  letterSpacing: '0.05em',
  fontSize: '30px',
  fontWeight: 600,
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    fontSize: '28px',
  }
}));

const LetterMask = styled(MotionBox)({
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'bottom',
});

const AnimatedLetter = styled(MotionBox)({
  display: 'inline-block',
  whiteSpace: 'pre',
  transformOrigin: "bottom left",
  willChange: 'transform',
});

const letterStagger = 0.04;

const wordVars = {
  hidden: { opacity: 0 },
  visible: (previousChars) => ({
    opacity: 1,
    transition: {
      delayChildren: previousChars * letterStagger,
      staggerChildren: letterStagger
    }
  })
};

const letterVars = {
  hidden: {
    y: "110%", rotate: 15,
  },
  visible: {
    y: 0, rotate: 0,
    transition: {
      duration: 0.6, ease: [0.33, 1, 0.68, 1],
    }
  }
};

const AnimatedWord = memo(function AnimatedWord({ item, offset, handleScrollsection }) {

  return (
    <WordWrapper
      variants={wordVars}
      custom={offset}
    >
      <HoverWord
        whileHover={{
          scale: 1.1,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        onClick={() => handleScrollsection(item.scrollId)}
      >
        {item.title.split('').map((l, i) => (
          <LetterMask key={i}>
            <AnimatedLetter variants={letterVars}>
              {l}
            </AnimatedLetter>
          </LetterMask>
        ))}
      </HoverWord>
    </WordWrapper>
  )
});