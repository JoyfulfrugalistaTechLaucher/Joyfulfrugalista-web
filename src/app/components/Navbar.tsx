"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SmsIcon from "@mui/icons-material/Sms";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


// Hamburger Menu for small screens
const items: string[] = [
  "Profile",
  "Ledger",
  "Stats",
  "About",
];
const MENU_HEIGHT: number = 48;

function HamburgerMenu() {

  return (
    <Stack spacing={1}>


    </Stack>
  );
}
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        {items.map((text) => (
          <ListItem key={text}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box component="nav" color="transparent" elevation={0}>
      <Toolbar className="nav-bar">
        <Link href="/" className="nav-home">
          <Typography color="primary" >
            Joyful Savings Jar
          </Typography>
        </Link>
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
        <Box className="nav-routes">
          <Link
            href=""
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <Typography color="primary" >
              About
            </Typography>
          </Link>
          <Link
            href="/ledger"
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <Typography color="primary">
              Ledger
            </Typography>
          </Link>
          <Link
            href="#"
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <Typography color="primary"
            >
              Stats
            </Typography>
          </Link>
          <Link
            href="#"
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <Typography color="primary" >
              Community
            </Typography>
          </Link>
        </Box>
        <Box className="nav-icons">
          <Link
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <NotificationsIcon color="primary" sx={{ fontSize: 32 }}/>
          </Link>
          <Link
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <SmsIcon color="primary" sx={{ fontSize: 32 }}/>
          </Link>

          <Link href="/profile"
            className="text-gray-800 hover:text-primary"
            style={{ textDecoration: "none" }}
          >
            <AccountCircleIcon color="primary" sx={{ fontSize: 32 }}/>
          </Link>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
