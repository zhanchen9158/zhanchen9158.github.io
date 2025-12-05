import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import AreaChartIcon from '@mui/icons-material/AreaChart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import marketintelligence from '../pics/marketintelligence.png';
import marketintelligence1 from '../pics/marketintelligence1.png';
import marketintelligence2 from '../pics/marketintelligence2.png';
import marketintelligence3 from '../pics/marketintelligence3.png';
import { preload } from 'react-dom';

preload(marketintelligence, { as: "image" });
preload(marketintelligence1, { as: "image" });
preload(marketintelligence2, { as: "image" });
preload(marketintelligence3, { as: "image" });


const items = [
  {
    icon: <AreaChartIcon />,
    title: 'Financial Data Visualization',
    description:
      '',
    image: marketintelligence,
  },
  {
    icon: <QueryStatsIcon />,
    title: 'Multivariate Quantile function based Forecasting',
    description:
      '',
    image: marketintelligence1,
  },
  {
    icon: <NewspaperIcon />,
    title: 'Technical Analysis Platform',
    description:
      '',
    image: marketintelligence2,
  },
  {
    icon: <TroubleshootIcon />,
    title: 'Financial Quote Retrieval',
    description:
      '',
    image: marketintelligence3,
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {

  const imgwidth = document.querySelector('#mobileprojimg')?.width;
  const imgheight = selectedFeature.image?.height * (imgwidth / selectedFeature.image?.width);

  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      id="projecthighlights"
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Stack direction='column' gap={1}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Stack>
      <Card variant="outlined">
        <Card
          id='mobileprojimg'
          sx={{
            height: imgheight ?? 200,
            width: '100%',
            pointerEvents: 'none',
          }}
        >
          <img
            src={selectedFeature.image ?? ''}
            loading='lazy'
            style={{
              m: 'auto',
              width: '100%',
              height: '100%',
            }}
          />
        </Card>
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function ProjectHighlights({ refProps }) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container
      ref={el => refProps.current = { ...refProps.current, projecthighlights: el }}
      id="projecthighlights"
      maxWidth="lg"
      sx={{
        pt: 8,
        pb: 8,
        alignItems: 'center',
        minHeight: '100dvh',
      }}
    >
      <Box sx={{
        margin: 'auto',
        width: { sm: '100%', md: '100%' },
        textAlign: { sm: 'left', md: 'center' },
      }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Project Highlights
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Card
          sx={(theme) => ({
            height: items[selectedItemIndex].image?.height ?? 500,
            width: '100%',
            display: { xs: 'none', sm: 'flex' },
            pointerEvents: 'none',
            backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel} / 0.5)`,
          })}
        >
          <img
            src={items[selectedItemIndex].image ?? ''}
            loading='lazy'
            style={{
              m: 'auto',
              width: '100%',
              height: '100%',
            }}
          />
        </Card>
      </Box>
    </Container>
  );
}
