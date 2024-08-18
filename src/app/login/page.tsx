"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { auth } from "../config/firebaseConfig"; // Ensure the path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { uid, setUid } = useAuth();
  const router = useRouter();

  // listen uid change
  useEffect(() => {
    if (uid) {
      console.log("UID already saved in context:", uid);
    }
  }, [uid]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("auth object:", auth);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // get user info
      const user = userCredential.user;

      // print uid

      console.log("uid", user.uid);

      //save uid
      setUid(user.uid);

      console.log("Login successful");
      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your email and password.");
      console.error("Login error:", err);
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
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
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
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
