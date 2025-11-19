import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';

import Button from '@mui/material/Button';


const AnimatedButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(#fff 0 0)',
  backgroundPosition: '0 100%',
  backgroundSize: '0 2px',
  backgroundRepeat: 'no-repeat',
  transition:
    'background-size 0.3s, background-position 0s 0.3s',
  '&:hover': {
    backgroundPosition: '100% 100%',
    backgroundSize: '100% 2px',
    backgroundColor: 'transparent',
  },
}));

export default function StyledButton(props) {

  return (
    <AnimatedButton {...props}>
      {props.children}
    </AnimatedButton>
  );
}