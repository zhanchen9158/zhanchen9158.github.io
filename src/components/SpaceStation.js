import React, { useRef, useEffect, useMemo, memo, useLayoutEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture, useKTX2 } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimateContext } from './AnimateContext';
import { useCanvasSectionFrame } from './CanvasContext';
import useConfigureTextures from '../functions/useConfigureTextures';
import SpaceRingParticles from './SpaceRingParticles';

import blankktx2 from '../pics/blank.ktx2';
import facektx2 from '../pics/spacestationface1.ktx2';

const ktx2import = import.meta.glob('../pics/spacestation*.ktx2', {
    eager: true,
    query: '?url'
});
const ktx2object = Object.entries(ktx2import).reduce((acc, [path, module]) => {
    const filename = path.split('/').pop().replace(/\.ktx2.*/, '');
    acc[filename] = module.default;

    return acc;
}, {});

const teximport = import.meta.glob('../pics/spacestation*.webp', {
    eager: true,
    query: '?url'
});
const texobject = Object.entries(teximport).reduce((acc, [path, module]) => {
    const filename = path.split('/').pop().replace(/\.webp.*/, '');
    acc[filename] = module.default;

    return acc;
}, {});

const citymapimport = import.meta.glob('../pics/spacestationcity*map.ktx2', {
    eager: true,
    query: '?url'
});
const citymaparray = Object.values(citymapimport).map((v, _) => (v.default));


const RING_CONFIG = [
    {
        id: 'outerring',
        outerRadius: 2.5, innerRadius: 1.8,
        depth: 0.5,
        segments: 32,
        startX: -90, startY: 60,
        rotX: [-90, 90], rotY: [-90, 90],
        rotZSpeed: 0.05,
        face: ktx2object.spacestationface1,
        emissivemask: ktx2object.spacestationface1emissive,
        windowsmask: ktx2object.spacestationface1windows,
        outerwall: ktx2object.spacestationwall1,
        outerwallemissive: ktx2object.spacestationwall1emissive,
        outerwallwindows: ktx2object.spacestationwall1windows,
        innerwall: ktx2object.spacestationwall2,
    },
    {
        id: 'innerring',
        outerRadius: 1.5, innerRadius: 1.0,
        depth: 0.4,
        segments: 32,
        startX: 90, startY: 90,
        rotX: [120, -120], rotY: [120, -120],
        rotZSpeed: -0.04,
        face: ktx2object.spacestationface2,
        emissivemask: ktx2object.spacestationface2emissive,
        windowsmask: ktx2object.spacestationface2windows,
        outerwall: ktx2object.spacestationwall3,
        innerwall: ktx2object.spacestationwall4,
        innerwallemissive: ktx2object.spacestationwall4emissive
    },
    {
        id: 'corestrut',
        width: 0.15, height: 0.4, depth: 2.0,
        startX: 120, startY: 120,
        rotX: [120, -120], rotY: [120, -120],
        rotZSpeed: -0.04,
        texture: ktx2object.spacestationcorestrut,
        emissivemask: ktx2object.spacestationcorestrutemissive,
        windowsmask: ktx2object.spacestationcorestrutwindows,
        sidetexture: ktx2object.spacestationcorestrutside,
    },
    {
        id: 'corelattice',
        latticeRadius: 0.8,
        detail: 0,
        latticeRotXSpeed: 0.05, latticeRotYSpeed: 0.05,
        latticeRotZSpeed: 0.05,
    },
    {
        id: 'corespire1',
        radiusTop: 0.05, radiusBottom: 0.2, height: 1.4,
        segments: 16,
        texture: ktx2object.spacestationspire1,
        emissivemask: ktx2object.spacestationspire1emissive,
        captexture: ktx2object.spacestationspirecap,
    },
    {
        id: 'corespire2',
        radiusTop: 0.1, radiusBottom: 0.2, height: 1.0,
        segments: 16,
        texture: ktx2object.spacestationspire2,
        emissivemask: ktx2object.spacestationspire2emissive,
        windowsmask: ktx2object.spacestationspire2windows,
        captexture: ktx2object.spacestationspirecap,
    },
    {
        id: 'corespire3',
        radiusTop: 0.2, radiusBottom: 0.3, height: 0.6,
        segments: 16,
        texture: ktx2object.spacestationspire3,
        emissivemask: ktx2object.spacestationspire3emissive,
        windowsmask: ktx2object.spacestationspire3windows,
        captexture: ktx2object.spacestationspirecap,
    },
    {
        id: 'exowall',
        radiusTop: 0.6, radiusBottom: 0.6, height: 0.6,
        segments: 32,
        texture: ktx2object.spacestationexowall,
        emissivemask: ktx2object.spacestationexowallemissive,
        windowsmask: ktx2object.spacestationexowallwindows,
    },
    {
        id: 'exocap',
        radiusTop: 0.6, radiusBottom: 0.6, height: 0.6,
        segments: 32,
        texture: ktx2object.spacestationexocap,
        emissivemask: ktx2object.spacestationexocapemissive,
        lightsmask: ktx2object.spacestationexocaplights,
    },
];

const delay = 2.0;
const initscale = 0.0;
const NINETY_DEGREES = Math.PI / 2;
const TARGET_FPS = 1 / 30;
const BLANK_FALLBACK = blankktx2;
//const BLANK_FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

const SpaceStation = memo(function SpaceStation({ isInView = false }) {

    const groupRef = useRef();

    const entranceProgress = useRef(0);
    const delayStartTime = useRef(0);
    const accumulator = useRef(0);

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            return;
        }

        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime();

        if (delayStartTime.current === 0) {
            delayStartTime.current = t;
        }
        const timeElapsedSinceInView = t - delayStartTime.current;
        const isDelayOver = timeElapsedSinceInView >= delay;

        const target = (isInView || entranceProgress.current > 0.99) ? 1 : 0;
        if (isDelayOver) {
            entranceProgress.current += (target - entranceProgress.current) * 0.05;
            if (entranceProgress.current > 0.99) entranceProgress.current = 1;
        } else {
            entranceProgress.current = 0;
        }

        const scaleProgress = initscale + (1.0 - initscale) * entranceProgress.current;

        groupRef.current.scale.set(scaleProgress, scaleProgress, scaleProgress);

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group ref={groupRef} scale={[0, 0, 0]}>
            <Core
                isInView={isInView}
                config={RING_CONFIG.slice(2)}
                entranceProgress={entranceProgress}
            />
            <InnerRing
                isInView={isInView}
                config={RING_CONFIG[1]}
                entranceProgress={entranceProgress}
            />
            <OuterRing
                isInView={isInView}
                config={RING_CONFIG[0]}
                entranceProgress={entranceProgress}
            />
        </group>
    );
});

const SHARED_HASH = `
  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
`;

const StrutMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uRepeat: 2.0,
        uGridSize: new THREE.Vector2(8.0, 8.0),
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#00e8ff"),
        uWindowColor: new THREE.Color("#00e8ff"),
        uSideTexture: new THREE.Texture(),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uWindowsMap;
    uniform vec3 uEmissiveColor;
    uniform vec3 uWindowColor;
    uniform sampler2D uSideTexture;

    ${SHARED_HASH}

    void main() {
        float uvXScaled = vUv.x * uRepeat;
        float repeatIndex = floor(uvXScaled);
        float localX = fract(uvXScaled);
        

        float isEvenIndex = step(mod(repeatIndex, 2.0), 0.99);
        float finalX = mix(localX, 1.0 - localX, isEvenIndex);
        vec2 repeatedUv = vec2(finalX, vUv.y);

        float distFromCenter = abs(repeatedUv.x - 0.5); 


        float isHullFace = step(0.9, abs(vNormal.x));
        
        vec4 hullColor = texture2D(uTexture, repeatedUv);
        vec4 sideColor = texture2D(uSideTexture, repeatedUv);
        vec4 baseColor = mix(sideColor, hullColor, isHullFace);

        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, repeatedUv).r;
        float windowsMask = texture2D(uWindowsMap, repeatedUv).r;


        float delayedTime = uTime - 2.0;
        float isTimeActive = step(0.0, delayedTime);
        
        float safeTime = max(0.0, delayedTime); 
        float timeProgress = fract(safeTime * 0.25);
        
        float waveWidth = 0.15;
        float waveFront = timeProgress * 0.65;
        
        float distToWave = abs(distFromCenter - waveFront);
        float pulseIntensity = smoothstep(waveWidth, 0.0, distToWave);
        pulseIntensity *= step(distFromCenter, 0.5);
        
        float periodicFlare = mix(1.5, 5.0, timeProgress);
        float totalEmissiveScale = pulseIntensity * periodicFlare * (emissiveMask + 0.1);
        
        float hasEmissive = step(0.05, emissiveMask) * isTimeActive * isHullFace;
        vec3 emissiveGlow = uEmissiveColor * (totalEmissiveScale * hasEmissive);


        vec2 gridCoords = floor(repeatedUv * uGridSize);
        float sectorRandom = hash(gridCoords);
        
        float slowPulse = cos(uTime * 0.8 + sectorRandom * 10.0) * 0.5 + 0.5;
        float dropDice = hash(vec2(floor(uTime), sectorRandom));
        
        float voltage = mix(1.0, 0.2, step(dropDice, 0.10));
        float totalWindowScale = slowPulse * voltage * 20.0 * windowsMask;
        
        float hasWindows = step(0.05, windowsMask) * isHullFace;
        vec3 windowsGlow = uWindowColor * (totalWindowScale * hasWindows);


        vec3 finalOutput = (baseColor.rgb * 1.05) + emissiveGlow + windowsGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ StrutMaterial });

const ExoSpireMaterial = shaderMaterial(
    {
        uTime: 0,
        uNumber: 1,
        uTexture: new THREE.Texture(),
        uRepeat: 4.0,
        uGridSize: new THREE.Vector2(8.0, 8.0),
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uGridSize: new THREE.Vector2(32.0, 16.0),
        uEmissiveColor: new THREE.Color("#00ffcc"),
        uWindowColor: new THREE.Color("#ff6600"),
        uHoloColor: new THREE.Color("#031620"),
        uGlyphColor: new THREE.Color("#FF8C00"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uNumber;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uWindowsMap;
    uniform vec3 uEmissiveColor;
    uniform vec3 uWindowColor;
    uniform vec3 uHoloColor;
    uniform vec3 uGlyphColor;

    ${SHARED_HASH}

    float noise(float t) {
        return fract(sin(t * 12.9898) * 43758.5453);
    }

    float random2d(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
        vec2 repeatedUv = vec2(fract(vUv.x * uRepeat), vUv.y);
        vec4 colorA = texture2D(uTexture, repeatedUv);
        vec2 flippedUv = vec2(1.0 - repeatedUv.x, repeatedUv.y);
        vec4 colorB = texture2D(uTexture, flippedUv);
        
        float distFromCenter = abs(repeatedUv.x - 0.5); 
        float seamBlendFactor = smoothstep(0.45, 0.50, distFromCenter);
        vec4 baseColor = mix(colorA, colorB, seamBlendFactor * 0.5);
        
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, repeatedUv).r;
        float windowsMask = texture2D(uWindowsMap, repeatedUv).r;

        vec2 gridCoords = floor(repeatedUv * uGridSize);
        float sectorRandom = hash(gridCoords);


        float verticalWave = sin(uTime * 0.8 - vUv.y * 2.0) * 0.5 + 0.5;
        float wavePulse = pow(verticalWave, 5.0);
        
        float edgeFade = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
        float emissiveIntensity = wavePulse * 5.0 * edgeFade;
        
        float hasEmissive = step(0.05, emissiveMask);
        vec3 emissiveGlow = uEmissiveColor * (emissiveIntensity * (emissiveMask + 0.1) * hasEmissive);


        float slowPulse = cos(uTime * 0.8 + sectorRandom * 10.0) * 0.5 + 0.5;
        float dropDice = hash(vec2(floor(uTime), sectorRandom));
        
        float voltage = mix(1.0, 0.2, step(dropDice, 0.10));
        float totalWindowScale = slowPulse * voltage * 5.0 * windowsMask;
        
        float hasWindows = step(0.05, windowsMask);
        vec3 windowsGlow = uWindowColor * (totalWindowScale * hasWindows);


        float xMask = smoothstep(0.215, 0.235, repeatedUv.x) * smoothstep(0.785, 0.765, repeatedUv.x);
        float yMask = smoothstep(0.66, 0.68, repeatedUv.y) * smoothstep(0.84, 0.82, repeatedUv.y);
        float screenMask = xMask * yMask;

        float currentScreenIndex = floor(vUv.x * uRepeat);
        vec2 textUv = repeatedUv * 8.0; 
        
        vec2 rowSeed = vec2(currentScreenIndex, floor(textUv.y));
        float rowSpeedVariation = mix(0.5, 1.5, random2d(rowSeed));
        textUv.x -= uTime * 0.2 * rowSpeedVariation;

        vec2 gridCell = floor(textUv);
        vec2 cellUv = fract(textUv);
        float timeStep = floor(uTime * 0.6);

        float glyphShape = step(random2d(gridCell + floor(cellUv.y * 4.0) + currentScreenIndex + timeStep), 0.45);            
        float wordSpacing = step(0.25, random2d(gridCell * 0.13 + currentScreenIndex * 7.13));
        float finalGlyph = glyphShape * wordSpacing;

        vec3 screenColor = uHoloColor * (screenMask * 2.0);
        vec3 generatedHolo = mix(screenColor, uGlyphColor, finalGlyph);

        float isHoloActive = step(2.99, uNumber) * step(uNumber, 3.01) * step(0.0, screenMask);
        vec3 holoGlow = generatedHolo * isHoloActive;
        float activeScreenMask = screenMask * isHoloActive;


        vec3 standardHull = (baseColor.rgb * 1.05) + emissiveGlow + windowsGlow;
        vec3 finalOutput = mix(standardHull, holoGlow, activeScreenMask);

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ ExoSpireMaterial });

const ExoSpireCapMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#00ffcc"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uEmissiveColor;

    void main() {
        vec4 baseColor = texture2D(uTexture, vUv);
        if (baseColor.a < 0.01) discard;

        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);


        float outerRadius = 0.5;
        float blur = 0.02;
        float screenMaskOuter = smoothstep(outerRadius, outerRadius - blur, dist);

        float innerRadius = outerRadius - 0.1;
        float screenMaskInner = smoothstep(innerRadius, innerRadius - blur, dist);

        float edgeMask = max(screenMaskOuter - screenMaskInner, 0.0);


        float glowPulse = sin(uTime * 2.0) * 0.4 + 0.6;

        float masterFade = sin(uTime * 0.5) * 0.5 + 0.5;
        masterFade *= masterFade;

        float totalGlowScale = edgeMask * glowPulse * masterFade * 4.0;
        vec3 edgeGlow = uEmissiveColor * totalGlowScale;


        vec3 finalOutput = (baseColor.rgb * 1.05) + edgeGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ ExoSpireCapMaterial });

const ExoWallMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uRepeat: 4.0,
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uGridSize: new THREE.Vector2(8.0, 8.0),
        uEmissiveColor: new THREE.Color("#00ffcc"),
        uWindowColor: new THREE.Color("#ff6600"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    uniform sampler2D uEmissiveMap;
    uniform vec3 uEmissiveColor;
    uniform sampler2D uWindowsMap;
    uniform vec3 uWindowColor;

    ${SHARED_HASH}

    void main() {         
        vec2 repeatedUv = vec2(fract(vUv.x * uRepeat), vUv.y);
        vec4 colorA = texture2D(uTexture, repeatedUv);
        vec2 flippedUv = vec2(1.0 - repeatedUv.x, repeatedUv.y);
        vec4 colorB = texture2D(uTexture, flippedUv);
        
        float distFromCenter = abs(repeatedUv.x - 0.5); 
        float seamBlendFactor = smoothstep(0.45, 0.50, distFromCenter);
        vec4 baseColor = mix(colorA, colorB, seamBlendFactor * 0.5);
        
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, repeatedUv).r;
        float windowsMask = texture2D(uWindowsMap, repeatedUv).r;

        vec2 gridCoords = floor(repeatedUv * uGridSize);
        float sectorRandom = hash(gridCoords);


        float linearTime = fract(uTime * 0.1); // Direct multiplier substitution
        float pingPongTime = 1.0 - abs(linearTime * 2.0 - 1.0);

        float maxDistance = 0.50;
        float waveFront = maxDistance * pingPongTime; // Simplified mix(0.0, 0.5, x)
        
        float distToWave = abs(distFromCenter - waveFront);
        float pulseIntensity = smoothstep(0.08, 0.0, distToWave);
        
        float edgeFade = smoothstep(maxDistance, maxDistance - 0.03, distFromCenter);
        pulseIntensity *= edgeFade; // 'step(0.0, distFromCenter)' dropped here (redundant math)
        
        float periodicFlare = mix(1.5, 5.0, pingPongTime);
        float totalEmissiveScale = pulseIntensity * periodicFlare * (emissiveMask + 0.1);

        float hasEmissive = step(0.15, emissiveMask);
        vec3 emissiveGlow = uEmissiveColor * (totalEmissiveScale * hasEmissive);


        float slowPulse = cos(uTime * 0.8 + sectorRandom * 10.0) * 0.5 + 0.5;
        float dropDice = hash(vec2(floor(uTime), sectorRandom));
        
        float voltage = mix(1.0, 0.2, step(dropDice, 0.10));
        float totalWindowScale = slowPulse * voltage * 5.0 * windowsMask;

        float hasWindows = step(0.05, windowsMask);
        vec3 windowsGlow = uWindowColor * (totalWindowScale * hasWindows);


        vec3 finalOutput = (baseColor.rgb * 1.05) + emissiveGlow + windowsGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ ExoWallMaterial });

const ExoCapMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uEmissiveMap: new THREE.Texture(),
        uLightsMap: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#00ffcc"),
        uLightColor: new THREE.Color("#ff0000"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uLightsMap;
    uniform vec3 uEmissiveColor;
    uniform vec3 uLightColor;

    ${SHARED_HASH}

    void main() {         
        vec4 baseColor = texture2D(uTexture, vUv);
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, vUv).r;
        float lightsMask = texture2D(uLightsMap, vUv).r;

        vec2 centerUv = vUv - vec2(0.5);
        float radius = length(centerUv) * 2.0;
        float angle = atan(centerUv.y, centerUv.x);
        float normalizedAngle = (angle + 3.14159265) * 0.159154943;

        vec2 sectorId = floor(vec2(normalizedAngle * 90.0, radius * 40.0));
        float sectorRandom = hash(sectorId);

        float waveSpeed = 0.4;
        
        float localWaveTime = mod(uTime, 10.0); 
        float waveFront = waveSpeed * localWaveTime;
        float distanceBehindFront = waveFront - radius;

        float decayFactor = exp(-12.0 * max(0.0, distanceBehindFront));
        float smoothCutoff = smoothstep(0.0, 0.05, distanceBehindFront);
        
        float isBehindFront = step(0.0, distanceBehindFront);
        float progressEnvelope = decayFactor * smoothCutoff * isBehindFront;

        float edgeFade = smoothstep(1.0, 0.8, radius);
        progressEnvelope *= edgeFade;


        float hasEnvelope = step(0.01, progressEnvelope);
        
        float hasEmissive = step(0.05, emissiveMask) * hasEnvelope;
        float finalEmissiveScalar = progressEnvelope * 5.0 * (emissiveMask + 0.1) * hasEmissive;
        vec3 emissiveGlow = uEmissiveColor * finalEmissiveScalar;


        float halfTime = uTime * 0.5;
        float timeStep = floor(halfTime); 

        float noiseValue = hash(vec2(timeStep, sectorRandom));
        float nextNoise  = hash(vec2(timeStep + 1.0, sectorRandom));

        float interpolation = fract(halfTime);
        float smoothNoise   = mix(noiseValue, nextNoise, smoothstep(0.0, 1.0, interpolation));
        float breath        = smoothstep(0.4, 0.6, smoothNoise);

        float flickerNoise = hash(vec2(floor(uTime * 15.0), sectorRandom));
        float baseFlicker  = mix(1.0, 0.4, step(flickerNoise, 0.15));

        float fade         = step(0.2, breath);
        float flicker      = mix(1.0, baseFlicker, fade);

        float lightIntensity = breath * flicker;

        float dropDice = hash(vec2(floor(uTime * 2.0), sectorRandom));
        float voltage  = step(0.10, dropDice);

        float hasLights = step(0.15, lightsMask);

        float combinedGlowFactor = clamp(lightIntensity * voltage * 5.0, 0.0, 5.0);

        vec3 lightsGlow = uLightColor * (combinedGlowFactor * lightsMask * hasLights);


        vec3 finalOutput = (baseColor.rgb * 1.05) + emissiveGlow + lightsGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ ExoCapMaterial });

const LatticeMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color("#0066ff"),
        uBaseOpacity: 1.0,
        uSeed: Math.random() * 1000.0,
    },
    // Vertex Shader
    `
    attribute float aLineId;
    varying float vLineId;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vLineId = aLineId;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    varying float vLineId;
    
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uBaseOpacity;
    uniform float uSeed;

    float hash(float n) { 
      return fract(sin(n) * 43758.5453123); 
    }

    float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash(i), hash(i + 1.0), u);
    }

    void main() {
        float slowDrift = noise(uTime * 0.4 + uSeed + vLineId); 
        float smoothFade = smoothstep(0.1, 0.9, slowDrift);
        
        float flickerCheckSpeed = 5.0; 
        float fastHash = hash(floor(uTime * flickerCheckSpeed) + uSeed + vLineId);
        
        float stutterSpeed = 0.001; 
        float stutterValue = mix(0.15, 1.0, hash(uTime * stutterSpeed + vLineId));
        
        float isStuttering = step(fastHash, 0.02);
        float flicker = mix(1.0, stutterValue, isStuttering);

        float glowNoise = noise(uTime * 0.7 + uSeed * 2.0 + vLineId);
        float glowIntensity = mix(1.0, 5.0, smoothstep(0.3, 0.9, glowNoise));

        float sharedFadeFactor = smoothFade * flicker;

        float finalAlpha = uBaseOpacity * sharedFadeFactor;
        vec3 finalColor = uColor * (glowIntensity * sharedFadeFactor);

        gl_FragColor = vec4(finalColor, finalAlpha);
    }
    `
);
extend({ LatticeMaterial });

function assignLineIds(geometry) {
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    const lineIds = new Float32Array(vertexCount);

    for (let i = 0; i < vertexCount; i += 2) {
        const randomId = Math.random() * 1000.0;

        lineIds[i] = randomId;
        if (i + 1 < vertexCount) {
            lineIds[i + 1] = randomId;
        }
    }

    geometry.setAttribute('aLineId', new THREE.BufferAttribute(lineIds, 1));
    return geometry;
}

function Core({ config = [], isInView = false, entranceProgress }) {
    const groupRef = useRef();
    const strutGroupRef = useRef()
    const spireGroupRef = useRef();
    const exoGroupRef = useRef();

    const latticeRef = useRef();
    const latticeUniforms = useRef({
        uTime: { value: 0 },
        uSeed: { value: Math.random() * 500.0 },
        uColor: { value: new THREE.Color("#70d6ff") },
        uBaseOpacity: { value: 1.0 }
    });

    const accumulator = useRef(0);

    const { mousePosRef } = useAnimateContext();

    const {
        width: strutwidth, height: strutheight, depth: strutdepth,
        texture: corestrut, emissivemask: corestrutemissive, windowsmask: corestrutwindows,
    } = config[0];
    const startX = config[0].startX * (Math.PI / 180);
    const startY = config[0].startY * (Math.PI / 180);
    const {
        latticeRadius, detail,
        latticeRotXSpeed, latticeRotYSpeed, latticeRotZSpeed
    } = config[1];
    const {
        radiusTop: exoradiustop, radiusBottom: exoradiusbottom, height: exoheight,
        segments: exosegments,
    } = config[5];

    const seed = useMemo(() => Math.random() * 1000, []);

    const textureMap = useKTX2(
        {
            strut: config[0]?.texture || BLANK_FALLBACK,
            strutEmissive: config[0]?.emissivemask || BLANK_FALLBACK,
            strutWindows: config[0]?.windowsmask || BLANK_FALLBACK,
            strutSide: config[0]?.sidetexture || BLANK_FALLBACK,

            spire1: config[2]?.texture || BLANK_FALLBACK,
            spire1Emissive: config[2]?.emissivemask || BLANK_FALLBACK,
            spire1Windows: config[2]?.windowsmask || BLANK_FALLBACK,
            spirecap: config[2]?.captexture || BLANK_FALLBACK,
            spire2: config[3]?.texture || BLANK_FALLBACK,
            spire2Emissive: BLANK_FALLBACK,
            spire2Windows: config[3]?.windowsmask || BLANK_FALLBACK,
            spire3: config[4]?.texture || BLANK_FALLBACK,
            spire3Emissive: BLANK_FALLBACK,
            spire3Windows: config[4]?.windowsmask || BLANK_FALLBACK,

            exowall: config[5]?.texture || BLANK_FALLBACK,
            exowallEmissive: config[5]?.emissivemask || BLANK_FALLBACK,
            exowallWindows: config[5]?.windowsmask || BLANK_FALLBACK,
            exocap: config[6]?.texture || BLANK_FALLBACK,
            exocapEmissive: config[6]?.emissivemask || BLANK_FALLBACK,
            exocapLights: config[6]?.lightsmask || BLANK_FALLBACK,
        });
    useConfigureTextures(textureMap);

    const spireConfig = useMemo(() => {
        return config.slice(2, 5).map((item, i) => {
            const spireNum = i + 1;

            return {
                id: `spire${spireNum}`,
                height: item.height,
                radiusTop: item.radiusTop,
                radiusBottom: item.radiusBottom,
                spireSegments: item.segments,
                texture: textureMap[`spire${spireNum}`],
                emissiveMap: textureMap[`spire${spireNum}Emissive`],
                windowsMap: textureMap[`spire${spireNum}Windows`],
                capTexture: textureMap[`spirecap`],
            };
        });
    }, [config, textureMap]);

    const edgesGeometry = useMemo(() => {
        const baseGeo = new THREE.IcosahedronGeometry(latticeRadius, detail);

        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const angle = Math.atan(1 / goldenRatio);
        baseGeo.rotateX(angle);

        let edges = new THREE.EdgesGeometry(baseGeo);
        edges = assignLineIds(edges);

        baseGeo.dispose();
        return edges;
    }, []);

    useCanvasSectionFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime();

        const progress = entranceProgress.current;
        const entranceOffset = (1 - entranceProgress.current) * -Math.PI;
        groupRef.current.rotation.z = entranceOffset + t * (config[0]?.rotZSpeed || -0.04);

        const baseX = (mousePosRef.current.y * (config[0].rotX[1] - config[0].rotX[0])) * (Math.PI / 180);
        const baseY = (mousePosRef.current.x * (config[0].rotY[1] - config[0].rotY[0])) * (Math.PI / 180);

        const targetX = startX + (baseX - startX) * progress;
        const targetY = startY + (baseY - startY) * progress;

        groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetX, 0.1);
        groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetY, 0.1);

        if (strutGroupRef.current) {
            strutGroupRef.current.traverse((child) => {
                if (child.isMesh) {
                    if (child.material && child.material.uniforms) {
                        child.material.uniforms.uTime.value = t;
                    }
                }
            });
        }

        if (spireGroupRef.current) {
            spireGroupRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => {
                            if (mat.uniforms && mat.uniforms.uTime) {
                                mat.uniforms.uTime.value = t
                            }
                        })
                    } else {
                        if (child.material.uniforms && child.material.uniforms.uTime) {
                            child.material.uniforms.uTime.value = t
                        }
                    }

                }
            });
        }

        if (exoGroupRef.current) {
            exoGroupRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => {
                            if (mat.uniforms && mat.uniforms.uTime) {
                                mat.uniforms.uTime.value = t
                            }
                        })
                    } else {
                        if (child.material.uniforms && child.material.uniforms.uTime) {
                            child.material.uniforms.uTime.value = t
                        }
                    }

                }
            });
        }

        if (latticeUniforms.current) {
            latticeUniforms.current.uTime.value = t;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group ref={groupRef}>
            <group ref={strutGroupRef} rotation={[NINETY_DEGREES, 0, 0]}>
                {[...Array(2)].map((_, i) => (
                    <mesh
                        key={i}
                        position={[0, 0, 0]}
                        rotation={[0, (i * Math.PI) / 2, 0]}
                    >
                        <boxGeometry args={[strutwidth, strutheight, strutdepth]} />
                        <strutMaterial
                            uTexture={textureMap.strut}
                            uEmissiveMap={textureMap.strutEmissive}
                            uWindowsMap={textureMap.strutWindows}
                            uSideTexture={textureMap.strutSide}
                        />
                    </mesh>
                ))}
            </group>

            <group ref={spireGroupRef}>
                {spireConfig.map((spire, i) => (
                    <group key={i}>
                        {[1, -1].map((dir, j) => (
                            <mesh
                                key={j}
                                position={[0, 0, (spire.height / 2) * dir]}
                                rotation={[NINETY_DEGREES * dir, 0, 0]}
                            >
                                <cylinderGeometry
                                    args={[
                                        spire.radiusTop,
                                        spire.radiusBottom,
                                        spire.height,
                                        spire.spireSegments,
                                        1,
                                    ]}
                                />

                                {/* Material Index 0: Side Walls */}
                                <exoSpireMaterial
                                    attach="material-0"
                                    uNumber={i + 1}
                                    uTexture={spire.texture}
                                    uEmissiveMap={spire.emissiveMap}
                                    uWindowsMap={spire.windowsMap}
                                />

                                {/* Material Index 1: Top Cap */}
                                <exoSpireCapMaterial
                                    attach="material-1"
                                    uTexture={spire.capTexture}
                                />

                                {/* Material Index 2: Bottom Cap (Hidden) */}
                                <meshBasicMaterial
                                    attach="material-2"
                                    visible={false}
                                />
                            </mesh>
                        ))}
                    </group>
                ))}
            </group>

            <group ref={exoGroupRef}>
                <mesh rotation={[NINETY_DEGREES, 0, 0]}>
                    <cylinderGeometry args={[0.6, 0.6, 0.6, 32, 32]} />
                    <exoWallMaterial
                        attach="material-0"
                        uTexture={textureMap.exowall}
                        uEmissiveMap={textureMap.exowallEmissive}
                        uWindowsMap={textureMap.exowallWindows}
                    />
                    <exoCapMaterial
                        attach="material-1"
                        uTexture={textureMap.exocap}
                        uEmissiveMap={textureMap.exocapEmissive}
                        uLightsMap={textureMap.exocapLights}
                    />
                    <exoCapMaterial
                        attach="material-2"
                        uTexture={textureMap.exocap}
                        uEmissiveMap={textureMap.exocapEmissive}
                        uLightsMap={textureMap.exocapLights}
                    />
                </mesh>
            </group>

            <lineSegments ref={latticeRef} geometry={edgesGeometry}>
                <latticeMaterial
                    uniforms={latticeUniforms.current}
                    transparent
                />
            </lineSegments>
        </group>
    );
}

const InnerRingOuterWallMaterial = shaderMaterial(
    {
        uTime: 0,
        uSeed: Math.random() * 10000.0,
        uTexture: new THREE.Texture(),
        uRepeat: 7.0,
        uGridSize: new THREE.Vector2(64.0, 64.0),

        uCityMap1: new THREE.Texture(),
        uCityMap2: new THREE.Texture(),
        uCityMap3: new THREE.Texture(),
        uCityMap4: new THREE.Texture(),
        uCityMap5: new THREE.Texture(),

        uTextureCount: 5.0,
        uCityColor: new THREE.Color("#f29641"),
        uTrackColor: new THREE.Color("#1AB3FF"),
        uTrackLightColor: new THREE.Color("#ff0000"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    precision highp float;

    varying vec2 vUv;

    uniform float uTime;
    uniform float uSeed;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    
    uniform sampler2D uCityMap1;
    uniform sampler2D uCityMap2;
    uniform sampler2D uCityMap3;
    uniform sampler2D uCityMap4;
    uniform sampler2D uCityMap5;
    
    uniform float uTextureCount;
    uniform vec3 uCityColor;
    uniform vec3 uTrackColor;
    uniform vec3 uTrackLightColor;

    ${SHARED_HASH}

    float seededTileHash(float tileId, float seed) {
        uint x = uint(int(tileId));
        uint y = uint(int(seed));
        
        x = (x ^ (y >> 11u)) * 0x45D9F3Bu;
        x = ((x >> 16u) ^ x) * 0x45D9F3Bu;
        x = ((x >> 16u) ^ x) + y;
        x = ((x >> 16u) ^ x) * 0x45D9F3Bu;
        x = (x >> 16u) ^ x;
        
        return float(x) / 4294967295.0; 
    }

    float sampleIndividualMaps(float targetIndex, vec2 uv) {
        float mask = 0.0;
        
        mask += texture2D(uCityMap1, uv).r * (step(-0.5, targetIndex) * step(targetIndex, 0.5));
        mask += texture2D(uCityMap2, uv).r * (step(0.5, targetIndex) * step(targetIndex, 1.5));
        mask += texture2D(uCityMap3, uv).r * (step(1.5, targetIndex) * step(targetIndex, 2.5));
        mask += texture2D(uCityMap4, uv).r * (step(2.5, targetIndex) * step(targetIndex, 3.5));
        mask += texture2D(uCityMap5, uv).r * (step(3.5, targetIndex) * step(targetIndex, 4.5));
        
        return mask;
    }

    void main() {
        float globalX = vUv.x * uRepeat;
        float tileId = floor(globalX);

        vec2 repeatedUv = vec2(fract(globalX), vUv.y);
        vec4 colorA = texture2D(uTexture, repeatedUv);
        vec2 flippedUv = vec2(1.0 - repeatedUv.x, repeatedUv.y);
        vec4 colorB = texture2D(uTexture, flippedUv);
        
        float distFromCenterX = abs(repeatedUv.x - 0.5); 
        float seamBlendFactor = smoothstep(0.45, 0.50, distFromCenterX);
        vec4 baseColor = mix(colorA, colorB, seamBlendFactor * 0.5);
        
        if (baseColor.a < 0.01) discard;

        float randomValue = seededTileHash(tileId, uSeed);
        float layerIndex = clamp(floor(randomValue * uTextureCount), 0.0, uTextureCount - 1.0);
        float centerCityMask = sampleIndividualMaps(layerIndex, repeatedUv);

        float edgeLayerIndex = mod(layerIndex + 1.0, uTextureCount);
        vec2 offsetUv = vec2(fract(repeatedUv.x + 0.5), repeatedUv.y);
        float edgeCityMask = sampleIndividualMaps(edgeLayerIndex, offsetUv);

        float cityMask = max(centerCityMask, edgeCityMask);
        float edgeGlowDriver = smoothstep(0.4, 0.5, distFromCenterX) * 0.5;
        float finalCityMask = max(cityMask, edgeGlowDriver);

        vec2 globalGridCoords = floor(vec2(globalX, vUv.y) * uGridSize);
        float sectorRandom = hash(globalGridCoords);

        float distFromCenter = distance(repeatedUv, vec2(0.5));
        float centerWeight = smoothstep(1.0, 0.0, distFromCenter);
        float edgeWeight = smoothstep(0.0, 0.8, distFromCenterX);
        float cityWeight = max(centerWeight, edgeWeight);

        float flicker = sin(uTime * (15.0 + sectorRandom * 4.0) + sectorRandom * 10.0) * 0.5 + 0.5;
        float flickerStability = mix(0.2, 0.6, cityWeight);
        float dynamicGlowModifier = mix(1.0, flicker, 1.0 - flickerStability);
        
        float edgeBrightnessBoost = edgeWeight * 2.0;
        float centerBrightnessBoost = 1.0 + (cityWeight * 2.5);
        float totalGlowIntensity = finalCityMask * (centerBrightnessBoost + edgeBrightnessBoost) * dynamicGlowModifier * 2.5;
        vec3 cityGlow = uCityColor * totalGlowIntensity;

        float activeScreenMask = cityMask * step(0.02, cityMask);
        vec3 standardHull = baseColor.rgb * 1.05;
        vec3 finalOutput = mix(standardHull, cityGlow, activeScreenMask);

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ InnerRingOuterWallMaterial });

const InnerRingInnerWallMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uEmissiveMap: new THREE.Texture(),
        uRepeat: 11.0,
        uGridSize: new THREE.Vector2(8.0, 16.0),
        uEmissiveColor: new THREE.Color("#ff7700"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform sampler2D uEmissiveMap;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    uniform vec3 uEmissiveColor;

    ${SHARED_HASH}

    void main() {
        vec2 repeatedUv = vec2(fract(vUv.x * uRepeat), vUv.y);
        vec4 colorA = texture2D(uTexture, repeatedUv);
        vec2 flippedUv = vec2(1.0 - repeatedUv.x, repeatedUv.y);
        vec4 colorB = texture2D(uTexture, flippedUv);
        
        float distFromCenter = abs(repeatedUv.x - 0.5); 
        float seamBlendFactor = smoothstep(0.45, 0.50, distFromCenter);
        vec4 baseColor = mix(colorA, colorB, seamBlendFactor * 0.5);
        
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, repeatedUv).r;

        vec2 globalGridSize = vec2(uGridSize.x * uRepeat, uGridSize.y);
        vec2 gridCoords = floor(vUv * globalGridSize);


        float sectorRandom = hash(gridCoords);
        float glowSpeed = 1.2;
        float sectorTimeOffset = sectorRandom * 12.34;

        float randomPulse = sin(uTime * glowSpeed + sectorTimeOffset) * 0.5 + 0.5;
        randomPulse = pow(randomPulse, 4.0);
        
        float edgeFadeZone = 0.10; 
        float edgeFade = smoothstep(0.0, edgeFadeZone, vUv.y) * smoothstep(1.0, 1.0 - edgeFadeZone, vUv.y);
        
        float emissiveIntensity = randomPulse * 6.0 * edgeFade * (0.4 + 0.6 * sectorRandom);
        
        float hasEmissive = step(0.05, emissiveMask);
        
        vec3 emissiveGlow = uEmissiveColor * (emissiveIntensity * (emissiveMask + 0.1) * hasEmissive);


        vec3 finalOutput = (baseColor.rgb * 1.05) + emissiveGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ InnerRingInnerWallMaterial });

const InnerRingFaceMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#0088ff"),
        uWindowColor: new THREE.Color("#ff6600"),
        uStreamColor: new THREE.Color("#00e8ff"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uWindowsMap;
    uniform float uTime;
    uniform vec3 uEmissiveColor;
    uniform vec3 uWindowColor;
    uniform vec3 uStreamColor;

    ${SHARED_HASH}

    void main() {
        vec4 baseColor = texture2D(uTexture, vUv);
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, vUv).r;
        float windowsMask = texture2D(uWindowsMap, vUv).r;

        vec2 centerUv = vUv - vec2(0.5);
        float radius = length(centerUv);
        float angle = atan(centerUv.y, centerUv.x);
        float normalizedAngle = (angle + 3.14159265) * 0.159154943;

        vec2 sectorId = floor(vec2(normalizedAngle * 32.0, radius * 80.0));
        float sectorRandom = hash(sectorId);


        float waveInterval = 4.0;
        float localTime = mod(uTime, waveInterval);
        float waveSpeed = 0.2;
        float waveFront = localTime * waveSpeed;
        
        float distToWave = abs(radius - waveFront);
        float waveThickness = 0.08;
        float emissiveWave = smoothstep(waveThickness, 0.0, distToWave);
        
        float edgeFade = smoothstep(0.65, 0.35, radius);
        float emissiveIntensity = emissiveWave * 4.0 * edgeFade;
        
        float hasEmissive = step(0.05, emissiveMask); 
        vec3 emissiveGlow = uEmissiveColor * (emissiveIntensity * emissiveMask * hasEmissive);


        float slowPulse = cos(uTime * 0.8 + sectorRandom * 10.0) * 0.5 + 0.5;
        float dropDice = hash(vec2(floor(uTime * 2.0), sectorRandom));
        
        float voltage = mix(1.0, 0.2, step(dropDice, 0.10)); 
        
        float hasWindows = step(0.05, windowsMask);
        vec3 windowsGlow = uWindowColor * (slowPulse * voltage * 15.0 * windowsMask * hasWindows);


        vec3 finalOutput = (baseColor.rgb * 1.05) + emissiveGlow + windowsGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ InnerRingFaceMaterial });

const InnerRing = memo(function InnerRing({ config, isInView = false, entranceProgress }) {
    const innerRingRef = useRef();
    const outerwallMaterialRef = useRef();
    const innerwallMaterialRef = useRef();
    const frontfaceMaterialRef = useRef();
    const backfaceMaterialRef = useRef();

    const accumulator = useRef(0);

    const { mousePosRef } = useAnimateContext();

    const { outerRadius, innerRadius, depth, segments } = config;
    const startX = config.startX * (Math.PI / 180);
    const startY = config.startY * (Math.PI / 180);
    const { face, emissivemask, windowsmask, outerwall, innerwall, innerwallemissive } = config;
    const seed = useMemo(() => Math.random() * 1000, []);

    const textures = useKTX2(
        [
            face || BLANK_FALLBACK,
            emissivemask || BLANK_FALLBACK,
            windowsmask || BLANK_FALLBACK,
            outerwall || BLANK_FALLBACK,
            innerwall || BLANK_FALLBACK,
            innerwallemissive || BLANK_FALLBACK,
        ]);

    const [
        faceTexture,
        faceemissiveTexture,
        windowsTexture,
        outerwallTexture,
        innerwallTexture,
        innerwallemissiveTexture,
    ] = textures;

    useConfigureTextures(textures);

    const citymapTextures = useKTX2(citymaparray);
    useConfigureTextures(citymapTextures);
    const texArrayCount = citymapTextures.length;

    useCanvasSectionFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        if (!innerRingRef.current) return;

        const t = state.clock.getElapsedTime();

        const progress = entranceProgress.current;
        const entranceOffset = (1 - entranceProgress.current) * -Math.PI;
        innerRingRef.current.rotation.z = entranceOffset + t * config.rotZSpeed;

        const baseX = (mousePosRef.current.y * (config.rotX[1] - config.rotX[0])) * (Math.PI / 180);
        const baseY = (mousePosRef.current.x * (config.rotY[1] - config.rotY[0])) * (Math.PI / 180);

        const targetX = startX + (baseX - startX) * progress;
        const targetY = startY + (baseY - startY) * progress;

        innerRingRef.current.rotation.x = lerp(innerRingRef.current.rotation.x, targetX, 0.1);
        innerRingRef.current.rotation.y = lerp(innerRingRef.current.rotation.y, targetY, 0.1);

        if (outerwallMaterialRef.current) {
            outerwallMaterialRef.current.uTime = t;
        }
        if (innerwallMaterialRef.current) {
            innerwallMaterialRef.current.uTime = t;
        }
        if (frontfaceMaterialRef.current) {
            frontfaceMaterialRef.current.uTime = t;
        }
        if (backfaceMaterialRef.current) {
            backfaceMaterialRef.current.uTime = t;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group ref={innerRingRef}>
            {/* 1. OUTER HULL (Facing Outwards) */}
            <mesh position={[0, 0, 0]} rotation={[NINETY_DEGREES, 0, 0]}>
                <cylinderGeometry
                    args={[outerRadius, outerRadius, depth, segments, 1, true]}
                />
                <innerRingOuterWallMaterial
                    ref={outerwallMaterialRef}
                    uTexture={outerwallTexture}
                    uCityMap1={citymapTextures[0]}
                    uCityMap2={citymapTextures[1]}
                    uCityMap3={citymapTextures[2]}
                    uCityMap4={citymapTextures[3]}
                    uCityMap5={citymapTextures[4]}
                    uTextureCount={texArrayCount}
                    side={THREE.FrontSide}
                />
            </mesh>
            {/* 2. INNER TUNNEL WALL (Facing Inwards) */}
            <mesh position={[0, 0, 0]} rotation={[NINETY_DEGREES, 0, 0]}>
                <cylinderGeometry
                    args={[innerRadius, innerRadius, depth, segments, 1, true]}
                />
                <innerRingInnerWallMaterial
                    ref={innerwallMaterialRef}
                    uTexture={innerwallTexture}
                    uEmissiveMap={innerwallemissiveTexture}
                    side={THREE.BackSide}
                />
            </mesh>
            {/* 3. FRONT CAP (The forward-facing ring rim) */}
            <mesh position={[0, 0, depth / 2]}>
                <ringGeometry
                    args={[innerRadius, outerRadius, segments]}
                />
                <innerRingFaceMaterial
                    ref={frontfaceMaterialRef}
                    uTexture={faceTexture}
                    uEmissiveMap={faceemissiveTexture}
                    uWindowsMap={windowsTexture}
                    uSeed={seed}
                    side={THREE.FrontSide}
                />
            </mesh>
            {/* 4. BACK CAP (The rear-facing ring rim) */}
            <mesh position={[0, 0, -depth / 2]}>
                <ringGeometry
                    args={[innerRadius, outerRadius, segments]}
                />
                <innerRingFaceMaterial
                    ref={backfaceMaterialRef}
                    uTexture={faceTexture}
                    uEmissiveMap={faceemissiveTexture}
                    uWindowsMap={windowsTexture}
                    uSeed={seed}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
});

const OuterRingOuterWallMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uRepeat: 16.0,
        uGridSize: new THREE.Vector2(16.0, 16.0),
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#40A8FF"),
        uWindowColor: new THREE.Color("#ff0000"),
        uHoloColor: new THREE.Color("#EFF2F6"),
        uGlyphColor: new THREE.Color("#FFAB20"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform vec2 uGridSize;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uWindowsMap;
    uniform vec3 uEmissiveColor;
    uniform vec3 uWindowColor;
    uniform vec3 uHoloColor;
    uniform vec3 uGlyphColor;

    ${SHARED_HASH}

    float noise(float t) {
        return fract(sin(t * 12.9898) * 43758.5453);
    }

    float random2d(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
        vec2 repeatedUv = vec2(fract(vUv.x * uRepeat), vUv.y);
        vec2 flippedUv  = vec2(1.0 - repeatedUv.x, repeatedUv.y);

        vec4 colorA       = texture2D(uTexture, repeatedUv);
        vec4 colorB       = texture2D(uTexture, flippedUv);
        float emissiveMask = texture2D(uEmissiveMap, repeatedUv).r;
        float windowsMask  = texture2D(uWindowsMap, repeatedUv).r;

        float distFromCenter = abs(repeatedUv.x - 0.5); 
        float seamBlendFactor = smoothstep(0.45, 0.50, distFromCenter);
        vec4 baseColor = mix(colorA, colorB, seamBlendFactor * 0.5);
        
        if (baseColor.a < 0.01) discard;

        vec2 gridCoords = floor(repeatedUv * uGridSize);
        float sectorRandom = hash(gridCoords);


        vec2 centerUv = vUv - vec2(0.5);
        float distFromCenterV = length(centerUv);

        float travelWave = sin(uTime * 1.0 - distFromCenterV * 3.0) * 0.5 + 0.5;
        float wavePulse  = travelWave * travelWave * travelWave;
        
        float edgeFade = smoothstep(0.0, 0.10, vUv.y) * smoothstep(1.0, 0.90, vUv.y);
        float emissiveIntensity = wavePulse * 2.5 * edgeFade * (0.6 + 0.4 * sectorRandom);
        
        float finalEmissiveActivation = step(0.05, emissiveMask);
        vec3 emissiveGlow = uEmissiveColor * emissiveIntensity * (emissiveMask + 0.1) * finalEmissiveActivation;


        float slowPulse = cos(uTime * 0.8 + sectorRandom * 10.0) * 0.5 + 0.5;
        float dropDice  = hash(vec2(floor(uTime * 1.0), sectorRandom));
        
        float voltage = mix(1.0, 0.6, step(dropDice, 0.10));
        float finalWindowActivation = step(0.05, windowsMask);
        vec3 windowsGlow = uWindowColor * (slowPulse * slowPulse * voltage * 25.0) * windowsMask * finalWindowActivation;


        float xMask = smoothstep(0.41, 0.43, repeatedUv.x) * smoothstep(0.59, 0.57, repeatedUv.x);
        float yMask = smoothstep(0.32, 0.35, repeatedUv.y) * smoothstep(0.68, 0.65, repeatedUv.y);
        float screenMask = xMask * yMask;

        float flicker = mix(0.8, 1.2, noise(floor(uTime * 15.0)));
        float currentScreenIndex = floor(vUv.x * uRepeat);
        
        vec2 textUv = repeatedUv * 12.0; 
        vec2 rowSeed = vec2(currentScreenIndex, floor(textUv.y));
        textUv.x -= floor(uTime * 0.8) * random2d(rowSeed);

        vec2 gridCell = floor(textUv);
        vec2 cellUv   = fract(textUv);

        float glyphShape = step(random2d(gridCell + floor(cellUv.y * 4.0) + currentScreenIndex), 0.45);
        float wordSpacing = step(0.25, random2d(gridCell * 0.13 + currentScreenIndex * 7.13));
        float finalGlyph = glyphShape * wordSpacing;

        vec3 screenColor = uHoloColor * (screenMask * 2.0);
        vec3 glyphLayer = uGlyphColor * finalGlyph;
        vec3 background = screenColor * (1.0 - finalGlyph);
        vec3 generatedHolo = background + glyphLayer;

        vec3 holoGlow = generatedHolo * 2.0;
        float activeScreenMask = screenMask;


        vec3 standardHull = (baseColor.rgb * 1.05) + emissiveGlow + windowsGlow;
        vec3 finalOutput = mix(standardHull, holoGlow, activeScreenMask);

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ OuterRingOuterWallMaterial });

const OuterRingInnerWallMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uRepeat: 11.0,
        uGridSize: new THREE.Vector2(128.0, 128.0),
        uTrackColor: new THREE.Color("#1AB3FF"),
        uTrackLightColor: new THREE.Color("#ff0000"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uRepeat;
    uniform float uTime;
    uniform vec2 uGridSize;
    uniform vec3 uTrackColor;
    uniform vec3 uTrackLightColor;

    ${SHARED_HASH}

    void main() {
        vec2 repeatedUv = vec2(fract(vUv.x * uRepeat), vUv.y);
        vec4 baseColor = texture2D(uTexture, repeatedUv);
        if (baseColor.a < 0.01) discard;

        vec2 globalGridSize = vec2(uGridSize.x * uRepeat, uGridSize.y);
        vec2 gridCoords = floor(vUv * globalGridSize);
        
        vec2 tileId = floor(gridCoords / uGridSize);
        vec2 tileNoise = vec2(
            hash(tileId + 1.234), // .x = tileNoiseFlare
            hash(tileId + 5.678)  // .y = tileNoiseFade
        );

        vec2 cellRandom = vec2(
            hash(gridCoords),       // .x = cellRandom1
            hash(gridCoords * 1.5)  // .y = cellRandom2
        );
        
 
        float warmedTime = uTime + 123.45;
        float halfTime = warmedTime * 0.15;
        float structureTimeStep = floor(halfTime + cellRandom.y * 0.2);

        float hLineThick = step(0.82, hash(vec2(floor(gridCoords.y / 4.0), structureTimeStep)));
        float vLineThick = step(0.82, hash(vec2(floor(gridCoords.x / 4.0), structureTimeStep + 4.3)));
        float primaryLattice = max(hLineThick, vLineThick);

        float hLineThin = step(0.72, hash(vec2(floor(gridCoords.y / 1.5), structureTimeStep * 1.7)));
        float vLineThin = step(0.72, hash(vec2(floor(gridCoords.x / 1.5), structureTimeStep * 1.7 + 9.1)));
        float secondaryLattice = max(hLineThin, vLineThin) * 0.4;

        float macroLatticeNetwork = clamp(primaryLattice + secondaryLattice, 0.0, 1.0);


        vec2 clusterGridCoords = floor(gridCoords / 2.0);
        float clusterTimeStep = floor(uTime * 0.4 + hash(clusterGridCoords) * 5.0);
        
        float clusterMask = step(0.78, hash(clusterGridCoords + clusterTimeStep * 0.23));


        float fadeWave = sin(uTime * (0.8 + cellRandom.y * 0.4) + cellRandom.x * 6.28);
        float networkPulse = smoothstep(-0.3, 0.7, fadeWave);
        
        float finalFade = mix(0.25, 0.95, networkPulse * macroLatticeNetwork);
        baseColor.rgb *= finalFade;


        float flareSpeed = 0.25;
        float flareProgress = fract((uTime + cellRandom.x * 3.5) * flareSpeed);
        float surgeWave = sin(flareProgress * 3.14159);
        float surgeIntensity = surgeWave * surgeWave * surgeWave;

        float flareTriggerChance = hash(gridCoords + floor(uTime * 0.6));
        
        float flareThreshold = mix(0.95, 0.45, max(macroLatticeNetwork, clusterMask));
        float isFlaring = step(flareThreshold, flareTriggerChance);

        float totalSurge = surgeIntensity * (macroLatticeNetwork * 3.0 + clusterMask * 5.0);
        totalSurge *= mix(0.4, 2.2, tileNoise.x);

        baseColor.rgb += baseColor.rgb * (totalSurge * 4.0) * isFlaring;


        float globalX = vUv.x * uRepeat;
        float trackThickness = 0.015;

        vec2 trackPositions = vec2(0.47, 0.53);
        vec2 directions     = vec2(1.0, -1.0);
        vec2 phaseOffsets   = vec2(0.0, 2.0);

        vec2 distToTracks = abs(vUv.yy - trackPositions);
        vec2 baseMasks = smoothstep(trackThickness, 0.0, distToTracks);

        vec2 pulses = sin((globalX * 2.0) - (uTime * 3.0 * directions) + phaseOffsets) * 0.5 + 0.5;
        vec2 sharpPulses = pow(max(pulses, vec2(0.0)), vec2(5.0)); 
        vec2 intensities = baseMasks * (0.3 + sharpPulses * 2.5);
        float hTrackIntensity = max(intensities.x, intensities.y);

        vec2 hDotMasks = smoothstep(0.97, 0.99, pulses) * baseMasks;
        float hDotMask = max(hDotMasks.x, hDotMasks.y);

        float vTrackSpacing = 2.0; 
        
        float repeatedGridX = fract(globalX * vTrackSpacing + 0.5) - 0.5;
        float worldSpaceGridX = repeatedGridX / vTrackSpacing;

        vec2 vTrackOffsets = vec2(-0.01, 0.01);
        vec2 distToVTracks = abs(worldSpaceGridX - vTrackOffsets);
        vec2 vTrackBaseMasks = smoothstep(trackThickness / 5.0, 0.0, distToVTracks);
        
        vec2 vDirections   = vec2(1.0, -1.0);
        vec2 vPhaseOffsets = vec2(0.0, 1.5);

        vec2 vTrackPulses = sin((vUv.yy * 3.0) + (uTime * 2.5 * vDirections) + vPhaseOffsets) * 0.5 + 0.5;
        vTrackPulses = pow(max(vTrackPulses, vec2(0.0)), vec2(5.0)); 
        
        vec2 vIntensities = vTrackBaseMasks * (0.3 + vTrackPulses * 2.5);
        float vTrackIntensity = max(vIntensities.x, vIntensities.y);

        vec2 vDotMasks = smoothstep(0.80, 0.99, vTrackPulses) * vTrackBaseMasks;
        float vDotMask = max(vDotMasks.x, vDotMasks.y);

        float combinedTrackMask = max(hTrackIntensity, vTrackIntensity);
        vec3 trackGlowOut = uTrackColor * combinedTrackMask * 3.5;
        
        float combinedDotMask = max(hDotMask, vDotMask);
        trackGlowOut += uTrackLightColor * combinedDotMask * 6.0; 

        vec3 finalOutput = (baseColor.rgb * 2.25) + trackGlowOut;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ OuterRingInnerWallMaterial });

const OuterRingFaceMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uEmissiveMap: new THREE.Texture(),
        uWindowsMap: new THREE.Texture(),
        uEmissiveColor: new THREE.Color("#00e8ff"),
        uWindowColor: new THREE.Color("#ffaa44"),
        uShieldColor: new THREE.Color("#0088ff"),
        uStreamColor: new THREE.Color("#00ffcc"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform sampler2D uEmissiveMap;
    uniform sampler2D uWindowsMap;
    uniform float uTime;
    uniform vec3 uEmissiveColor;
    uniform vec3 uWindowColor;
    uniform vec3 uShieldColor;
    uniform vec3 uStreamColor;

    ${SHARED_HASH}

    void main() {
        vec4 baseColor = texture2D(uTexture, vUv);
        if (baseColor.a < 0.01) discard;

        float emissiveMask = texture2D(uEmissiveMap, vUv).r;
        float windowsMask  = texture2D(uWindowsMap, vUv).r;

        vec2 centerUv = vUv - vec2(0.5);
        float radius = length(centerUv);
        float angle = atan(centerUv.y, centerUv.x);
        float normalizedAngle = (angle + 3.14159265) * 0.15915494;

        float scaledRadius = radius * 150.0;
        float trackGrid = fract(scaledRadius); 
        float trackIndex = floor(scaledRadius);
        float trackRandom = hash(vec2(trackIndex, 55.43));


        float globalFade = cos(uTime * 0.5) * 0.5 + 0.5;
        globalFade = smoothstep(0.0, 1.0, globalFade);
        
        float finalPulseIntensity = mix(0.05, 1.0, globalFade);
        float isEmissiveActive = step(0.05, emissiveMask);
        
        vec3 emissiveGlow = uEmissiveColor * (finalPulseIntensity * emissiveMask) * isEmissiveActive;


        vec2 sectorId = floor(vec2(normalizedAngle * 180.0, radius * 64.0));
        float sectorRandom = hash(sectorId);
        
        float t = uTime * 2.0;
        float flickerBase = sin(t * 1.1) + sin(t * 2.3) + sin(t * 5.8);
        float ambientFlicker = 0.5 + 0.3 * (flickerBase / 3.0);

        float sparkRandom = hash(vec2(floor(uTime * 2.0), sectorRandom));
        float sparkFlicker = step(0.85, sparkRandom) * pow(sin(uTime * 2.0 + sectorRandom * 50.0) * 0.5 + 0.5, 4.0);

        float finalFlicker = mix(ambientFlicker, 1.0, sparkFlicker) * (1.0 + sparkFlicker * 2.0);

        float isWindowActive = step(0.05, windowsMask);
        vec3 windowGlow = uWindowColor * (finalFlicker * 2.0 * windowsMask) * isWindowActive;


        float isInRadialRing = step(0.35, radius) * step(radius, 0.40);
        
        float timeCycle = floor(uTime * 0.2); 
        float cycleProgress = fract(uTime * 0.2);
        
        vec2 trackPicks = floor(vec2(hash(timeCycle + vec2(1.1, 2.2))) * 20.0);
        float wrappedTrack = mod(trackIndex, 20.0);
        
        float matchesPick = step(abs(wrappedTrack - trackPicks.x), 0.001) + 
                            step(abs(wrappedTrack - trackPicks.y), 0.001);
        float isSelectedTrack = step(0.5, matchesPick);
        
        float trackLifetimeFade = smoothstep(0.0, 0.15, cycleProgress) * smoothstep(1.0, 0.85, cycleProgress);
        
        float dir = mix(-1.0, 1.0, step(0.5, trackRandom));
        float streamSpeed = 0.6 + trackRandom * 1.2;
        
        float streamCoord = normalizedAngle * 12.0 - (uTime * streamSpeed * dir);
        float streamPattern = sin(streamCoord + trackRandom * 6.28);
        
        float seamMask = smoothstep(0.0, 0.10, normalizedAngle) * smoothstep(1.0, 0.90, normalizedAngle);
        float radialMask = smoothstep(0.1, 0.5, trackGrid) * smoothstep(0.9, 0.5, trackGrid);
        float lineFade = smoothstep(0.0, 0.8, max(0.0, streamPattern));
        
        float streamIntensity = lineFade * radialMask * seamMask * trackLifetimeFade * 3.5;
        
        float isStreamVisible = step(0.0, streamPattern) * isSelectedTrack;
        
        vec3 dataStreamGlow = uStreamColor * streamIntensity;
        dataStreamGlow *= (0.7 + 0.3 * sin(uTime * 40.0 + normalizedAngle * 800.0));
        dataStreamGlow *= (isInRadialRing * isStreamVisible);


        float shieldWave = sin(radius * 15.0 - uTime);
        float shieldIntensity = pow(max(0.0, shieldWave), 4.0) * 0.15;
        vec3 shieldGlow = uShieldColor * shieldIntensity;


        vec3 finalOutput = (baseColor.rgb * 1.25) + emissiveGlow + windowGlow + dataStreamGlow + shieldGlow;

        gl_FragColor = vec4(finalOutput, baseColor.a);
    }
    `
);
extend({ OuterRingFaceMaterial });

const OuterRing = memo(function OuterRing({ config, isInView = false, entranceProgress }) {
    const outerRingRef = useRef();
    const outerwallMaterialRef = useRef();
    const innerwallMaterialRef = useRef();
    const frontfaceMaterialRef = useRef();
    const backfaceMaterialRef = useRef();

    const accumulator = useRef(0);

    const { mousePosRef } = useAnimateContext();

    const { outerRadius, innerRadius, depth, segments } = config;
    const startX = config.startX * (Math.PI / 180);
    const startY = config.startY * (Math.PI / 180);
    const {
        face, emissivemask, windowsmask,
        outerwall, innerwall, outerwallemissive, outerwallwindows
    } = config;

    const textures = useKTX2(
        [
            face || BLANK_FALLBACK,
            emissivemask || BLANK_FALLBACK,
            windowsmask || BLANK_FALLBACK,
            outerwall || BLANK_FALLBACK,
            innerwall || BLANK_FALLBACK,
            outerwallemissive || BLANK_FALLBACK,
            outerwallwindows || BLANK_FALLBACK,
        ]);

    const [
        faceTexture,
        faceemissiveTexture,
        windowsTexture,
        outerwallTexture,
        innerwallTexture,
        outerwallemissiveTexture,
        outerwallwindowsTexture,
    ] = textures;

    useConfigureTextures(textures);

    useCanvasSectionFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        if (!outerRingRef.current) return;

        const t = state.clock.getElapsedTime();

        const progress = entranceProgress.current;
        const entranceOffset = (1 - entranceProgress.current) * -Math.PI;
        outerRingRef.current.rotation.z = entranceOffset + t * config.rotZSpeed;

        const baseX = (mousePosRef.current.y * (config.rotX[1] - config.rotX[0])) * (Math.PI / 180);
        const baseY = (mousePosRef.current.x * (config.rotY[1] - config.rotY[0])) * (Math.PI / 180);

        const targetX = startX + (baseX - startX) * progress;
        const targetY = startY + (baseY - startY) * progress;

        outerRingRef.current.rotation.x = lerp(outerRingRef.current.rotation.x, targetX, 0.1);
        outerRingRef.current.rotation.y = lerp(outerRingRef.current.rotation.y, targetY, 0.1);

        if (outerwallMaterialRef.current) {
            outerwallMaterialRef.current.uTime = t;
        }
        if (innerwallMaterialRef.current) {
            innerwallMaterialRef.current.uTime = t;
        }
        if (frontfaceMaterialRef.current) {
            frontfaceMaterialRef.current.uTime = t;
        }
        if (backfaceMaterialRef.current) {
            backfaceMaterialRef.current.uTime = t;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group ref={outerRingRef}>
            {/* 1. OUTER HULL (Facing Outwards) */}
            <mesh position={[0, 0, 0]} rotation={[NINETY_DEGREES, 0, 0]}>
                <cylinderGeometry
                    args={[outerRadius, outerRadius, depth, segments, 1, true]}
                />
                <outerRingOuterWallMaterial
                    ref={outerwallMaterialRef}
                    uTexture={outerwallTexture}
                    uEmissiveMap={outerwallemissiveTexture}
                    uWindowsMap={outerwallwindowsTexture}
                    side={THREE.FrontSide}
                />
            </mesh>
            {/* 2. INNER TUNNEL WALL (Facing Inwards) */}
            <mesh position={[0, 0, 0]} rotation={[NINETY_DEGREES, 0, 0]}>
                <cylinderGeometry
                    args={[innerRadius, innerRadius, depth, segments, 1, true]}
                />
                <outerRingInnerWallMaterial
                    ref={innerwallMaterialRef}
                    uTexture={innerwallTexture}
                    side={THREE.BackSide}
                />
            </mesh>
            {/* 3. FRONT CAP (The forward-facing ring rim) */}
            <mesh position={[0, 0, depth / 2]}>
                <ringGeometry
                    args={[innerRadius, outerRadius, segments]}
                />
                <outerRingFaceMaterial
                    ref={frontfaceMaterialRef}
                    uTexture={faceTexture}
                    uEmissiveMap={faceemissiveTexture}
                    uWindowsMap={windowsTexture}
                    side={THREE.FrontSide}
                />
            </mesh>
            {/* 4. BACK CAP (The rear-facing ring rim) */}
            <mesh position={[0, 0, -depth / 2]}>
                <ringGeometry
                    args={[innerRadius, outerRadius, segments]}
                />
                <outerRingFaceMaterial
                    ref={backfaceMaterialRef}
                    uTexture={faceTexture}
                    uEmissiveMap={faceemissiveTexture}
                    uWindowsMap={windowsTexture}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <SpaceRingParticles />
        </group>
    );
});

export default SpaceStation;