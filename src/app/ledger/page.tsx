'use client';
import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from "axios";
import { useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import MainLayout from '@/app/layouts/MainLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRecords } from '@/app/contexts/RecordsContext';
import { recordsReducer } from '@/app/reducers/recordsReducer';
import { auth } from '@/app/config/firebaseConfig';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { FB_URL } from '@/app/constants';
import { SavingsRecord, SavingsRecordProps } from '@/app/interface';
import { SummaryBox } from './components/SummaryBox';
import { AddPanel } from './components/AddPanel';
import { RecordHistory } from './components/History';

function LedgerCalendar(
  {date, handler}: {date: string, handler: (date: string) => void}
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

function filterRecords(filter: string) {
  dispatch({
    kind: 'filtered',
    filter: filter
  });
}

function sortRecords(key: 'latest' | 'oldest' | 'increasing' | 'decreasing') {
  dispatch({
    kind: 'sorted',
    key: key
  });
}

function LedgerPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { records, loading, error, addRecord, refreshRecords } = useRecords();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
  const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <BackgroundWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </BackgroundWrapper>
    );
  }

  return (
    <MainLayout>
      <div className="ledger-layout">
        {/* Column one: Calender + Summary + AddPanel */}
        <div className="ledger-left-column">
          <div className="flex-1 flex justify-between items-start ledger-block-border">
            <LedgerCalendar
              date={selectedDate}
              handler={(newDate) => setSelectedDate(newDate)}
            />
            <SummaryBox period={'day'} amount={37.5} />
          </div>
          <AddPanel
            selectedDate={selectedDate}
            onAddRecord={addRecord}
            onRefresh={refreshRecords}
          />
        </div>

        {/* Column two: History */}
        <div className="ledger-right-column ledger-block-border">
          <RecordHistory records={records} />
        </div>
      </div>
    </MainLayout>
  );
};


export default LedgerPage;
