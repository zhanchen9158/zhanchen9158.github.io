import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AWSIcon from '../icons/aws.svg';
import MicrosoftIcon from '../icons/microsoft.svg';
import FreecodecampIcon from '../icons/freecodecamp.svg';
import { motion, AnimatePresence, delay } from "framer-motion";
import Avatar from '@mui/material/Avatar';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import FloatingPage from './FloatingPage';
import { Canvas } from '@react-three/fiber'

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

const StyledCard = styled(Box)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  border: '1px solid',
  borderColor: `rgba(${(theme.vars || theme).palette.text.primaryChannel} / 0.15)`,
  backdropFilter: 'blur(10px)',
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

const SubHeader = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
  fontFamily: 'Fira Code, monospace',
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
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
  }
}));

export default function Certifications({ refProps, handleViewport }) {
  const [cards, setCards] = useState(items);

  const theme = useTheme();
  const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));
  const greaterThanSm = useMediaQuery(theme.breakpoints.up('sm'));
  const smheight = useMediaQuery('(max-height:600px)');

  const header = '70px';

  const stackdiff = greaterThanMd
    ? 60
    : greaterThanSm
      ? 30
      : 10;

  const cardw = greaterThanSm ? 350 : 250;
  const cardh = greaterThanSm ? 400 : 300;

  const l = items.length;
  const containerwidth = stackdiff * (l - 1) + cardw;

  const flipx = greaterThanSm ? -300 : -200;

  const hoverscale = greaterThanSm
    ? 1.1
    : 1.05;

  const wh = window?.innerHeight;
  const padbot = (wh - parseInt(header, 10) - cardh) / 3;

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
      },
    },
    static: { opacity: 1, transition: { duration: 0 } },
  };

  const cardVars = {
    hidden: { opacity: 0, y: 20, },
    visible: (i) => ({
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
    exit: {
      opacity: 0.5,
      rotateY: -110 * hoverscale,
      x: flipx * hoverscale,
      zIndex: items.length + 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const itemVars = {
    hover: {
      scale: hoverscale,
      y: -40,
      transition: {
        duration: 0.2,
        type: "spring", stiffness: 160, damping: 15,
      }
    },
  };

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const handleNext = () => {
    setCards((prev) => {
      const newArray = [...prev];
      const firstItem = newArray.shift();
      newArray.push(firstItem);
      return newArray;
    });
  };

  return (
    <Container
      component={motion.div}
      ref={el => refProps.current['certifications'] = el}
      onViewportEnter={() => handleViewport('certifications', true)}
      onViewportLeave={() => handleViewport('certifications', false)}
      viewport={{ amount: 0.5 }}
      id="certifications"
      maxWidth="lg"
      sx={{
        position: 'fixed',
        marginTop: header,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100dvh - ${header})`,
        overflow: 'hidden',
        pb: `${padbot}px`,
      }}
    >
      {/*<Canvas camera={{ position: [0, 0, 10], fov: 35 }} 
      //style={{ width: 300, height: 400 }}
      >
        <ambientLight intensity={0.5} />
        <FloatingPage url={page} position={[0, 0, 0]} style={{ width: 90, height: 120 }}/>
      </Canvas>*/}
      {mode == 'normal' ?
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: containerwidth,
            height: cardh + 20 * l,
            perspective: 1200,
          }}
          onClick={handleNext}
        >
          <AnimatePresence mode="popLayout">
            {cards.map((v, i) => (
              <Box
                component={motion.div}
                key={v.title + i}
                layout
                willChange
                custom={i}
                variants={cardVars}
                whileInView="visible"
                viewport={{ once: false }}
                exit={i == 0 && "exit"}
                sx={{
                  position: 'absolute',
                  width: `${cardw}px`,
                  height: `${cardh}px`,
                  //transformOrigin: "left",
                  originX: 0,
                }}
              >
                <StyledCard
                  component={motion.div}
                  //key={i}
                  variants={itemVars}
                  whileHover={i == 0 && 'hover'}
                  sx={{
                    position: 'absolute',
                    width: { xs: 250, sm: 350 },
                    height: `${cardh}px`,
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
                </StyledCard>
              </Box>
            ))}
          </AnimatePresence>
        </Box> :
        <ReducedAnimation />
      }
    </Container >
  );
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
