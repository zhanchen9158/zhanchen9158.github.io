import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Typography from '@mui/material/Typography';
import StyledButton from './StyledButton';

const StyledAppbar = styled(AppBar)(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backdropFilter: 'blur(24px)',
  backgroundColor: 'transparent',
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  backgroundColor: 'transparent',
  padding: '8px 12px',
  fontWeight: 'bold',
  "& .MuiButton-text": {
    fontVariant: 'small-caps',
    fontSize: 20,
    fontFamily: 'Francois One',
  },
}));

export default function AppAppBar({ scrollCallback, appbarshow }) {
  const [open, setOpen] = useState(false);

  const DrawerOn = () => {
    setOpen(true);
  };

  const DrawerOff = () => {
    setOpen(false);
  };

  return (
    <StyledAppbar
      position="fixed"
      enableColorOnDark
      sx={{
        top: appbarshow ? 0 : '-20vh',
        transition: '1s ease 0.10s',
      }}
    >
      <Container maxWidth="false">
        <StyledToolbar
          variant="dense"
          disableGutters
          sx={{
            willChange: 'transition, opacity',
            opacity: appbarshow ? '1.0' : '0',
            transition: '1s linear 0.5s',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontFamily: 'Bebas Neue',
              flexGrow: 1, display: { xs: 'none', sm: 'block' }
            }}
          >
            ZC
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <StyledButton onClick={() => scrollCallback('projects')} variant="text" color="info" size="small">
                Projects
              </StyledButton>
              <StyledButton onClick={() => scrollCallback('projecthighlights')} variant="text" color="info" size="small">
                Project Highlights
              </StyledButton>
              <StyledButton onClick={() => scrollCallback('certifications')} variant="text" color="info" size="small">
                Certifications
              </StyledButton>
            </Box>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            gap: 1,
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton aria-label="Menu button" onClick={DrawerOn}>
              <MenuIcon />
            </IconButton>
            <ColorModeIconDropdown size="medium" />
            <Drawer
              anchor="top"
              open={open}
              onClose={DrawerOff}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={DrawerOff}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => {
                  scrollCallback('projecthighlights');
                  DrawerOff();
                }}>
                  Project Highlights
                </MenuItem>
                <MenuItem onClick={() => {
                  scrollCallback('projects');
                  DrawerOff();
                }}>
                  Projects
                </MenuItem>
                <MenuItem onClick={() => {
                  scrollCallback('certifications');
                  DrawerOff();
                }}>
                  Certifications
                </MenuItem>
                <Divider sx={{ my: 3 }} />
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </StyledAppbar >
  );
}
