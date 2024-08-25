"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import BackgroundWrapper from "../components/BackgroundWrapper";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SavingsIcon from "@mui/icons-material/Savings";
import { log } from "console";

// 统一颜色变量
const colors = {
  primary: "purple",
  hover: "darkviolet",
  text: "#000000", // 黑色字体
  border: "purple",
};

const URL =
  "https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { uid, isLoggedIn, setUid } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("local" + isLoggedIn);

    if (!isLoggedIn) {
      router.replace("/login");
    } else if (uid) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`${URL}/users/${uid}.json`);
          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isLoggedIn, uid, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUid(null);
      localStorage.setItem("isLoggedIn", "false");
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              mb={4}
            >
              <Avatar
                src="/assets/portrait.png"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: `4px solid ${colors.primary}`,
                }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: colors.text, ml: 2 }}
              >
                {userData ? userData.name : "Not set"}
              </Typography>
            </Box>

            <Box sx={{ ml: 2 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <EmailIcon sx={{ color: colors.primary, mr: 2 }} />
                <Typography variant="body1" sx={{ color: colors.text }}>
                  {userData ? userData.email : "Not set"}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <PhoneIcon sx={{ color: colors.primary, mr: 2 }} />
                <Typography variant="body1" sx={{ color: colors.text }}>
                  {userData ? userData.phone : "Not set"}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  border: `2px solid ${colors.primary}`,
                }}
              >
                <SavingsIcon sx={{ color: colors.primary, mr: 2 }} />
                <Typography variant="body1" sx={{ color: colors.text }}>
                  Monthly Saving Goal:{" "}
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{ fontWeight: "bold", color: colors.primary }}
                  >
                    {userData ? `$${userData.goal}` : "Not set"}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* 右侧空白区域，可用于未来的用户账本或其他内容 */}
          <Grid item xs={12} sm={4} md={6}>
            {/* 此处保留为空白 */}
          </Grid>

          {/* Logout 链接居中 */}
          <Grid item xs={12}>
            <Box mt={4} textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  color: colors.primary,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleLogout}
              >
                Log out
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </BackgroundWrapper>
  );
};

export default ProfilePage;
