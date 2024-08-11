import React from 'react';
import MainLayout from './layouts/MainLayout';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="home-hero-container flex justify-center items-center py-24 bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="home-hero flex flex-col items-center justify-center w-full max-w-screen-lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={4} className="flex justify-center">
            <Image src="/assets/saving_jar.png" alt="Hero Image" width={300} height={300} />
          </Grid>
          <Grid item xs={12} md={8} className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Welcome to Joyful Savings Jar, your ultimate savings companion.
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Track spending, wealth extending. Join our community and save more.
            </p>
            <Button variant="outlined" color="primary" className="mt-4">
              Learn More
            </Button>
          </Grid>
        </Grid>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
