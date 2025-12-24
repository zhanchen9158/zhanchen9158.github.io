import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const base = 0.6;

const StyledBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    width: '100%',
    '& .chevron': {
        position: 'absolute',
        width: `${base * 3.5}rem`,
        height: `${base * 0.8}rem`,
        opacity: 0,
        transform: 'scale(0.3)',
        animation: 'move-chevron 3s ease-out infinite',
    },
    '& .chevron:first-child': {
        animation: 'move-chevron 3s ease-out 1s infinite',
    },
    '& .chevron:nth-child(2)': {
        animation: 'move-chevron 3s ease-out 2s infinite',
    },
    '& .chevron::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '50%',
        background: (theme.vars || theme).palette.text.primary,
        left: 0,
        transform: 'skewY(30deg)',
    },
    '& .chevron::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '50%',
        background: (theme.vars || theme).palette.text.primary,
        right: 0,
        width: '50%',
        transform: 'skewY(-30deg)',
    },
    '@keyframes move-chevron': {
        '25%': {
            opacity: 1,
        },
        '33.3%': {
            opacity: 1,
            transform: `translateY(${base * 3.8}rem)`,
        },
        '66.6%': {
            opacity: 1,
            transform: `translateY(${base * 5.2}rem)`,
        },
        '100%': {
            opacity: 0,
            transform: `translateY(${base * 8}rem) scale(0.5)`,
        },
    },
}));

export default function ScrollDown({ ...props }) {
    return (
        <StyledBox id='scrolldown' {...props}>
            <div class="chevron"></div>
            <div class="chevron"></div>
            <div class="chevron"></div>
        </StyledBox>
    );
}