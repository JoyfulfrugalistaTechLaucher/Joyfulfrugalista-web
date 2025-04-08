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
import { recordsReducer } from './reducers/recordsReducer';
import { FB_URL } from '../constants';

type SavingsRecord = {
  id: string;                  // firebase record id
  date: string;
  category: string;
  moneyAdded: number;
  description?: string;
}

function LedgerCalendar() {
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  return (
    // TODO:
    // 1. make this a controlled component
    // 2. make the background darker and add border
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <DateCalendar
        className="border rounded-md border-solid border-gray-300"
        value={date}
        onChange={(newd) => setDate(newd)} />
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


  // detail of user's savings
  const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
  const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

  const [records, dispatch] = useReducer(recordsReducer, []);
  const [filteredRecrods, setFilteredRecords] = useState<SavingsRecord[]>([]);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

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
          recordReducer(records, {kind: 'loaded' });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchSavingsRecords();
    }
  }, [isLoggedIn, uid, router]);

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

  const fake = {
    date: today,
    category: 'Education',
    moneyAdded: 20.5,
    description: 'Found a free online course'
  }
  return (
    <MainLayout>
      <Stack spacing={6} direction='row'>
        {/* Column one: Calender + Summary */}
        <Stack
          spacing={4}
          className="justify-between"
        >
          <LedgerCalendar />
          <SummaryBox period={'day'} amount={37.5} />
        </Stack>

        {/* Column two: AddPanel */}
        <Stack
          spacing={4}
          className="border-solid border border-gray-300 rounded-md p-2"
        >
          <AddPanel record={fake} />

        </Stack>
      </Stack>
    </MainLayout>
  );
};


export default LedgerPage;
