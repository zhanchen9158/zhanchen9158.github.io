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
import { motion, AnimatePresence, useMotionValue, useSpring, color } from "motion/react";
import Box from '@mui/material/Box';
import getActivesection from '../functions/getActivesection';
import { useAnimateContext } from './AnimateContext';
import compass1 from '../pics/compass1.webp';
import compass2 from '../pics/compass2.webp';


const MotionBox = motion.create(Box);

const SECTION_COLORS = {
  introduction: '#E0F7FA',
  projects: '#0F172A',
  highlights: '#FF8C00',
  certifications: '#E0F7FA',
};

const DEFAULT_COLOR = '#E0F7FA';

const TRANSITION_CONFIG = {
  mainfab: { duration: 0.5, ease: 'easeOut' },
};

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  bottom: 16, right: 16,
  '& .MuiSpeedDial-fab': {
    width: 56, height: 56,
    background: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.down('sm')]: {
      width: 42, height: 42,
      minHeight: 42,
    },
    '&:hover': {
      background: 'transparent',
    },
  },
}));

const StyledSpeedDialAction = styled(SpeedDialAction)(({ theme }) => ({
  '&.MuiSpeedDialAction-fab': {
    width: 48, height: 48,
    minHeight: 48,
    background: 'transparent',
    boxShadow: 'none',
    color: (theme.vars || theme).palette.grey[500],
    '&:hover': {
      color: 'var(--hover-color)',
    },
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

  const color = useMemo(() => SECTION_COLORS[section] || DEFAULT_COLOR,
    [section]);

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
          icon={<ForkLeftIcon />} tooltip={section || ''} handleSubaction={handleScrollsection}
          fontcolor={color} />
      },
      {
        name: 'Color Mode',
        icon: (openName) => <SubMenu open={openName} name="Color Mode" section={section}
          icon={colorIcon} tooltip={colorMode} handleSubaction={setMode}
          fontcolor={color} />
      },
      {
        name: 'Animation',
        icon: (openName) => <SubMenu open={openName} name="Animation" section={section}
          icon={animationIcon} tooltip={animationMode} handleSubaction={setAniMode}
          fontcolor={color} />
      },
      { name: 'Back to Top', icon: () => <KeyboardDoubleArrowUpIcon /> },
    ];
  }, [colorMode, animationMode, section, color]);

  const handleAction = useCallback((action) => {
    if (action == 'Back to Top') handleScrollsection('introduction');
    else
      setSubopen(prev => prev === action ? null : action);
  }, []);

  const handleOpen = useCallback((_, reason) => {
    setOpen(true);
  }, []);
  const handleClose = useCallback((_, reason) => {
    if (reason == 'toggle') setOpen(false);
    else return;
  }, []);

  return (
    <StyledSpeedDial
      ariaLabel="speeddial"
      icon={<AnimatedFabIcon color={color} open={open} />}
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
              style: { '--hover-color': color }
            }
          }}
        />
      ))}
    </StyledSpeedDial>
  );
}

const FabIconContainer = styled(MotionBox)(({ theme }) => ({
  width: 56, height: 56,
  minHeight: 56,
  borderRadius: '50%',
  backfaceVisibility: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 42, height: 42,
    minHeight: 42,
  },
}));

const FabBgHover = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  background: (theme.vars || theme).palette.primary.dark,
  filter: 'blur(8px)',
  backfaceVisibility: 'hidden',
}));

const CompassIcon = styled(MotionBox)(({ theme }) => ({
  position: 'absolute',
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  backfaceVisibility: 'hidden',
}));

const fabBgHoverVars = {
  initial: {
    opacity: 0, scale: 0.2,
    transition: TRANSITION_CONFIG.mainfab,
  },
  animate: {
    opacity: 0.6, scale: 0.8,
    transition: TRANSITION_CONFIG.mainfab,
  },
};

const compass1Vars = {
  initial: {
    rotate: 0,
    rotateX: 0, rotateY: 0,
    transition: TRANSITION_CONFIG.mainfab,
  },
  animate: {
    rotate: 45,
    rotateX: 90, rotateY: 90,
    transition: TRANSITION_CONFIG.mainfab,
  },
};

const compass2Vars = {
  initial: {
    rotate: 0,
    rotateX: -90, rotateY: -90,
    transition: TRANSITION_CONFIG.mainfab,
  },
  animate: {
    rotate: 45,
    rotateX: 0, rotateY: 0,
    transition: TRANSITION_CONFIG.mainfab,
  },
};

const AnimatedFabIcon = memo(function AnimatedFabIcon({ color, open }) {

  return (
    <FabIconContainer
      initial='initial'
      animate={open ? 'animate' : 'initial'}
    >
      <FabBgHover
        variants={fabBgHoverVars}
      />
      <CompassIcon
        variants={compass1Vars}
        style={{
          mask: `url(${compass1}) no-repeat center / 56px`,
          WebkitMask: `url(${compass1}) no-repeat center / 56px`,
          backgroundColor: '#ffffff'
        }}
      />
      <CompassIcon
        variants={compass2Vars}
        style={{
          mask: `url(${compass2}) no-repeat center / 56px`,
          WebkitMask: `url(${compass2}) no-repeat center / 56px`,
          backgroundColor: '#ffffff'
        }}
      />
    </FabIconContainer>
  );
});

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

const ANGLE = 178;
const RADIUS = 60;
const BASE_X = Math.cos((ANGLE * Math.PI) / 180) * RADIUS;
const BASE_Y = Math.sin((ANGLE * Math.PI) / 180) * RADIUS;

const StyledSubMenuIcon = styled(Box)(({ theme }) => ({
  borderRadius: "50%", border: "none",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center"
}));

const StyledSubMenuText = styled(MotionBox)(({ theme }) => ({
  position: "absolute", width: 32, height: 32,
  cursor: 'pointer', whiteSpace: "nowrap", direction: "rtl",
  left: 8, top: 4, textTransform: 'capitalize',
  fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em',
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

const SubMenu = memo(function SubMenu({ open, name, section, icon,
  tooltip, handleSubaction, fontcolor }) {

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
      <AnimatePresence mode='popLayout'>
        {open == null &&
          <StyledSubMenuText
            key={name}
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
            key={v.name}
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
  fontSize: "16px", fontWeight: 'bold', letterSpacing: '0.05em', whiteSpace: 'nowrap',
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
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = useMemo(() => ({ stiffness: 150, damping: 15, mass: 0.1 }), []);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = rectRef.current;

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
      onMouseEnter={handleMouseEnter}
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