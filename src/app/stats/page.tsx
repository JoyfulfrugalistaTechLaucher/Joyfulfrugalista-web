'use client';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/layouts/MainLayout';
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

function Stats() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return (

    <MainLayout>
      <div>Work in progress</div>
    </MainLayout>
  )
}

export default Stats;
