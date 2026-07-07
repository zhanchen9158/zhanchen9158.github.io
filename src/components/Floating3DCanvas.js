import React, {
    useState, useEffect, useLayoutEffect,
    useRef, useCallback, memo, Suspense,
    useMemo
} from 'react';
import { useThree, Canvas, useFrame } from '@react-three/fiber';
import {
    Preload, AdaptiveDpr, AdaptiveEvents, MeshTransmissionMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { styled, useTheme } from '@mui/material/styles';
import FloatingPage from './FloatingPage';
import floatingbook from '../pics/floatingbook.webp';
import floatingpen from '../pics/floatingpen.webp';
import floatingpencap from '../pics/floatingpencap.webp';
import FloatingItem from './FloatingItem';
import FloatingInk from './FloatingInk';
import { useAnimateContext } from './AnimateContext';
import { useStateContext } from './StateContext';
import { easing } from 'maath';
import FloatingThread from './FloatingThread';
import FloatingHourglass from './FloatingHourglass';
import FloatingTesseract from './FloatingTesseract';
import FloatingSequence from './FloatingSequence';
import FloatingBg from './FloatingBg';
import getActiveSection from '../functions/getActivesection';
import { CanvasSection } from './CanvasContext';
import WaterRipples from './WaterRipples';
import SpaceStation from './SpaceStation';
import SpaceStationBg from './SpaceStationBg';

const pageimport = import.meta.glob('../pics/page*.webp', {
    eager: true,
    query: '?url'
});
const pagearray = Object.values(pageimport).map((v, _) => (v.default));

const bookimport = import.meta.glob('../pics/booksequence*.webp', {
    eager: true,
    query: '?url'
});
const bookarray = Object.values(bookimport).map((v, _) => (v.default));


const PAGE_CONFIG = [
    {
        id: 'cert0',
        url: pagearray[0] || pagearray[0],
        position: [0.75, 0.25, 0],
        rotate: { xCenter: 60, yCenter: 5, yAmp: 5, z: -30 },
        ytravel: { speed: 0.1, range: 0.1 },
        bend: { number: 1.8, amp: 0.4 },
    },
    {
        id: 'cert3',
        url: pagearray[3] || pagearray[0],
        position: [1, 2, -1],
        rotate: { xCenter: 45, yCenter: 15, yAmp: 45, z: -90 },
        ytravel: { speed: 0.2, range: 0.1 },
        bend: { number: 1.2, amp: 0.6 },
    },
    {
        id: 'cert1',
        url: pagearray[1] || pagearray[0],
        position: [-0.75, 1.25, 1],
        rotate: { xCenter: 5, yCenter: 45, yAmp: 15, z: 0 },
        ytravel: { speed: 0.4, range: 0.2 }
    },
    {
        id: 'cert2',
        url: pagearray[2] || pagearray[0],
        position: [-1, -0.5, -1],
        rotate: { xCenter: 30, yCenter: 0, yAmp: 30, z: -150 },
        ytravel: { speed: 0.2, range: 0.2 },
        bend: { number: 2.4, amp: 0.1 },
    },

];

const idNumberArr = PAGE_CONFIG.reduce((acc, page) => {
    const match = page.id.match(/\d+/) || '0';
    acc.push(parseInt(match[0], 10));
    return acc;
}, []);

const BOOKSEQ_CONFIG = {
    id: 'booksequence',
    position: [2.25, -1.5, 0],
    size: { width: 2.0, aspectratio: 3 / 2 },
    rotate: { xStart: 0, xAmp: 10, yStart: 0, yAmp: 10, zStart: -60, zAmp: 20 },
    ytravel: { speed: 0.1, range: 0.1 },
};

const ITEM_CONFIG = [
    {
        id: 'item0',
        url: floatingbook,
        position: [-0.75, -2.25, 0],
        size: { width: 2.0, aspectratio: 2.0 },
        rotate: { xStart: 0, xAmp: 10, yStart: 0, yAmp: 30, zStart: 30, zAmp: 15 },
        ytravel: { speed: 0.2, range: 0.1 },
    },
    {
        id: 'item1',
        url: floatingpen,
        position: [0.75, -2, 0],
        size: { width: 0.75, aspectratio: 1.8 },
        rotate: { xStart: 0, xAmp: 10, yStart: 0, yAmp: 10, zStart: -60, zAmp: -25 },
        ytravel: { speed: 0.2, range: 0.2 },
    },
];

const StyledCanvas = styled(Canvas)(({ theme }) => ({
    position: 'fixed', inset: 0,
    //pointerEvents: 'none',
    contain: 'layout size',
    backfaceVisibility: 'hidden',
}));

const Floating3DCanvas = memo(function Floating3DCanvas({ activeId, coordRef, handleSelect,
    certData, activesection }) {

    const section = useMemo(() => getActiveSection(activesection),
        [activesection]);

    return (
        <StyledCanvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 10], fov: 35 }}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true
            }}
        >
            <Suspense fallback={null}>
                <CanvasContent
                    activeId={activeId}
                    coordRef={coordRef}
                    handleSelect={handleSelect}
                    certData={certData}
                    section={section}
                />
                <CanvasBackDrop />
            </Suspense>
        </StyledCanvas>
    )
});

const CanvasContent = memo(function CanvasContent({ activeId, coordRef, handleSelect,
    certData, section }) {

    const canvasRef = useRef();
    const objectsRef = useRef({});

    const heroActive = useMemo(() => section === 'introduction', [section]);
    const highlightsActive = useMemo(() => section === 'highlights', [section]);
    const certActive = useMemo(() => section === 'certifications', [section]);

    return (
        <>
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <Preload all />
            <ambientLight intensity={0.5} />
            <CameraZoom activeId={activeId} coordRef={coordRef} />
            <CanvasSection isActive={heroActive}>
                <SpaceStationBg isInView={heroActive} />
                <SpaceStation
                    isInView={heroActive}
                />
            </CanvasSection>
            <CanvasSection isActive={highlightsActive}>
                <WaterRipples isInView={highlightsActive} />
            </CanvasSection>
            <CanvasSection isActive={certActive}>
                <FloatingBg
                    isInView={certActive}
                />
                <FloatingSequence
                    {...BOOKSEQ_CONFIG}
                    imageUrls={bookarray}
                    duration={30}
                />
                <FloatingInk />
                <FloatingHourglass />
                <FloatingTesseract />
                <FloatingThread
                    objectsRef={objectsRef}
                />
                {ITEM_CONFIG.map((item, i) => (
                    <FloatingItem key={item.id}
                        {...item}
                    />
                ))}
                {PAGE_CONFIG.map((page, i) => (
                    <FloatingPage key={page.id}
                        isInView={certActive}
                        {...page}
                        svgIcon={certData[[idNumberArr[i]]].icon}
                        coordRef={coordRef}
                        handleSelect={handleSelect}
                        objectsRef={objectsRef}
                    />
                ))}
            </CanvasSection>
        </>
    )
});

function CameraZoom({ activeId, coordRef }) {
    useFrame((state, delta) => {
        const step = 0.4;

        state.camera.zoom = 1;

        if (activeId !== null && activeId !== undefined) {
            const targetX = coordRef.current?.worldX || 0;
            const targetY = coordRef.current?.worldY || 0;

            easing.damp3(state.camera.position, [targetX, targetY, 2], step, delta);
        } else {
            easing.damp3(state.camera.position, [0, 0, 10], step, delta);
        }

        state.camera.updateProjectionMatrix();
    });

    return null;
};

const CanvasBackDrop = memo(function CanvasBackDrop() {
    const { activeSkillsId } = useStateContext();

    if (activeSkillsId === null) return null;

    return (
        <mesh position={[0, 0, 5]} scale={[8, 5, 1]}>
            <planeGeometry />
            <MeshTransmissionMaterial
                backside={false}
                samples={2}
                resolution={256}
                anisotropy={0}

                roughness={0.2}
                thickness={0.2}
                chromaticAberration={0.05}
                distortion={0.0}
                distortionScale={0.0}
                temporalDistortion={0.0}
                clearcoat={1}
                attenuationDistance={0.5}
                attenuationColor="#ffffff"
                color="#ffffff"
                transmission={1}
                buffer={null}
            />
        </mesh>
    )
});

export default Floating3DCanvas;