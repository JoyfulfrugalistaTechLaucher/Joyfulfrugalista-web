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
import { getWeekBounds, formatDate } from '@/app/utils';

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
        className="h-full my-4 pt-2"
      >
        {/* Label */}
        {period === 'day' && (
          <div className="text-xs text-info text-center">
            Total saved on { formatDate(date) }
          </div>
        )}
        {period === 'week' && (
          <div className="text-xs text-info text-center">
            {(() => {
              const { start, end } = getWeekBounds(date);
              return (
                <> Total saved in { formatDate(start, { month: 'long' }) } {start.getDate()}-{end.getDate()}, {start.getFullYear()}
                </>
              );
            })()}
          </div>
        )}
        {period === 'month' && (
          <div className="text-xs text-info text-center">
             Total saved in {formatDate(date, {month: 'long', year: 'numeric'})}
          </div>
        )}

        <div className="m-2 text-3xl font-bold text-primary text-center">
          ${summary(records, date, period)}
        </div>
      </div>
    </Box>
  )
}
