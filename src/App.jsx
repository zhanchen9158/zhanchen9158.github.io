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
    }, 1000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AppTheme {...props}>
      <PortfolioPage />
    </AppTheme >
  );
}
