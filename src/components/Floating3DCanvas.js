import React, {
    useState, useEffect, useLayoutEffect,
    useRef, useCallback, memo, Suspense
} from 'react';
import { useThree, Canvas } from '@react-three/fiber';
import {
    Preload, AdaptiveDpr, AdaptiveEvents,
} from '@react-three/drei';
import { styled, useTheme } from '@mui/material/styles';
import FloatingPage from './FloatingPage';
import floatingbook from '../pics/floatingbook.webp';
import floatingpen from '../pics/floatingpen.webp';
import floatingpencap from '../pics/floatingpencap.webp';
import FloatingItem from './FloatingItem';
import FloatingInk from './FloatingInk';
import { useAnimateContext } from './AnimateContext';

const pageimport = import.meta.glob('../pics/page*.webp', {
    eager: true,
    query: '?url'
});
const pagearray = Object.values(pageimport).map((v, _) => (v.default));


const PAGE_CONFIG = [
    {
        id: 0,
        url: pagearray[0] || pagearray[0],
        position: [0.25, 0.25, 0],
        rotate: { xCenter: 60, yCenter: 5, yAmp: 5, z: -30 },
        ytravel: { speed: 0.1, range: 0.1 },
        bend: { number: 1.8, amp: 0.4 },
    },
    {
        id: 3,
        url: pagearray[3] || pagearray[0],
        position: [1, 2, -1],
        rotate: { xCenter: 45, yCenter: 15, yAmp: 45, z: -90 },
        ytravel: { speed: 0.2, range: 0.1 },
        bend: { number: 1.2, amp: 0.6 },
    },
    {
        id: 1,
        url: pagearray[1] || pagearray[0],
        position: [-0.75, 1.25, 1],
        rotate: { xCenter: 5, yCenter: 45, yAmp: 15, z: 0 },
        ytravel: { speed: 0.4, range: 0.2 }
    },
    {
        id: 2,
        url: pagearray[2] || pagearray[0],
        position: [-1.5, -0.5, -1],
        rotate: { xCenter: 30, yCenter: 0, yAmp: 30, z: -150 },
        ytravel: { speed: 0.2, range: 0.2 },
        bend: { number: 2.4, amp: 0.1 },
    },

];

const ITEM_CONFIG = [
    {
        id: 0,
        url: floatingbook,
        position: [-0.75, -2.5, 0],
        size: { width: 1.0, aspectratio: 0.67 },
        rotate: { xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: 30, zAmp: 15 },
        ytravel: { speed: 0.2, range: 0.1 },
    },
    {
        id: 1,
        url: floatingpen,
        position: [0.75, -2, 0],
        size: { width: 0.75, aspectratio: 1.8 },
        rotate: { xStart: 0, xAmp: 10, yStart: 0, yAmp: 10, zStart: -60, zAmp: -25 },
        ytravel: { speed: 0.2, range: 0.2 },
    },
];

const StyledCanvas = styled(Canvas)(({ theme }) => ({
    position: 'fixed', //inset: 0,
    width: '100dvw !important',
    height: '100dvh !important',
    top: 0, left: 0,
    //pointerEvents: 'none',
    backfaceVisibility: 'hidden',
}));

const Floating3DCanvas = memo(function Floating3DCanvas({ coordRef, handleSelect, certData }) {
    const [fixedSize, setFixedSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setFixedSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <StyledCanvas
            size={fixedSize}
            dpr={2}
            camera={{ position: [0, 0, 10], fov: 35 }}
            resize={{ scroll: false, debounce: 0 }}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true
            }}
        >
            <AdaptiveSetup />
            <Suspense fallback={null}>
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
                <Preload all />
                <ambientLight intensity={0.5} />
                <group>
                    <FloatingInk />
                    {ITEM_CONFIG.map((item, i) => (
                        <FloatingItem key={item.id}
                            {...item}
                        />
                    ))}
                    {PAGE_CONFIG.map((page, i) => (
                        <FloatingPage key={page.id}
                            {...page}
                            svgIcon={certData[page.id].icon}
                            coordRef={coordRef}
                            handleSelect={handleSelect}
                        />
                    ))}
                </group>
            </Suspense>
        </StyledCanvas>
    )
});

function AdaptiveSetup() {
    const { gl, camera, size } = useThree();

    useLayoutEffect(() => {
        gl.setSize(size.width, size.height);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
    }, [size, gl, camera]);

    return null;
}

export default Floating3DCanvas;