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

  const handlePageChange = (e, v) => {
    setPage(v);
  }

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
        }}>
        <Pagination count={maxpage} page={page} onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', }} />
        <Grid container spacing={2}>
          {projectInfo.slice((page - 1) * perpage, page * perpage).map((v, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}
              sx={(theme) => ({
                marginBottom: { xs: 1, md: 2 },
                '& .MuiPaper-root': {
                  background: (theme.vars || theme).palette.background.projcard,
                },
              })}
            >
              <Card
                variant="outlined"
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
                <CardActionArea href={v.link} target="_blank">
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
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container >
  );
}
