'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import AddPage from '../addPage/page';
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

function LedgerCalendar() {
  return (
    // TODO:
    // 1. make this a controlled component
    // 2. make the background darker and add border
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <DateCalendar
        className="border rounded-md border-solid border-gray-300"
      />
    </LocalizationProvider>
  );
}

function LedgerPage() {
  const [showModal, setShowModal] = useState(false);
  const [refreshDetail, setRefreshDetail] = useState(false); // 用于控制 Detail 刷新
  const [showPieChart, setShowPieChart] = useState(false);
  const router = useRouter();
  const { uid, isLoggedIn, setUid } = useAuth();
  const [loading, setLoading] = useState(true);
  // detail of user's savings
  const [savingEntries, setSavingEntries] = useState<SavingsRecord[]>([]);
  const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
  const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

  useEffect(() => {
    console.log("uid" + uid);

    if (!isLoggedIn) {
      setLoading(false);

      router.replace("/login");
    } else if (uid) {
      console.log("succeed");
      setLoading(false);
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);
  };


  const closeModalAndRefresh = () => {
    setShowModal(false);
    setRefreshDetail(!refreshDetail);
  };

  const closeModalOnClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      closeModalAndRefresh();
    }
  };

  const closePieChart = () => {
    setShowPieChart(false);
  };

  const fake = {
    date: new Date(),
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
