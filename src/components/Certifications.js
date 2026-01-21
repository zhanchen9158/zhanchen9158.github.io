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
import page from '../pics/page.webp';
import FloatingPage from './FloatingPage';
import { Canvas } from '@react-three/fiber';
import floatingbook1 from '../pics/floatingbook1.webp';
import floatingbook2 from '../pics/floatingbook2.webp';
import floatingpen from '../pics/floatingpen.png';
import floatingpencap from '../pics/floatingpencap.png';
import FloatingItem from './FloatingItem';


const items = [
  {
    id: 1,
    icon: AWSIcon,
    title: 'Amazon Web Services Certified Solutions Architect - Associate',
    description: [
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
    description: [
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
    description: [
      'Fundamental and advanced knowledge focused on ES6+, Object-Oriented Programming (OOP), and Functional Programming paradigms.',
      'Develope algorithmic solutions for data manipulation, including regular expression, recursion, and complex state logic.',
      'Produce optimized solutions utilizing algorithmic efficiency, memoization and dynamic programming, and mathematical optimization.',
    ],
  },
  {
    id: 4,
    icon: FreecodecampIcon,
    title: 'Responsive Web Design Developer',
    description: [
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
  marginTop: header,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `calc(100dvh - ${header})`,
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
  marginBottom: theme.spacing(1),
  '& img': {
    objectFit: 'contain',
    backgroundColor: 'rgba(250,250,250,0.9)',
  },
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: (theme.vars || theme).palette.primary.main,
  fontFamily: 'fraunces',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontWeight: 600,
  opacity: '0.8',
  fontSize: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  }
}));

const StyledList = styled(Typography)(({ theme }) => ({
  fontFamily: 'Archivo',
  fontSize: '16px',
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
          <Floating3DCanvas />
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
                  {v.description.map((item, i) => (
                    <StyledList key={i}>
                      {item}
                    </StyledList>
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

function Floating3DCanvas() {
  return (
    <CanvasContainer
      variants={canvasVars}
      initial='initial'
      animate='animate'
      exit={'initial'}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        style={{ position: 'fixed', width: '100dvw', height: '100dvh' }}
      >
        <ambientLight intensity={0.5} />
        <FloatingPage url={page} position={[-3, 0.75, 0]} width={0.5}
          rotate={{ xCenter: 60, yCenter: 5, yAmp: 5, z: 0 }}
          ytravel={{ speed: 0.1, range: 0.05 }}
          bend={{ number: 1.8, amp: 0.4 }} />
        <FloatingPage url={page} position={[-4.75, 0.25, -1]} width={0.5}
          rotate={{ xCenter: 30, yCenter: 0, yAmp: 15, z: 120 }}
          ytravel={{ speed: 0.2, range: 0.2 }}
          bend={{ number: 2.4, amp: 0.1 }} />
        <FloatingPage url={page} position={[-3.5, 1.75, 0]} width={0.5}
          rotate={{ xCenter: 5, yCenter: 45, yAmp: 15, z: 30 }}
          ytravel={{ speed: 0.4, range: 0.2 }}
        />
        <FloatingItem url={floatingpen} position={[-3.0, -1.0, 0]}
          size={{ width: 1, aspectratio: 1.8 }}
          rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: -45, zAmp: 5 }}
          ytravel={{ speed: 0.1, range: 0.1 }}
        />
        <FloatingItem url={floatingpencap} position={[-3.5, -0.25, 0]}
          size={{ width: 0.45, aspectratio: 1.4 }}
          rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: -120, zAmp: 30 }}
          ytravel={{ speed: 0.2, range: 0.2 }}
        />
        <FloatingItem url={floatingbook1} position={[-4.0, -1.25, 0]}
          size={{ width: 1.0, aspectratio: 0.67 }}
          rotate={{ xStart: 0, xAmp: 0, yStart: 0, yAmp: 30, zStart: 10, zAmp: 10 }}
          ytravel={{ speed: 0.1, range: 0.1 }}
        />
      </Canvas>
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
              {v.description.map((item, i) => (
                <StyledList key={i}>
                  {item}
                </StyledList>
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
