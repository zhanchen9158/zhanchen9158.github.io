import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, AnimatePresence } from "framer-motion";
import { useAnimateContext } from './AnimateContext';
import ParticleBackground from './ParticleBackground';
import AnimatedBorder from './AnimatedBorder';

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
    id: 1,
    icon: <AreaChartIcon />,
    title: 'Multivariate Quantile function based Forecasting',
    description:
      '',
    image: marketintelligence,
    size: 'large', color: '#1976d2'
  },
  {
    id: 2,
    icon: <QueryStatsIcon />,
    title: 'Financial Data Visualization',
    description:
      '',
    image: marketintelligence1,
    size: 'small', color: '#9c27b0'
  },
  {
    id: 3,
    icon: <NewspaperIcon />,
    title: 'Technical Analysis Platform',
    description:
      '',
    image: marketintelligence2,
    size: 'small', color: '#2e7d32'
  },
  {
    id: 4,
    icon: <TroubleshootIcon />,
    title: 'Financial Quote Retrieval',
    description:
      '',
    image: marketintelligence3,
    size: 'medium', color: '#ed6c02'
  },
];

const ImgCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  width: '100%',
  pointerEvents: 'none',
  border: 'none',
  padding: 0,
  borderRadius: '12px',
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  pointerEvents: 'none',
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.4)`,
  }),
}));

export default function ProjectHighlights({ refProps, handleViewport }) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const smheight = useMediaQuery('(max-height:600px)');

  const header = '70px';

  const selectedFeature = items[selectedItemIndex];

  const imgwidth = document.querySelector('#projimg')?.width;
  const imgheight = selectedFeature.image?.height * (imgwidth / selectedFeature.image?.width);
  console.log(imgwidth)

  const imgh = smheight ? 400 : 500;
  const wh = window?.innerHeight;
  const padbot = (wh - parseInt(header, 10) - imgh) / 3;

  const theme = useTheme();
  const lesserThanSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

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
        alignItems: 'center',
        height: `calc(100dvh - ${header})`,
        overflow: 'hidden',
        pb: `${padbot}px`,
      }}
    >
      <ParticleBackground />
      <Overlay />
      {lesserThanSm ?
        <MobileLayout
          selectedItemIndex={selectedItemIndex}
          handleItemClick={handleItemClick}
          selectedFeature={selectedFeature}
        />
        :
        <BentoGrid />
      }
    </Container>
  );
}

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

  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
      <ImgCard>
        <AnimatedBorder key={items[selectedItemIndex].title} />
        <img
          src={selectedFeature.image ?? ''}
          loading='lazy'
          style={{
            m: 'auto',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '12px',
          }}
        />
      </ImgCard>
    </Box>
  );
}

const GridContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4), display: 'grid', gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'repeat(2, 200px)',
  gridTemplateAreas: `
        "a a b c"
        "a a d d"
      `
}));

const GridItem = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  padding: theme.spacing(3),
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  color: (theme.vars || theme).palette.text.primary,
}));

const Modal = styled(Box)(({ theme }) => ({
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 10, display: 'flex',
  alignItems: 'center', justifyContent: 'center'
}));

const ModalContent = styled(Box)(({ theme }) => ({
  width: '80%', maxWidth: 600, height: 400,
  borderRadius: theme.spacing(4), padding: theme.spacing(4),
  color: (theme.vars || theme).palette.text.primary,
  display: 'flex', flexDirection: 'column',
  alignItems: 'flex-start', justifyContent: 'center'
}));

function BentoGrid() {
  const [selectedId, setSelectedId] = useState(null);

  const selectedItem = useMemo(() =>
    items.find(i => i.id == selectedId),
    [selectedId]
  );

  const handleItemSelect = (id) => () => {
    setSelectedId(id);
  }

  return (
    <GridContainer>
      {items.map((item, index) => (
        <GridItem
          key={item.id}
          component={motion.div}
          layoutId={item.id}
          onClick={handleItemSelect(item.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 0.98 }}
          sx={{
            gridArea: item.id === 1 ? 'a' : item.id === 2 ? 'b' : item.id === 3 ? 'c' : 'd',
            bgcolor: item.color,
          }}
        >
          {item.id == 1 &&
            <img
              src={item.image ?? ''}
              loading='eager'
              style={{
                m: 'auto',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          }
          <Typography variant="h4" fontWeight="bold">{item.title}</Typography>
        </GridItem>
      ))}

      <AnimatePresence>
        {selectedId && (
          <Modal
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleItemSelect(null)}
          >
            <ModalContent
              component={motion.div}
              layoutId={selectedId}
              sx={{
                bgcolor: selectedItem.color,
              }}
            >
              <Typography variant="h5" fontWeight="bold">{selectedItem.title}</Typography>
              <img
                src={selectedItem.image ?? ''}
                loading='eager'
                style={{
                  m: 'auto',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </GridContainer>
  );
};