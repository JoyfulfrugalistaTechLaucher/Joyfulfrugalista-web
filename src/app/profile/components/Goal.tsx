'use client';

import React, { Fragment, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '../../interface';
import { getDatabase, ref, get } from 'firebase/database'; // Import Firebase to fetch total savings
import { useAuth } from '@/app/context/AuthContext';

interface ProfileGoalProps {
  user: User,
}

export function UserMonthGoal({ user }: ProfileGoalProps) {
  const route = useRouter();
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [goalReached, setGoalReached] = useState<boolean>(false);
  const { uid, isLoggedIn } = useAuth();

  // Fetch the user's total savings from Firebase
  useEffect(() => {
    const fetchTotalSavings = async () => {
      if (!user || !user.task || !uid) return;

      try {
        const response = await fetch(`/api/savings/${uid}`);

        if (!response.ok) {
          console.error("Error fetching savings from API:", response.status);
          return;
        }

        const data = await response.json();
        const { totalMoneyAdded, goal } = data;

        setTotalSavings(totalMoneyAdded);

        if (totalMoneyAdded >= goal) {
          setGoalReached(true);
        }
      } catch (error) {
        console.error('Error fetching total savings from API:', error);
      }
    };

    if (isLoggedIn && uid) {
      fetchTotalSavings();
    }
  }, [user, uid, isLoggedIn]);

  const onSetOrEditGoal = () => {
    route.push('/task');
  };

  return (
    <Fragment>
      {user.task === undefined || user.task.goal === 0 ? (
        <Button
          variant="contained"
          aria-label="go to setting a goal"
          startIcon={<AddTaskIcon />}
          onClick={onSetOrEditGoal}
        >
          Set Goal
        </Button>
      ) : (
        <Stack className="profile-goal-container" alignItems={'flex-end'} spacing={1}>
          <Box>GOAL: ${user.task.goal || 0}</Box>
          <Box>${totalSavings} saved</Box>
          <Box>
            <Button
              variant="outlined"
              aria-label="edit or set new goal"
              startIcon={goalReached ? <AddTaskIcon /> : <EditIcon />} // Change icon based on goal status
              onClick={onSetOrEditGoal}
              color={goalReached ? 'success' : 'primary'}
              sx={{ whiteSpace: 'nowrap', padding: '4px 8px', minWidth: 'fit-content' }}
            >
              {goalReached ? 'Set New Goal' : 'Edit Goal'}
            </Button>
          </Box>
        </Stack>
      )}
    </Fragment>
  );
}
