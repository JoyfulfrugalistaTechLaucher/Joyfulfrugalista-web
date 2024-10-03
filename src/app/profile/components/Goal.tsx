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
import EditIcon from '@mui/icons-material/Edit';
import { User } from '../_interface';

interface ProfileGoalProps {
  user: User,
}

export function UserMonthGoal({ user }: ProfileGoalProps) {
  const route = useRouter();
  const onSetOrEditGoal = () => {
    route.push('/task');
  };

  return (
    <Fragment>
      { user.task === undefined || user.task.goal === 0 ? (
        <Button
          variant="contained"
          aria-label="go to setting a goal"
          startIcon={<AddTaskIcon />}
          onClick={onSetOrEditGoal}
        >
          Set Goal
        </Button>
      ) : (
        <Stack className="profile-goal-container">
          <Box>GOAL</Box>
          <Box> ${user.task.goal || 0} month </Box>
          <Box>
            <Button
              variant="outlined"
              aria-label="edit goal"
              startIcon={<EditIcon />}
              onClick={onSetOrEditGoal}
            >
              Edit
            </Button>
          </Box>
        </Stack>
      )}
    </Fragment>
  );
}
