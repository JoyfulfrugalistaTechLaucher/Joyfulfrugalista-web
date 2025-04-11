'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecords } from '@/app/contexts/RecordsContext';
import MainLayout from '@/app/layouts/MainLayout';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  Box,
  CircularProgress,
} from "@mui/material";
import BarStats from './components/BarStats';
import PieStats from './components/PieStats';

function Stats() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { records, loading } = useRecords();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

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
      <div className="flex flex-col md:flex-col gap-2 justify-between items-center">
        <PieStats records={records} />
        <BarStats records={records} />
      </div>
    </MainLayout>
  )
}

export default Stats;
