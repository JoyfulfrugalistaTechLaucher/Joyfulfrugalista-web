"use client";

import  React, { useEffect, useState } from "react";
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
import { User } from "../../data/User";
import {
  UserEmail,
  UserGender,
  UserName,
  UserPhone,
  UserMonthGoal
} from "./components/Inputs";

// for developement only
const userFakeData: User = {
  email: 'u7890123@anu.edu.au',
  name: 'Joyful Jar',
  gender: 'Male',
  goal: 100,
  phone: '0478912345',
};

const URL =
  "https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/";


function ProfilePage() {
  // local state
  const [userInfo, setUserInfo] = useState<User | null>(userFakeData);
  const [loading, setLoading] = useState<boolean>(true);
  const { uid, isLoggedIn, setUid } = useAuth();
  const router = useRouter();

  // user data
  const {email, name, gender, goal, phone } = userFakeData;

  const handleEmailConfirm = (update: Partial<User>) => {
    setUserInfo(
      (oldUserData) => oldUserData ? {...oldUserData, ...update,} : null
    );
  };


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
                border: '4px solid black',
              }}
            />
          </Box>

          <Stack spacing={2}>
            <UserEmail userData={userFakeData} onConfirm={handleEmailConfirm} />

            <UserName user={userFakeData} />

            <UserMonthGoal user={userFakeData} />

            {/* optional fields */}
            <UserGender user={userFakeData} />
            <UserPhone user={userFakeData} />
          </Stack>



        </Stack>

      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
