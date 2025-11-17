import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    height: '80%',
    '& #loader': {
        display: 'block',
        position: 'relative',
        left: '50%',
        top: '50%',
        width: '150px',
        height: '150px',
        margin: '-75px 0 0 -75px',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#9370DB',
        WebkitAnimation: 'spin 2s linear infinite',
        animation: 'spin 2s linear infinite',
    },
    '& #loader:before': {
        content: '""',
        position: 'absolute',
        top: '5px',
        left: '5px',
        right: '5px',
        bottom: '5px',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#BA55D3',
        WebkitAnimation: 'spin 3s linear infinite',
        animation: 'spin 3s linear infinite',
    },
    '& #loader:after': {
        content: '""',
        position: 'absolute',
        top: '15px',
        left: '15px',
        right: '15px',
        bottom: '15px',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#FF00FF',
        WebkitAnimation: 'spin 1.5s linear infinite',
        animation: 'spin 1.5s linear infinite',
    },
    '@-webkit-keyframes spin': {
        '0%': {
            WebkitTransform: 'rotate(0deg)',
            msTransform: 'rotate(0deg)',
            transform: 'rotate(0deg)',
        },
        '100%': {
            WebkitTransform: 'rotate(360deg)',
            msTransform: 'rotate(360deg)',
            transform: 'rotate(360deg)',
        },
    },
    '@keyframes spin': {
        '0%': {
            WebkitTransform: 'rotate(0deg)',
            msTransform: 'rotate(0deg)',
            transform: 'rotate(0deg)',
        },
        '100%': {
            WebkitTransform: 'rotate(360deg)',
            msTransform: 'rotate(360deg)',
            transform: 'rotate(360deg)',
        },
    },
}));

export default function SplashScreen() {
    return (
        <Box sx={(theme) => ({
            backgroundColor: `${(theme.vars || theme).palette.background.default}`,
            width: '100dvw',
            height: '100dvh',
        })}>
            <StyledBox>
                <div id="loader"></div>
            </StyledBox>
        </Box>
    );
}