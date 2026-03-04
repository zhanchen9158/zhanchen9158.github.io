import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';


const MotionBox = motion(Box);

const GlassOverlay = styled(Box)(({ theme, opacity = 1 }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',

    background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.05))',
    border: '1px solid rgba(255, 255, 255, 1)',
    boxShadow: 'inset 0 0 5px rgba(255, 255, 255, 0.25)',
    opacity: opacity,
    backfaceVisibility: "hidden",
}));

const BevelGlassOverlay = styled(Box)(({ theme, opacity = 1, depth = 1 }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',

    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `
      inset 0 ${depth}px ${depth}px rgba(255, 255, 255, 0.5), 
      inset 0 -${depth}px ${depth}px rgba(0, 0, 0, 0.15),
      0 ${2 * depth}px ${4 * depth}px rgba(0, 0, 0, 0.15)
    `,
    opacity: opacity,
    zIndex: 10,
    backfaceVisibility: "hidden",
}));

const BorderSheen = styled(MotionBox)(({ theme, border = 1.5 }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    padding: `${border}px`,
    background: 'linear-gradient(to bottom right, rgba(255,255,255,1), rgba(255,255,255,0) 40%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    backfaceVisibility: "hidden",
}));

export default GlassOverlay;
export { BevelGlassOverlay, BorderSheen };