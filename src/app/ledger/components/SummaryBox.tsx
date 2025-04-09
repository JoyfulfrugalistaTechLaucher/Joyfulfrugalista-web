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
import { User } from '@/app/interface';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

type summaryBoxProps = {
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
      className="p-2"
    >
      <div className="flex justify-between items-center">
        <Typography component="h3">Summary</Typography>
        {/*TODO: make this tabs*/}
        <div>Day | Week | Month </div>
      </div>
      <div component="div" className="text-3xl font-bold text-primary">
        ${amount}
      </div>
    </Box>
  )
}
