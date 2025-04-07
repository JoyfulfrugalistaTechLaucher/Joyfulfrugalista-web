'use client';

import React, { Fragment, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {useMediaQuery, useTheme} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { User, UserProfileProps } from '../../interface';

export const MAX_NAME_LEN = 30;
export const GENDERS: string[] = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say'
];

export function UserName({user, handler}: UserProfileProps) {
  const isValid = (value: string) => value.length <= MAX_NAME_LEN;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    handler({ name: newName });
  };
  return (
   <TextField
     error={!isValid(user.name)}
     required
     autoComplete="off"
     label="Name"
     type="text"
     onChange={onChange}
     value={user.name}
     placeholder="Joyful Jar"
     helperText={isValid(user.name) ? "" : 'Name length exceeds 30 characters'}
    />
  );
}

function formatPhoneNumber(input: string | undefined): string {
  if (input === undefined || input.length === 0) {
    return '';
  }

  const digitsOnly = input.replace(/\D/g, '');
  const match = digitsOnly.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);

  if (!match) return '';

  return match
    .slice(1)
    .filter(Boolean)
    .join(' ')
    .trim();
}

function isValidPhoneNumber(phone: string): boolean {
  return phone.length === 0 || /^04\d{2}\s\d{3}\s\d{3}$/.test(phone);
}

// TODO: support Chinese mobile phone number
export function UserPhone({user, handler}: UserProfileProps) {

  let fmtPhone = formatPhoneNumber(user.phone);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    fmtPhone = formatPhoneNumber(input);

    handler({phone: fmtPhone});
  };

  return (
    <TextField
      fullWidth
      error={!isValidPhoneNumber(fmtPhone)}
      autoComplete="off"
      label="Mobile"
      type="tel"
      value={fmtPhone}
      onChange={onChange}
      helperText={isValidPhoneNumber(fmtPhone) ? '' : 'Mobile must be 04xx xxx xxx'}
      placeholder="0412 356 789"
    />
  );
}


export function UserGender({user, handler}: UserProfileProps) {

  const onSelect = (e: SelectChangeEvent<string>) => {
    handler({gender: e.target.value});
  }

  return (
    <FormControl fullWidth >
      <InputLabel id="user-gender-label">Gender</InputLabel>
      <Select
        labelId="user-gender-label"
        id="user-gender-select"
        value={user.gender}
        label="Gender"
        onChange={onSelect}
      >
        {GENDERS.map((gender) => (
          <MenuItem
            key={gender}
            value={gender}
          >
            {gender}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function isEmail(email: string): boolean {
  const eRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return eRegex.test(email);
}

export function UserEmail({user, handler}: UserProfileProps) {
  // user email
  const { email } = user;

  // local state
  const [valid, setValid] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>(email);
  const [error, setError] = useState<string>('');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const onEdit = () => {
    if (!editing) {
      setEditing(true);
    }
  };

  const onMouseDownEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onMouseUpEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onSave = () => {
    if (userEmail.trim() === '') {
      setValid(false);
      setError('Email is required.');
    }
    else if (!isEmail(userEmail)) {
      setValid(false);
      setError('Email address format is not valid.');
    } else {
      handler({ email: userEmail });
      setEditing(false);
    }
  };

  const onClear = () => {
    setUserEmail(userEmail);
    setEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setUserEmail(newEmail);

    if (newEmail.trim().length === 0) {
      setValid(false);
      setError('Email is required.');
    }
    else if (!isEmail(newEmail)) {
      setValid(false);
      setError('Email address format is not valid.');
    }
    else {
      setValid(true);
    }
  };

  return (
    <FormControl
      required
      disabled={!editing}
      error={!valid}
      variant="outlined"
      color="primary"
    >
      <InputLabel
        htmlFor="outlined-adornment-email"
        color="primary"
      >
        Email
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-email"
        error={!valid}
        autoComplete="off"
        label="Email"
        type="email"
        onChange={onChange}
        value={userEmail}
        placeholder="example@com.au"
        color="primary"
        endAdornment={
          <InputAdornment position="end">
            {editing ? (
              <Stack direction="row" spacing={1}>
                {isSmallScreen ? (
                  <Fragment>
                    <IconButton
                      color="default"
                      aria-label="cancel email editing"
                      onClick={onClear}
                      onMouseUp={onMouseUpEmail}
                      onMouseDown={onMouseDownEmail}
                    >
                      <ClearIcon />
                    </IconButton>
                    <IconButton
                      color="default"
                      aria-label="confirm email editing"
                      onClick={onSave}
                      onMouseUp={onMouseUpEmail}
                      onMouseDown={onMouseDownEmail}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Button
                      onClick={onClear}
                      onMouseUp={onMouseUpEmail}
                      onMouseDown={onMouseDownEmail}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={onSave}
                      onMouseUp={onMouseUpEmail}
                      onMouseDown={onMouseDownEmail}
                    >
                      Save
                    </Button>
                  </Fragment>
                )}
              </Stack>
            ) : (isSmallScreen ? (
              <IconButton
                 aria-label="start editing email"
                 onClick={onEdit}
                 onMouseUp={onMouseUpEmail}
                 onMouseDown={onMouseDownEmail}
              >
                 <EditIcon />
               </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  aria-label="toggle email editing"
                  onClick={onEdit}
                  onMouseUp={onMouseUpEmail}
                  onMouseDown={onMouseDownEmail}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              ))
            }
          </InputAdornment>
        }
      />
      {!valid &&
        <FormHelperText> {error} </FormHelperText> }

    </FormControl>
  );
}
