import Box from "@mui/material/Box";


const SvgGlassOverlay = ({ i, ...props }) => {

    const radialid = 'glassGradient' + i;
    const filterid = 'innerGlow' + i;

    return (
        <Box
            component="svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                borderRadius: '50%',
                overflow: 'visible',
                ...props
            }}
        >
            <defs>
                <radialGradient id={radialid} cx="25%" cy="25%" r="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                </radialGradient>

                <filter id={filterid} x="-100%" y="-100%" width="300%" height="300%">
                    {/* --- PART 1: INSET GLOW (Frosted Edge) --- */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blurInset" />
                    <feComposite in="SourceAlpha" in2="blurInset" operator="out" result="insetShape" />
                    <feColorMatrix
                        in="insetShape"
                        type="matrix"
                        values={[
                            "0 0 0 0 1",
                            "0 0 0 0 1",
                            "0 0 0 0 1",
                            "0 0 0 0.15 0"
                        ].join(" ")}
                        result="whiteInsetGlow"
                    />

                    {/* --- PART 2: ATMOSPHERIC DROP SHADOW --- */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blurDrop" />
                    <feOffset in="blurDrop" dx="0" dy="10" result="offsetDrop" />
                    <feColorMatrix
                        in="offsetDrop"
                        type="matrix"
                        values={[
                            "0 0 0 0 0",
                            "0 0 0 0 0",
                            "0 0 0 0 0",
                            "0 0 0 .28 0"
                        ].join(" ")}
                        result="blackDropShadow"
                    />

                    {/* --- PART 3: FROSTED TEXTURE GENERATION --- */}
                    {/* baseFrequency 0.65 creates a fine grain. numOctaves 3 makes it smooth. */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
                    {/* Clip the noise to only show inside the icon shape */}
                    <feComposite in="noise" in2="SourceAlpha" operator="in" result="frostedNoise" />
                    {/* Lighten the noise so it looks like frosted sparkles, not gray dirt */}
                    <feColorMatrix
                        in="frostedNoise"
                        type="matrix"
                        values={[
                            "1 0 0 0 0",
                            "0 1 0 0 0",
                            "0 0 1 0 0",
                            "0 0 0 0.05 0" // Very low opacity (5%) for a subtle grit
                        ].join(" ")}
                        result="subtleFrost"
                    />

                    {/* --- PART 4: FINAL LAYER STACK --- */}
                    <feMerge>
                        <feMergeNode in="blackDropShadow" />
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="subtleFrost" />
                        <feMergeNode in="whiteInsetGlow" />
                    </feMerge>
                </filter>
            </defs>

            {/* The Main Glass Overlay */}
            <circle
                cx="50" cy="50" r="48"
                fill={`url(#${radialid})`}
                filter={`url(#${filterid})`}
                stroke="rgba(255,255,255,1)"
                strokeWidth="1"
            />
        </Box>
    )
};

export default SvgGlassOverlay;