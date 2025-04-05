'use client';
import React, { useState, useEffect } from 'react';
import { categories } from '@/data/Category';
import Image from 'next/image';
import { fetchSavingData } from '../components/FirebaseDatabase';
import { useAuth } from '../context/AuthContext';
import BackgroundWrapper from "../components/DetailPageBackgroud";
import {
  Box,
  Stack,
} from '@mui/material';

interface SavingsRecord {
  date: Date;
  category: string;
  moneyAdded: number;
  description?: string;
}


export function Detail() {

  return (
    <Stack spacing={2}>
      <Box component='h2'>
        Savings History By Category
      </Box>

    </Stack>
  );
}
