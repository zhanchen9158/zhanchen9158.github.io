import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import SkillsCard from './SkillsCard';
import useSectionReporting from '../functions/useSectionReporting';
import GrainOverlay from './GrainOverlay';


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

const MotionContainer = motion.create(Container);
const MotionBox = motion.create(Box);
const MotionSpan = motion.create('span');

const header = '70px';
const scrolldown = 80;

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  //marginTop: header,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  //width: '100dvw', 
  height: '100dvh',
  overflow: 'hidden',
}));

const WindowGlass = styled(Box)(({ theme }) => ({
  position: 'absolute', inset: 0,
  borderRadius: 'inherit',
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

const PageContainer = styled(Box)(({ theme }) => ({
  position: 'relative', boxSizing: 'border-box',
  width: '100%',
  display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(9),
  },
}));

export default function Hero({ refProps, handleViewport, handleScrollsection }) {

  const { onEnter, onLeave } = useSectionReporting('introduction', handleViewport);

  return (
    <SectionContainer
      id="introduction"
      //ref={el => refProps.current['introduction'] = el}
      onViewportEnter={onEnter}
      onViewportLeave={onLeave}
      viewport={{ amount: 0.5 }}
      maxWidth="lg"
    >
      <PageContainer>
        <SkillsCard />
        <AnimatedNavigation handleScrollsection={handleScrollsection} />
      </PageContainer>
    </SectionContainer>
  );
}

const NavigationBox = styled(MotionBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center', alignItems: 'center',
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

const calculateWordOffsets = (data) => {
  let count = 0;
  return data.map((v) => {
    const currentOffset = count;
    count += v.title.length;
    return currentOffset;
  });
};

const WORD_OFFSETS = calculateWordOffsets(NAVIGATION_DATA);

const AnimatedNavigation = memo(function AnimatedNavigation({ handleScrollsection }) {

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
          offset={WORD_OFFSETS[i]}
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
  },
}));

const Bracket = styled(MotionSpan)(({ theme }) => ({
  height: '1.2em',
  display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center',
  color: '#FF4500',
  lineHeight: '1.2em',
  verticalAlign: 'middle',
}));

const LetterWrapper = styled(MotionBox)(({ theme }) => ({
  height: '1.2em',
  display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center',
  color: (theme.vars || theme).palette.primary.main,
  lineHeight: '1.2em',
  verticalAlign: 'middle',
  overflow: 'hidden',
}));

const animationdelay = 2;
const letterStagger = 0.2;

const wordVars = {
  hidden: { opacity: 0 },
  visible: (offset) => ({
    opacity: 1,
    transition: {
      delayChildren: offset * letterStagger + animationdelay,
      staggerChildren: letterStagger
    }
  })
};

const AnimatedWord = memo(function AnimatedWord({ item, offset, handleScrollsection }) {

  const hoverVal = useMotionValue(0);

  const scale = useTransform(hoverVal, [0, 1], [1, 1.1]);

  const bracketOpacity = useTransform(hoverVal, [0, 1], [0, 1]);
  const bracketX1 = useTransform(hoverVal, [0, 1], [-10, 0]);
  const bracketX2 = useTransform(hoverVal, [0, 1], [10, 0]);

  const handleHoverStart = () => {
    animate(hoverVal, 1, { duration: 0.3, ease: "easeOut" });
  };
  const handleHoverEnd = () => {
    animate(hoverVal, 0, { duration: 0.3, ease: "easeOut" });
  };

  return (
    <WordWrapper
      variants={wordVars}
      custom={offset}
    >
      <HoverWord
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={{ scale }}
        onClick={() => handleScrollsection(item.scrollId)}
      >
        <Bracket
          style={{ opacity: bracketOpacity, x: bracketX1 }}
        >
          [
        </Bracket>
        {item.title.split('').map((l, i) => (
          <LetterWrapper key={i}>
            <LetterAnimation
              letter={l}
              delay={(offset + i) * letterStagger + animationdelay}
            />
          </LetterWrapper>
        ))}
        <Bracket
          style={{ opacity: bracketOpacity, x: bracketX2 }}
        >
          ]
        </Bracket>
      </HoverWord>
    </WordWrapper>
  )
});

const AnimatedLetter = styled(MotionBox)({
  width: '1.25ch', height: '1.2em',
  display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center',
  whiteSpace: 'pre',
});

const letterVars = {
  hidden: {
    opacity: 0,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: [0, 1, 1],
    filter: ['blur(2px)', 'blur(2px)', 'blur(0px)'],
    transition: {
      duration: 0.65 + 1,
      ease: "easeOut",
      times: [0, 0.1, 1]
    }
  }
};

const GLYPHS = "0123456789ABCDEF<>[]/!@#$%^&*";
const getRandomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const LetterAnimation = memo(function LetterAnimation({ letter, delay }) {
  const [displayLetter, setDisplayLetter] = useState(getRandomGlyph());
  const [isLocked, setIsLocked] = useState(false);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const startDecryption = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(intervalRef.current);

    timeoutRef.current = setTimeout(() => {
      let iteration = 0;
      const maxIterations = 10;

      const runInterval = () => {
        const speed = 20 + (iteration * 10);
        intervalRef.current = setTimeout(() => {
          setDisplayLetter(getRandomGlyph());
          iteration++;

          if (iteration < maxIterations) {
            runInterval();
          } else {
            setIsLocked(true);
            setDisplayLetter(letter);
          }
        }, speed);
      };
      runInterval();
    }, delay * 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <AnimatedLetter
      variants={letterVars}
      onAnimationStart={startDecryption}
      style={{
        color: isLocked ? '#ffffff' : 'inherit',
      }}
    >
      {displayLetter}
    </AnimatedLetter>
  );
});