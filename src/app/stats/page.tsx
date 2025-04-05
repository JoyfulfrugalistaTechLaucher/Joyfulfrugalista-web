'use client';
import React, { useState,useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import MainLayout from "../layouts/MainLayout";
import BackgroundWrapper from "../components/BackgroundWrapper";
import {
  Avatar,
  Box,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";


function Summary() {
  return (
    <Stack spacing={4} direction='row'>
      <SummaryBox period='day' amount={108.5} />
      <SummaryBox period='week' amount={876.43} />
      <SummaryBox period='month' amount={900} />
    </Stack>
         );
}

function SummaryChart() {

}

// Only show latest 10 items history savings
function LastestRecords() {

}
