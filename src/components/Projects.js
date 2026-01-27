import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import marketintelligence from '../pics/marketintelligence.png';
import artexplorer from '../pics/artexplorer.png';
import researchdigest from '../pics/researchdigest.png';
import mealplanner from '../pics/mealplanner.png';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Pagination from '@mui/material/Pagination';
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAnimateContext } from './AnimateContext';


const projectInfo = [
  {
    img: marketintelligence,
    header: 'Market Intelligence',
    descriptions: [
      'Full-stack financial analytics application that ingests real-time market data to forecast trends.',
      'Predictive AI model trained using PyTorch, achieving less than 10% Multivariate Quantile function forecaster loss, leading to well-calibrated and narrow predicted probabilities of trends.',
    ],
    link: 'https://marketintelligence0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: researchdigest,
    header: 'Research Digest',
    descriptions: [
      'Knowledge retrieval portal for searching scientific literature.',
      'Client-side Retrieval-Augmented Generation-based real-time Question Answering of papers.',
      'Optimized performances using multi-threading to offload heavy model inference computations, preserving UI responsiveness.',
    ],
    link: 'https://researchdigest0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: mealplanner,
    header: 'Meal Planner',
    descriptions: [
      'Elastically scalable meal planning solution utilizing AWS cloud infrastructure, aggregating data sources to provide a holistic user experience for recipe and nutritional retrieval.',
      'Quantized, web-based Grouped-Query Attention Transformer to deliver a low-latency, stateful chat-driven interface for recipe and nutritional retrieval.'
    ],
    link: 'https://mealplanner0.s3.us-east-2.amazonaws.com/index.html',
  },
  {
    img: artexplorer,
    header: 'Art Explorer',
    descriptions: [
      'Artwork search engine presenting information on artists, art descriptions, and comprehensive historical details.',
    ],
    link: 'https://artexplorer0.s3.us-east-2.amazonaws.com/index.html'
  },
];

const MotionContainer = motion(Container);
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const header = '70px';

const SectionContainer = styled(MotionContainer)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: `100dvh`,
  overflow: 'hidden',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1),
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%', //height: 'auto'
  gap: theme.spacing(1),
}));

export default function Projects({ refProps, handleViewport }) {
  const [page, setPage] = useState(1);
  const [hoveredProj, setHoveredProj] = useState(null);

  const handleHovering = useCallback((v) => {
    setHoveredProj(v);
  }, []);

  const theme = useTheme();
  const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));
  const lesserThanSm = useMediaQuery(theme.breakpoints.down('sm'));
  const smheight = useMediaQuery('(max-height:600px)');

  const cardh = smheight ? 350 : 450;

  const perpage = lesserThanSm ? 1
    : lesserThanMd
      ? 2 : 3;
  const maxpage = Math.ceil(projectInfo.length / perpage);

  const handlePageChange = useCallback((_, v) => {
    setPage(v);
  }, []);

  const currentPage = useMemo(() =>
    projectInfo.slice((page - 1) * perpage, page * perpage),
    [page, perpage]
  );

  const { manual, system } = useAnimateContext();
  const mode = system || manual;

  const animationConfig = useMemo(() => {
    const isNormal = mode === 'normal';

    return {
      gridcontainer: isNormal ? "visible" : "static",

      animate: !isNormal ? "static" : (hoveredProj ? "hidden" : "initial"),
      hover: isNormal ? "hover" : "static",

      image: isNormal ? "animate" : "static",
    };
  }, [mode, hoveredProj]);

  return (
    <SectionContainer
      ref={el => refProps.current['projects'] = el}
      onViewportEnter={() => handleViewport('projects', true)}
      onViewportLeave={() => handleViewport('projects', false)}
      viewport={{ amount: 0.5 }}
      id="projects"
      maxWidth="lg"
    >
      <ContentBox>
        <ProjectsGrid currentPage={currentPage} page={page} perpage={perpage} cardh={cardh}
          hoveredProj={hoveredProj}
          handleHovering={handleHovering}
          animationConfig={animationConfig}
        />
        <Pagination count={maxpage} page={page} onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', }} />
      </ContentBox>
      <HoveredAnimation hoveredProj={hoveredProj} animationConfig={animationConfig} />
    </SectionContainer >
  );
}

const GridContainer = styled(MotionGrid)(({ theme }) => ({
  width: '100%', padding: '2px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  perspective: '1000px',
  position: 'relative',
}));

const StyledGridItem = styled(MotionGrid)(({ theme }) => ({
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

const ProjectsGrid = memo(function ProjectsGrid({ currentPage, page, perpage, cardh, hoveredProj, handleHovering, animationConfig }) {

  return (
    <GridContainer container key={`${page}-${perpage}`} spacing={2}
      variants={containerVars}
      initial="hidden"
      whileInView={animationConfig.gridcontainer}
      viewport={{ once: false, amount: 0.5 }}
    >
      <AnimatePresence>
        {currentPage.map((v, i) => (
          <StyledGridItem item size={{ xs: 12, sm: 6, md: 4 }} key={`griditem-${i}`}
            variants={itemVars}
            sx={{
              height: `calc(${cardh}px + 50px)`,
              isolation: 'isolate',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
          >
            <ProjectCard v={v} cardh={cardh}
              hoveredProj={hoveredProj}
              handleHovering={handleHovering} animationConfig={animationConfig}
            />
          </StyledGridItem>
        ))}
      </AnimatePresence>
    </GridContainer>
  );
});

const CardContainer = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  width: '95%', //height: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'inherit',
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
}));

const Colorbackground = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  backgroundColor: (theme.vars || theme).palette.background.default,
  zIndex: 0,
  willChange: 'transform,opacity',
}));

const Bloombackground = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  backgroundColor: (theme.vars || theme).palette.primary.light,
  maskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  WebkitMaskImage: "radial-gradient(circle, transparent var(--inner), black var(--inner), black var(--outer), transparent var(--outer))",
  zIndex: 0,
  "--inner": "0%",
  "--outer": "0%",
  willChange: 'transform,opacity',
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.primary.main,
  }),
}));

const Shadowbackground = styled(MotionBox)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  boxShadow: `0 0 10px 5px ${(theme.vars || theme).palette.primary.main}`,
  backgroundColor: 'transparent',
  zIndex: 0,
  willChange: 'transform,opacity',
}));

const StyledCard = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'auto',
  borderRadius: 'inherit',
  padding: theme.spacing(2),
  opacity: 'inherit',
  willChange: 'transform, opacity',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  background: "transparent",
  cursor: 'none',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '150px',
  objectFit: "contain",
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: '4px 0 0 8px',
  '& .MuiCardHeader-title': {
    fontFamily: 'Instrument Serif',
    fontSize: '20px',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'start',
}));

const StyledArrowRightIcon = styled(ArrowRightIcon)(({ theme }) => ({
  marginTop: '6px',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontFamily: 'Instrument Sans',
    fontSize: '16px',
  },
}));

const cardcontainerVars = {
  initial: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  hover: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  static: {
    opacity: 1,
    transition: { duration: 0 }
  }
};

const colorVars = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0,
    scale: 1,
    transition: { duration: 0.3 }
  },
  static: {
    opacity: 1, scale: 1,
    transition: { duration: 0 }
  }
};

const bloomVars = {
  initial: {
    opacity: 0, scale: 1,
    "--inner": "0%", "--outer": "0%",
  },
  hover: {
    opacity: 1, scale: 1,
    "--inner": ["0%", "0%", "100%"],
    "--outer": ["0%", "100%", "100%"],
    transition: {
      duration: 1,
      times: [0, 0.5, 0.85]
    }
  },
  hidden: {
    opacity: 0, scale: 1,
    "--inner": "0%", "--outer": "0%",
    transition: { duration: 0.3 }
  },
  static: {
    opacity: 0, scale: 1,
    "--inner": "0%", "--outer": "0%",
    transition: { duration: 0 }
  }
};

const shadowVars = {
  initial: {
    opacity: 0, scale: 1,
  },
  hover: {
    opacity: 1, scale: 1,
    transition: {
      delay: 0.35,
      duration: 0.35,
    }
  },
  hidden: {
    opacity: 0, scale: 1,
    transition: { duration: 0.3 }
  },
  static: {
    opacity: 0, scale: 1,
    transition: { duration: 0 }
  }
};

const cardVars = {
  initial: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  hover: {
    opacity: 1,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hidden: {
    opacity: 0,
    scale: 0.75,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  static: {
    opacity: 1, scale: 1,
    transition: { duration: 0 }
  }
};

const ProjectCard = memo(function ProjectCard({ v, cardh, hoveredProj, handleHovering, animationConfig }) {

  const activeProj = hoveredProj && hoveredProj.header === v.header;

  const handleClick = useCallback((e) => {
    e.stopPropagation();

    window.open(v.link, '_blank', 'noopener,noreferrer');
  }, [v.link])

  return (
    <CardContainer
      variants={cardcontainerVars}
      initial="initial"
      animate={activeProj ? 'hover' : animationConfig.animate}
      whileHover={animationConfig.hover}
      sx={{ height: cardh }}
    >
      <Colorbackground
        variants={colorVars}
      />
      <Bloombackground
        variants={bloomVars}
      />
      <Shadowbackground
        variants={shadowVars}
      />
      <StyledCard
        variants={cardVars}
        sx={{ height: cardh }}
      >
        <StyledCardContent
          onMouseEnter={() => handleHovering(v)}
          onMouseLeave={() => handleHovering(null)}
          onClick={handleClick}
        >
          <StyledCardMedia
            component="img"
            image={v.img}
          />
          <StyledCardHeader
            title={v.header}
          />
          <List>
            {v.descriptions.map((description, i) => (
              <StyledListItem disablePadding key={`desc-${v.header}-${i}`}>
                <StyledArrowRightIcon />
                <StyledListItemText primary={description} />
              </StyledListItem>
            ))}
          </List>
        </StyledCardContent>
      </StyledCard>
    </CardContainer>
  )
});

const AnimatedToolTip = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '70px', height: '70px',
  top: 0, left: 0,
  willChange: 'transform,opacity',
  borderRadius: '50%',
  pointerEvents: 'none',
  padding: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Playfair Display',
  lineHeight: 1.1,
  fontSize: '14px',
  fontWeight: 500,
}));

const ImageContainer = styled(MotionBox)(({ theme }) => ({
  position: 'fixed',
  width: '100dvw', //height: 'auto',
  aspectRatio: 16 / 9,
  borderRadius: '16px',
  zIndex: -1,
  willChange: "transform, opacity",
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
  display: 'block',
}));

const tooltipVars = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

const imageVars = {
  initial: { opacity: 0, scale: 1.1 },
  animate: {
    opacity: 0.75, scale: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { opacity: 0, scale: 1.05 },
  static: { opacity: 0, scale: 1 },
};

const HoveredAnimation = memo(function HoveredAnimation({ hoveredProj, animationConfig }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!hoveredProj) return;

    const updateMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', updateMouse, { passive: true });
    return () => window.removeEventListener('mousemove', updateMouse);
  }, [hoveredProj, mouseX, mouseY]);

  if (!hoveredProj) return <AnimatePresence />;

  return (
    <AnimatePresence mode='wait'>
      {hoveredProj && (
        <React.Fragment>
          <AnimatedToolTip
            variants={tooltipVars}
            initial='initial'
            animate='animate'
            exit='initial'
            style={{
              x: sx, y: sy,
              translateX: '-50%', translateY: '-50%',
              zIndex: 1000,
            }}
          >
            View <br /> Project
          </AnimatedToolTip>
          <ImageContainer
            key={hoveredProj.img}
            variants={imageVars}
            initial='initial'
            animate={animationConfig.image}
            exit='exit'
          >
            <StyledImage src={hoveredProj.img} />
          </ImageContainer>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
});