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
    willChange: 'transform',
    backfaceVisibility: "hidden",
}));

const BevelGlassOverlay = styled(Box)(({ theme, opacity = 1 }) => ({
    position: 'absolute', inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',

    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `
      inset 0 1px 1px rgba(255, 255, 255, 0.5), 
      inset 0 -1px 1px rgba(0, 0, 0, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.15)
    `,
    opacity: opacity,
    willChange: 'transform',
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
    willChange: 'transform',
    backfaceVisibility: "hidden",
}));

export default GlassOverlay;
export { BevelGlassOverlay, BorderSheen };