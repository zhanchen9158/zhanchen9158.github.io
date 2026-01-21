import Box from "@mui/material/Box";


const SvgGlow = ({ ...props }) => (
    <Box
        component="svg"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        sx={{
            position: 'absolute',
            top: props.top ?? 0,
            left: props.left ?? '50%',
            transform: props.transform ?? 'translate(-50%, -40%) translateZ(30px)',
            width: '100%',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'transform, opacity',
            clipPath: 'inset(0% 0% 0% 0%)',
            ...props
        }}
    >
        <defs>
            <radialGradient id="glowGradient" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* High-Performance SVG Blur Filter */}
            <filter id="svgBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
        </defs>

        <circle
            cx="100"
            cy="100"
            r="80"
            fill="url(#glowGradient)"
            filter="url(#svgBlur)"
        />
    </Box>
);

export default SvgGlow;