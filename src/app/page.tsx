import React from 'react';
import MainLayout from './layouts/MainLayout';
import Image from 'next/image';
import Button from '@mui/material/Button';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="home-hero">
        <div className="hero-image">
          <Image src="/assets/saving_jar.png" alt="Hero Image" width={300} height={300} />
        </div>
        <div className="hero-text">
          <h1>Welcome to Joyful Savings Jar, your ultimate savings companion.</h1>
          <p>Track spending, wealth extending</p>
          <p>Join our community and save more</p>
          <Button variant="outlined" color="primary">Learn More</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
