'use client';

import{ React, useEffect, useState } from 'react';
import User from '../../data/User';
import { IconButton, Stack, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const MAX_NAME_LEN: number = 30;

type UserEmailProps = {
  userData: User,
  onConfirm: (newEmail: string) => void;
}

export function UserName(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Name");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    if (value.length > MAX_NAME_LEN) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Name")
    }
    // TODO: update parent props `user`
  };

  return (
    <TextField
      className="my-2"
      error={!valid}
      required
      autoComplete="off"
      id={txtFieldId}
      label={txtFieldLb}
      type="text"
      onChange={onChange}
      helperText={valid ? "" : "Name length exceeds 30 characters"}
    />
  );
}

export function UserMonthGoal(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Monthly Saving Goal");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = e.target.value;
    if (isNaN(value) || value <= 0) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Monthly Saving Goal")
    }
    // TODO: update parent props `user`
  };

  return (
    <TextField
      className="my-2"
      error={!valid}
      required
      autoComplete="off"
      id={txtFieldId}
      label={txtFieldLb}
      type="text"
      onChange={onChange}
      helperText={valid ? "" : "Monthly Goal must be a positive number"}
    />
  );
}

// TODO: support both Chinese and Australian phone numbers
export function UserPhone(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Monthly Saving Goal");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = e.target.value;
    if (isNaN(value) || value <= 0) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Monthly Saving Goal")
    }
    // TODO: update parent props `user`
  };

  return (
    <TextField
      className="my-2"
      error={!valid}
      required
      autoComplete="off"
      id={txtFieldId}
      label={txtFieldLb}
      type="text"
      onChange={onChange}
      helperText={valid ? "" : "Monthly Goal must be a positive number"}
    />
  );
}


function isEmail(email: string): boolean {
  const eRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return eRegex.test(email);
}

export function UserEmail({user, onConfirm}: UserEmailProps) {
  // local state
  const [valid, setValid] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [tmpEmail, setTmpEmail] = useState<string>("");
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Email");

  // user data
  const { email } = user;

  const onEdit = () => {
    if (!editing) {
      setEditing(true);
    }
  };

  const onCheck = () => {
    onConfirm(tmpEmail);
    setEditing(false);
  };

  const onClear = () => {
    setTmpEmail("");
    setEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpEmail(e.targer.value);

    if (isEmail(tmpEmail)) {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Email")
    } else {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    }
  };

  return (
    <Stack direction="row">
      <TextField
        className="my-2"
        error={!valid}
        disabled={!editing}
        required
        autoComplete="off"
        id={txtFieldId}
        label={email ? "" : txtFieldLb}
        type="text"
        onChange={onChange}
        defaultValue={email}
        helperText={valid ? "" : "Monthly Goal must be a positive number"}
        placeholder={email ? email : "example@com.au"}
      />
      { editing ?
        <Stack direction="row" spacing={2}>
          <IconButton>
            <CheckIcon onClick={onCheck} />
          </IconButton>
          <IconButton>
            <ClearIcon onClick={onClear} />
          </IconButton>
        </Stack>
        :
        <IconButton aria-label="edit" size="small">
          <EditIcon onClick={onEdit} />
        </IconButton>
      }
    </Stack>
  )
}
