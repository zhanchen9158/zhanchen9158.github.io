import React from 'react';
import Box from '@mui/material/Box';

const SvgSplitColor = ({ color = 'rgba(255, 255, 255, 1)', ...props }) => {
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
                ...props
            }}
        >
            <defs>
                <radialGradient id="leftSpotlight" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>
            </defs>

            <ellipse
                cx="0" cy="0" rx="400" ry="450"
                fill={color}
                transform="rotate(-10, 0, 0)"
            />

            <ellipse
                cx="0" cy="0" rx="400" ry="450"
                fill="url(#leftSpotlight)"
                transform="rotate(-10, 0, 0)"
            />
        </Box>
    );
};

export default SvgSplitColor;