'use client';
import React, { useState } from 'react';
import {
  Box,
  Link,
  Tab,
  Tabs,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRecords } from '@/app/contexts/RecordsContext';
import { getWeekBounds, formatDate } from '@/app/utils';
import { SavingsRecord } from '@/app/interface';

function summary(
  records: SavingsRecord[],
  targetDate: Date,
  period: string
): number {
  switch(period) {
  case 'day': {
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === targetDate.getFullYear() &&
          recordDate.getMonth() === targetDate.getMonth() &&
          recordDate.getDate() === targetDate.getDate();
      })
      .reduce((acc, r) => acc + r.saved, 0);
  }
  case 'week': {
    const { start, end } = getWeekBounds(targetDate);
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate >= start && recordDate <= end;
      })
      .reduce((acc, r) => acc + r.saved, 0);
  }
  case 'month': {
    return records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === targetDate.getFullYear() &&
          recordDate.getMonth() === targetDate.getMonth();
      })
      .reduce((acc, r) => acc + r.saved, 0);
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
  const theme = useTheme();
  const mid = useMediaQuery(theme.breakpoints.down('lg'));

  const onChange = (
    event: React.SyntheticEvent,
    newPeriod: 'day' | 'week' | 'month') => {
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
      <div className="h-full my-4 pt-2" >
        {/* Label */}
        <div className="text-sm text-center">
          { period === 'day' && (
            <span>Total saved on { formatDate(date) }</span>
          )}
          { period === 'week' && (() => {
            const { start, end } = getWeekBounds(date);
            return (
              <span> Total saved in { formatDate(start, { month: 'long' }) } {start.getDate()}-{end.getDate()}, {start.getFullYear()}
              </span>
            );
          })()}
          { period === 'month' && (
            <span>
              Total saved in {formatDate(date, {month: 'long', year: 'numeric'})}
            </span>
          )}
        </div>
        {/* Summary */}
        <div className="m-2 text-3xl font-bold text-primary text-center">
          ${summary(records, date, period)}
        </div>

        {/* History entry */}
        { mid &&
          <Link
            href="/ledger/history"
            underline="hover"
            variant="caption"
            display="block"
            align="center"
          >
            <span>View full savings history &gt; </span>
          </Link>
        }
      </div>
    </Box>
  )
}
