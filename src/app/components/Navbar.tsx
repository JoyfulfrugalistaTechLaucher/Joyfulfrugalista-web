'use client';

import React, { Fragment, useEffect, useState  } from 'react';
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { AppBarProps} from '@mui/material/AppBar';
import {useMediaQuery, useTheme} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SmsIcon from '@mui/icons-material/Sms';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { User } from '../interface';
import { DEFAULT_AVATAR, FB_URL } from '../constants';
import { useUserData } from '../hooks/useUserData';

// Hamburger Menu for small screens
const appRoutes: string[] = [
  'About',
  'Ledger',
  'Task',
  'Stats',
];

function HamburgerMenu() {

  return (
    <Stack spacing={1}>


    </Stack>
  );
}


function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { uid, isLoggedIn, setUid } = useAuth();
  const { user, loading } = useUserData(uid);
  const router = useRouter();

  // handlers
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.replace("/profile");
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUid(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem("isLoggedIn", "false");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  if (loading) {
    return (
      <Box>Login ...</Box>
    );
  }

  if (!isLoggedIn) {
    return  (
      <Button variant="text" href="/login">
        Login
      </Button>
    );
  }

  return (
    <Box>
      <Tooltip title="Profile settings">
        <Button
          onClick={handleClick}
          sx={{ ml: 2 }}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={user?.avatar || ''}
            alt="user avatar"
            sx={{ width: 36, height: 36 }}
          ></Avatar>
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}


const FlatAppBar = styled(AppBar)<AppBarProps>(() => ({
  boxShadow: 'none',
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'normal',
  fontSize: '16pt',
  color: theme.palette.primary.main,
}));

function Navbar() {

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FlatAppBar component="nav" color="transparent" position="static">
      <Toolbar className="nav-bar">
        {sm ? (
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            className="sm:hidden"
            sx={{ mr: 2 }}
          >
            <MenuIcon fontSize="inherit"/>
          </IconButton>
        ) : (
          <NavButton
            variant="text"
            href="/"
            color="primary"
            disableFocusRipple
            disableRipple
          >
            Joyful Savings Jar
          </NavButton>

        )}

        <Box className="nav-routes">
          <NavButton
            href="/about"
            variant="text"
            color="primary"
          >
            About
          </NavButton>
          <NavButton
            href="/ledger"
            variant="text"
            color="primary"
          >
              Ledger
          </NavButton>
          <NavButton
            href="/stats"
            variant="text"
            color="primary"
          >
              Stats
          </NavButton>
          <NavButton
            href="/task"
            variant="text"
            color="primary"
          >
            Task
          </NavButton>
        </Box>
        <Box className="nav-icons">
          <ProfileMenu />
        </Box>
      </Toolbar>
    </FlatAppBar>
  );
};

export default Navbar;
