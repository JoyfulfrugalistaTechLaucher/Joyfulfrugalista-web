'use client';
import React, { useState, useEffect, useReducer } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import {
  Avatar,
  Box,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import MainLayout from '../layouts/MainLayout';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { SummaryBox } from './components/SummaryBox';
import { AddPanel, SavingsRecordProps } from './components/AddPanel';
import { RecordHistory } from './components/History';
import { recordsReducer } from './reducers/recordsReducer';
import { FB_URL } from '@/app/constants';
import { SavingsRecord, SavingsRecordProps } from '@/app/interface';

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

function addNewRecord(record: SavingsRecord) {
  dispatch({
    kind: 'added',
    record: record
  });
}

function LedgerPage() {
  const router = useRouter();
  const { uid, isLoggedIn, setUid } = useAuth();
  const [loading, setLoading] = useState(true);

  const [records, dispatch] = useReducer(recordsReducer, []);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
  const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

  useEffect(() => {
    console.log('uid' + uid);

    if (!isLoggedIn) {
      setLoading(false);

      router.replace('/login');
    } else if (uid) {
      console.log('User logged in successfully');
      const fetchSavingsRecords = async () => {
        try {
          const response = await axios.get(`${FB_URL}/addInfo/${uid}.json`);

          // Convert Firebase object to array
          const recordsData = response.data;
          const records: SavingsRecord[] = recordsData ?
            Object.entries(recordsData).map(([id, data]) => ({
              id,
              ...(data as SavingsRecord),
          })) : [];
          dispatch({kind: 'loaded', data: records.reverse()});
          console.log('Loaded ', records.length, ' records');
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchSavingsRecords();
    }
  }, [isLoggedIn, uid, router]);

  // Refresh records after adding
  const refreshRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${FB_URL}/addInfo/${uid}.json`);
      const recordsData = response.data;
      const records: SavingsRecord[] = recordsData ?
        Object.entries(recordsData).map(([id, data]) => ({
          id,
          ...(data as SavingsRecord),
        })) : [];
      dispatch({kind: 'loaded', data: records});
      console.log('Refreshed records: ', records.length);
    } catch (error) {
      console.error('Error refreshing records:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewRecord = async (record: SavingsRecord) => {
    try {
      const response = await axios.post(`${FB_URL}/addInfo/${uid}.json`, record);
      if (response.data && response.status === 200) {
        // Add the new record to local state
        const newRecord = {
          ...record,
          id: response.data.name // Firebase returns the new ID
        };
        dispatch({
          kind: 'added',
          record: newRecord
        });
        return true;
      }
    } catch (error) {
      console.error('Error adding record:', error);
    }
    return false;
  };

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
        <div className="flex-1 flex flex-col justify-between gap-x-2">
          <div className="flex-1 flex justify-between items-start ledger-block-border">
            <LedgerCalendar
              date={selectedDate}
              handler={(newDate) => setSelectedDate(newDate)}
            />
            <SummaryBox period={'day'} amount={37.5} />
          </div>
          <AddPanel
            selectedDate={selectedDate}
            onAddRecord={addNewRecord}
            onRefresh={refreshRecords}
          />
        </div>

        {/* Column two: History */}
        <div className="ledger-block-border p-2">
          <RecordHistory records={records} />
        </div>
      </div>
    </MainLayout>
  );
};


export default LedgerPage;
