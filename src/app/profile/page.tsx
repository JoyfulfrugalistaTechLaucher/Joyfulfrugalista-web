"use client";

import  React, { useEffect, useState } from "react";
import {
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
import {useMediaQuery, useTheme} from '@mui/material';
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
} from './components/Inputs';
import { UserAvatar } from './components/Avatar';

// for development only
const userFakeData: User = {
  email: 'u7890123@anu.edu.au',
  name: 'Joyful Jar',
  gender: 'Male',
  goal: 100,
  phone: '0478912345',
  avatar: '/assets/portrait.png',
};

const URL =
  "https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/";


function ProfilePage() {
  // local state
  const [userInfo, setUserInfo] = useState<User | null>(userFakeData);
  const [loading, setLoading] = useState<boolean>(true);
  const { uid, isLoggedIn, setUid } = useAuth();
  const router = useRouter();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
          <UserAvatar user={userFakeData} />
          <Stack spacing={2}>
            {/* optional fields */}
            <UserEmail user={userFakeData} onConfirm={handleEmailConfirm} />
            <UserName user={userFakeData} />
            <UserMonthGoal user={userFakeData} />

            {/* optional fields */}
            <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
              <UserGender user={userFakeData} />
              <UserPhone user={userFakeData} />
            </Stack>
          </Stack>



        </Stack>

      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
