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

function getWeekBounds(date: Date): { start: Date, end: Date } {
  const start = new Date(date);
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday

  // Set to Sunday (start of week)
  start.setDate(date.getDate() - day);

  // Set to Saturday (end of week)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Reset time parts to start/end of day if needed
  // start.setHours(0, 0, 0, 0);
  // end.setHours(23, 59, 59, 999);
  return { start, end };
}

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
    const { start, end } = getWeekBounds(targetDate);
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate >= start && recordDate <= end;
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
