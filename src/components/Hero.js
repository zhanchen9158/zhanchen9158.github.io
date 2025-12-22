import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ScrollDown from './ScrollDown';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from "framer-motion";
import SkillsCard from './SkillsCard';


const StyledTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  //color: `${(theme.vars || theme).palette.primary.contrastText}`,
  fontFamily: 'Charm',
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

  return (
    <Box
      component={motion.div}
      ref={el => refProps.current['introduction'] = el}
      onViewportEnter={() => handleViewport('introduction', true)}
      onViewportLeave={() => handleViewport('introduction', false)}
      viewport={{ amount: 0.5 }}
      id="introduction"
      sx={(theme) => ({
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
        maxWidth: { lg: '100%' },
        height: '100dvh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 24 },
          height: '100%',
          justifyContent: 'space-between',
          gap:2,
        }}
      >
        <SkillsCard />
        <Box
          sx={{
            display: { xs: 'flex', md: 'flex' },
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            pt: { xs: 0, md: 2 },
            gap: { xs: 2, md: 4 },
          }}
        >
          <StyledTypography onClick={handleScrollsection('projects')}>
            Projects
          </StyledTypography>
          <StyledTypography onClick={handleScrollsection('highlights')}>
            Project Highlights
          </StyledTypography>
          <StyledTypography onClick={handleScrollsection('certifications')}>
            Certifications
          </StyledTypography>
        </Box>
        <ScrollDown
          sx={{
            transform: { xs: 'scale(0.9)', md: 'scale(1.5)' },
          }}
        />
      </Container>
    </Box>
  );
}
