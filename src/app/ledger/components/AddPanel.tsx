'use client';
import React, { useState, useEffect } from 'react';
import { category, categories } from '@/data/Category';
import Image from 'next/image';
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
import { fetchSavingData } from '../components/FirebaseDatabase';
import { useAuth } from '../context/AuthContext';
import BackgroundWrapper from "../components/DetailPageBackgroud";

type SavingsRecordProps = {
  date: string;
  category: string;
  moneyAdded: number;
  description?: string;
}

// Form to submit new record of savings
function AmountForm(record: SavingsRecordProps) {
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
    <Stack spacing={2}>
      {/* Amount */}
      <FormControl className="m-1">
        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          autoComplete="off"
          label="Amount"
          type="number"
          onChange={onAmtChange}
          value={amt}
          placeholder="0.00"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
      {/* Description */}
      <FormControl className="m-1">
        <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
        <OutlinedInput
          id="outlined-adornment-description"
          autoComplete="off"
          label="Description"
          type="text"
          onChange={onDesChange}
          value={des}
          placeholder="(optional) Found a more affordable online course"
        />
      </FormControl>
    </Stack>
  )
}

function CategoryPanel(record: SavingsRecordProps) {

  return (
    <Box>
      <Typography component="h3">Select a category</Typography>
      <Stack
        direction="row"
        className="my-2 flex-wrap items-center justify-center"
      >
        { categories.map((category) => (
          <div
            key={category.id}
            className="p-1 m-1 rounded-md bg-slate-100"
          >
            {category.id}
          </div>
        )) }
      </Stack>
    </Box>
  )
}

export function AddPanel(record: SavingsRecordProps) {

  return (
    <Stack spacing={2}>
      <Typography component="h3">
        Add New Savings
      </Typography>
      <AmountForm record={record} />
      <CategoryPanel record={record} />
    </Stack>
  );
}
