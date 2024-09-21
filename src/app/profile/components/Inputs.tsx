'use client';

import React, { Fragment, useEffect, useState } from 'react';
import {
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
import { User } from '../../../data/User';

const MAX_NAME_LEN = 30;

interface UserEmailProps {
  userData: User,
  onConfirm: (update: Partial<User>) => void;
};


const genders: string[] = ['Male', 'Female', 'Secret', 'Trans'];

// Override some default styles
const MyInputLabel = styled(InputLabel)(({ theme }) => ({
  '&.Mui-focused.Mui-disabled': {
    color: theme.palette.primary.main,
  },
}));


export function UserName(props: {user: User}) {
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

export function UserMonthGoal(props: {user: User}) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Monthly Saving Goal");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
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

function formatPhoneNumber(input: string): string {
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
export function UserPhone(props: {user: User}) {
  // user phone
  const { phone } = props.user;

  const [valid, setValid] = useState<boolean>(true);
  const [userPhone, setUserPhone] = useState<string | undefined>(phone);

  useEffect(() => {
    setUserPhone(phone);
  }, [phone]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);

    if (formatted.length <= 12 && isValidPhoneNumber(formatted)) {
      setValid(true);
      setUserPhone(formatted);
    } else {
      setValid(false);
      setUserPhone(input);
    }

  };

  return (
    <TextField
      error={!valid}
      autoComplete="off"
      label="Mobile"
      type="tel"
      value={userPhone}
      onChange={onChange}
      helperText={valid ? "" : "Invalid mobile number. Must be '04xx xxx xxx'"}
      placeholder="04xx xxx xxx"
    />
  );
}


export function UserGender(props: {user: User}) {
  const { gender } = props.user;

  const [userGender, setUserGender] = useState<string | undefined>(gender);

  useEffect(() => {
    setUserGender(gender);
  }, [gender]);


  // const onSelect = (e: SelectChangeEvent<string>) => {
  const onSelect = (e: SelectChangeEvent<string>) => {
    setUserGender(e.target.value);
  }

  return (
    <FormControl>
      <InputLabel id="user-gender-label">Gender</InputLabel>
      <Select
        labelId="user-gender-label"
        id="user-gender-select"
        value={userGender}
        label="Gender"
        onChange={onSelect}
      >
        {genders.map((gender) => (
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

export function UserEmail({userData, onConfirm}: UserEmailProps) {
  // user data
  const { email } = userData;

  // local state
  const [valid, setValid] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>(email);
  const [error, setError] = useState<string>("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setUserEmail(email);
  }, [email]);


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
    if (userEmail.trim() === "") {
      setValid(false);
      setError("Email is required.");
    }
    else if (!isEmail(userEmail)) {
      setValid(false);
      setError("Email address format is not valid.");
    } else {
      onConfirm({ email: userEmail });
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
      setError("Email is required.");
    }
    else if (!isEmail(newEmail)) {
      setValid(false);
      setError("Email address format is not valid.");
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
        disabled={!editing}
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
                 ariable-label="start editing email"
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
