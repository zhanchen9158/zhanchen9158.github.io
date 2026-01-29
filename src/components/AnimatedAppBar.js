import React, { useMemo, memo } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import getActivesection from '../functions/getActivesection';
import { motion, AnimatePresence } from "motion/react";
import Box from '@mui/material/Box';


const MotionBox = motion(Box);

const StyledAppbar = styled(AppBar)(({ theme }) => ({
  border: '1px solid',
  borderColor: `rgba(${(theme.vars || theme).palette.primary.lightChannel} / 0.3)`,
  boxShadow: `0 10px 15px -3px rgba(${(theme.vars || theme).palette.background.contrastChannel} / 0.1)`,
  width: '90%',
  borderRadius: '12px',
  left: 0, right: 0, margin: '1rem auto',
  backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1)`,
  willChange: 'transform',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  border: 'none',
  backgroundColor: 'transparent',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
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
    <StyledAppbar
      position="fixed"
      enableColorOnDark
    >
      <StyledToolbar
        variant="dense"
        disableGutters
      >
        <AnimatePresence>
          <MotionBox
            key={key}
            variants={itemVars}
            initial='initial'
            animate="animate"
          >
            <StyledTypography>
              {name}
            </StyledTypography>
          </MotionBox>
        </AnimatePresence>
      </StyledToolbar>
    </StyledAppbar >
  );
});

export default AnimatedAppBar;