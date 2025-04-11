'use client';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecords } from '@/app/contexts/RecordsContext';
import MainLayout from '@/app/layouts/MainLayout';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  Avatar,
  Box,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BarChat from './components/BarStats';

function Stats() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { records, loading, error, addRecord, refreshRecords } = useRecords();

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
      <BarChat records={records} />
    </MainLayout>
  )
}



export default Stats;
