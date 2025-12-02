import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useColorScheme } from '@mui/material/styles';
import stockinsight from '../pics/stockinsight.png';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


const projectInfo = [
  {
    img: stockinsight,
    header: 'Stock Insight',
    description: [
      'Full-stack financial analytics application that ingests real-time market data to forecast trends.',
      'Predictive AI model trained using PyTorch, achieving less than 10% Multivariate Quantile function forecaster loss, leading to well-calibrated and narrow predicted probabilities of trends.',
    ],
    link: 'https://stockinsight0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: researchdigest,
    header: 'Research Surveyor',
    description: [
      'Knowledge retrieval portal for searching academic papers.',
      'Client-side inferencing by leveraging a web-based Transformer model for real-time Question-and-Answering of papers.',
      'Optimized performances using multi-threading to offload heavy model inference computations, preserving UI responsiveness on the main execution thread.',
    ],
    link: 'https://researchdigest0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: mealplanner,
    header: 'Meal Planner',
    description: [
      'Elastically scalable meal planning solution utilizing AWS cloud infrastructure, aggregating data sources to provide a holistic user experience for recipe and nutritional retrieval.',
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

export default function Projects({ refProps }) {
  const { mode, systemMode } = useColorScheme();
  /*
    let logos;
    if (mode === 'system') {
      if (systemMode === 'light') {
        logos = lightModeLogos;
      } else {
        logos = darkModeLogos;
      }
    } else if (mode === 'light') {
      logos = lightModeLogos;
    } else {
      logos = darkModeLogos;
    }
  */
  return (
    <Container
      ref={el => refProps.current = { ...refProps.current, projects: el }}
      id="projects"
      maxWidth="lg"
      sx={{
        pt:8,
        pb: 8,
        position: 'relative',
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        alignItems: 'center',
        gap: { xs: 3, md: 6 },
        minHeight: '100dvh',
      }}
    >
      <Box
        sx={{
          margin: 'auto',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Projects
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {projectInfo.map((info, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}
            sx={(theme) => ({
              display: 'flex',
              //backgroundColor: `${(theme.vars || theme).palette.background.default}`,
              '& .MuiPaper-root': {
                backgroundColor: `rgba(${(theme.vars || theme).palette.background.defaultChannel} / 0.75)`,
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
              }}
            >
              <CardActionArea href={info.link} target="_blank">
                <CardMedia
                  component="img"
                  height="150"
                  image={info.img}
                  sx={{ objectFit: "contain" }}
                />
                <CardHeader sx={{ p: '4px 0 0 8px' }}
                  title={info.header}
                />
                <List>
                  {info.description.map((v, i) => (
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
