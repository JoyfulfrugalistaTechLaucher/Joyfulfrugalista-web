'use client';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DesktopView from './views/Desktop';
import MobileView from './views/Mobile';

function LedgerPage() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));

  if (small) {
    return (
      <MobileView />
    )
  }

  // wide screen by default
  return <DesktopView />
};

export default LedgerPage;
