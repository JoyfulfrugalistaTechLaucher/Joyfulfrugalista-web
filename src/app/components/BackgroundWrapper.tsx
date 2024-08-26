"use client";
import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface BackgroundWrapperProps {
    children: ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "url('/assets/background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
            }}
        >
            {children}
        </Box>
    );
};

export default BackgroundWrapper;
