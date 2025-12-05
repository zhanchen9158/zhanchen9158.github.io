import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

export default function ScrollTop(props) {
    const { children, showscrolltop } = props;

    return (
        <Box
            sx={{
                position: 'fixed', bottom: 16, right: 16,
                willChange: 'transition, opacity',
                transform: showscrolltop ? 'scale(1)' : 'scale(0)',
                opacity: showscrolltop ? '1.0' : '0',
                transition: 'opacity 1s linear',
            }}
        >
            {children}
        </Box>
    );
}