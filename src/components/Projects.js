import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useColorScheme } from '@mui/material/styles';
import sudokusolver from '../pics/sodukusolver.png';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.png';


const projectInfo = [
  {
    img: researchdigest,
    header: 'Research Surveyor',
    subheader: 'Research paper provider with query search and web-based AI summarization functionalities.',
    link: 'https://researchdigest0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: mealplanner,
    header: 'Meal Planner',
    subheader: 'Meal planner complete with recipe instructions and nutritional guidelines.',
    link: 'https://mealplanner0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: artexplorer,
    header: 'Art Explorer',
    subheader: 'Artwork search engine presenting information on artists, art descriptions, and comprehensive historical details.',
    link: 'https://artexplorer0.s3.us-east-2.amazonaws.com/index.html'
  },
  {
    img: sudokusolver,
    header: 'Sudoku Solver',
    subheader: 'Sudoku solver hosted on AWS.',
    link: 'https://sudokusolver-0.s3.us-east-2.amazonaws.com/index.html',
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
        pt: { xs: 4, md: 12 },
        pb: { xs: 8, md: 16 },
        position: 'relative',
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        alignItems: 'center',
        gap: { xs: 3, md: 6 },
        height: { sm: '80vh', md: '90vh' },
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardHeader
                    title={info.header}
                    subheader={info.subheader}
                  />
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
