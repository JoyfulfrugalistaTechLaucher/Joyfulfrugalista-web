"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface CastleProps {
  target: number;
  progress: number;
}

const Castle: React.FC<CastleProps> = ({ target, progress }) => {
  const progressRatio = progress / target;

  const getCastleImage = () => {
    if (progressRatio <= 0.25) {
      return "/assets/castle1.png";
    } else if (progressRatio <= 0.5) {
      return "/assets/castle2.png";
    } else if (progressRatio <= 0.75) {
      return "/assets/castle3.png";
    } else {
      return "/assets/castle4.png";
    }
  };

  return (
    <Box
      sx={{
        position: "absolute", // 改为 absolute
        right: 50,
        bottom: 100,
        zIndex: 1000,
        textAlign: "center",
      }}
    >
      <Image src={getCastleImage()} alt="Castle" width={300} height={300} />
      <Box
        sx={{
          width: "320px",
          height: "30px",
          backgroundColor: "#333",
          borderRadius: "4px",
          overflow: "hidden",
          marginTop: "20px",
          border: "2px solid #000",
        }}
      >
        <Box
          sx={{
            width: `${progressRatio * 100}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            borderRadius: "4px 0 0 4px",
            boxShadow: "inset -1px -1px 0px 0px #000",
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "#000",
          fontFamily: "monospace",
          fontSize: "16px",
          marginTop: "5px",
        }}
      >
        {Math.floor(progressRatio * 100)}%
      </Typography>
    </Box>
  );
};

export default Castle;
