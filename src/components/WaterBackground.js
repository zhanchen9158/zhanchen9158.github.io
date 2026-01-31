import React, { useRef, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { motion, useInView } from 'motion/react';
import { useAnimateContext } from './AnimateContext';
import dockimg from '../pics/dock.webp';
import waterimg from '../pics/ocean.webp';
import dockmobileimg from '../pics/dockmobile.webp';


const dockw = 20;

const MotionBox = motion(Box);

const Container = styled(Box)(({ theme }) => ({
  zIndex: 0,
}));

const DockImage = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: `${dockw}dvw`,
  height: '100dvh',
  backgroundImage: `url(${dockimg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'right',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    backgroundImage: `url(${dockmobileimg})`,
  },
}));

const DockShadow = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  top: 0, left: `${dockw * 3 / 4}dvw`,
  width: `${dockw / 2}dvw`, height: '100dvh',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 30, 60, 0.4)',
    filter: 'blur(4px)',
    willChange: 'transform, opacity',
  },
}));

const OceanImage = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '100dvw',
  height: '100dvh',
  backgroundImage: `url(${waterimg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'right',
  zIndex: 0,
  willChange: 'transform, opacity',
}));

const shadowVars = {
  animate: (shadowDuration) => ({
    x: ['5%', '15%', '5%'],
    opacity: [0.6, 0.9, 0.6],
    transition: {
      duration: shadowDuration,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }),
  static: {
    x: '5%',
    opacity: 0.6,
  }
};

const oceanVars = {
  animate: (driftDuration) => ({
    x: ['0%', '50%', '0%'],
    transition: {
      duration: driftDuration,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }),
  static: {
    x: '0%',
  }
};

const WaterBackground = ({ shadowDuration = 20, driftDuration = 80 }) => {

  const containerRef = useRef(null);

  const { manual, system } = useAnimateContext();
  const mode = system || manual;
  const isInView = useInView(containerRef, { amount: 0.1 });

  const animationConfig = useMemo(() => {
    const animate = (mode == 'normal' && isInView);

    return {
      animate: animate ? "animate" : "static",
    };
  }, [mode, isInView]);

  return (
    <Container
      ref={containerRef}
    >
      <DockImage />
      <DockShadow
        variants={shadowVars}
        custom={shadowDuration}
        animate={animationConfig.animate}
      />
      <OceanImage
        //variants={oceanVars}
        //custom={driftDuration}
        //animate={animationConfig.animate}
      />
    </Container>
  );
};

export default WaterBackground;