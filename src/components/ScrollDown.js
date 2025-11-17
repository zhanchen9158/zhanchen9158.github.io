import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledBox = styled(Box)(({ theme }) => ({
    '& #mouse-btn': {
        margin: '10px auto',
        width: '40px',
        height: '80px',
        border: `3px solid ${(theme.vars || theme).palette.primary.contrast}`,
        borderRadius: '20px',
        display: 'flex',
    },
    '& #mouse-scroll': {
        display: 'block',
        width: '20px',
        height: '20px',
        background: `linear-gradient(170deg, ${(theme.vars || theme).palette.primary.contrast}, ${(theme.vars || theme).palette.primary.contrast})`,
        borderRadius: '50%',
        margin: 'auto',
        animation: 'scrolling13 1s linear infinite',
    },
    '@keyframes scrolling13': {
        '0%': {
            opacity: 0,
            transform: 'translateY(-20px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(20px)',
        },
    },
}));

export default function ScrollDown() {
    return (
        <StyledBox>
            <span id="mouse-btn">
                <span id="mouse-scroll"></span>
            </span>
            <span>Scroll Down</span>
        </StyledBox>
    );
}