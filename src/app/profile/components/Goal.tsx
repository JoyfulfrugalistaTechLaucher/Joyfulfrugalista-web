'use client';

import React, { Fragment, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { User } from '../_interface';

interface ProfileGoalProps {
  user: User,
}

export function UserMonthGoal({ user }: ProfileGoalProps) {
  const route = useRouter();
  const onSetGoal = () => {
    route.push('/task');
  };

  return (
    <Fragment>
      { user.task === undefined || user.task.goal === 0 ? (
        <Button
          variant="contained"
          aria-label="go to setting a goal"
          startIcon={<AddTaskIcon />}
          onClick={onSetGoal}
        >
          Set Goal
        </Button>
      ) : (
        <Stack className="profile-goal-container">
          <Box>GOAL</Box>
          <Box> ${user.task.goal || 0} month </Box>
        </Stack>
      )}
    </Fragment>
  );
}
