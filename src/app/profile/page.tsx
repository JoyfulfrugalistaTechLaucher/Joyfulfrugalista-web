'use client';

import  React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {useMediaQuery, useTheme} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import MainLayout from "../layouts/MainLayout";
import Castle from "../components/Castle";
import {
  UserEmail,
  UserGender,
  UserName,
  UserPhone,
} from './components/Inputs';
import { UserAvatar } from './components/Avatar';
import { UserMonthGoal } from './components/Goal';
import { FB_URL } from '../constants';
import { AVATARS, DUSER } from './_constants';
import { User, UserProfileProps } from "./_interface";

// styles
const AvatarButton = styled(Button)(() => ({
  '& .MuiButton-startIcon' : {
    marginRight: '2px',
  },
  '&.MuiButton-root' : {
    padding: 0,
  },
})) as typeof Button;


function AvatarSelection({user, handler}: UserProfileProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ImageList
      sx={{ width: 260, height: 380 }}
      cols={ isSmallScreen ? 1 : 2}
      rowHeight={120}
      gap={2}
    >
      {AVATARS.map((avt) => (
        <ImageListItem key={avt} onClick={() => handler({avatar: avt})}>
          <img
            srcSet={avt}
            src={avt}
            alt="saving jar avatar"
            loading="lazy"
            style={{
              border: user.avatar === avt ?
                `4px solid ${theme.palette.info.main}` : 'none',
              cursor: 'pointer',
              width: 120,
              height: 120,
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}


function ProfilePage() {
  const [userInfo, setUserInfo] = useState<User>(DUSER);
  const [origUserInfo, setUserOrigInfo] = useState<User>(DUSER);
  const [loading, setLoading] = useState<boolean>(true);
  const [editAvt, setEditAvt] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const { uid, isLoggedIn, setUid } = useAuth();
  const router = useRouter();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // handlers
  const handleUserInfoChange = (update: Partial<User>) => {
    setUserInfo((oldUserData) => ({ ...oldUserData, ...update }));
    setEdited(true);
    console.log('User updated: ', update);
  };

  const onEditAvt = () => {
      setEditAvt(!editAvt);
  }

  const onSave = async () => {
    setEdited(false);
    setUserInfo(userInfo);
    setUserOrigInfo(userInfo);
    console.log("Updated profile: ", userInfo);

    if (!uid || !userInfo) {
      console.log("Undefined uid or user info");
      console.group();
      console.log("uid: ", uid);
      console.log("user info: ", userInfo);
      console.groupEnd();
      return;
    }

    setLoading(true);
    try {
      const userRef = ref(db, 'users/'+ uid);

      await set(userRef, {
        email: userInfo.email,
        name: userInfo.name,
        gender: userInfo.gender,
        phone: userInfo.phone,
        avatar: userInfo.avatar,
        task: userInfo.task === undefined ? {goal: 0, setDtate: ''} : userInfo.task,
      });


      setEdited(false);
      console.log("Profile updated successfully");
      // TODO: show a success message to the user
    } catch (error) {
      console.error("Error updating profile: ", error);
      // TODO: show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setEdited(false);
    setUserInfo(origUserInfo);
    console.log("Original profile: ", origUserInfo);
  };

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

  // start rendering the page
  // fetch user info from firebase rtdb
  useEffect(() => {
    console.log("uid" + uid);

    if (!isLoggedIn) {
      router.replace("/login");
    } else if (uid) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`${FB_URL}/users/${uid}.json`);
          // TOOD: handle null?
          const user: User = response.data;
          setUserInfo({...DUSER, ...user});
          setUserOrigInfo({...DUSER, ...user});
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isLoggedIn, uid, router]);


  if (loading) {
    return (
      <MainLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: 4, mb: 4, position: "relative" }}
      >
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className="avatar-container">
              <UserAvatar user={userInfo} />
              {isSmallScreen ? (
                <IconButton
                  aria-label="select new profile image"
                  onClick={onEditAvt}
                  className="avatar-btn"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <AvatarButton
                  component="label"
                  variant="outlined"
                  aria-label="upload new profile image"
                  onClick={onEditAvt}
                  startIcon={<EditIcon fontSize="small" />}
                  size="small"
                  className="avatar-btn"
                >
                  Edit
                </AvatarButton>
              )}
            </Box>

            <UserMonthGoal user={userInfo} />
          </Stack>

          <Stack spacing={2}>
            {/* optional fields */}
            <UserEmail user={userInfo} handler={handleUserInfoChange} />
            <UserName user={userInfo} handler={handleUserInfoChange}/>

            {/* optional fields */}
            <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
              <UserGender user={userInfo} handler={handleUserInfoChange}/>
              <UserPhone user={userInfo} handler={handleUserInfoChange} />
            </Stack>
          </Stack>
        </Stack>

        {edited &&
          <Stack
            direction="row"
            justifyContent="center"
            spacing={4}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
            >Save
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
            >Cancel
            </Button>
          </Stack>
        }

        {editAvt &&
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'primary.light',
              overflow: 'auto',
              boxShadow: 24,
              p: 1,
              borderRadius: 2,
              zIndex: 9,
            }}
          >
            <Box sx={{ position: "relative"}} >
              <IconButton
                size="medium"
                aria-label="close avatar selection panel"
                onClick={() => setEditAvt(false)}
                color="primary"
                sx={{
                  position: "absolute",
                  right: -10,
                  top: -30,
                  zIndex: 10,
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
              <AvatarSelection user={userInfo} handler={handleUserInfoChange} />
            </Box>
          </Box>
        }

      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
