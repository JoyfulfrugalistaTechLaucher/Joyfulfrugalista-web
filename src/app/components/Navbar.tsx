"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            Joyful Savings Jar
          </Typography>
          <div className="hidden md:flex space-x-4">
            <a href="" className="text-gray-800 hover:text-primary">
              About
            </a>
            <a href="/ledger" className="text-gray-800 hover:text-primary">
              Ledger
            </a>
            <a href="#" className="text-gray-800 hover:text-primary">
              Statistic
            </a>
            <a href="#" className="text-gray-800 hover:text-primary">
              Community
            </a>
            <div className="flex items-center space-x-2">
              <Image
                src="/bell-icon.svg"
                alt="Notifications"
                width={24}
                height={24}
              />
              <Image
                src="/chat-icon.svg"
                alt="Messages"
                width={24}
                height={24}
              />
              <Link href="/profile" passHref>
                <div className="text-gray-800">Profile</div>
              </Link>
            </div>
          </div>
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
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
