import React from 'react';
import Box from '@mui/material/Box';

const SvgSpotlights = () => {
    return (
        <Box
            component="svg"
            viewBox="0 0 600 400"
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                borderRadius: 'inherit',
                willChange: 'transform, opacity',
                //...props
            }}
        >
            <defs>
                {/* Gradient for the Left Spotlight */}
                <radialGradient id="leftSpotlight" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>

                {/* Gradient for the Right Spotlight */}
                <radialGradient id="rightSpotlight" cx="100%" cy="0%" r="80%" fx="100%" fy="0%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>
            </defs>

            {/* Left Light Beam */}
            <ellipse
                cx="0" cy="0" rx="400" ry="450"
                fill="url(#leftSpotlight)"
                transform="rotate(-10, 0, 0)"
            />

            {/* Right Light Beam */}
            <ellipse
                cx="600" cy="0" rx="400" ry="600"
                fill="url(#rightSpotlight)"
                transform="rotate(10, 800, 0)"
            />
        </Box>
    );
};

export default SvgSpotlights;