'use client';
import React, { useState, useEffect } from 'react';
// import { db } from '../config/firebaseConfig';
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { auth } from "@/app/config/firebaseConfig";
import { category, categories } from '@/data/Category';
import {
  Box,
  Button,
  CircularProgress,
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
import { formatDate } from '@/app/utils';
import { FB_URL } from '@/app/constants';

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

export function AddPanel({
  selectedDate,
  onAddRecord,
  onRefresh
}: {
  selectedDate: Date,
  onAddRecord: (record: SavingsRecord) => Promise<boolean>,
  onRefresh: () => Promise<void>
}) {
  const { uid } = useAuth(); // Get user ID for Firebase operations
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Default record state with selectedDate
  const defaultRecord = {
    date: selectedDate,
    category: 'General', // Set a default category
    moneyAdded: 0,
    description: ''
  };

  const [record, setRecord] = useState<SavingsRecord>(defaultRecord);

  useEffect(() => {
    // Update date when selectedDate changes
    setRecord(prev => ({...prev, date: selectedDate}));
  }, [selectedDate]);

  const updateRecord = (update: Partial<SavingsRecord>) => {
    setRecord(old => ({...old, ...update}));
  };

  const clearForm = () => {
    setRecord(defaultRecord);
    setMessage(null);
  };

  const submitRecord = async () => {
    // Validate the record
    if (record.moneyAdded <= 0) {
      setMessage({text: 'Please enter a valid amount', type: 'error'});
      return;
    }

    if (!record.category) {
      setMessage({text: 'Please select a category', type: 'error'});
      return;
    }

    setLoading(true);
    try {
      const success = await onAddRecord(record);

      if (success) {
        setMessage({text: 'Record saved successfully!', type: 'success'});
        // Clear form after successful submission
        clearForm();
        // Refresh the records in parent component
        await onRefresh();
      } else {
        setMessage({text: 'Failed to save record. Please try again.', type: 'error'});
      }
    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({text: 'Failed to save record. Please try again.', type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 p-2 ledger-block-border">
      <div className="flex gap-x-2 items-center">
        <h4 className="font-semibold m-1"> Add New Savings </h4>
        <div className="text-sm text-gray-400">
          Selected Date: {formatDate(selectedDate)}
        </div>
      </div>
      <NewRecordForm record={record} handler={updateRecord} />
      <CategoryPanel record={record} handler={updateRecord} />

      {/* Status message */}
      {message && (
        <div className={`mt-2 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex justify-end gap-x-2">
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearForm}
          disabled={loading}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={submitRecord}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Record'}
        </Button>
      </div>
    </div>
  )
}
