'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useTheme,
  useMediaQuery,
  Box,
  CircularProgress,
} from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRecords } from '@/app/contexts/RecordsContext';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { SummaryBox } from '../components/SummaryBox';
import { AddPanel } from '../components/AddPanel';
import { LedgerCalendarMobile, LedgerCalendarDesktop } from '../components/Calendar';

function MobileView() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { loading, addRecord, refreshRecords } = useRecords();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // TODO: need to handle null?
  // const handleDateChange = (newDate: Dayjs) => {
  //   if (newDate && newDate.isValid()) {
  //     setSelectedDate(newDate.toDate());
  //   }
  // }
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
      <div className="ledger-layout-mobile">

        { md ? (
          <div className="ledger-block-border my-2 flex flex-row gap-2">
            <LedgerCalendarDesktop
              date={selectedDate}
              handler={handleDateChange}
            />
            <SummaryBox date={selectedDate}/>
          </div>
        ) : (
          <>
            <div className="mb-2 ledger-block-border">
              <SummaryBox date={selectedDate}/>
            </div>
            <LedgerCalendarMobile
              date={selectedDate}
              handler={handleDateChange}
            />
          </>
        )
        }

        <AddPanel
          selectedDate={selectedDate}
          onAddRecord={addRecord}
          onRefresh={refreshRecords}
        />

      </div>
    </MainLayout>
  );
}

export default MobileView;
