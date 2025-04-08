'use client';
import React, { useState, useEffect } from 'react';
import { category, categories } from '@/data/Category';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from '@mui/material';

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
    <div className="m-1 w-full flex gap-x-2 justify-around items-center">
      {/* Amount */}
      <FormControl className="m-1 flex-1">
        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
        <OutlinedInput
          id="outlined-amount"
          required
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
       <TextField
         id="outlined-adornment-description"
         autoComplete="off"
         className="m-1 flex-1"
         label="Description"
         type="text"
         onChange={onDesChange}
         value={des}
         placeholder="(optional) e.g. Used gift cards" />
    </div>
  )
}

function CategoryPanel(record: SavingsRecordProps) {

  return (
    <div>
      <Typography component="h4">Category</Typography>
      <Stack
        direction="row"
        className="my-2 flex-wrap items-center justify-start"
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
    </div>
  )
}

export function AddPanel(record: SavingsRecordProps) {

  return (
    <Stack spacing={2} className="mt-2 p-2 ledger-block-border">
      <Typography component="h3">
        Add New Savings
      </Typography>
      <AmountForm record={record} />
      <CategoryPanel record={record} />
    </Stack>
  );
}
