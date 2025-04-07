'use client';
import React, { useState, useEffect } from 'react';
import { categories } from '@/data/Category';
import Image from 'next/image';
import { fetchSavingData } from '../components/FirebaseDatabase';
import { useAuth } from '../context/AuthContext';
import BackgroundWrapper from "../components/DetailPageBackgroud";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';

type SavingsRecordProps = {
  date: Date;
  category: string;
  moneyAdded: number;
  description?: string;
}

// Form to submit new record of savings
function SavingAmount(record: SavingsRecordProps) {
  const { moneyAdded, description } = record
  const [amt, updateAmt] = useState<number>(moneyAdded)
  const [des, updateDes] = useState<string | undefined>(description)

  const onAmtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmt = e.target.value
    updateAmt(newAmt)
  }

  const onDesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDes = e.target.value
    updateDes(newDes)
  }

  return (
    <Stack spacing={4}>
      {/* Amount */}
      <FormControl fullWidth className="m-2">
        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          autoComplete="off"
          label="Amount"
          type="number"
          onChange={onAmtChange}
          value={amt}
          placeholder="0.00"
          startAdornment={<InputAdornment position="start">
                            <MonetizationOnRoundedIcon />
                          </InputAdornment>}
        />
      </FormControl>
      {/* Description */}
      <FormControl fullWidth className="m-2">
        <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
        <OutlinedInput
          id="outlined-adornment-description"
          autoComplete="off"
          label="Description"
          type="text"
          onChange={onDesChange}
          value={des}
          placeholder="(optional) Found a more affordable online course"
          startAdornment={<InputAdornment position="start">
                            <StickyNote2RoundedIcon />
                          </InputAdornment>}
        />
      </FormControl>
    </Stack>
  )
}

export function AddPanel(record: SavingsRecordProps) {

  return (
    <Stack spacing={4}>
      <Typography component="h2">
        Add New Savings Record
      </Typography>
      <SavingAmount record={record} />
    </Stack>
  );
}
