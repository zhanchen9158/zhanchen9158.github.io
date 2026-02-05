import React, { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AWSIcon from '../icons/aws.svg';
import MicrosoftIcon from '../icons/microsoft.svg';
import FreecodecampIcon from '../icons/freecodecamp.svg';
import { motion, AnimatePresence } from "motion/react";
import Avatar from '@mui/material/Avatar';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import Floating3DCanvas from './Floating3DCanvas';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const items = [
  {
    id: 1,
    icon: AWSIcon,
    title: 'Amazon Web Services Certified Solutions Architect - Associate',
    descriptions: [
      'Identify and design ideal cloud solutions that incorporate AWS services to meet current and future business requirements.',
      'Design architectures with secure accesses and appropriate data security controls.',
      'Design architectures that are scalable, highly-available, and fault-tolerant.',
      'Design architectures with appropriate services and configurations that meet performance demands.',
      'Design cost-optimized architectures.',
    ],
  },
  {
    id: 2,
    icon: MicrosoftIcon,
    title: 'Foundational C# with Microsoft',
    descriptions: [
      'Thorough foundational knowledge of the core concepts, syntax, data structures, and algorithms of C#.',
      'Identify and structure code solutions based on reusable and maintainability principles.',
      'Create applications that adhere to exception handling principles.',
      'Troubleshoot applications through the use of debugging processes and Visual Studio Code debugger.',
    ],
  },
  {
    id: 3,
    icon: FreecodecampIcon,
    title: 'JavaScript Algorithms and Data Structures',
    descriptions: [
      'Fundamental and advanced knowledge focused on ES6+, Object-Oriented Programming (OOP), and Functional Programming paradigms.',
      'Develope algorithmic solutions for data manipulation, including regular expression, recursion, and complex state logic.',
      'Produce optimized solutions utilizing algorithmic efficiency, memoization and dynamic programming, and mathematical optimization.',
    ],
  },
  {
    id: 4,
    icon: FreecodecampIcon,
    title: 'Responsive Web Design Developer',
    descriptions: [
      'Thorough foundational knowledge in HTML, CSS, and responsive web design.',
      'Implemente modern layout techniques including mobile-first responsive strategy, fluid grids, and responsive UI to create complex, fluid user interfaces.',
      'Apply Web Content Accessibility Guidelines (WCAG) standards, utilizing semantic HTML to ensure screen-reader compatibility and SEO optimization.',
    ],
  },
];

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const header = '70px';

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  width: '100dvw', height: `calc(100dvh - ${header})`,
  marginTop: header,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  overflow: 'hidden',
}));

const CardsContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '75%', height: '100%',
  perspective: 1200,
  [theme.breakpoints.down('md')]: {
    width: '85%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const AnimatedCard = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: `50%`, height: `75%`,
  maxWidth: '450px', maxHeight: '500px',
  originX: 0,
  willChange: 'transform,opacity',
  [theme.breakpoints.down('md')]: {
    width: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const StyledCard = styled(MotionBox)(({ theme }) => ({
  width: '100%', height: '100%',
  color: (theme.vars || theme).palette.text.primary,
  border: '1px solid',
  borderColor: `rgba(${(theme.vars || theme).palette.primary.lightChannel} / 0.15)`,
  background: (theme.vars || theme).palette.background.certcard,
  filter: `drop-shadow(0px 5px 10px rgba(${(theme.vars || theme).palette.text.primaryChannel} / 0.15))`,
  borderRadius: '12px',
  whiteSpace: 'wrap',
  overflow: 'scroll',
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '8px',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  height: 48,
  width: 48,
  float: 'left',
  marginRight: theme.spacing(2),
  marginTop: '6px',
  '& img': {
    objectFit: 'contain',
    backgroundColor: 'rgba(250,250,250,0.9)',
  },
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: (theme.vars || theme).palette.primary.main,
  fontFamily: 'Fraunces',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontWeight: 600,
  opacity: '0.8',
  fontSize: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  }
}));

const StyledListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1)
}));

const StyledPlayArrowIcon = styled(PlayArrowIcon)(({ theme }) => ({
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const StyledList = styled(Typography)(({ theme }) => ({
  display: 'inline',
  fontFamily: 'Archivo',
  fontSize: '16px',
  lineHeight: 1.5,
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  }
}));

const cardVars = {
  hidden: { opacity: 0, y: 20, },
  visible: ({ i, stackdiff }) => ({
    scale: 1 - i * 0.05,
    x: i * stackdiff,
    y: i * -20,
    zIndex: items.length - i,
    opacity: 1 - i * 0.1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 20,
      restDelta: 0.1,
      delay: 0.35 * i,
    }
  }),
  exit: ({ flipx }) => ({
    opacity: 0.5,
    rotateY: -110,
    x: flipx,
    zIndex: items.length + 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  }),
};

const itemVars = {
  hover: (hoverscale) => ({
    scale: hoverscale,
    y: -40,
    transition: {
      duration: 0.2,
      type: "spring", stiffness: 160, damping: 15,
    }
  }),
};

export default function Certifications({ refProps, handleViewport }) {
  const [cards, setCards] = useState(items);
  const [isInView, setIsInView] = useState(false);

  const theme = useTheme();
  const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));
  const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));

  const { stackdiff, flipx, hoverscale } = useMemo(() => {
    return {
      stackdiff: greaterThanSm ? 45 : 10,
      flipx: greaterThanSm ? -350 : -200,
      hoverscale: greaterThanSm ? 1.1 : 1.05
    };
  }, [greaterThanMd, greaterThanSm]);

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const animate = (mode == 'normal' && isInView && greaterThanMd);

    return {
      canvas: animate ? true : false,
    };
  }, [mode, isInView, greaterThanMd]);

  const handleNext = () => {
    setCards((prev) => {
      const newArray = [...prev];
      const firstItem = newArray.shift();
      newArray.push(firstItem);
      return newArray;
    });
  };

  const handleInView = useCallback((v) => {
    handleViewport('certifications', v);
    setIsInView(v);
  }, [handleViewport]);

  return (
    <SectionContainer
      ref={el => refProps.current['certifications'] = el}
      onViewportEnter={() => handleInView(true)}
      onViewportLeave={() => handleInView(false)}
      viewport={{ amount: 0.5 }}
      id="certifications"
      maxWidth="lg"
    >
      <AnimatePresence>
        {animationConfig.canvas &&
          <Animated3D />
        }
      </AnimatePresence>
      {mode == 'normal' ?
        <CardsContainer
          onClick={handleNext}
        >
          <AnimatePresence mode="popLayout">
            {cards.map((v, i) => (
              <AnimatedCard
                key={v.title + i}
                layout
                custom={{ i, stackdiff, flipx }}
                variants={cardVars}
                whileInView="visible"
                viewport={{ once: false }}
                exit={i == 0 && "exit"}
              >
                <StyledCard
                  custom={hoverscale}
                  variants={itemVars}
                  whileHover={i == 0 && 'hover'}
                >
                  <Box>
                    <StyledAvatar
                      variant='square'
                      src={v.icon}
                    />
                    <SubHeader>
                      {v.title}
                    </SubHeader>
                  </Box>
                  {v.descriptions.map((item, i) => (
                    <StyledListItem key={`desc-${v.title}-${i}`} >
                      <StyledPlayArrowIcon />
                      <StyledList>
                        {item}
                      </StyledList>
                    </StyledListItem>
                  ))}
                </StyledCard>
              </AnimatedCard>
            ))}
          </AnimatePresence>
        </CardsContainer>
        :
        <ReducedAnimation />
      }
    </SectionContainer>
  );
}

const CanvasContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  willChange: 'transform,opacity',
}));

const canvasVars = {
  initial: { opacity: 0, y: 100 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.5, duration: 2 },
  },
};

function Animated3D() {
  return (
    <CanvasContainer
      variants={canvasVars}
      initial='initial'
      animate='animate'
      exit={'initial'}
    >
      <Floating3DCanvas />
    </CanvasContainer>
  )
}

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiPaper-root': {
    background: 'transparent',
    border: `none`,
  },
}));

const ReducedAnimationCard = styled(Box)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  border: '1px solid',
  borderColor: `rgba(${(theme.vars || theme).palette.text.primaryChannel} / 0.15)`,
  backdropFilter: 'blur(10px)',
  background: (theme.vars || theme).palette.background.certcard,
  filter: `drop-shadow(0px 5px 10px rgba(${(theme.vars || theme).palette.text.primaryChannel} / 0.15))`,
  borderRadius: '12px',
  whiteSpace: 'wrap',
  overflow: 'scroll',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '8px',
}));

function ReducedAnimation({ }) {
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));

  const perpage = lesserThanMd ? 1 : 2;
  const maxpage = Math.ceil(items.length / perpage);

  const handlePageChange = (e, v) => {
    setPage(v);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
      }}>
      <Grid container spacing={0} key={page}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '2px',
        }}
      >
        {items.slice((page - 1) * perpage, page * perpage).map((v, i) => (
          <StyledGridItem item size={{ xs: 12, md: 6 }} key={i}>
            <ReducedAnimationCard
              sx={{
                width: { xs: 250, md: 350 },
                height: { xs: 300, md: 400 },
              }}
            >
              <Avatar
                variant='square'
                src={v.icon}
                slotProps={{
                  img: {
                    style: {
                      objectFit: 'contain',
                      backgroundColor: 'rgba(250,250,250,0.9)',
                    },
                  },
                }}
                sx={{
                  height: 48,
                  width: 48,
                }}
              />
              <SubHeader>
                {v.title}
              </SubHeader>
              {v.descriptions.map((item, i) => (
                <StyledListItem key={`desc-${v.title}-${i}`} >
                  <StyledPlayArrowIcon />
                  <StyledList>
                    {item}
                  </StyledList>
                </StyledListItem>
              ))}
            </ReducedAnimationCard>
          </StyledGridItem>
        ))}
      </Grid>
      <Pagination count={maxpage} page={page} onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', }} />
    </Box>
  );
}
