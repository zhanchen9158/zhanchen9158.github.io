import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import getActivesection from '../functions/getActivesection';
import { motion, AnimatePresence } from 'framer-motion';


const StyledButton = styled(IconButton)(({ theme }) => ({
  background: (theme.vars || theme).palette.text.primary,
  color: (theme.vars || theme).palette.background.default,
  alignSelf: 'flex-start',
  ...theme.applyStyles('dark', {
    background: (theme.vars || theme).palette.text.primary,
  }),
  '&:hover': {
    background: (theme.vars || theme).palette.text.secondary,
  },
}));

const footVars = {
  hidden: {
    opacity: 0, x: -50,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
  slide: {
    opacity: 1, x: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

export default function Footer({ activesection }) {

  const section = getActivesection(activesection);

  return (
    <AnimatePresence>
      {section == 'introduction' && (
        <Box
          component={motion.div}
          variants={footVars}
          initial='hidden'
          animate='slide'
          exit='hidden'
          sx={{
            pb: { xs: 1, md: 2 },
            pl: { xs: 1, md: 2 },
            display: 'flex',
            position: 'fixed',
            left: 0,
            bottom: 0,
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <StyledButton
              size="small"
              href="https://github.com/zhanchen9158/zhanchen9158.github.io"
              target='_blank'
              aria-label="GitHub"
            >
              <GitHubIcon />
            </StyledButton>
            <div>
              <Copyright />
            </div>
          </Stack>
        </Box>
      )}
    </AnimatePresence>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary">
        Portfolio
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}