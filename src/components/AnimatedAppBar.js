import React, { useMemo, memo } from 'react';
import { styled } from '@mui/material/styles';
import getActivesection from '../functions/getActivesection';
import { motion, AnimatePresence } from "motion/react";
import Box from '@mui/material/Box';


const MotionBox = motion(Box);

const AppBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0, right: 0, margin: '1rem auto',
  width: '90%', height: '50px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '12px',
  border: '1px solid',
  borderColor: `rgba(${(theme.vars || theme).palette.primary.lightChannel} / 0.3)`,
  backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1)`,
  boxShadow: `0 10px 15px -3px rgba(${(theme.vars || theme).palette.background.contrastChannel} / 0.1)`,
  zIndex: 9999,
}));

const AppBarHeader = styled(MotionBox)(({ theme }) => ({
  width: 'fit-content',
  textAlign: 'center', textTransform: 'capitalize',
  fontFamily: 'Playfair Display',
  fontWeight: 800,
  lineHeight: 1.5,
  background: `linear-gradient(to bottom right, #6366F1, #38BDF8)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  fontSize: '32px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  },
  WebkitFontSmoothing: 'antialiased',
  backfaceVisibility: "hidden",
}));

const itemVars = {
  initial: {
    opacity: 0,
    scale: 1,
    y: -15,
    clipPath: "inset(0% 0% 100% 0%)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

const AnimatedAppBar = memo(function AnimatedAppBar({ activesection }) {

  const { key, name } = useMemo(() => {
    const s = getActivesection(activesection);
    return {
      key: s,
      name: s === 'introduction' ? "zhan chen's portfolio" : s
    };
  }, [activesection]);

  return (
    <AppBar

    >

      <AnimatePresence>
        <AppBarHeader
          key={key}
          variants={itemVars}
          initial='initial'
          animate="animate"
        >
          {name}
        </AppBarHeader>
      </AnimatePresence>
    </AppBar >
  );
});

export default AnimatedAppBar;