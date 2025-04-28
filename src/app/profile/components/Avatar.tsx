'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '@/app/interface';
import { DEFAULT_AVATAR } from '@/app/constants';
import { CircImgBox } from '@/app/components/ImgBox';

export function UserAvatar({ small, user }: {small: boolean, user: User}) {

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box component="div" className='avatar-container'>
      <CircImgBox
        src={user.avatar ? user.avatar : DEFAULT_AVATAR}
        alt={`${user.name}'s profile image`}
        size={small ? 200 : 140}
      >
      </CircImgBox>
      <Button
        id="avatar-button"
        variant="contained"
        aria-label="upload new profile image"
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<EditIcon fontSize="small" />}
        onClick={handleClick}
        size="small"
        className="avatar-btn"
      >
         Edit
      </Button>
      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'avatar-button',
        }}
      >
        <MenuItem onClick={handleClose}>Upload a photo</MenuItem>
        <MenuItem onClick={handleClose}>Remove photo</MenuItem>
      </Menu>
    </Box>
  );
}
