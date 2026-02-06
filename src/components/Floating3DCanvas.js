import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { styled, useTheme } from '@mui/material/styles';
import page from '../pics/page.webp';
import FloatingPage from './FloatingPage';
import floatingbook from '../pics/floatingbook.webp';
import floatingpen from '../pics/floatingpen.webp';
import floatingpencap from '../pics/floatingpencap.webp';
import FloatingItem from './FloatingItem';
import floatinglaptop from '../pics/floatinglaptop.webp';


const StyledCanvas = styled(Canvas)(({ theme }) => ({
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none'
}));

export default function Floating3DCanvas() {
    return (
        <StyledCanvas
            dpr={[1, 2]}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true
            }}
            camera={{ position: [0, 0, 10], fov: 35 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <group>
                    <FloatingPage url={page} position={[-3.5, 1, 0]}
                        rotate={{ xCenter: 5, yCenter: 45, yAmp: 15, z: 0 }}
                        ytravel={{ speed: 0.4, range: 0.2 }}
                    />
                    <FloatingPage url={page} position={[-4.75, -0.75, -1]}
                        rotate={{ xCenter: 30, yCenter: 0, yAmp: 30, z: -120 }}
                        ytravel={{ speed: 0.2, range: 0.2 }}
                        bend={{ number: 2.4, amp: 0.1 }}
                    />
                    <FloatingPage url={page} position={[-3, -1, 0]}
                        rotate={{ xCenter: 60, yCenter: 5, yAmp: 5, z: -30 }}
                        ytravel={{ speed: 0.1, range: 0.1 }}
                        bend={{ number: 1.8, amp: 0.4 }}
                    />
                    <FloatingItem url={floatingbook} position={[-4, -2.25, 0]}
                        size={{ width: 1.0, aspectratio: 0.67 }}
                        rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: 10, zAmp: 15 }}
                        ytravel={{ speed: 0.2, range: 0.1 }}
                    />
                    <FloatingItem url={floatingpen} position={[-3.25, -0.25, 0]}
                        size={{ width: 0.75, aspectratio: 1.8 }}
                        rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 10, zStart: -60, zAmp: -25 }}
                        ytravel={{ speed: 0.2, range: 0.2 }}
                    />
                    {/*<FloatingItem url={floatinglaptop} position={[-3.5, 0, 0]}
                        size={{ width: 2, aspectratio: 1.5 }}
                        rotate={{ xStart: 0, xAmp: 5, yStart: 0, yAmp: 5, zStart: -30, zAmp: 15 }}
                        ytravel={{ speed: 0.1, range: 0.1 }}
                    />*/}
                </group>
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
                <Preload all />
            </Suspense>
        </StyledCanvas>
    )
}