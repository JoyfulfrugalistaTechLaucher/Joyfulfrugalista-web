'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {useMediaQuery, useTheme} from '@mui/material';
import { useRouter } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/app/interface';

interface ProfileGoalProps {
  user: User;
  show: boolean;
  handleShow: (hs: boolean) => void;
}

interface CircProgressProps {
  reached: boolean,
  prog: number;
  // total savings
  total: number;
  size?: number | string;
}

interface LinearProgressProps {
  prog: number;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: '90%',
  marginRight: 2,
  borderRadius: 5,
  '& .MuiLineProgress-colorPrimary': {
    // backgroundColor: theme.palette.grey[200],
    backgroundColor: theme.palette.primary.light,
  },
  '& .MuiLineProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const CircProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const CircProgressRemainder = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.light,
  position: 'absolute',
}));

const CompactButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 0),
  textTransform: 'none',
  '& .MuiButton-endIcon': {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
}));

const SmallGoalDoneIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
}));

const LargeGoalDoneIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2.5rem',
  position: 'absolute',
  bottom: '1rem',
}));

// Format a given number to the contarcted form. For example, input 123,400
// output 123.4 k.  Supports numbers no larger than one billion
function formatValue(value: number | undefined): string {
  if (value === undefined) return '';

  if (value < 1000) {
    return value.toString();
  }

  if (value < 1000_000) {
    return (value / 1000).toString().concat('K');
  }

  if (value < 1000_000_000) {
    return (value / 1000_000).toString().concat('M');
  }

  // else this must be a super billionare
  // return 'Hello Billionare';
  return (value / 1000_000_000).toString().concat('B');
}

function easeInOutQuad(time: number): number {
  return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
}

// TODO: make font responds to screen sizes more smoothly
// For task page.  Mui does not ship a default semi-circular progress
// bar so we make our own one.
export function SemiCircGoalPanel({reached, prog, total, size}: CircProgressProps) {
  const [currProg, setCurrProg] = useState<number>(0);
  const reqRef = useRef<number | undefined>(0);
  const startTimeRef = useRef<number | undefined>(0);

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('sm')); // default: 600px+

  useEffect(() => {
    const animate = (time: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current;
      const duration = Math.min(elapsed / 3000, 1); // 3000ms duration
      const easedProgress = easeInOutQuad(duration);
      const newProg = Math.min(prog * easedProgress, Math.min(100, prog));

      setCurrProg(newProg);

      if (duration < 1) {
        reqRef.current = requestAnimationFrame(animate);
      }
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqRef.current) {
        cancelAnimationFrame(reqRef.current);
      }
    };
  }, [prog]);

  // 100% = 180° so: 1° = 1% * 1.8
  // 45 is to add the needed rotation to have the borders at the bottom
  const rotation = 45 + (currProg * 1.8);

  return (
    <Stack
      className="semi-progress"
      style={{ '--size': size} as React.CSSProperties }
    >
      <div className="semi-progress-overflow">
        <Typography
          variant={md ? 'h4' : 'h5'}
          className="absolute left-0 right-0 font-semibold"
          style={{
            top: md ? '3.5rem' : '3rem',
          }}
        >
          Saved
        </Typography>
        <Typography
          variant={md ? 'h1' : 'h2'}
          className="absolute left-0 right-0 font-bold"
          style={{
            top: md ? '5.2rem' : '4.8rem',
          }}
        >
          ${total}
        </Typography>
        <div
          className="semi-progress-bar"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        ></div>
      </div>
      {reached && !md && <SmallGoalDoneIcon /> }
      {reached && md &&  <LargeGoalDoneIcon /> }
      {!reached &&
        <Typography className="sm:text-lg md:text-2xl text-base" >
          {Math.min(100, currProg)}% of your goal
        </Typography>
      }
    </Stack>
  );
}

// For middle and large screens
export function CircProgressWithLabel({reached, prog, total }: CircProgressProps) {
  return(
    <Stack className="relative justify-center">
      <CircProgressRemainder
        variant="determinate"
        size={120}
        value={100}
        thickness={2}
        className="left-0 right-0"
      />
      <CircProgress
        variant="determinate"
        size={120}
        value={Math.min(100, prog)}
        thickness={2}
      />
      <Stack
        className="absolute left-0 right-0 justify-center items-center"
      >
        <Box className="text-base font-semibold">Saved</Box>
        <Box className="text-2xl font-bold">${formatValue(total)}</Box>
        {reached && <SmallGoalDoneIcon />}
      </Stack>
    </Stack>
  );
}

// For smaller screens
export function LinearProgressWithLabel({ prog }: LinearProgressProps) {
  return (
    <Stack spacing={2} direction="row" className="w-full items-center mt-3">
      <BorderLinearProgress
          variant="determinate"
        value={Math.min(100, prog)}
      />
      <Typography
        variant="body2"
      >
        {`${Math.min(100, prog)}%`}
      </Typography>
    </Stack>
  );
}

export function UserMonthGoal({ user, show, handleShow }: ProfileGoalProps) {
  const route = useRouter();
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [hasGoal] = useState<boolean>(
    user.task !== undefined && user.task.goal !== 0
  );

  const [progress, setProgress] = useState<number>(0);
  const [goalReached, setGoalReached] = useState<boolean>(false);
  const { uid, isLoggedIn } = useAuth();

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm')); // default: 600px

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
        const prop = (totalMoneyAdded / goal) * 100;
        const prog = prop < 1 ? 1 : Math.floor(prop);
        setTotalSavings(totalMoneyAdded);
        setProgress(prog);

        if (totalMoneyAdded >= goal) {
          setGoalReached(true);
        }

        // Fetch animation preference from localStorage
        const savedShowAnimation = localStorage.getItem('showAnimation');
        handleShow(savedShowAnimation === null
          ? true
          : JSON.parse(savedShowAnimation));

      } catch (error) {
        console.error('Error fetching total savings from API:', error);
      }
    };

    if (isLoggedIn && uid) {
      fetchTotalSavings();
    }
  }, [user, uid, isLoggedIn]);

  // Handle animation toggle and save to localStorage
  const handleAnimationToggle = () => {
    const newShowAnimation = !show;
    handleShow(newShowAnimation);
    localStorage.setItem('showAnimation', JSON.stringify(newShowAnimation));
  };

  const onSetOrEditGoal = () => {
    route.push('/task');
  };

  return (
    <Stack
      direction="row"
      className="gap-x-2 p-2 rounded-lg bg-white/25 backdrop-blur-md" >
      {!sm &&
        <Fragment>
          < CircProgressWithLabel
            reached={goalReached}
            prog={progress}
            total={totalSavings}
          />
          <Stack spacing={0} className="h-[120px] justify-between items-start">
            <Stack spacing={0} className="pt-1">
              <Box className="text-xs font-light">Your Monthly Goal</Box>
              <Box className="text-2xl font-normal">
                ${hasGoal ? formatValue(user.task?.goal) : 0}
              </Box>
            </Stack>
            <CompactButton
              variant="text"
              size="medium"
              className="mt-2 p-0 text-base"
              endIcon={<ChevronRightIcon />}
              onClick={onSetOrEditGoal}
            >
              {hasGoal ? 'Adjust Goal' : 'Set A Goal'}
            </CompactButton>
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleAnimationToggle} />}
                label="Animation"
                labelPlacement="start"
                className="m-0"
              />
            </FormGroup>
          </Stack>
        </Fragment>}
      {sm &&
        <Box className="w-full">
          <Stack direction="row" className="justify-between items-center">
            <Box className="text-base font-semibold">
              Saved ${formatValue(totalSavings)}
            </Box>
            <Box className="text-base font-semibold">
              Your Monthily Goal ${hasGoal ? formatValue(user.task?.goal) : 0}
            </Box>
          </Stack>
          <LinearProgressWithLabel prog={progress} />
          <Stack direction="row" className="justify-between items-center">
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleAnimationToggle} />}
                label="Animation"
                labelPlacement="start"
                className="m-0"
              />
            </FormGroup>
            <CompactButton
              variant="text"
              size="medium"
              className="p-0 text-base"
              endIcon={<ChevronRightIcon />}
              onClick={onSetOrEditGoal}
            >
              {hasGoal ? 'Adjust Goal' : 'Set A Goal'}
            </CompactButton>
          </Stack>
        </Box >
      }
    </Stack>
  );
}
