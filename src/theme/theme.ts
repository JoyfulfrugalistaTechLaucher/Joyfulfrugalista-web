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
    },
    error: {
      main: '#ff2172',
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
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body2: 'span',
        }
      },
      variants: [
        {
          props: { variant: 'body2' },
          style: {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
          }
        }
      ]
    }
  },
};
