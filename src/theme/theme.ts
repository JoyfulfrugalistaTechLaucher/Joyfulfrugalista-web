import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#603a6b',
    },
    secondary: {
      main: '#f3c875',
    },
    error: {
      main: '#fc96bb',
    },
    warning: {
      main: '#ffc397',
    },
    info: {
      main: '#6dc1dc',
    },
    success: {
      main: '#a690fc',
    },
    gray: {
      500: '#7B8298',
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1rem",
    fontWeight: 600,
    h3: {
      fontFamily: "Montserrat, sans-serif",
      fontWeight: 700,
      whiteSpace: "pre-line",
      fontSize: "3rem",
    },
    h4: {
      fontFamily: "Montserrat, sans-serif",
      fontSize: "1.5rem",
      fontWeight: 500,
      whiteSpace: "pre-line",
    }
  },
};
