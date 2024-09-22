import React, { Fragment, useState } from 'react';
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
import {useMediaQuery, useTheme} from '@mui/material';
import { User } from '../../../data/User';


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
          aria-label="edit profile image"
          onClick={onEdit}
          className="avatar-btn"
        >
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          aria-label="toggle email editing"
          onClick={onEdit}
          startIcon={<EditIcon />}
          size='small'
          className="avatar-btn"
        >
          Edit
        </Button>
      )}
    </Box>
  );
}
