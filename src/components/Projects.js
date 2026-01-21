import React, { useState, useRef, useLayoutEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import marketintelligence from '../pics/marketintelligence.png';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Pagination from '@mui/material/Pagination';
import { delay, motion } from "motion/react";
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';
import Tooltip from '@mui/material/Tooltip';


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

const GridContainer = styled(Grid)(({ theme }) => ({
  width: '100%', padding: '2px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  perspective: '1000px',
  position: 'relative',
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '15px',
  overflow: 'hidden',
  '& .MuiPaper-root': {
    border: `none`,
  },
  transform: "translateZ(60px)",
  transformStyle: "preserve-3d",
}));

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

export default function Projects({ refProps, handleViewport }) {
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));
  const lesserThanSm = useMediaQuery(theme.breakpoints.down('sm'));
  const smheight = useMediaQuery('(max-height:600px)');

  const header = '70px';

  const cardh = smheight ? 350 : 450;
  const wh = window?.innerHeight;
  const padbot = (wh - parseInt(header, 10) - cardh) / 3;

  const perpage = lesserThanSm ? 1
    : lesserThanMd
      ? 2 : 3;
  const maxpage = Math.ceil(projectInfo.length / perpage);

  const hoverdistance = 20;

  const handlePageChange = (e, v) => {
    setPage(v);
  }

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

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
        pb: `${padbot}px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          width: '100%', //height: 'auto'
        }}>
        <GridContainer container key={page} spacing={2}
          layout
          component={motion.div}
          variants={containerVars}
          initial="hidden"
          whileInView={mode == 'normal' ? "visible" : "static"}
          viewport={{ once: false, amount: 0.5 }}
        >
          {projectInfo.slice((page - 1) * perpage, page * perpage).map((v, i) => (
            <StyledGridItem item size={{ xs: 12, sm: 6, md: 4 }} key={i}
              component={motion.div}
              variants={itemVars}
              sx={{
                height: `calc(${cardh}px + 50px)`,
                isolation: 'isolate',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
              }}
            >
              <ProjectCard v={v} cardh={cardh} />
            </StyledGridItem>
          ))}
        </GridContainer>
        <Pagination count={maxpage} page={page} onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', }} />
      </Box>
    </Container >
  );
}

const cardVars = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut", type: "spring", stiffness: 160, damping: 20 }
  },
  static: {
    opacity: 1, scale: 1, x: 0, y: 0,
    transition: { duration: 0 }
  }
};

const bloomVars = {
  initial: {
    opacity: 0, scale: 1, y: 0,
    "--inner": "0%", "--outer": "0%",
  },
  hover: {
    opacity: 1, scale: 1, y: -8,
    "--inner": ["0%", "0%", "100%"],
    "--outer": ["0%", "100%", "100%"],
    transition: {
      duration: 1,
      times: [0, 0.5, 0.85]
    }
  },
  static: {
    opacity: 1, scale: 1, x: 0, y: 0,
    "--inner": ["0%", "0%", "100%"],
    "--outer": ["0%", "100%", "100%"],
    transition: { duration: 0 }
  }
};

const shadowVars = {
  initial: {
    opacity: 0, scale: 1, y: 0,
  },
  hover: {
    opacity: 1, scale: 1, y: -8,
    transition: {
      delay: 0.35,
      duration: 0.35,
    }
  },
  static: {
    opacity: 1, scale: 1, x: 0, y: 0,
    transition: { duration: 0 }
  }
};

const CardContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '95%', //height: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'inherit',
}));

const Bloombackground = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  backgroundColor: (theme.vars || theme).palette.primary.light,
  maskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  WebkitMaskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  zIndex: 0,
  willChange: "transform, opacity",
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.primary.main,
  }),
}));

const Shadowbackground = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  boxShadow: `0 0 10px 5px ${(theme.vars || theme).palette.primary.main}`,
  backgroundColor: 'transparent',
  zIndex: 0,
  willChange: "transform, opacity",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'auto',
  borderRadius: 'inherit',
  background: `rgba(${(theme.vars || theme).palette.background.defaultChannel}/0.1)`,
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  '&.MuiPaper-root': {
    background: 'transparent',
  },
}));

function ProjectCard({ v, cardh }) {

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  return (
    <CardContainer
      component={motion.div}
      initial="initial"
      whileHover={mode == 'normal' ? "hover" : "static"}
      sx={{ height: cardh }}
    >
      <Bloombackground
        component={motion.div}
        variants={bloomVars}
      />
      <Shadowbackground
        component={motion.div}
        variants={shadowVars}
      />
      <StyledCard
        component={motion.div}
        variants={cardVars}
        sx={{ height: cardh }}
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
          <CardHeader sx={{ p: '4px 0 0 8px', }}
            title={v.header}
            slotProps={{
              title: {
                style: {
                  fontFamily: 'Instrument Serif',
                  fontSize: '20px',
                },
              },
            }}
          />
          <List>
            {v.description.map((v, i) => (
              <ListItem disablePadding sx={{ alignItems: 'start', }}>
                <ArrowRightIcon sx={{ mt: '5px' }} /><ListItemText primary={v}
                  slotProps={{
                    primary: {
                      style: {
                        fontFamily: 'Instrument Sans',
                        fontSize: '16px',
                      },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardActionArea>
      </StyledCard>
    </CardContainer>
  )
}