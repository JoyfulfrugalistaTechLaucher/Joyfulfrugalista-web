'use client';
import  React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import {useMediaQuery, useTheme} from '@mui/material';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import MainLayout from "@/app/layouts/MainLayout";
import Animation from '@/app/components/Animation';
import Castle from "@/app/components/Castle";
import { DUSER } from '@/app/constants';
import { User } from "@/app/interface";
import {
  UserEmail,
  UserGender,
  UserName,
  UserPhone,
} from './components/Inputs';
import { UserMonthGoal } from './components/Goal';
import { UserAvatar } from './components/Avatar';

// styles
function ProfilePage() {
  const [edited, setEdited] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [localUserData, setLocalUserData] = useState<Partial<User>>({});
  const { user, loading, updateUserProfile, uid, isLoggedIn } = useAuth();
  const router = useRouter();

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, loading, router]);

  // Prepare combined user data (current user + local edits)
  const userInfo: User = user ? { ...user, ...localUserData } : DUSER;

  // handlers
  const handleUserInfoChange = (update: Partial<User>) => {
    setLocalUserData(prev => ({ ...prev, ...update }));
    setEdited(true);
  };

  const onSave = async () => {
    try {
      await updateUserProfile(localUserData);
      setLocalUserData({});
      setEdited(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      // TODO: show error message to user
    }
  };

  const onCancel = () => {
    setLocalUserData({});
    setEdited(false);
  };

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
        component="div"
        className="profile-page-layout"
      >
        <Stack direction="row" className="justify-between items-center">
          {/* avatar */}
          <Box className="avatar-container">
            <UserAvatar
              small={sm}
              user={userInfo}
            />
          </Box>

          {/* goal display on midlle or large screens */}
          {md && <UserMonthGoal
                   user={userInfo}
                   show={showAnimation}
                   handleShow={setShowAnimation}
          />}
        </Stack>

        {/* goal display on smaller screens */}
        {sm &&
          <UserMonthGoal
            user={userInfo}
            show={showAnimation}
            handleShow={setShowAnimation}
          />
        }

        {/* informatoin fields */}
        <Stack className="mt-4" spacing={2}>
          <UserEmail user={userInfo} handler={handleUserInfoChange} />
          <UserName user={userInfo} handler={handleUserInfoChange}/>
          <UserGender user={userInfo} handler={handleUserInfoChange}/>
          <UserPhone user={userInfo} handler={handleUserInfoChange} />
        </Stack>

        {/* save and cancel buttons */}
        <Stack
          direction="row"
          spacing={4}
          className="justify-center items-center mt-4"
        >
          <Button
            disabled={!edited}
            variant="contained"
            color="primary"
            onClick={onSave}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>

        {/* Animation component */}
        {uid && showAnimation && <Animation uid={uid} />}

      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
