import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
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
        pt: { xs: 8, md: 0 },
        pb: { xs: 2, md: 8 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, md: 6 },
        height: '100dvh',
      }}
    >
      <Pagination count={maxpage} page={page} onChange={handlePageChange} />
      <Grid container spacing={2}
        sx={{
          width: '100%',
          height: { xs: '90%', md: '50%' },
          justifyContent:'center',
        }}>
        {projectInfo.slice((page - 1) * perpage, page * perpage).map((v, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}
            sx={(theme) => ({
              display: 'flex',
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
                flexGrow: 1,
                //width: '100%',
                padding: { xs: 1, md: 2 },
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
                    <ListItem disablePadding sx={{ alignItems: 'start' }}>
                      <ArrowRightIcon sx={{ mt: '5px' }} /><ListItemText primary={v} />
                    </ListItem>
                  ))}
                </List>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
