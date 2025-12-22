import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import getActivesection from '../functions/getActivesection';


const StyledAppbar = styled(AppBar)(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 10px 15px -3px rgba(${(theme.vars || theme).palette.background.contrastChannel} / 0.1)`,
  margin: '1rem auto',
  width: '90%',
  borderRadius: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  //height: 'fit-content',
  background: (theme.vars || theme).palette.background.appbar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: 'transparent',
  //height: 'fit-content',
  //padding: '8px 12px',
  fontWeight: 'bold',
  "& .MuiButton-text": {
    fontVariant: 'small-caps',
    fontSize: 20,
    fontFamily: 'Francois One',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  width: 'fit-content',
  //height: 'fit-content',
  textAlign: 'center', textTransform: 'capitalize',
  fontFamily: `'Inter', sans-serif`,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1.5,
  background: `linear-gradient(to bottom right, #6366F1, #38BDF8)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'drop-shadow(0 10px 20px rgba(99, 102, 241, 0.3))',
  fontSize:'20px',
  [theme.breakpoints.up('sm')]: {
    fontSize: '32px',
  },
}));

export default function AppAppBar({ appbarshow = true, activesection }) {

  const section = getActivesection(activesection);
  return (
    <StyledAppbar
      position="fixed"
      enableColorOnDark
      sx={{
        top: appbarshow ? 0 : '-20vh',
        transition: '1s ease 0.10s',
      }}
    >
      <StyledToolbar
        variant="dense"
        disableGutters
        sx={{
          willChange: 'transition, opacity',
          opacity: appbarshow ? '1.0' : '0',
          transition: '1s linear 0.5s',
        }}
      >
        <StyledTypography
          component="div"
        >
          {section=='introduction'?`zhan chen's porftfolio`:section}
        </StyledTypography>
      </StyledToolbar>
    </StyledAppbar >
  );
}
