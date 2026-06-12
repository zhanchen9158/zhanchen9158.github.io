import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './shared-theme/AppTheme';
import PortfolioPage from './PortfolioPage';
import { StateProvider } from './components/StateContext';


export default function App(props) {

  return (
    <AppTheme {...props}>
      <StateProvider>
        <PortfolioPage />
      </StateProvider>
    </AppTheme >
  );
}
