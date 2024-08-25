"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat"; // 导入 Montserrat 字体
import BackgroundWrapper from "../components/BackgroundWrapper"; // 导入背景组件

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { uid, setUid } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (uid) {
      console.log("UID already saved in context:", uid);
    }
  }, [uid]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUid(user.uid);
      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your email and password.");
      console.error("Login error:", err);
    }
  };

  return (
    <BackgroundWrapper>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: -30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleLogin}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: { fontFamily: "Montserrat, sans-serif" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Montserrat, sans-serif" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "& fieldset": {
                    borderColor: "purple", // 默认边框颜色
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // 悬停时边框颜色
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // 聚焦时边框颜色
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { fontFamily: "Montserrat, sans-serif" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Montserrat, sans-serif" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "& fieldset": {
                    borderColor: "purple", // 默认边框颜色
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // 悬停时边框颜色
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // 聚焦时边框颜色
                  },
                },
              }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 3,
                backgroundColor: "purple",
                "&:hover": {
                  backgroundColor: "darkviolet",
                },
              }}
            >
              Log in
            </Button>
            <Link
              href="#"
              variant="body2"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                fontFamily: "Montserrat, sans-serif",
                color: "purple",
                "&:hover": {
                  color: "darkviolet",
                },
              }}
              onClick={() => router.push("/register")}
            >
              Create Account
            </Link>
          </Box>
        </Box>
      </Container>
    </BackgroundWrapper>
  );
};

export default LoginPage;
