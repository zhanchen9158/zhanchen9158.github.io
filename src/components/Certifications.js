import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import AWSIcon from '../icons/aws.svg';
import MicrosoftIcon from '../icons/microsoft.svg';
import FreecodecampIcon from '../icons/freecodecamp.svg';
import ExpandableList from './ExpandableList';

const items = [
  {
    icon: AWSIcon,
    title: 'Amazon Web Services Certified Solutions Architect - Associate',
    description: [
      'Identify and design ideal cloud solutions that incorporate AWS services to meet current and future business requirements.',
      'Design architectures with secure accesses and appropriate data security controls.',
      'Design architectures that are scalable, highly-available, and fault-tolerant.',
      'Design architectures with appropriate services and configurations that meet performance demands.',
      'Design cost-optimized architecturs.',
    ],
  },
  {
    icon: MicrosoftIcon,
    title: 'Foundational C# with Microsoft',
    description: [
      'Thorough foundational knowledge of the core concepts, syntax, data structures, and algorithms of C#.',
      'Identify and structure code solutions based on reusable and maintainability principles.',
      'Create applications that adhere to exception handling principles.',
      'Troubleshoot applications through the use of debugging processes and Visual Studio Code debugger.',
    ],
  },
  {
    icon: FreecodecampIcon,
    title: 'Responsive Web Design Developer',
    description: [
      'Thorough foundational knowledge in HTML, CSS, and responsive web design.',
      'Create responsive and adaptive websites.',
      'Implement advanced CSS techniques for website layout and design.',
    ],
  },
];

export default function Certifications({ refProps }) {
  return (
    <Box
      ref={el => refProps.current = { ...refProps.current, certifications: el }}
      id="certifications"
      sx={{
        pt: { xs: 4, md: 12 },
        pb: { xs: 8, md: 16 },
        color: 'white',
        bgcolor: 'grey.900',
        maxWidth: { lg: '100%' },
        backgroundColor: 'transparent',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 0, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Certifications
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Stack direction="row" spacing={1} >
                  <Icon
                    sx={{
                      opacity: '100%',
                      height: 48,
                      width: 48,
                    }}>
                    <img style={{ width: '100%', height: '100%' }} src={item.icon} />
                  </Icon>
                  <Typography gutterBottom
                    sx={{
                      display: 'flex',
                      width: '100%',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Francois One',
                      fontSize: { sm: 14, md: 16 },
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'grey.400', }}>
                  {item.description.map((item, index) => (
                    <ExpandableList key={index} text={item} />
                  ))}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
