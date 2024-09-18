"use client";

import{ React, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SavingsIcon from "@mui/icons-material/Savings";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import MainLayout from "../layouts/MainLayout";
import Castle from "../components/Castle";
import User from "../../data/User";

const MAX_NAME_LEN: number = 30;

const colors = {
  primary: "purple",
  hover: "darkviolet",
  text: "#000000",
  border: "purple",
};

interface UserInfoParams {
  required: boolean,
  label: string,
  type: string,
}

const URL =
  "https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/";

function UserName(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Name");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    if (value.length > MAX_NAME_LEN) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Name")
    }
    // TODO: update parent props `user`
  }

  return (
      <TextField
        className="my-2"
        error={!valid}
        required
        autoComplete="off"
        id={txtFieldId}
        label={txtFieldLb}
        type="text"
        onChange={onChange}
        helperText={valid ? "" : "Name length exceeds 30 characters"}
      />
    );
}


function UserMonthGoal(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Monthly Saving Goal");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = e.target.value;
    if (isNaN(value) || value <= 0) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Monthly Saving Goal")
    }
    // TODO: update parent props `user`
  }

  return (
      <TextField
        className="my-2"
        error={!valid}
        required
        autoComplete="off"
        id={txtFieldId}
        label={txtFieldLb}
        type="text"
        onChange={onChange}
        helperText={valid ? "" : "Monthly Goal must be a positive number"}
      />
    );
}

// TODO: support both Chinese and Australian phone numbers
function UserPhone(user: User) {
  const [valid, setValid] = useState<boolean>(true);
  const [txtFieldId, setTxtFieldId] = useState<string>("outlined-required");
  const [txtFieldLb, setTxtFieldLb] = useState<string>("Monthly Saving Goal");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = e.target.value;
    if (isNaN(value) || value <= 0) {
      setValid(false);
      setTxtFieldId("outlined-error-helper-text")
      setTxtFieldLb("Error")
    } else {
      setValid(true);
      setTxtFieldId("outlined-required")
      setTxtFieldLb("Monthly Saving Goal")
    }
    // TODO: update parent props `user`
  }

  return (
      <TextField
        className="my-2"
        error={!valid}
        required
        autoComplete="off"
        id={txtFieldId}
        label={txtFieldLb}
        type="text"
        onChange={onChange}
        helperText={valid ? "" : "Monthly Goal must be a positive number"}
      />
    );
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { uid, isLoggedIn, setUid } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   console.log("uid" + uid);
  //
  //   if (!isLoggedIn) {
  //     router.replace("/login");
  //   } else if (uid) {
  //     const fetchProfile = async () => {
  //       try {
  //         const response = await axios.get(`${URL}/users/${uid}.json`);
  //         setUserData(response.data);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //         setLoading(false);
  //       }
  //     };
  //
  //     fetchProfile();
  //   }
  // }, [isLoggedIn, uid, router]);

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

  // if (loading) {
  //   return (
  //     <BackgroundWrapper>
  //       <Box
  //         display="flex"
  //         justifyContent="center"
  //         alignItems="center"
  //         minHeight="100vh"
  //       >
  //         <CircularProgress />
  //       </Box>
  //     </BackgroundWrapper>
  //   );
  // }

  return (
    <MainLayout>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, position: "relative" }}
      >
        <Stack>
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

          <Stack component="form" >
            <UserName user={userData} />

            <UserMonthGoal user={userData} />
          </Stack>

          <Grid item xs={12} sm={4} md={6}></Grid>

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
        </Stack>

      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
