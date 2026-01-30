import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import getActivesection from '../functions/getActivesection';
import { motion, AnimatePresence } from "motion/react";


const MotionBox = motion(Box);

const FooterContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  left: 0, bottom: 0,
  width: 'fit-content', height: 'fit-content',
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  display: 'flex', flexDirection: 'column',
  zIndex: 5,
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  }
}));

const StyledButton = styled(IconButton)(({ theme }) => ({
  background: (theme.vars || theme).palette.text.primary,
  color: (theme.vars || theme).palette.background.default,
  alignSelf: 'flex-start',
  ...theme.applyStyles('dark', {
    background: (theme.vars || theme).palette.text.primary,
  }),
  '&:hover': {
    background: (theme.vars || theme).palette.text.secondary,
  },
}));

const SPRING_CONFIG = { type: "spring", stiffness: 80, damping: 20 };

const footVars = {
  initial: {
    opacity: 0, x: -50,
    transition: SPRING_CONFIG,
  },
  animate: {
    opacity: 1, x: 0,
    transition: SPRING_CONFIG,
  },
}

export default function Footer({ activesection }) {

  const section = getActivesection(activesection);

  return (
    <AnimatePresence>
      {section == 'introduction' && (
        <FooterContainer
          variants={footVars}
          initial='initial'
          animate='animate'
          exit='initial'
        >
          <StyledButton
            size="small"
            href="https://github.com/zhanchen9158/zhanchen9158.github.io"
            target='_blank'
            aria-label="GitHub"
          >
            <GitHubIcon />
          </StyledButton>
          <Copyright />
        </FooterContainer>
      )}
    </AnimatePresence>
  );
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: (theme.vars || theme).palette.text.secondary,
}));

const Copyright = memo(function Copyright() {
  return (
    <StyledTypography variant="body2">
      {'Copyright © Portfolio '}
      {new Date().getFullYear()}
    </StyledTypography>
  );
});