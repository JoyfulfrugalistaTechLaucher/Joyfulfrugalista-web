'use client';

import React, { Fragment, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {useMediaQuery, useTheme} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useRecords } from '@/app/contexts/RecordsContext';

function summary(records: SavingsRecord[], targetDate: Date, period: string): number {
  switch(period) {
  case 'day': {
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === targetDate.getFullYear() &&
          recordDate.getMonth() === targetDate.getMonth() &&
          recordDate.getDate() === targetDate.getDate();
      })
      .reduce((acc, r) => acc + r.moneyAdded, 0);
  }
  case 'week': {
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);

        // Get year and week number for both dates
        const recordYear = recordDate.getFullYear();
        const targetYear = targetDate.getFullYear();

        // Get week numbers (using ISO week definition)
        const getWeek = (d: Date) => {
          const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
          const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
          return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        };

        const recordWeek = getWeek(recordDate);
        const targetWeek = getWeek(targetDate);

        // Match if same year and week
        return recordYear === targetYear && recordWeek === targetWeek;
      })
      .reduce((acc, r) => acc + r.moneyAdded, 0);
  }
  case 'month': {
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === targetDate.getFullYear() &&
          recordDate.getMonth() === targetDate.getMonth();
      })
      .reduce((acc, r) => acc + r.moneyAdded, 0);
  }
  default: {
    console.error('Unknow period: ', period);
    return 0;
  }
  }
}

export function SummaryBox({date}: {date: Date}) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const { records } = useRecords();
  console.log(records[0]);
  const onChange = (event: React.SyntheticEvent, newPeriod: string) => {
    setPeriod(newPeriod);
  }

  return (
    <Box
      component="div"
      className="h-full p-2"
    >
      <Tabs
        value={period}
        textColor="primary"
        onChange={onChange}
        indicatorColor="secondary"
        aria-label="summary period selector"
      >
        <Tab value="day" label="Day" className="capitalize"></Tab>
        <Tab value="week" label="Week"></Tab>
        <Tab value="month" label="Month"></Tab>
      </Tabs>
      <div
        component="div"
        className="grid grid-cols-1 text-3xl font-bold text-primary h-full"
      >
        <div className="place-self-center">
               ${summary(records, date, period)}
        </div>
      </div>
    </Box>
  )
}
