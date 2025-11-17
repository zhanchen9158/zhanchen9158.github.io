import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './shared-theme/AppTheme';
import PortfolioPage from './PortfolioPage';
import Box from '@mui/material/Box';
import SplashScreen from './components/SplashScreen';

export default function App(props) {
  const [appbarshow, setAppbarshow] = useState(true);
  const [showscrolltop, setShowscrolltop] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleAppbaron = () => {
    setShowscrolltop(false);
    setAppbarshow(true);
  };

  const toggleAppbar = (e) => {
    if (e.deltaY < 0) {
      setAppbarshow(true);
    }
    else {
      setShowscrolltop(true);
      setAppbarshow(false);
    }
  };

  const toggleScrolltop = (tf) => {
    setShowscrolltop(tf);
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setTimeout(() => {
      setAppbarshow(true);
    }, 2300);
  }, []);

  return loading ? (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SplashScreen />
    </AppTheme>
  )
    : (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Box onWheel={toggleAppbar} sx={(theme) => ({
          //position: 'relative',
          overflowY: 'scroll',
          backgroundImage: `${(theme.vars || theme).palette.background.image}`,
          backgroundSize: 'cover',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: loading ? "blur(20px)" : 'none',
          opacity: loading ? 0 : 1,
          transition: "filter 0.5s, opacity 0.2s",
          height: '100vh',
          width: '100vw',
        })}>
          <Container maxWidth="lg">
            <PortfolioPage appbarshow={appbarshow} toggleAppbaron={toggleAppbaron}
              showscrolltop={showscrolltop} toggleScrolltop={toggleScrolltop} />
          </Container>
        </Box>
      </AppTheme>
    );
}
