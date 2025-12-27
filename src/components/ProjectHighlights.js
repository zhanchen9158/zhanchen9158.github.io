import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from "framer-motion";
import { useAnimateContext } from './AnimateContext';

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

const ImgCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  width: '100%',
  pointerEvents: 'none',
  backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel} / 0.1)`,
  border: 'none',
  padding: 0,
}));

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

export default function ProjectHighlights({ refProps, handleViewport }) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const header = '70px';

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container
      component={motion.div}
      ref={el => refProps.current['highlights'] = el}
      onViewportEnter={() => handleViewport('highlights', true)}
      onViewportLeave={() => handleViewport('highlights', false)}
      viewport={{ amount: 0.5 }}
      id="highlights"
      maxWidth="lg"
      sx={{
        position: 'fixed',
        marginTop: header,
        display: 'flex',
        justifyContent: 'center',
        alignItems: { xs: 'flex-start', md: 'center' },
        height: `calc(100dvh - ${header})`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {lesserThanMd &&
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        }
        {!lesserThanMd &&
          <React.Fragment>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, lg: 2 },
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
                  </Box>
                </Box>
              ))}
            </Box>
            <ImgCard
              sx={{
                height: 500,
              }}
            >
              <AnimatedBorder key={items[selectedItemIndex].title} />
              <img
                src={items[selectedItemIndex].image ?? ''}
                loading='lazy'
                style={{
                  m: 'auto',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </ImgCard>
          </React.Fragment>
        }
      </Box>
    </Container>
  );
}

export function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {

  const imgwidth = document.querySelector('#mobileprojimg')?.width;
  const imgheight = selectedFeature.image?.height * (imgwidth / selectedFeature.image?.width);

  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      id="projecthighlights"
      sx={{
        display: 'flex',
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
      <ImgCard
        id='mobileprojimg'
        sx={{
          height: imgheight ?? 200,
        }}
      >
        <AnimatedBorder key={items[selectedItemIndex].title} />
        <img
          src={selectedFeature.image ?? ''}
          loading='lazy'
          style={{
            m: 'auto',
            width: '100%',
            height: '100%',
          }}
        />
      </ImgCard>
    </Box>
  );
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.35, ease: "easeInOut" }
  },
  static: { pathLength: 1, opacity: 1, }
};

function AnimatedBorder({ key }) {

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  return (
    <svg
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id="img-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00dbde" />
          <stop offset="100%" stopColor="#fc00ff" />
        </linearGradient>
      </defs>
      <motion.rect
        key={key}
        width="100%"
        height="100%"
        rx="12"
        stroke="url(#img-gradient)"
        strokeWidth="5"
        fill="transparent"
        variants={draw}
        initial="hidden"
        whileInView={mode == 'normal' ? "visible" : "static"}
        viewport={{ once: false, amount: 0.5 }}
      />
    </svg>
  );
};