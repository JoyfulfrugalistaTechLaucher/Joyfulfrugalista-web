import React from "react";
import { Box, Container, Grid } from "@mui/material";
import ThemeRegistry from "../themeRegistry";
import Navbar from "../components/Navbar";
import BackgroundWrapper from "../components/BackgroundWrapper";

// For all pages layout
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackgroundWrapper>
      <ThemeRegistry>
        <Container className="layout-container">
          <Navbar/>
          <Box component="main" className="flex-1 flex justify-center items-center">
            {children}
          </Box>
          <footer className="footer">
            &copy; 2024 Joyful Savings Jar. All rights reserved.
          </footer>
        </Container>
      </ThemeRegistry>
    </BackgroundWrapper>
  );
};

export default MainLayout;
