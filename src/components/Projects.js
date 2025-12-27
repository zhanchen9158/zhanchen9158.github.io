import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import marketintelligence from '../pics/marketintelligence1.png';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Pagination from '@mui/material/Pagination';
import { motion } from "framer-motion";
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';
import Tooltip from '@mui/material/Tooltip';


const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: '15px',
  '& .MuiPaper-root': {
    background: `rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1)`,
    backdropFilter: 'blur(12px)',
    borderRadius: '15px',
    border: `none`,
    padding: '15px',
    '&:hover': {
      //background: `linear-gradient(rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1), rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1)) padding-box, ${(theme.vars || theme).palette.background.projcard} border-box`,
    },
  },
}));

const projectInfo = [
  {
    img: marketintelligence,
    header: 'Market Intelligence',
    description: [
      'Full-stack financial analytics application that ingests real-time market data to forecast trends.',
      'Predictive AI model trained using PyTorch, achieving less than 10% Multivariate Quantile function forecaster loss, leading to well-calibrated and narrow predicted probabilities of trends.',
    ],
    link: 'https://marketintelligence0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: researchdigest,
    header: 'Research Digest',
    description: [
      'Knowledge retrieval portal for searching scientific literature.',
      'Client-side Retrieval-Augmented Generation-based real-time Question Answering of papers.',
      'Optimized performances using multi-threading to offload heavy model inference computations, preserving UI responsiveness.',
    ],
    link: 'https://researchdigest0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: mealplanner,
    header: 'Meal Planner',
    description: [
      'Elastically scalable meal planning solution utilizing AWS cloud infrastructure, aggregating data sources to provide a holistic user experience for recipe and nutritional retrieval.',
      'Quantized, web-based Grouped-Query Attention Transformer to deliver a low-latency, stateful chat-driven interface for recipe and nutritional retrieval.'
    ],
    link: 'https://mealplanner0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: artexplorer,
    header: 'Art Explorer',
    description: [
      'Artwork search engine presenting information on artists, art descriptions, and comprehensive historical details.',
    ],
    link: 'https://artexplorer0.s3.us-east-2.amazonaws.com/index.html'
  },
];

export default function Projects({ refProps, handleViewport }) {
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));
  const smheight = useMediaQuery('(max-height:600px)');


  const header = '70px';

  const perpage = lesserThanMd ? 1 : 3;
  const maxpage = Math.ceil(projectInfo.length / perpage);

  const hoverdistance = 20;

  const handlePageChange = (e, v) => {
    setPage(v);
  }

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const containerVars = {
    hidden: { opacity: 0, scale: 1, y: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        staggerChildren: 0.35,
      },
    },
    static: { opacity: 1, scale: 1, y: 0, transition: { duration: 0 } },
  };

  const itemVars = {
    hidden: {
      opacity: 0,
      scale: 1,
      y: 20,
      clipPath: "inset(100% 0% 0% 0%)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      }
    },
    static: { opacity: 1, scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0 } },
  };

  const cardVars = {
    hover: {
      scale: 1.02,
      y: -8,
      boxShadow: `0 20px 25px -5px rgba(${(theme.vars || theme).palette.text.primaryChannel}/0.1), 0 10px 10px -5px rgba(${(theme.vars || theme).palette.text.primaryChannel}/0.04)`,
      zIndex: 1200,
      transition: { type: "spring", stiffness: 160, damping: 20 }
    },
  };

  return (
    <Container
      component={motion.div}
      ref={el => refProps.current['projects'] = el}
      onViewportEnter={() => handleViewport('projects', true)}
      onViewportLeave={() => handleViewport('projects', false)}
      viewport={{ amount: 0.5 }}
      id="projects"
      maxWidth="lg"
      sx={{
        position: 'fixed',
        marginTop: header,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, md: 3 },
        height: `calc(100dvh - ${header})`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          width: '100%',
        }}>
        <Grid container spacing={0} key={page}
          component={motion.div}
          variants={containerVars}
          initial="hidden"
          whileInView={mode == 'normal' ? "visible" : "static"}
          viewport={{ once: false, amount: 0.5 }}
          sx={{ width: '100%', padding: '2px' }}
        >
          {projectInfo.slice((page - 1) * perpage, page * perpage).map((v, i) => (
            <StyledGridItem item size={{ xs: 12, sm: 6, md: 4 }} key={i}
              component={motion.div}
              layout
              variants={itemVars}
            >
              <Tooltip title='Visit Site' placement='top'>
                <Card
                  variant="outlined"
                  component={motion.div}
                  variants={cardVars}
                  whileHover={'hover'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: { xs: 1, md: 2 },
                    width: '100%',
                    height: 450,
                    '@media (max-height: 600px)': {
                      height: 350,
                    },
                    overflow: 'auto',
                  }}
                >
                  <CardActionArea href={v.link} target="_blank"
                    disableRipple
                    sx={{
                      "& .MuiCardActionArea-focusHighlight": {
                        background: "transparent",
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="150"
                      image={v.img}
                      sx={{ objectFit: "contain" }}
                    />
                    <CardHeader sx={{ p: '4px 0 0 8px' }}
                      title={v.header}
                    />
                    <List>
                      {v.description.map((v, i) => (
                        <ListItem disablePadding sx={{ alignItems: 'start', }}>
                          <ArrowRightIcon sx={{ mt: '5px' }} /><ListItemText primary={v} />
                        </ListItem>
                      ))}
                    </List>
                  </CardActionArea>
                </Card>
              </Tooltip>
            </StyledGridItem>
          ))}
        </Grid>
        <Pagination count={maxpage} page={page} onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', }} />
      </Box>
    </Container >
  );
}
