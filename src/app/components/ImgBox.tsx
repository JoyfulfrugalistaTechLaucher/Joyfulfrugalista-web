'use client';
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type ImgBoxProps = {
  imgSrc?: string;
  alt?: string;
  size: number;
}

const CircImgFrame = styled(Box)<ImgBoxProps>(({ theme, size }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: size,
  width: size,
}));

const StyledImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});


export function CircImgBox({imgSrc, alt, size}: ImgBoxProps) {
  return (
    <CircImgFrame size={size}>
      <StyledImg src={imgSrc} alt={alt} />
    </CircImgFrame>
  );
};

// TODO: add a rectangle image box
