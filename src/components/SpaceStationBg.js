import { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useConfigureTextures from '../functions/useConfigureTextures';


const NebulaBgMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0,
        uScale: 1.5,
        uSeed: Math.random() * 1000.0,
        uSpaceColor: new THREE.Color("#08050f"),
        uNebulaColor1: new THREE.Color("#1999bf"),
        uNebulaColor2: new THREE.Color("#d92673"),
        uCoreColor: new THREE.Color("#fff2d9"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uScale;

    void main() {
        vUv = uv;

        float scale = mix(uScale, 1.0, uProgress);
        vec3 scaledPosition = vec3(position.xy * scale, position.z);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSeed;
    uniform vec3 uSpaceColor;
    uniform vec3 uNebulaColor1;
    uniform vec3 uNebulaColor2;
    uniform vec3 uCoreColor;

    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
        vec2 centeredUv = vUv - vec2(0.5);
        float dist = length(centeredUv);
        
        float spiralTwist = 3.5 / (dist + 0.15); 
        float slowSpin = uTime * 0.08;
        
        float angle1 = slowSpin + dist * spiralTwist;
        float s1 = sin(angle1);
        float c1 = cos(angle1);
        
        vec2 uv1 = vec2(centeredUv.x * c1 - centeredUv.y * s1, centeredUv.x * s1 + centeredUv.y * c1) * 2.0 + uSeed;
        
        float angle2 = -slowSpin * 1.5 + dist * (spiralTwist * 0.5);
        float s2 = sin(angle2);
        float c2 = cos(angle2);
        vec2 uv2 = vec2(centeredUv.x * c2 - centeredUv.y * s2, centeredUv.x * s2 + centeredUv.y * c2) * 4.0 - uSeed;
        
        float n1 = smoothNoise(uv1);
        float n2 = smoothNoise(uv2);
        
        float s3 = sin(slowSpin * 2.0);
        float c3 = cos(slowSpin * 2.0);
        vec2 uv3 = vec2(centeredUv.x * c3 - centeredUv.y * s3, centeredUv.x * s3 + centeredUv.y * c3) * 8.0 + (n1 * 2.0);
        float n3 = smoothNoise(uv3);
        
        float galaxyClouds = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
        
        float coreGlow = smoothstep(0.8, 0.0, dist);
        galaxyClouds *= coreGlow;
        
        float nebulaMask = smoothstep(0.2, 0.8, galaxyClouds);
        
        float coreGlow3 = pow(coreGlow, 3.0);
        float coreGlow4 = coreGlow3 * coreGlow;
        
        vec3 gasMix = mix(uNebulaColor1, uNebulaColor2, n2);
        
        vec3 finalColor = mix(uSpaceColor, gasMix, nebulaMask);
        finalColor += uCoreColor * (coreGlow4 * 0.65); 
        finalColor += gasMix * (n3 * 0.15 * nebulaMask);       
        
        float alpha = clamp(nebulaMask * 0.85 + coreGlow3 * 0.3, 0.0, 1.0);
        
        gl_FragColor = vec4(finalColor, alpha);
    }
  `
);
extend({ NebulaBgMaterial });

const SpaceStationBg = memo(function SpaceStationBg({ isInView = false }) {

    const groupRef = useRef();
    const nebulaMaterialRef = useRef();

    const entranceProgress = useRef(0);

    const { viewport, camera } = useThree();
    const MESH_Z = -5;
    const meshTargetPos = new THREE.Vector3();

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            return;
        }

        if (groupRef.current) {
            groupRef.current.position.x = state.camera.position.x;
            groupRef.current.position.y = state.camera.position.y;
            groupRef.current.position.z = MESH_Z;

            meshTargetPos.set(state.camera.position.x, state.camera.position.y, MESH_Z);
            const { width, height } = viewport.getCurrentViewport(state.camera, meshTargetPos);

            const parallaxFactor = 0.5;
            const finalWidth = THREE.MathUtils.lerp(width, width * 1.5, parallaxFactor * (10 - state.camera.position.z) / 8);
            const finalHeight = THREE.MathUtils.lerp(height, height * 1.5, parallaxFactor * (10 - state.camera.position.z) / 8);

            groupRef.current.scale.set(finalWidth, finalHeight, 1);
        }

        const time = state.clock.getElapsedTime();

        const target = (isInView) ? 1 : 0;
        entranceProgress.current += (target - entranceProgress.current) * 0.009;

        const p = entranceProgress.current;
        const isAnimating = Math.abs(target - p) > 0.001;

        if (nebulaMaterialRef.current) {
            nebulaMaterialRef.current.uTime = time;
            nebulaMaterialRef.current.uProgress = entranceProgress.current;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1, 1]} />
                <nebulaBgMaterial
                    ref={nebulaMaterialRef}
                    uScale={1.5}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
});

export default SpaceStationBg;