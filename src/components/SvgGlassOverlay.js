import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';


const Container = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '100%', height: '100%',
    pointerEvents: 'none',
    isolation: 'isolate',
    willChange: 'transform, opacity',
    borderRadius: '50%',
    overflow: 'visible',
}));

const SvgGlassOverlay = ({ i = 0, ...props }) => {

    const radialid = 'glassGradient' + i;
    const filterid = 'innerGlow' + i;

    return (
        <Container
            component="svg"
            viewBox="0 0 100 100"
            sx={{ ...props }}
        >
            <defs>
                <radialGradient id={radialid} cx="25%" cy="25%" r="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                </radialGradient>

                <filter id={filterid} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blurInset" />
                    <feComposite in="SourceAlpha" in2="blurInset" operator="out" result="insetShape" />
                    <feColorMatrix
                        in="insetShape"
                        type="matrix"
                        values={[
                            "0 0 0 0 1",
                            "0 0 0 0 1",
                            "0 0 0 0 1",
                            "0 0 0 0.25 0"
                        ].join(" ")}
                        result="whiteInsetGlow"
                    />

                    <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="whiteInsetGlow" />
                    </feMerge>
                </filter>
            </defs>

            <circle
                cx="50" cy="50" r="48"
                fill={`url(#${radialid})`}
                stroke="rgba(255,255,255,1)"
                strokeWidth="1"
            />
        </Container>
    )
};

export default SvgGlassOverlay;