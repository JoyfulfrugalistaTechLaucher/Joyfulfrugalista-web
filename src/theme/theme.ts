import { ThemeOptions } from '@mui/material/styles';

// Basic options for all dependecies
export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main:  '#603a6b',
      light: '#aa96b0',
      dark:  '#530e66',
    },
    secondary: {
      main: '#f3c875',
      dark: '#937400'
    },
    error: {
      main: '#ff2172',
    },
    warning: {
      main: '#ffc397',
    },
    info: {
      main: '#6dc1dc',
      dark: '#006080'
    },
    success: {
      main: '#a690fc',
    },
  },
  // by default equal to those of the defaul tailwincss
  // 1. https://v3.tailwindcss.com/docs/responsive-design
  // 2. https://mui.com/material-ui/customization/breakpoints/
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 900,
      xl: 1280,
    }
  },
};
