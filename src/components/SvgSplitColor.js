import React, { useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { motion } from 'motion/react';
import hexToRgba from '../functions/hexToRgba';


const MotionBox = motion(Box);

const SvgContainer = styled(MotionBox)(({ theme }) => ({
    position: 'absolute',
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    borderRadius: 'inherit',
}));

const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};

const borderVars = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 2,
            ease: 'easeOut',
        }
    }
};

const SvgSplitColor = memo(({ color = 'rgba(255, 255, 255, 1)',
    width = 675, height = 450, rx = 450, ry = 506.25,
    strokeColor = '#ffffff',
    strokeWidth = 2.2, borderRadius = 32,
    ...props }) => {

    const gradientColor = useMemo(() =>
        [hexToRgba(strokeColor, 0.8), hexToRgba(strokeColor, 0.2)]
        , [strokeColor]);
    const inset = strokeWidth / 2;

    const noiseImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAMAAAAva96uAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAA1JREFUeNpjYBgFAwUAAAQRAAF9Ut9DAAAAAElFTkSuQmCC";

    return (
        <SvgContainer
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            shapeRendering="geometricPrecision"
            variants={containerVars}
            initial='initial'
            animate='animate'
            exit='initial'
            sx={{ ...props }}
        >
            <defs>
                <pattern id="noisePattern" width="64" height="64" patternUnits="userSpaceOnUse">
                    <image href={noiseImage} width="64" height="64" opacity="0.2" />
                </pattern>

                <radialGradient id="leftSpotlight" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>

                <radialGradient id="edgeGradient" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
                    <stop offset="0%" stopColor={gradientColor[0]} />
                    <stop offset="50%" stopColor={gradientColor[1]} />
                    <stop offset="80%" stopColor="transparent" />
                </radialGradient>
                <mask id="ellipseMask">
                    <ellipse
                        cx="0" cy="0" rx={rx} ry={ry}
                        fill="white"
                        transform="rotate(-10, 0, 0)"
                    />
                </mask>
            </defs>

            <ellipse
                cx="0" cy="0" rx={rx} ry={ry}
                fill={color}
                transform="rotate(-10, 0, 0)"
            />

            <ellipse
                cx="0" cy="0" rx={rx} ry={ry}
                fill="url(#noisePattern)"
                transform="rotate(-10)"
                style={{ mixBlendMode: 'soft-light' }}
            />

            <motion.rect
                x={inset}
                y={inset}
                width={width - strokeWidth}
                height={height - strokeWidth}
                rx={borderRadius}
                ry={borderRadius}
                fill="none"
                stroke="url(#edgeGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                mask="url(#ellipseMask)"
                variants={borderVars}
                initial='initial'
                animate='animate'
            />

            <ellipse
                cx="0" cy="0" rx={rx} ry={ry}
                fill="url(#leftSpotlight)"
                transform="rotate(-10, 0, 0)"
            />
        </SvgContainer>
    );
});

const ShadowContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    borderRadius: 'inherit',
    transform: 'translateZ(0)',
    willChange: 'filter',
    filter: 'drop-shadow(10px 10px 12px rgba(0, 0, 0, 0.5))',
}));

const SvgSplitShadow = memo(({ color = 'rgba(255, 255, 255, 1)',
    width = 675, height = 450, rx = 450, ry = 506.25,
    ...props }) => {
    return (
        <ShadowContainer
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            sx={{ ...props }}
        >
            <ellipse
                cx="0" cy="0" rx={rx} ry={ry}
                fill={color}
                //filter="url(#dropShadow)"
                transform="rotate(-10, 0, 0)"
            />
        </ShadowContainer>
    );
});

const SvgBorder = memo(({ glowColor = '#ffffff',
    width = 675, height = 450, rx = 450, ry = 506.25,
    borderColor = '#ffffff',
    strokeWidth = 2, borderRadius = 32,
    ...props }) => {

    const borderColors = useMemo(() =>
        [hexToRgba(borderColor, 0.4), hexToRgba(borderColor, 1)]
        , [borderColor]);

    const glowColors = useMemo(() =>
        [hexToRgba(glowColor, 0.2), hexToRgba(glowColor, 0)]
        , [borderColor]);
    const inset = strokeWidth / 2;

    return (
        <SvgContainer
            component="svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            shapeRendering="geometricPrecision"
            variants={containerVars}
            initial='initial'
            animate='animate'
            exit='initial'
            sx={{
                ...props
            }}
        >
            <defs>
                <linearGradient id="edgeGradientBR" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="65%" stopColor="transparent" />
                    <stop offset="85%" stopColor={borderColors[0]} />
                    <stop offset="100%" stopColor={borderColors[1]} />
                </linearGradient>

                <radialGradient id="rightShadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={glowColors[0]} />
                    <stop offset="100%" stopColor={glowColors[1]} />
                </radialGradient>
            </defs>

            <motion.rect
                x={inset}
                y={inset}
                width={width - strokeWidth + 1}
                height={height - strokeWidth + 1}
                rx={borderRadius}
                ry={borderRadius}
                fill="none"
                stroke="url(#edgeGradientBR)"
                strokeWidth={strokeWidth}
                variants={borderVars}
                initial='initial'
                animate='animate'
            />

            <circle
                cx={width}
                cy={height}
                r={height}
                fill="url(#rightShadow)"
                style={{ mixBlendMode: 'soft-light' }}
            />
        </SvgContainer>
    );
});

export default SvgSplitColor;
export { SvgSplitShadow, SvgBorder };