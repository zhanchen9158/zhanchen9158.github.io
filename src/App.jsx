import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './shared-theme/AppTheme';
import PortfolioPage from './PortfolioPage';
import Box from '@mui/material/Box';
import SplashScreen from './components/SplashScreen';


export default function App(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box //onWheel={toggleAppbar} 
        sx={(theme) => ({
          //position: 'relative',
          overflowY: 'scroll',
          backgroundColor: `#F4F7F6`,
          backgroundImage: (theme.vars||theme).palette.background.image,
          backdropFilter: 'blur(12px) saturate(180%)',
          backgroundSize: 'cover',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: '100dvh',
          width: '100dvw',
        })}>
        <PortfolioPage />
      </Box>
    </AppTheme>
  );
}
