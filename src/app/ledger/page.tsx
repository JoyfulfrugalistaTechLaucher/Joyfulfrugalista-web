'use client';
import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import MainLayout from '@/app/layouts/MainLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRecords } from '@/app/contexts/RecordsContext';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SummaryBox } from './components/SummaryBox';
import { AddPanel } from './components/AddPanel';
import { RecordHistory } from './components/History';
import DesktopView from './views/Desktop';

function LedgerCalendar(
  {date, handler}: {date: Date, handler: (date: Date) => void}
) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <DateCalendar
        value={dayjs(date)}
        onChange={handler} />
    </LocalizationProvider>
  );
}

function LedgerPage() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));

  if (small) {
    return (
      <div>Working on this</div>
    )
  }

  // wide screen by default
  return <DesktopView />
};

export default LedgerPage;
