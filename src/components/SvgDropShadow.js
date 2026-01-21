import Box from "@mui/material/Box";
import { styled, useTheme } from '@mui/material/styles';


const SvgContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    display: 'inline-block',
    //transform: 'translate(-50%, -40%) translateZ(25px)',
    width: '100%',
    height: '50%',
    pointerEvents: 'none',
    overflow: 'visible',
    zIndex: 0,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    '& rect': { overflow: 'visible' },
    '@keyframes shadowMove': {
        '0%': { transform: 'translate3d(0, 0, 0)' },
        '25%': { transform: 'translate3d(3%, -2%, 0)' },
        '50%': { transform: 'translate3d(5%, 0%, 0)' },
        '75%': { transform: 'translate3d(3%, 2%, 0)' },
        '100%': { transform: 'translate3d(0, 0, 0)' },
    },
}));

const SvgDropShadow = ({ duration = 20, color = "rgb(0,30,60)", opacity = 0.5, ...props }) => {

    const rectw = 80;
    const recth = 100;
    const x = (100 - rectw) / 2;
    const y = (100 - recth) / 2;

    return (
        <SvgContainer
            component="svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            sx={{
                top: props.top ?? '50%',
                left: props.left ?? '24px',
                animation: `shadowMove ${duration}s infinite ease-in-out`,
                ...props
            }}
        >
            <defs>
                <linearGradient id="blockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(0, 30, 60)" stopOpacity="0" />
                    <stop offset="25%" stopColor="rgb(0, 30, 60)" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="rgb(0, 30, 60)" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="rgb(0, 30, 60)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="rgb(0, 30, 60)" stopOpacity="0" />
                </linearGradient>

                <filter id="svgBlur" filterUnits="userSpaceOnUse" x="0" y="0" width="200%" height="200%">
                    <feGaussianBlur in="spread" stdDeviation="4" />
                </filter>
            </defs>

            <rect
                rx="10" ry="10"
                x={x}
                y={y}
                width={rectw}
                height={recth}
                fill="url(#blockGradient)"
                fillOpacity={opacity}
                filter="url(#svgBlur)"
            />
        </SvgContainer>
    )
}

export default SvgDropShadow;