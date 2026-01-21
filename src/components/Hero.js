import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ScrollDown from './ScrollDown';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from "motion/react";
import SkillsCard from './SkillsCard';


const StyledTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  color: 'white',
  fontFamily: 'Archivo',
  fontSize: '24px',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    textShadow: `0 0 10px ${(theme.vars || theme).palette.text.shadow}`,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
  }
}));

export default function Hero({ refProps, handleViewport, handleScrollsection }) {

  const theme = useTheme();

  const header = '70px';
  const scrolldown = 80;


  return (
    <Container
      component={motion.div}
      ref={el => refProps.current['introduction'] = el}
      onViewportEnter={() => handleViewport('introduction', true)}
      onViewportLeave={() => handleViewport('introduction', false)}
      viewport={{ amount: 0.5 }}
      id="introduction"
      maxWidth="lg"
      sx={(theme) => ({
        position: 'fixed',
        marginTop: header,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100dvh - ${header})`,
        overflow: 'hidden',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          width: '100%',
          pb: { xs: `${0.9 * scrolldown}px`, md: `${1.5 * scrolldown}px` }
        }}>
        <SkillsCard />
        <Box
          sx={{
            display: { xs: 'flex', md: 'flex' },
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            pt: { xs: 0, md: 2 },
            pb: { xs: 0, md: 2 },
            gap: { xs: 2, md: 4 },
          }}
        >
          <StyledTypography onClick={() => handleScrollsection('projects')}>
            Projects
          </StyledTypography>
          <StyledTypography onClick={() => handleScrollsection('highlights')}>
            Project Highlights
          </StyledTypography>
          <StyledTypography onClick={() => handleScrollsection('certifications')}>
            Certifications
          </StyledTypography>
        </Box>
        <ScrollDown
          sx={{
            //height: { xs: `${0.9 * scrolldown}px`, md: `${1.5 * scrolldown}px` },
            transform: { xs: 'scale(0.9)', md: 'scale(1)' },
          }}
        />
      </Box>
    </Container>
  );
}
