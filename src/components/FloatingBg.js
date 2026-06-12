import { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import canvas3bg from '../pics/canvas3bg.webp';
import canvas3bgentrance from '../pics/canvas3bgentrance.webp';
import useConfigureTextures from '../functions/useConfigureTextures';

const BgEntranceMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0,
        uTexture: new THREE.Texture(),
        uScale: 1.5,
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
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uProgress;

    void main() {
        vec4 color = texture2D(uTexture, vUv);
        if (color.a < 0.1) discard;

        float invertedProgress = 1.0 - uProgress;
        float alpha = smoothstep(0.0, 1.0, invertedProgress);

        gl_FragColor = vec4(color.rgb, alpha);
    }
  `
);

extend({ BgEntranceMaterial });

const BgMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0,
        uTexture: new THREE.Texture(),
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
    uniform float uTime;
    uniform float uProgress;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 n) {
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }

    void main() {
        float bigNoise = noise(vUv * 6.0 + uTime * 0.2);
        float smallNoise = noise(vUv * 15.0 - uTime * 0.5);
        float combinedNoise = (bigNoise * 0.8 + smallNoise * 0.2) * 2.0;
        float centeredNoise = combinedNoise - 0.5;

        vec4 texColor = texture2D(uTexture, vUv);

        float soakIntensity = 1.2;
        float soakEffect = centeredNoise * soakIntensity * (1.1 - uProgress);

        float growthThreshold = 1.0 - (uProgress * uProgress);
        float edge = growthThreshold + soakEffect;
        
        float growth = smoothstep(edge, edge + 0.05, texColor.a);
        float finalAlpha = growth * smoothstep(0.0, 0.05, uProgress);

        gl_FragColor = vec4(texColor.rgb, finalAlpha);
    }
  `
);

extend({ BgMaterial });

const BgOverlayMaterial = shaderMaterial(
    {
        uTime: 0,
        uSeed: Math.random() * 1000.0,
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
    uniform float uTime;
    uniform float uSeed;
    varying vec2 vUv;

    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Smooth noise for the "smoke" look
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
        vec2 uv = vUv;
        
        // Layer 1: Slow, large clouds
        float n1 = smoothNoise(uv * 3.0 + uSeed + uTime * 0.1);
        // Layer 2: Faster, smaller details
        float n2 = smoothNoise(uv * 6.0 - uSeed - uTime * 0.5);
        
        // Combine layers (fBm)
        float cn = (n1 * 0.6 + n2 * 0.4);
        
        float alpha = cn * 0.15;
        
        float colorMixFactor = clamp(cn * 1.5, 0.0, 1.0);
        vec3 baseColor   = vec3(0.22, 0.11, 0.07);
        vec3 secondColor = vec3(0.85, 0.51, 0.24);
    
        vec3 finalColor = mix(baseColor, secondColor, colorMixFactor);
        
        gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ BgOverlayMaterial });

const FloatingBg = memo(function FloatingBg({ isInView = false }) {

    const groupRef = useRef();
    const bgentranceMaterialRef = useRef();
    const bgMaterialRef = useRef();
    const bgoverlayMaterialRef = useRef();

    const entranceProgress = useRef(0);

    const prevInViewRef = useRef(isInView);
    const delayStartTimeRef = useRef(0);
    const DELAY_MS = 2800;

    const { viewport, camera } = useThree();
    const MESH_Z = -5;
    const meshTargetPos = new THREE.Vector3();

    const [
        bgEntranceTexture,
        bgTexture
    ] = useTexture(
        [canvas3bgentrance, canvas3bg]
    );

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            delayStartTimeRef.current = 0;
            return;
        }

        const turnedInView = isInView && !prevInViewRef.current;

        if (turnedInView && groupRef.current) {
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

        const hasDelayPassed = (time - delayStartTimeRef.current) >= (DELAY_MS / 1000);
        const target = (isInView) ? 1 : 0;
        entranceProgress.current += (target - entranceProgress.current) * 0.009;

        const p = entranceProgress.current;
        const isAnimating = Math.abs(target - p) > 0.001;

        if (bgentranceMaterialRef.current && isAnimating) {
            bgentranceMaterialRef.current.uTime = time;
            bgentranceMaterialRef.current.uProgress = entranceProgress.current;
        }

        if (bgMaterialRef.current && isAnimating) {
            bgMaterialRef.current.uTime = time;
            bgMaterialRef.current.uProgress = entranceProgress.current;
        }

        if (bgoverlayMaterialRef.current) {
            bgoverlayMaterialRef.current.uTime = time;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <planeGeometry args={[1, 1]} />
                <bgEntranceMaterial
                    ref={bgentranceMaterialRef}
                    uTexture={bgEntranceTexture}
                    uScale={1.5}
                    transparent
                    depthWrite={false}
                />
            </mesh>
            <mesh>
                <planeGeometry args={[1, 1]} />
                <bgMaterial
                    ref={bgMaterialRef}
                    uTexture={bgTexture}
                    transparent
                    depthWrite={false}
                />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1, 1]} />
                <bgOverlayMaterial
                    ref={bgoverlayMaterialRef}
                    transparent={true}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
});

export default FloatingBg;