'use client';
import React, { useState, useEffect } from 'react';
import { category, categories } from '@/data/Category';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { SavingsRecord, SavingsRecordProps } from '@/app/interface';
import { formatDateString } from '@/app/utils';

// Form to submit new record of savings
function NewRecordForm({ record, handler }: SavingsRecordProps) {
  const { moneyAdded, description } = record

  const onAmtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmt = parseFloat(e.target.value) || 0;
    handler({ moneyAdded: newAmt });
  }

  const onDesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handler({ description: e.target.value });
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
          value={moneyAdded}
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
         value={description || ''}
         placeholder="(optional) e.g. Used gift cards" />
    </div>
  )
}

function CategoryPanel({record, handler}: {SavingsRecordProps}) {

  const onSelect = (category: string) => {
    handler({ category });
  };

  return (
    <div>
      <Typography component="h4">Category</Typography>
      <div
        className="my-2 flex flex-wrap items-center justify-start gap-1"
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={record.category === category.id ? "contained" : "outlined"}
            onClick={() => onSelect(category.id)}
            className="p-1 m-1 rounded-md"
            size="small"
          >
            {category.id}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function AddPanel({selectedDate}: {selectedDate: string}) {
  const [record, setRecord] = useState<SavingsRecord>({
    date: selectedDate,
    category: 'General',
    moneyAdded: 0
  });

  const updateRecord = (update: Partial<SavingsRecord>) => {
    setRecord(old => ({...old, ...update}));
  };

  return (
    <div spacing={2} className="mt-2 p-2 ledger-block-border">
      <div className="flex gap-x-2 items-center">
        <h4 className="font-semibold m-1"> Add New Savings </h4>
        <div className="text-sm text-gray-400">
          Selected Date: {formatDateString(selectedDate)}
        </div>
      </div>
      <NewRecordForm record={record} handler={updateRecord} />
      <CategoryPanel record={record} handler={updateRecord} />
    </div>
  )
}
