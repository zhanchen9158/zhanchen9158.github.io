import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
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
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import speeddialmain from '../pics/speeddialmain.webp';
import { useStateContext } from './StateContext';


const MotionBox = motion.create(Box);

const SECTION_COLORS = {
  introduction: '#E0F7FA',
  projects: '#0F172A',
  highlights: '#FF8C00',
  certifications: '#FF0000',
};

const DEFAULT_COLOR = '#E0F7FA';

const TRANSITION_CONFIG = {
  mainfab: { duration: 0.5, ease: 'easeOut' },
};

const SpeedDialContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: 56, height: 56,
  bottom: 16, right: 16,
  background: 'transparent',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    width: 48, height: 48,
  },
  zIndex: 1050,
}));

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute', inset: 0,
  background: 'transparent',
  '& .MuiSpeedDial-fab': {
    width: '100%', height: '100%', minHeight: '100%',
    background: 'transparent',
    boxShadow: 'none',
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

export default function CustomizedSpeedDial({ handleScrollsection }) {
  const [open, setOpen] = useState(false);
  const [subopen, setSubopen] = useState(null);

  const { activesection } = useStateContext();

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
    <SpeedDialContainer>
      <SpeedDial3DCanvas open={open} />
      <StyledSpeedDial
        ariaLabel="speeddial"
        icon={null}
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
    </SpeedDialContainer>
  );
}

const StyledCanvas = styled(Canvas)(({ theme }) => ({
  position: 'absolute',
  bottom: 0, left: 0,
  width: '100%', height: '500%', minHeight: '500%',
  transform: 'translateY(-80%)',
  transformOrigin: 'bottom center',
  contain: 'layout size',
  pointerEvents: 'none',
  backfaceVisibility: 'hidden',
}));

const SpeedDial3DCanvas = memo(function SpeedDial3DCanvas({ open }) {
  return (
    <StyledCanvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      style={{ pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <Suspense fallback={null}>
        <CanvasContent isOpen={open} />
      </Suspense>
    </StyledCanvas>
  );
});

const MarbleMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uDistortionScale: 9.5,
    uSpeed: 0.3,
    uSeed: Math.random() * 1000.0,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDistortionScale;
  uniform float uSeed;
  uniform float uSpeed;

  // Lightweight 2D Noise for UV distortion
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx) ;
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 n = 1.0 - 3.0 * ( 0.5 * (a0*a0 + h*h) );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float time = uTime * uSpeed;

    vec2 seedOffset = vec2(uSeed * 1.37, uSeed * -0.85);

    float noiseX = snoise(vUv * 2.0 + seedOffset + vec2(time, time * 0.4));
    float noiseY = snoise(vUv * 3.0 - seedOffset - vec2(time * 0.2, time));

    vec2 uvOffset = vec2(noiseX, noiseY) * 0.02 * uDistortionScale;
    
    vec2 distortedUv = fract(vUv + uvOffset);

    vec4 color = texture2D(uTexture, distortedUv);

    float rim = max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float cloudGlow = smoothstep(0.0, 0.5, rim);
    color.a *= cloudGlow;

    if (color.a < 0.01) discard;

    float brightness = 2.0; 
    color.rgb *= brightness;

    gl_FragColor = color;
  }
  `
);
extend({ MarbleMaterial });

const TARGET_FPS = 1 / 30;

const CanvasContent = memo(function CanvasContent({ isOpen }) {
  const groupRef = useRef();
  const marbleMaterialRef = useRef();
  const shaderTimeRef = useRef(0);
  const accumulator = useRef(0);

  const marbelTexture = useTexture(speeddialmain);
  useEffect(() => {
    if (marbelTexture) {
      marbelTexture.anisotropy = 8;
    }
  }, [marbelTexture]);

  useFrame((state, delta) => {
    if (!isOpen) return;
    accumulator.current += delta;
    if (accumulator.current < TARGET_FPS) return;

    const t = state.clock.getElapsedTime();
    shaderTimeRef.current += delta;

    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.8;
      groupRef.current.rotation.x -= delta * 0.4;
    }
    if (marbleMaterialRef.current) {
      marbleMaterialRef.current.uTime = shaderTimeRef.current;
    }

    accumulator.current %= TARGET_FPS;
  });


  return (
    <group >
      <mesh ref={groupRef} position={[0, -1.1, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <marbleMaterial
          ref={marbleMaterialRef}
          uTexture={marbelTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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