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
import { User } from '../_interface';
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
      if (!user || !user.task) return;

      try {
        const database = getDatabase();
        const userSavingsRef = ref(database, `addInfo/${uid}`); // Assume `email` is used as an identifier
        const snapshot = await get(userSavingsRef);

        if (snapshot.exists()) {
          const savingsEntries = snapshot.val();
          const total = Object.values(savingsEntries).reduce((acc: number, entry: any) => acc + parseInt(entry.moneyAdded), 0);
          setTotalSavings(total);

          console.log(total);

          if (total >= user.task.goal) {
            setGoalReached(true); // Set state if goal is reached
          }
        }
      } catch (error) {
        console.error('Error fetching total savings:', error);
      }
    };

    fetchTotalSavings();
  }, [user]);

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
