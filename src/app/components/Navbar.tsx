'use client';

import React, { useState, useEffect  } from 'react';
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
  Toolbar,
  Tooltip,
} from '@mui/material';
import { AppBarProps} from '@mui/material/AppBar';
import {useMediaQuery, useTheme} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/config/firebaseConfig';
import { useAuth } from '@/app/contexts/AuthContext';

const menuItems = ['about', 'ledger', 'task', 'stats', 'profile'];
const menuIconsMap: { [key: string]: React.ElementType} = {
  'about': HomeIcon,
  'ledger': BookIcon,
  'task': TaskAltIcon,
  'stats': BarChartIcon,
  'profile': AccountCircleIcon,
};

function DrawerMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  const handleItemClick = (item: string) => {
    setOpen(false);
    router.push('/'.concat(item));
 };

  const DrawerList = (
    <Box sx={{ width: 180 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleItemClick(item)}>
              <ListItemIcon>
                {React.createElement(menuIconsMap[item])}
              </ListItemIcon>
              <ListItemText primary={item} className="capitalize"/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon fontSize="inherit"/>
      </IconButton>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}


function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { uid, user, isLoggedIn, setUid } = useAuth();
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

  // Use a client-side only initial render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null on server-side
  if (!mounted) {
    return null;
  }

  if (!isLoggedIn) {
    return  (
      <Button variant="outlined" href="/login">
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
        {sm ? <DrawerMenu /> : (
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
