'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Container, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ref, set, get, getDatabase } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

function TaskPage() {
  const [goal, setGoal] = useState<number>(0); // Initialize as 0
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { uid, isLoggedIn } = useAuth();
  const router = useRouter();

  // Fetch the user's current goal when the page loads
  useEffect(() => {
    const fetchUserGoal = async () => {
      if (!uid) return;

      try {
        const response = await fetch(`/api/savings/${uid}`);
        
        if (!response.ok) {
          console.error("Error fetching user goal from API:", response.status);
          setError("Failed to fetch user goal.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setGoal(data.goal);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user goal:", error);
        setError("Failed to fetch user goal.");
        setLoading(false);
      }
    };

    if (isLoggedIn && uid) {
      fetchUserGoal();
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, uid, router]);


  const handleSaveGoal = async () => {
    setLoading(true);
    if (!uid || goal <= 0) {
      setError('Invalid goal. Please enter a valid number.');
      setLoading(false);
      return;
    }
    try {
      const userRef = ref(db, `users/${uid}/task`);
      await set(userRef, {
        goal: goal,
        setDate: new Date().toISOString().split('T')[0],  // Set the current date
      });
      router.push('/profile'); // Redirect back to profile page after saving
    } catch (error) {
      console.error('Error setting goal:', error);
      setError('Failed to update goal. Please try again.');
      setLoading(false);
    }
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
        component="main"
        maxWidth="sm"
        sx={{ mt: 4, mb: 4 }}
      >
        <Stack spacing={2}>
          <TextField
            label="Total Saving Goal"
            type="number"
            variant="outlined"
            fullWidth
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            error={!!error}
            helperText={error || 'Set your total savings goal in dollars'}
          />

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveGoal}
              disabled={goal <= 0}
            >
              Save Goal
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/profile')}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Container>
    </MainLayout>
  );
}

export default TaskPage;
