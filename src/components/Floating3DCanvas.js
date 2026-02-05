import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { styled, useTheme } from '@mui/material/styles';
import page from '../pics/page.webp';
import FloatingPage from './FloatingPage';
import floatingbook1 from '../pics/floatingbook1.webp';
import floatingbook2 from '../pics/floatingbook2.webp';
import floatingpen from '../pics/floatingpen.png';
import floatingpencap from '../pics/floatingpencap.png';
import FloatingItem from './FloatingItem';


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
                    <FloatingPage url={page} position={[-3, 0.75, 0]} width={0.5}
                        rotate={{ xCenter: 60, yCenter: 5, yAmp: 5, z: 0 }}
                        ytravel={{ speed: 0.1, range: 0.05 }}
                        bend={{ number: 1.8, amp: 0.4 }} />
                    <FloatingPage url={page} position={[-4.75, 0.25, -1]} width={0.5}
                        rotate={{ xCenter: 30, yCenter: 0, yAmp: 15, z: 120 }}
                        ytravel={{ speed: 0.2, range: 0.2 }}
                        bend={{ number: 2.4, amp: 0.1 }} />
                    <FloatingPage url={page} position={[-3.5, 1.75, 0]} width={0.5}
                        rotate={{ xCenter: 5, yCenter: 45, yAmp: 15, z: 30 }}
                        ytravel={{ speed: 0.4, range: 0.2 }}
                    />
                    <FloatingItem url={floatingpen} position={[-3.0, -1.0, 0]}
                        size={{ width: 1, aspectratio: 1.8 }}
                        rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: -45, zAmp: 5 }}
                        ytravel={{ speed: 0.1, range: 0.1 }}
                    />
                    <FloatingItem url={floatingpencap} position={[-3.5, -0.25, 0]}
                        size={{ width: 0.45, aspectratio: 1.4 }}
                        rotate={{ xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: -120, zAmp: 30 }}
                        ytravel={{ speed: 0.2, range: 0.2 }}
                    />
                    <FloatingItem url={floatingbook1} position={[-4.0, -1.25, 0]}
                        size={{ width: 1.0, aspectratio: 0.67 }}
                        rotate={{ xStart: 0, xAmp: 0, yStart: 0, yAmp: 30, zStart: 10, zAmp: 10 }}
                        ytravel={{ speed: 0.1, range: 0.1 }}
                    />
                </group>
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
                <Preload all />
            </Suspense>
        </StyledCanvas>
    )
}