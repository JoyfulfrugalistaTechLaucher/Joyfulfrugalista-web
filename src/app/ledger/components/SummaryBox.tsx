'use client';

import React, { Fragment, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {useMediaQuery, useTheme} from '@mui/material';
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/app/interface';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface summaryBoxProps {
  period: 'day' | 'week' | 'month';
  amount: number;
}


function savingLabel(period: 'day' | 'week' |'month'): string {
  if (period === 'day') {
    return 'Today Saved';
  } else {
    return `This ${period} Saved`;
  }
}

export function SummaryBox({period, amount}: summaryBoxProps) {
  return (
    <Box
      component='div'
      sx = {{
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 220
      }}
    >
      <Typography>Saved</Typography>
      <Typography color='primary' sx={{ fontSize: 34, fontWeight: 'medium' }}>
        ${amount}
      </Typography>
    </Box>
  )
}
