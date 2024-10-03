"use client";
import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth,db} from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { ref, set } from "firebase/database";
import "@fontsource/montserrat";
import MainLayout from "../layouts/MainLayout";


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { setUid } = useAuth();
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // 清空错误信息
    setSuccess(""); // 清空成功信息

    try {
      // 使用 Firebase 创建新用户
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 发送验证邮件
      await sendEmailVerification(user);

      // 保存 UID 到上下文
      setUid(user.uid);

      //将用户信息保存到 Realtime Database
      await set(ref(db, "users/" + user.uid), {
        email: user.email,
        name: "",
        phone: "",
        task: {
          goal: 0,
          setDate: "",
        },
      });

      // 显示成功信息
      setSuccess(
        "Registration successful! Please check your email for verification."
      );

      // 跳转到主页
      setTimeout(() => router.push("/"), 3000); // 延迟跳转，让用户有时间看到成功消息
    } catch (err) {
      setError("Registration failed. Please check your details and try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <MainLayout>
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
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleRegister}
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
                    borderColor: "purple",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
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
              autoComplete="new-password"
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
                    borderColor: "purple",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    borderColor: "purple",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
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
            {success && (
              <Typography
                color="primary"
                variant="body2"
                sx={{ fontFamily: "Montserrat, sans-serif", color: "green" }}
              >
                {success}
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
              Register
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
              onClick={() => router.push("/login")}
            >
              Already have an account? Log in
            </Link>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default RegisterPage;
