'use client';
import React, { useState, useEffect, useReducer } from 'react';
import { Category, categories } from '@/data/Category';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { SavingsRecord } from '@/app/interface';
import { Action, recordsReducer } from '@/app/reducers/recordsReducer';
import {
  formatDate,
  formatNumber
} from '@/app/utils';
import { SortKey } from '@/app/constants';

export function RecordCard(
  { record }: { record: SavingsRecord }
) {
  return (
    <div
      className="ledger-block-border p-2 my-1 mr-1 bg-slate-100 flex justify-between items-center"
    >
      <div className="text-sm">
        <div className="font-semibold capitalize">{record.category}</div>
        <div>
          {formatDate(record.date)}
        </div>
        { record.description && <div>{record.description}</div> }
      </div>
      <div className="font-semibold text-xl">${formatNumber(record.moneyAdded)}</div>
    </div>
  )
}

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Category) => option.id,
});

const keys: SortKey[] = ['latest', 'oldest', 'largest', 'smallest'];

export function RecordHistory({ records }: { records: SavingsRecord[] }) {
  const [history, dispatch] = useReducer(recordsReducer, records);
  const [sortKey, setSortKey] = useState<number>(0);

  // TODO: May need useEffect here to make sure the records are sorted accordingly

  const onClickSort = (key: number) => {
    setSortKey(key);
    dispatch({kind: 'sorted', key: keys[key]});
  }
  return (
    <>
      <h4 className="m-1">Savings History</h4>
      <Autocomplete
        className="w-[92%] m-1"
        size="small"
        options={categories}
        getOptionLabel={(option) => option.id}
        filterOptions={filterOptions}
        renderInput={(params) => <TextField {...params}
                                   label="Filter by Category" />}
      />
      <div className="flex gap-x-1 mx-1 my-2">
        <Button
          variant={sortKey === 0 ? "contained" : "outlined"}
          onClick={() => onClickSort(0)}
          className="p-1 mx-1 rounded-md font-bold"
          size="small"
        >
          Latest
        </Button>
        <Button
          variant={sortKey === 1 ? "contained" : "outlined"}
          onClick={() => onClickSort(1)}
          className="p-1 mx-1 rounded-md font-bold"
          size="small"
        >
          Oldest
        </Button>
        <Button
          variant={sortKey === 2 ? "contained" : "outlined"}
          onClick={() => onClickSort(2)}
          className="p-1 mx-1 rounded-md font-bold"
          size="small"
        >
          <VerticalAlignTopIcon />
        </Button>
        <Button
          variant={sortKey === 3 ? "contained" : "outlined"}
          onClick={() => onClickSort(3)}
          className="p-1 mx-1 rounded-md font-bold"
          size="small"
        >
          <VerticalAlignBottomIcon />
        </Button>

      </div>
      <div className="h-4/5 mt-2 overflow-y-scroll">
        {
          history.map((record) => {
            return <RecordCard key={record.id} record={record} />
          })
        }
      </div>
    </>

  )
}
