'use client';

import React from 'react';
import {
  Avatar,
  Box,
} from '@mui/material';
import { User } from '../../interface';
import { DEFAULT_AVATAR } from '../../constants';

export function UserAvatar(props: {user: User}) {

  return (
    <Box className='avatar-container'>
      <Avatar
        src={props.user.avatar || DEFAULT_AVATAR}
        alt={`${props.user.name}'s profile image`}
      >
      </Avatar>
    </Box>
  );
}
