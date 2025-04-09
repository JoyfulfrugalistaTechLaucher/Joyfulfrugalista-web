'use client';
import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
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
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SummaryBox } from './components/SummaryBox';
import { AddPanel } from './components/AddPanel';
import { RecordHistory } from './components/History';

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
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { records, loading, error, addRecord, refreshRecords } = useRecords();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // TODO: need to handle null?
  const handleDateChange = (newDate: Dayjs) => {
    if (newDate && newDate.isValid()) {
      setSelectedDate(newDate.toDate());
    }
  }

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
              handler={handleDateChange}
            />
            <SummaryBox date={selectedDate}/>
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
