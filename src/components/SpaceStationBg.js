import { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useConfigureTextures from '../functions/useConfigureTextures';


const NebulaBgMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0.0, 
        uSeed: Math.random() * 1000.0,
        uSpaceColor: new THREE.Color("#04030a"),
        uNebulaBlue: new THREE.Color("#1a4bb0"),
        uHighlightBlue: new THREE.Color("#85cfeb"),
        uHighlightPink: new THREE.Color("#f4c1dc"),
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
    uniform float uProgress;
    uniform float uSeed;

    uniform vec3 uSpaceColor;
    uniform vec3 uNebulaBlue;
    uniform vec3 uHighlightBlue;
    uniform vec3 uHighlightPink;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p, vec2 seedOffset) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p = p * 2.0 + seedOffset;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vec2 uv = vUv;
        float slowTime = uTime * 0.02;
        vec2 seedOffset = vec2(uSeed * 0.01);

        vec2 slowTimeVec = vec2(slowTime);
        vec2 q = vec2(
            fbm(uv * 2.5 + slowTimeVec * vec2(1.0, 0.5), seedOffset),
            fbm(uv * 3.0 - slowTimeVec * vec2(0.2, 1.0), seedOffset)
        );

        vec2 r = vec2(
            fbm(uv * 4.0 + q * 2.0 + vec2(1.2, 3.4) + slowTime * 0.5, seedOffset),
            fbm(uv * 5.0 + q * 1.5 + vec2(5.6, 7.8) - slowTime * 0.3, seedOffset)
        );

        float gasDensity = fbm(uv * 2.0 + r * 3.0, seedOffset);
        gasDensity *= smoothstep(-0.2, 1.2, (uv.x + uv.y * 0.8));

        float blueMask = smoothstep(0.1, 0.7, gasDensity);
        vec3 finalColor = mix(uSpaceColor, uNebulaBlue, blueMask * 0.85);

        float burstSpeed = uTime * 0.35; 
        float burstId = floor(burstSpeed);   
        float burstPhase = fract(burstSpeed); 

        float h1 = hash(vec2(burstId, 13.5));
        float h2 = hash(vec2(burstId, 24.6));
        float h3 = hash(vec2(burstId, 35.7));
        float h4 = hash(vec2(burstId, 46.8));
        float h5 = hash(vec2(burstId, 57.1));

        float isActiveBurst = step(0.6, h1); 

        vec2 corePos = vec2(mix(0.2, 0.8, h2), mix(0.2, 0.8, h3));

        vec2 warpLookup = uv * 3.0 + vec2(uSeed * 0.05);
        vec2 warp = vec2(
            fbm(warpLookup + q, seedOffset), 
            fbm(warpLookup + r, seedOffset)
        );

        vec2 warpedUv = uv + warp * 0.45; 
        vec2 warpedCorePos = corePos + vec2(fbm(corePos * 5.0, seedOffset)) * 0.2;

        float distortedDist = length(warpedUv - warpedCorePos);

        float maxRadius = mix(0.15, 0.35, h5);
        float currentRadius = burstPhase * maxRadius; 

        float boundaryFade = smoothstep(maxRadius, maxRadius - 0.12, currentRadius);
        float burstFade = smoothstep(0.0, 0.05, burstPhase) * smoothstep(1.0, 0.4, burstPhase) * isActiveBurst * boundaryFade;

        float coreFlash = (1.0 / (1.0 + distortedDist * 25.0)) * burstFade;
        
        float lightSpread = smoothstep(currentRadius + 0.04, currentRadius - 0.08, distortedDist);
        float internalFalloff = smoothstep(maxRadius * 1.6, 0.0, distortedDist);
        
        float cloudIllumination = lightSpread * internalFalloff * gasDensity * burstFade * 2.2;

        vec3 burstColor = mix(uHighlightBlue, uHighlightPink, step(0.5, h4));
        finalColor += burstColor * (coreFlash + cloudIllumination);
        
        float alpha = clamp(blueMask + coreFlash + cloudIllumination, 0.2, 1.0) * uProgress;

        gl_FragColor = vec4(finalColor, alpha);
    }
    `
);
extend({ NebulaBgMaterial });

const delay = 2.0;
const MESH_Z = -5;
const SCRATCH_VECTOR = new THREE.Vector3();
const TARGET_FPS = 1 / 30;

const SpaceStationBg = memo(function SpaceStationBg({ isInView = false }) {

    const groupRef = useRef();
    const nebulaMaterialRef = useRef();

    const entranceProgress = useRef(0);
    const delayStartTime = useRef(0);
    const accumulator = useRef(0);

    const { viewport, camera } = useThree();

    SCRATCH_VECTOR.set(camera.position.x, camera.position.y, MESH_Z);
    const { width, height } = viewport.getCurrentViewport(camera, SCRATCH_VECTOR);

    useEffect(() => {
        if (!isInView || !groupRef.current) return;

        groupRef.current.position.x = camera.position.x;
        groupRef.current.position.y = camera.position.y;
        groupRef.current.position.z = MESH_Z;

        const parallaxFactor = 0.5;
        const finalWidth = THREE.MathUtils.lerp(width, width * 1.5, parallaxFactor * (10 - camera.position.z) / 8);
        const finalHeight = THREE.MathUtils.lerp(height, height * 1.5, parallaxFactor * (10 - camera.position.z) / 8);

        groupRef.current.scale.set(finalWidth, finalHeight, 1);

    }, [isInView, camera, viewport]);

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            return;
        }
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;
        accumulator.current %= TARGET_FPS;

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

        if (nebulaMaterialRef.current) {
            nebulaMaterialRef.current.uTime = t;
            nebulaMaterialRef.current.uProgress = entranceProgress.current;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1, 1]} />
                <nebulaBgMaterial
                    ref={nebulaMaterialRef}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
});

export default SpaceStationBg;