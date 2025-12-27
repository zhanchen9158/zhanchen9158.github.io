import React, { useState, useRef } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled, useTheme, useColorScheme } from '@mui/material/styles';
import { motion, AnimatePresence, useMotionValue, useInView } from "framer-motion";
import Box from '@mui/material/Box';
import getActivesection from '../functions/getActivesection';
import { useAnimateContext } from './AnimateContext';


const sections = {
  'Go to': [
    { name: 'projects', route: 'projects' },
    { name: 'highlights', route: 'highlights' },
    { name: 'certifications', route: 'certifications' },
  ],
  'Color Mode': [
    { name: 'system mode', route: 'system' },
    { name: 'light mode', route: 'light' },
    { name: 'dark mode', route: 'dark' },
  ],
  'Animation': [
    { name: 'system mode', route: 'system' },
    { name: 'normal mode', route: 'normal' },
    { name: 'reduce mode', route: 'reduce' },
  ],
};

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  right: 16,
}));

export default function CustomizedSpeedDial({ handleScrollsection, activesection }) {
  const [open, setOpen] = useState(false);
  const [subopen, setSubopen] = useState(null);

  const { mode, systemMode, setMode } = useColorScheme();
  const { manual, system, setAniMode } = useAnimateContext();

  const handleSubopen = (sub) => () => {
    if (subopen == sub) setSubopen(null);
    else setSubopen(sub);
  };

  const handleColormode = (targetMode) => () => {
    setMode(targetMode);
  };

  const handleAnimationmode = (t) => () => {
    setAniMode(t);
  };

  const section = getActivesection(activesection);

  const resolvedMode = systemMode || mode;
  const icon = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
  }[resolvedMode];

  const animode = system || manual;
  const aniicon = {
    normal: <PlayArrowIcon />,
    reduce: <PauseIcon />,
  }[animode];

  const actions = [
    {
      icon: <SubMenu open={subopen} handleOpen={handleSubopen}
        icon={<ForkLeftIcon />} subactions={sections['Go to']}
        handleSubaction={handleScrollsection} name={"Go to"} tooltip={section} />,
      name: 'Go to'
    },
    {
      icon: <SubMenu open={subopen} handleOpen={handleSubopen}
        icon={icon} subactions={sections['Color Mode']}
        handleSubaction={handleColormode} name={'Color Mode'} tooltip={`${resolvedMode} Mode`} />,
      name: 'Color Mode'
    },
    {
      icon: <SubMenu open={subopen} handleOpen={handleSubopen}
        icon={aniicon} subactions={sections['Animation']}
        handleSubaction={handleAnimationmode} name={'Animation'} tooltip={`${animode} Animation`} />,
      name: 'Animation'
    },
    {
      icon: <SingleActionMenu open={subopen}
        icon={<KeyboardDoubleArrowUpIcon />}
        handleSubaction={handleScrollsection('introduction')} name={'Back to Top'} />,
      name: 'Back to Top'
    },
  ];

  const handleOpen = (e, reason) => {
    if (reason == 'toggle') setOpen(true);
    else return;
  }
  const handleClose = (e, reason) => {
    if (reason == 'toggle') setOpen(false);
    else return;
  };

  return (
    <StyledSpeedDial
      ariaLabel="speeddial"
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      FabProps={{
        sx: {
          size: { xs: 'small', sm: 'medium', },
          width: { xs: 42, sm: 56, },
          height: { xs: 42, sm: 56, },
        }
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          slotProps={{
            fab: {
              sx: (theme) => ({
                width: { xs: 32, sm: 48, },
                height: { xs: 32, sm: 48, },
                minHeight: { xs: 32, sm: 48, },
                '&:hover': {
                  bgcolor: (theme.vars || theme).palette.background.paper,
                  //boxShadow: 'none',
                },
              }),
            },
          }}
        />
      ))}
    </StyledSpeedDial>
  );
}

function SingleActionMenu({ open, icon, handleSubaction, name }) {
  return (
    <Box
      onClick={handleSubaction}
      sx={{
        borderRadius: "50%", border: "none",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      {icon}
    </Box>
  );
};

function SubMenu({ open, handleOpen, icon, subactions, handleSubaction, name, tooltip }) {

  const angle = 180;
  const radius = 80;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <React.Fragment>
      <Box
        onClick={handleOpen(name)}
        sx={{
          borderRadius: "50%", border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        {icon}
      </Box>
      <AnimatePresence>
        {open == null &&
          <Box
            onClick={handleOpen(name)}
            component={motion.div}
            initial={{
              opacity: 0,
              x: x + 32,
              y
            }}
            animate={{
              opacity: [0, 0.4, 0.8, 1],
              x,
              y
            }}
            exit={{
              opacity: 0,
              x: x + 32,
              y
            }}
            sx={{
              position: "absolute", width: 32, height: 32,
              cursor: 'default', whiteSpace: "nowrap", direction: "rtl",
              left: 8, top: 8, textTransform: 'capitalize',
              fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em',
              display: 'flex', alignItems: 'center',
            }}
          >
            {tooltip || name}
          </Box>
        }
        {open == name && subactions.map((v, i) => {
          const gap = 35;
          const cAngle = angle + gap - (i * gap);
          const cx = Math.cos((cAngle * Math.PI) / 180) * 60;
          const cy = Math.sin((cAngle * Math.PI) / 180) * 60;

          return (
            <Box
              component={motion.div}
              onClick={handleSubaction(v.route)}
              key={i}
              initial={{ opacity: 0, x, y }}
              animate={{ opacity: 1, x: x + cx, y: y + cy }}
              exit={{ opacity: 0, x, y }}
              sx={{
                position: "absolute", width: 32, height: 32,
                cursor: "pointer",
                left: 8, top: 8,
              }}
            >
              <MagneticBox>
                {v.name}
              </MagneticBox>
            </Box>
          );
        })}
      </AnimatePresence>
    </React.Fragment>
  );
};

function MagneticBox({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Calculate the distance from the center of the button
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Set the state - the division (0.3) controls the "magnetic strength"
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Box
      component={motion.div}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      whileHover={{
        //transform: 'translateY(-4px) translateX(-2px)',
        //textShadow: "10px 15px 30px rgba(0,0,0,0.6)",
        transition: {
          type: "spring",
          stiffness: 90,
          damping: 20
        },
      }}
      animate={{
        x: position.x,
        y: position.y
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        //mass: 0.1
      }}
      sx={(theme) => ({
        display: "flex", alignItems: "baseline", justifyContent: 'flex-start',
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px", fontWeight: 'bold', letterSpacing: '0.05em', whiteSpace: 'nowrap',
        color: (theme.vars || theme).palette.primary.main,
        textShadow: `2px 2px 4px rgba(${(theme.vars || theme).palette.primary.main}/0.1), 4px 4px 10px rgba(${(theme.vars || theme).palette.primary.main}/0.1), 10px 10px 20px rgba(${(theme.vars || theme).palette.primary.main}/0.2)`,
        '& span': {
          color: (theme.vars || theme).palette.text.primary,
          paddingLeft: '1px',
          width: 'fit-content',
          fontSize: '12px',
          textTransform: 'lowercase',
          letterSpacing: '0.15em',
          textShadow: 'none',
        },
      })}
    >
      {children.substring(0, 1).toUpperCase()}
      <span>
        {children.substring(1)}
      </span>
    </Box>
  );
}