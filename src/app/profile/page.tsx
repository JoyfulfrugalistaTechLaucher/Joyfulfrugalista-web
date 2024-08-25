"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

const Profile: React.FC = () => {
  const { uid, setUid } = useAuth();
  const router = useRouter();

  // 如果没有 UID，则重定向到登录页面
  useEffect(() => {
    if (!uid) {
      router.replace("/login"); // 重定向到登录页面
    }
  }, [uid, router]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // Firebase sign out
      await signOut(auth);

      // 重置上下文中的 UID
      setUid(null);

      // 重定向到登录页面
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Profile Page
        </Typography>
        {uid ? (
          <>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Current User UID: {uid}
            </Typography>
            <Button
              onClick={() => router.push("/")}
              variant="contained"
              sx={{ mt: 3 }}
            >
              Go to Home
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              color="secondary"
              sx={{ mt: 3 }}
            >
              Quit
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            No UID found. Redirecting to login...
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
