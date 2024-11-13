"use client";
import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface BackgroundWrapperProps {
    children: ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <Box className="bgwrapper" >
      {children}
    </Box>
  );
};

export default BackgroundWrapper;
