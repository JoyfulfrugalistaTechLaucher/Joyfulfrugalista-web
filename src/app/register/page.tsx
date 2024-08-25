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
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import "@fontsource/montserrat"; // 导入 Montserrat 字体
import BackgroundWrapper from "../components/BackgroundWrapper"; // 导入背景组件

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { setUid } = useAuth();
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // 清空错误信息
    setSuccess(""); // 清空成功信息

    // 检查密码和确认密码是否匹配
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
    </BackgroundWrapper>
  );
};

export default RegisterPage;