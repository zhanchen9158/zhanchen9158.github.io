import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ScrollDown from './ScrollDown';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';


const StyledTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  color: `${(theme.vars || theme).palette.primary.contrastText}`,
  fontFamily: 'Charm',
  fontSize: '24px',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    textShadow: `0 0 10px ${(theme.vars || theme).palette.text.shadow}`,
  }
}));

export default function Hero({ refProps, scrollCallback }) {

  const theme = useTheme();
  const greaterThansm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      ref={el => refProps.current = { ...refProps.current, hero: el }}
      id="hero"
      sx={(theme) => ({
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
        maxWidth: { lg: '100%' },
        minHeight: '100dvh',
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
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
          height: '90%',
          justifyContent: 'space-between',
        }}
      >
        <Stack onClick={() => scrollCallback('projecthighlights')}
          spacing={2}
          useFlexGap
          sx={(theme) => ({
            alignItems: 'center', width: { xs: '100%', sm: '70%' },
            cursor: 'pointer',
            '& :hover': {
              transform: 'scale(1.05)',
              textShadow: `0 0 25px ${(theme.vars || theme).palette.text.shadow}`,
            }
          })}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Zhan&nbsp;Chen
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              's&nbsp;Portfolio
            </Typography>
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <StyledTypography onClick={() => scrollCallback('projects')}>
            Projects
          </StyledTypography>
          <StyledTypography onClick={() => scrollCallback('projecthighlights')}>
            Project Highlights
          </StyledTypography>
          <StyledTypography onClick={() => scrollCallback('certifications')}>
            Certifications
          </StyledTypography>
        </Stack>
        <ScrollDown sx={{
          transform: greaterThansm ? 'scale(1.0)' : 'scale(0.5)',
        }} />
      </Container>
    </Box>
  );
}
