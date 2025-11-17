import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: 'rgba(51, 145, 255, 1)',
      light: 'rgba(5, 29, 57, 1)',
      dark: 'rgba(51, 145, 255, 1)',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: 'rgba(51, 145, 255, 1)',
    },
  },
});

export default theme;
