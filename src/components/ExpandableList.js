import React, { useState } from 'react';
import Box from '@mui/material/Box';

export default function ExpandableList(props) {
    const { key, text } = props;
    const [open, setOpen] = useState(false);

    const toggleList = () => {
        setOpen((prev) => !prev);
    };

    return (
        <li key={key} onMouseOver={() => setOpen(true)} 
            style={{
                cursor: 'pointer',
                textOverflow: 'ellipsis',
                listStylePosition: open ? 'outside' : 'inside',
                overflow: open ? '' : 'hidden',
                whiteSpace: open ? '' : 'nowrap',
                color: open ? 'white' : 'inherit',
                textShadow: open ? 'white 0px 0px 1px' : '',
            }}
        >
            {text}
        </li>
    );
}