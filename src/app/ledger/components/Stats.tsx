import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


function CalendarNav() {
  return (
    <div class="p-2 my-4 rounded-md border border-solid border-lgray flex justify-between item-stretch divide-x divide-black w-4/5">
      <div class="flex-1"><ArrowBackIosIcon /></div>
      <div class="flex-1">2024 Month</div>
      <div class="flex-1"><ArrowForwardIosIcon /></div>
    </div>
  );
}

// Progress bar for user's goal
function ProgressBar() {
  return (
    <div class="bg-white rounded-md w-full">
      <div class="prog-bar w-4/5"></div>
    </div>
  );
}

function Goal() {
  return (
    <div class="goal-container">
      <div class="flex-1 my-2 text-white">Approaching your goal: 80%</div>
      <ProgressBar />
    </div>
  );
}


function BarGraph() {
  return (
    <div class="h-10"></div>
  );
}

/*
 * @param Icon
 * @param Text
 */
function IconTab() {
  let active = false;
  return (
    <div class="">
      <div><Icon /></div>
      <div>Text</div>
    </div>

  );
}

function StatsTabs() {

  return (
    <div class="rounded-md w-4/5">

    </div>
  );
}

export function Stats() {
  return (
    <>
      <CalendarNav />
      <Goal />
    </>
  );
}
