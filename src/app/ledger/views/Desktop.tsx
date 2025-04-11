'use client';
import React, { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRecords } from '@/app/contexts/RecordsContext';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SummaryBox } from '../components/SummaryBox';
import { AddPanel } from '../components/AddPanel';
import { RecordHistory } from '../components/History';
import { LedgerCalendarDesktop } from '../components/Calendar';

function DesktopView() {
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
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
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
      <div className="ledger-layout-desktop">
        {/* Column one: Calender + Summary + AddPanel */}
        <div className="ledger-left-column">
          <div className="flex-1 flex justify-between items-start ledger-block-border">
            <LedgerCalendarDesktop
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

export default DesktopView;
