import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
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
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import Box from '@mui/material/Box';
import getActivesection from '../functions/getActivesection';
import { useAnimateContext } from './AnimateContext';


const MotionBox = motion(Box);

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  right: 16,
  '& .MuiSpeedDial-fab': {
    width: 56, height: 56,
    [theme.breakpoints.down('sm')]: {
      width: 42, height: 42,
      minHeight: 42,
    },
  },
}));

const StyledSpeedDialAction = styled(SpeedDialAction)(({ theme }) => ({
  '& .MuiSpeedDialAction-fab': {
    width: 48, height: 48,
    minHeight: 48,
    [theme.breakpoints.down('sm')]: {
      width: 32, height: 32,
      minHeight: 32,
    },
  },
}));

export default function CustomizedSpeedDial({ handleScrollsection, activesection }) {
  const [open, setOpen] = useState(false);
  const [subopen, setSubopen] = useState(null);

  const section = useMemo(() => getActivesection(activesection),
    [activesection]);

  const { mode, systemMode, setMode } = useColorScheme();
  const { manual, system, setAniMode } = useAnimateContext();

  const colorMode = systemMode || mode;
  const animationMode = system || manual;

  const actions = useMemo(() => {
    const colorIcon = colorMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />;
    const animationIcon = animationMode === 'normal' ? <PlayArrowIcon /> : <PauseIcon />;

    return [
      {
        name: 'Go to',
        icon: (openName) => <SubMenu open={openName} name="Go to" section={section}
          icon={<ForkLeftIcon />} tooltip={section || ''} handleSubaction={handleScrollsection} />
      },
      {
        name: 'Color Mode',
        icon: (openName) => <SubMenu open={openName} name="Color Mode" section={section}
          icon={colorIcon} tooltip={`${colorMode} Mode`} handleSubaction={setMode} />
      },
      {
        name: 'Animation',
        icon: (openName) => <SubMenu open={openName} name="Animation" section={section}
          icon={animationIcon} tooltip={`${animationMode} Animation`} handleSubaction={setAniMode} />
      },
      { name: 'Back to Top', icon: () => <KeyboardDoubleArrowUpIcon /> },
    ];
  }, [colorMode, animationMode, section, handleScrollsection, setMode, setAniMode]);

  const handleAction = useCallback((action) => {
    if (action == 'Back to Top') handleScrollsection('introduction');
    else
      setSubopen(prev => prev === action ? null : action);
  }, [handleScrollsection]);

  const handleOpen = useCallback((_, reason) => {
    if (reason == 'toggle') setOpen(true);
    else return;
  }, []);
  const handleClose = useCallback((_, reason) => {
    if (reason == 'toggle') setOpen(false);
    else return;
  }, []);

  return (
    <StyledSpeedDial
      ariaLabel="speeddial"
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action, i) => (
        <StyledSpeedDialAction
          key={action.name}
          icon={action.icon(subopen)}
          onClick={() => handleAction(action.name)}
          slotProps={{
            fab: {
              sx: {
                '&:hover': { bgcolor: 'primary.dark', color: 'white' },
              }
            }
          }}
        />
      ))}
    </StyledSpeedDial>
  );
}

const SUBACTIONS_DATA = {
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

const ANGLE = 180;
const RADIUS = 80;
const BASE_X = Math.cos((ANGLE * Math.PI) / 180) * RADIUS;
const BASE_Y = Math.sin((ANGLE * Math.PI) / 180) * RADIUS;

const SECTION_COLORS = {
  introduction: '#E0F7FA',
  projects: '#FF8C00',
  highlights: '#E0B0FF',
  certifications: '#E0F7FA',
};

const DEFAULT_COLOR = '#E0F7FA';

const StyledSubMenuIcon = styled(Box)(({ theme }) => ({
  borderRadius: "50%", border: "none",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center"
}));

const StyledSubMenuText = styled(MotionBox)(({ theme }) => ({
  position: "absolute", width: 32, height: 32,
  cursor: 'pointer', whiteSpace: "nowrap", direction: "rtl",
  left: 8, top: 4, textTransform: 'capitalize',
  fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.1em',
  display: 'flex', alignItems: 'center',
}));

const StyledSubAction = styled(MotionBox)(({ theme }) => ({
  position: "absolute", width: 32, height: 32,
  cursor: "pointer",
  left: 8, top: 4,
}));

const TRANSITION_DATA = {
  opacity: { duration: 0.15 },
  x: { type: 'spring', stiffness: 260, damping: 20, mass: 0.1 },
  y: { type: 'spring', stiffness: 260, damping: 20, mass: 0.1 },
};

const submenuVars = {
  initial: {
    opacity: 0,
    x: BASE_X + 32,
    y: BASE_Y,
    transition: TRANSITION_DATA,
  },
  animate: {
    opacity: 1,
    x: BASE_X,
    y: BASE_Y,
    transition: TRANSITION_DATA,
  },
};

const subactionVars = {
  initial: {
    opacity: 0,
    x: BASE_X,
    y: BASE_Y,
    transition: TRANSITION_DATA,
  },
  animate: (offset) => ({
    opacity: 1,
    x: BASE_X + offset.cx,
    y: BASE_Y + offset.cy,
    transition: TRANSITION_DATA,
  }),
};

const SubMenu = memo(function SubMenu({ open, name, section, icon, tooltip, handleSubaction }) {

  const fontcolor = SECTION_COLORS[section] || DEFAULT_COLOR;

  const calculatedPositions = useMemo(() => {
    const gap = 35;
    return SUBACTIONS_DATA[name].map((_, i) => {
      const cAngle = ANGLE + gap - (i * gap);
      return {
        cx: Math.cos((cAngle * Math.PI) / 180) * 60,
        cy: Math.sin((cAngle * Math.PI) / 180) * 60
      };
    });
  }, [SUBACTIONS_DATA]);

  return (
    <React.Fragment>
      <StyledSubMenuIcon>
        {icon}
      </StyledSubMenuIcon>
      <AnimatePresence mode='wait'>
        {open == null &&
          <StyledSubMenuText
            key={`submenutext-${name}-${tooltip}`}
            variants={submenuVars}
            initial='initial'
            animate='animate'
            exit='initial'
            sx={{
              color: fontcolor,
            }}
          >
            {tooltip || ''}
          </StyledSubMenuText>
        }
        {open == name && SUBACTIONS_DATA[name].map((v, i) => (
          <StyledSubAction
            key={`subaction-${name}-${v.name}`}
            onClick={() => handleSubaction(v.route)}
            variants={subactionVars}
            custom={calculatedPositions[i]}
            initial='initial'
            animate='animate'
            exit='initial'
          >
            <MagneticBox fontcolor={fontcolor}>
              {v.name}
            </MagneticBox>
          </StyledSubAction>
        ))}
      </AnimatePresence>
    </React.Fragment>
  );
});

const StyledMagneticBox = styled(MotionBox)(({ theme }) => ({
  display: "flex", alignItems: "baseline", justifyContent: 'flex-start',
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "20px", fontWeight: 'bold', letterSpacing: '0.05em', whiteSpace: 'nowrap',
  color: (theme.vars || theme).palette.primary.main,
  '& span': {
    paddingLeft: '1px',
    width: 'fit-content',
    fontSize: '12px',
    textTransform: 'lowercase',
    letterSpacing: '0.15em',
  },
}));

const MagneticBox = memo(function MagneticBox({ fontcolor, children }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = useMemo(() => ({ stiffness: 150, damping: 15, mass: 0.1 }), []);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    mouseX.set((clientX - (left + width / 2)) * 0.3);
    mouseY.set((clientY - (top + height / 2)) * 0.3);
  }, [mouseX, mouseY]);

  const reset = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <StyledMagneticBox
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x, y }}
      sx={{
        '& span': {
          color: fontcolor,
        },
      }}
    >
      {children.substring(0, 1).toUpperCase()}
      <span>
        {children.substring(1)}
      </span>
    </StyledMagneticBox>
  );
});