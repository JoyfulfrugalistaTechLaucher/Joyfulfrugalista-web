"use client";
import React from "react";
import {
  Container,
  Box,
  Button,
  Grid,
  Link,
  Stack,
  Typography
} from "@mui/material";
import "@fontsource/montserrat";
import MainLayout from "./layouts/MainLayout";

const imgSize = 330;

const HomePage = () => {
  return (
    <MainLayout>
      <Stack direction={{ md: "row", sm: "column" }} spacing={{xs: 4, md: 8}}
        justifyContent="center" alignItems="center">
        <Box
          component="img"
          className="rounded-lg"
          src="/assets/saving_jar.png"
          alt="Saving Jar Logo"
          width={{ md: imgSize, xs: (imgSize * 0.8)}}
          height={{ md: imgSize, xs: (imgSize * 0.8)}}
        />
        <Stack spacing={{md: 4, xs: 2}}>
          <Box>
            <Typography variant="h3" color="primary.main"
              sx={{
                fontSize: {
                  md: "3rem", sm: "2rem", xs: "1.5rem",
                }
              }}
            >
               Joyful Savings Jar will help you save.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="grey.500"
              sx={{
                fontSize: {
                  md: "1.5rem", sm: "1rem", xs: ".75rem",
                }
              }}
            >
               Track your spending and watch your savings grow.
               Join our community of joyful savers now.
            </Typography>
          </Box>
          <Box>
            <Button variant="outlined" color="primary">
                Learn More
            </Button>
          </Box>
        </Stack>
      </Stack>
    </MainLayout>
  );
};

export default HomePage;
