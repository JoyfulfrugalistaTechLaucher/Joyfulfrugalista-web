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
              乐存将帮助您储蓄
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
              跟踪您的支出，见证您的储蓄增长。 现在就加入我们的乐存的社区！
            </Typography>
          </Box>
          <Box>
            <Button variant="outlined" color="primary">
              了解更多
            </Button>
          </Box>
        </Stack>
      </Stack>
    </MainLayout>
  );
};

export default HomePage;
