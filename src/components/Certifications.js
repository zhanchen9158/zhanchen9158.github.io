import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AWSIcon from '../icons/aws.svg';
import MicrosoftIcon from '../icons/microsoft.svg';
import FreecodecampIcon from '../icons/freecodecamp.svg';
import { motion, AnimatePresence } from "framer-motion";
import Avatar from '@mui/material/Avatar';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';


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
  [theme.breakpoints.down('md')]: {
    width: '95dvw',
    height: '80dvh',
  }
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

  const header = '70px';

  const stack = greaterThanMd
    ? 60
    : greaterThanSm
      ? 30
      : 10;

  const l = items.length;
  const containerwidth = greaterThanMd
    ? 60 * l + 350
    : greaterThanSm
      ? 30 * l + 350
      : 10 * l + 250;

  const hoverscale = greaterThanMd
    ? 1.2
    : greaterThanSm
      ? 1.2
      : 1.1;

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
      x: i * stack,
      y: i * -20,
      zIndex: items.length - i,
      opacity: 1 - i * 0.1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 20,
        restDelta: 0.1,
      }
    }),
    static: (i) => ({ opacity: 1, zIndex: items.length - i, transition: { duration: 0 } }),
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
      }}
    >
      <AnimatePresence>
        <Box
          component={motion.div}
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: containerwidth,
            height: { xs: 300 + 20 * l, sm: 400 + 20 * l },
          }}
          onClick={handleNext}
          variants={containerVars}
          initial="hidden"
          whileInView={mode == 'normal' ? "visible" : "static"}
          viewport={{ once: false }}
        >
          {cards.map((v, i) => (
            <Box
              component={motion.div}
              key={i}
              layout
              custom={i}
              variants={cardVars}
              sx={{
                position: 'absolute',
                width: { xs: 250, sm: 350 },
                height: { xs: 300, sm: 400 }
              }}
            >
              <StyledCard
                component={motion.div}
                key={i}
                layout
                custom={i}
                variants={itemVars}
                whileHover={i == 0 && 'hover'}
                sx={{
                  position: 'absolute',
                  width: { xs: 250, sm: 350 },
                  height: { xs: 300, sm: 400 }
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
        </Box>
      </AnimatePresence>
    </Container >
  );
}
