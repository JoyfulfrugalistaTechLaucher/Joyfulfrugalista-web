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
import { SavingsRecord } from '@/app/interface';
import {
  formatDate,
  formatNumber
} from '@/app/utils';


export function RecordCard(
  { record }: { record: SavingsRecord }
) {
  return (
    <div
      className="ledger-block-border p-2 m-1 bg-slate-100 flex justify-between items-center"
    >
      <div className="text-sm">
        <div className="font-bold capitalize">{record.category}</div>
        <div>{formatDate(record.date)}</div>
        { record.description && <div>{record.description}</div> }
      </div>
      <div className="font-bold text-xl">${formatNumber(record.moneyAdded)}</div>
    </div>
  )
}

export function RecordHistory({ records }: { records: SavingsRecord[] }) {
  return (
    <>
      <h4 className="m-2">History</h4>
      <div className="h-4/5 overflow-y-scroll">
        {
          records.map((record) => {
            return <RecordCard key={record.id} record={record} />
          })
        }
      </div>
    </>

  )
}
