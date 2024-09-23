'use client';

import React, { Fragment, useState, useRef} from 'react';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import {useMediaQuery, useTheme} from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { User } from '../../../data/User';

const AvatarButton = styled(Button)(() => ({
  '& .MuiButton-startIcon' : {
    marginRight: '2px',
  },
  '&.MuiButton-root' : {
    padding: 0,
  },
})) as typeof Button;

export function UserAvatar(props: {user: User}) {
  // user avatar
  const { avatar, name } = props.user;

  const [editing, setEditing] = useState<boolean>(false);
  const [newAvatar, setNewAvatar] = useState<string>(avatar);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const onEdit = () => {
    if (!editing) {
      setEditing(true);
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: use props to pass down parent state and store new file there

  };

  return (
    <Box className='avatar-container'>
      <Avatar
        src={newAvatar}
        alt={`${name}'s profile image`}
        className="avatar"
      >
      </Avatar>
      {/* edit button */}
       {isSmallScreen ? (
        <IconButton
          aria-label="upload new profile image"
          onClick={onEdit}
          className="avatar-btn"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ) : (
        <AvatarButton
          component="label"
          variant="outlined"
          aria-label="upload new profile image"
          onClick={onEdit}
          startIcon={<EditIcon fontSize="small" />}
          size="small"
          className="avatar-btn"
        >
          Edit
          <input
            type="file"
            name="user_profile_img"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".png, .jpeg, .jpg"
          />
        </AvatarButton>
      )}
    </Box>
  );
}
