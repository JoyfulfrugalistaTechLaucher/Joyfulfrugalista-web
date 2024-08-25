"use client";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import Image from "next/image";
import {
  Container,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import "@fontsource/montserrat";
import BackgroundWrapper from "./components/BackgroundWrapper";

const imgSize = 330;

const HomePage = () => {
  return (
    <MainLayout>
      <Grid container spacing={8} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4}>
          <Box component="img" className="rounded-lg"
            src="/assets/saving_jar.png"
            alt="Saving Jar Logo"
            width={imgSize}
            height={imgSize}
            alignItems="center"
          >
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container justifyContent="start">
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                Test CI/CD Welcome to Joyful Savings Jar, your ultimate savings companion.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                component="h5"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 24,
                  color: "info.gray",
                }}
              >
                Track spending, wealth extending. Join our community and save more.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 24,
                  color: "info.gray",
                }}
              >
                <Button variant="outlined" color="primary" className="mt-4">
                  Learn More
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default HomePage;
