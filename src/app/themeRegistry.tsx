"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { themeOptions } from "../theme/theme";
import React from "react";

// Get basic theme options
let theme = createTheme(themeOptions);

// Compose new options
theme = createTheme(theme, {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[300],
            borderWidth: "2px",
            borderRadius: 10,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: "3px",
            borderRadius: 10,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderWidth: "3px",
            borderRadius: 10,
          },
          '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
            borderWidth: "3px",
            borderRadius: 10,
          },

        },
      },
    },
  },
});


export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
