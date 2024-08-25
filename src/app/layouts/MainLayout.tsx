import React from "react";
import { Box, Container, Grid } from "@mui/material";
import ThemeRegistry from "../themeRegistry";
import Navbar from "../components/Navbar";
import BackgroundWrapper from "../components/BackgroundWrapper";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackgroundWrapper>
      <ThemeRegistry>
        <Container className="layout-container">
          <Navbar />
          <Box component="main" className="flex flex-1 p-2 gap-x-1">{children}</Box>
          <footer className="footer">
            &copy; 2024 Joyful Savings Jar. All rights reserved.
          </footer>
        </Container>
      </ThemeRegistry>
    </BackgroundWrapper>
  );
};

export default MainLayout;
