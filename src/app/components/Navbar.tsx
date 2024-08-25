"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        {["About", "Ledger", "Statistic", "Community"].map((text) => (
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
    <AppBar component="nav" color="transparent" elevation={0}>
      <Toolbar className="nav-bar">
        <Box className="nav-home">
          <Typography variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Joyful Savings Jar
          </Typography>
        </Box>
        <Box className="nav-links hidden space-x-4">
          <a href="" className="text-gray-800 hover:text-primary">
            <Typography variant="h6" className="flex-grow"
              sx={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              About
            </Typography>
          </a>
          <a href="/ledger" className="text-gray-800 hover:text-primary">
            <Typography variant="h6" className="flex-grow"
              sx={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Leger
            </Typography>
          </a>
          <a href="#" className="text-gray-800 hover:text-primary">
            <Typography variant="h6" className="flex-grow"
              sx={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Stats
            </Typography>
          </a>
          <a href="#" className="text-gray-800 hover:text-primary">
            <Typography variant="h6" className="flex-grow"
              sx={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Community
            </Typography>
          </a>
          <div className="flex items-center space-x-2">
            <NotificationsIcon color="primary"/>
            <SmsIcon color="primary"/>
            <Link href="/profile" passHref>
              <Typography variant="h6" className="flex-grow"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Profile
              </Typography>
            </Link>
          </div>
        </Box>
        <IconButton
          edge="start"
          className="md:hidden"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <nav>
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
      </nav>
    </AppBar>
  );
};

export default Navbar;
