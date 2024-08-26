"use client";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import { Container, Box, Button, Grid, Typography, Link } from "@mui/material";
import "@fontsource/montserrat";

const imgSize = 330;

const HomePage = () => {
  return (
    <MainLayout>
      <Grid container spacing={8} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            className="rounded-lg"
            src="/assets/saving_jar.png"
            alt="Saving Jar Logo"
            width={imgSize}
            height={imgSize}
            alignItems="center"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container justifyContent="start" spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  color: "primary.main",
                  whiteSpace: "pre-line",
                }}
              >
                Welcome to Joyful Savings Jar,
                {"\n"}your ultimate savings {"\n"} companion.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                component="h5"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 24,
                  color: "info.gray",
                }}
              >
                Track spending, wealth extending. Join our community and save
                more.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default HomePage;
