import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';


const icons = import.meta.glob('../icons/skills/*.svg', {
    eager: true,
    query: '?url'
});

const StyledCard = styled(Card)(({ theme }) => ({
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 10px 15px -3px rgba(${(theme.vars || theme).palette.background.contrastChannel} / 0.1)`,
    borderRadius: '12px',
    background: (theme.vars || theme).palette.background.skillcard,
    minWidth: 275,
    maxWidth: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '8px',
    marginBottom: 8,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    width: '100dvw',
    paddingTop: 32,
    '& .MuiTabs-scrollButtons.Mui-disabled': {
        opacity: 0.3,
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    fontFamily: 'Fira Code, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6366f1',
    opacity: '0.8',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const SubHeader = styled(Typography)(({ theme }) => ({
    fontFamily: 'Fira Code, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontWeight: 600,
    color: '#6366f1',
    opacity: '0.8',
    fontSize: '16px',
}));

const StyledImg = styled('img')(({ theme }) => ({
    width: 56, height: 56,
    padding: '6px',
    background: `rgba(250,250,250, 1)`,
    backdropFilter: 'blur(10px)',
    borderRadius: '20%',
    filter: `drop-shadow(0px 5px 10px rgba(15,15,15,0.4))`,
    [theme.breakpoints.down('md')]: {
        width: 48, height: 48,
    },
}));

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.35,
        },
    },
};

const cardVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    },
};

const itemVars = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

const skills = {
    'languages': [
        { file: 'java', name: 'Java' },
        { file: 'javascript', name: 'JavaScript' },
        { file: 'python', name: 'Python' },
        { file: 'csharp', name: 'C#' },
        { file: 'sql', name: 'SQL' }
    ],
    'frontend': [
        { file: 'react', name: 'React' },
        { file: 'materialui', name: 'Material UI' },
        { file: 'html', name: 'HTML' },
        { file: 'css', name: 'CSS' },
        { file: 'vite', name: 'Vite' },
        { file: 'emotion', name: 'Emotion' },
        { file: 'framermotion', name: 'Framer Motion' }
    ],
    'backend': [
        { file: 'springboot', name: 'Spring Boot' },
        { file: 'nodejs', name: 'Node.js' },
        { file: 'hibernate', name: 'Hibernate' },
        { file: 'mysql', name: 'MySQL' },
        { file: 'mongodb', name: 'MongoDB' },
        { file: 'elasticsearch', name: 'Elasticsearch' }
    ],
    'tools/cloud': [
        { file: 'aws', name: 'AWS' },
        { file: 'pytorch', name: 'PyTorch' },
        { file: 'huggingface', name: 'Hugging Face' },
        { file: 'docker', name: 'Docker' },
        { file: 'git', name: 'Git' },
        { file: 'jwt', name: 'JWT' },
        { file: 'cloudarchitecture', name: 'Cloud Architecture' },
        { file: 'microservice', name: 'Microservice' },
        { file: 'restapi', name: 'REST API' }
    ],
};

export default function SkillsCard() {
    const [tabvalue, setTabvalue] = useState(0);

    const theme = useTheme();
    const lesserThanMd = useMediaQuery(theme.breakpoints.down('md'));
    const smheight = useMediaQuery('(max-height:600px)');

    const handleChange = (e, nv) => {
        setTabvalue(nv);
    };

    if (lesserThanMd || smheight) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}>
                <StyledTabs value={tabvalue} onChange={handleChange}
                    variant="scrollable"
                    scrollButtons={true}
                    allowScrollButtonsMobile
                >
                    {Object.keys(skills).map((v, i) => (
                        <StyledTab label={v} key={i} />
                    ))}
                </StyledTabs>
                {Object.keys(skills).map((v, i) => (
                    <TabPanel index={i} value={tabvalue} />
                ))}
            </Box>
        )
    }

    return (
        <React.Fragment>
            <motion.div
                variants={containerVars}
                layout
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {Object.entries(skills).map(([k, section], i) => (
                    <React.Fragment key={i}>
                        <SubHeader>{k}</SubHeader>
                        <AnimateCard key={i}>
                            <StyledCard>
                                {section.map((icon, ii) => (
                                    <InteractiveIcon key={ii}>
                                        <Tooltip title={icon.name}>
                                            <StyledImg src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                                                alt={icon.name} />
                                        </Tooltip>
                                    </InteractiveIcon>
                                ))}
                            </StyledCard>
                        </AnimateCard>
                    </React.Fragment>
                ))}
            </motion.div>
        </React.Fragment >
    );
}

function AnimateCard({ children, }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth out the movement
    const mouseX = useSpring(x);
    const mouseY = useSpring(y);

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    const onMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            variants={cardVars}
            layout
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

function InteractiveIcon({ children }) {
    return (
        <motion.div
            variants={itemVars}
            whileHover={{
                scale: 1.1,
                y: -6,
                transition: { type: "spring", stiffness: 260, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.div>
    );
};

function TabPanel({ value, index }) {
    return (
        <Box
            sx={{
                width: '100%', padding: '0 8px',
                display: value != index ? 'none' : 'flex',
            }}
        >
            {value == index &&
                <motion.div
                    variants={cardVars}
                    initial="hidden"
                    whileInView="visible"
                    style={{ marginTop: '4px', width: '100%' }}
                >
                    <StyledCard>
                        {skills[Object.keys(skills)[index]].map((icon, ii) => (
                            <motion.div key={ii}
                                variants={itemVars}
                                whileHover={{
                                    scale: 1.1,
                                    y: -6,
                                    transition: { type: "spring", stiffness: 260, damping: 10 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Tooltip title={icon.name}>
                                    <StyledImg src={icons[`../icons/skills/${icon.file}.svg`]?.default}
                                        alt={icon.name} />
                                </Tooltip>
                            </motion.div>
                        ))}
                    </StyledCard>
                </motion.div>
            }
        </Box>
    );
}