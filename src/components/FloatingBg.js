import { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useAnimateContext } from './AnimateContext';
import canvas3bg from '../pics/canvas3bg.webp';


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
        uProgress: 0,
        uTexture: new THREE.Texture(),
        uColor: new THREE.Color('#080808'),
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
    uniform vec3 uColor;

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

extend({ BgOverlayMaterial });

const FloatingBg = memo(function FloatingBg({ isInView = false }) {

    const bgMeshRef = useRef();
    const bgMaterialRef = useRef();
    const accumulator = useRef(0);

    const entranceProgress = useRef(0);

    const prevCamZ = useRef(10);
    const prevInViewRef = useRef(isInView);

    const { viewport, camera } = useThree();
    const MESH_Z = -5;
    const meshTargetPos = new THREE.Vector3();

    const bgTexture = useTexture(canvas3bg);
    useEffect(() => {
        if (bgTexture) {
            bgTexture.anisotropy = 8;
        }
    }, [bgTexture]);

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            prevCamZ.current = 10;
            return;
        }

        const turnedInView = isInView && !prevInViewRef.current;
        const cameraIsMoving = Math.abs(state.camera.position.z - prevCamZ.current) > 0.001;
        const scaleCalc = turnedInView || cameraIsMoving;

        if (turnedInView && bgMeshRef.current) {
            bgMeshRef.current.position.x = state.camera.position.x;
            bgMeshRef.current.position.y = state.camera.position.y;
            bgMeshRef.current.position.z = MESH_Z;

            meshTargetPos.set(state.camera.position.x, state.camera.position.y, MESH_Z);
            const { width, height } = viewport.getCurrentViewport(state.camera, meshTargetPos);

            const parallaxFactor = 0.5;
            const finalWidth = THREE.MathUtils.lerp(width, width * 1.5, parallaxFactor * (10 - state.camera.position.z) / 8);
            const finalHeight = THREE.MathUtils.lerp(height, height * 1.5, parallaxFactor * (10 - state.camera.position.z) / 8);

            bgMeshRef.current.scale.set(finalWidth, finalHeight, 1);
        }

        const time = state.clock.getElapsedTime();

        const target = isInView ? 1 : 0;
        entranceProgress.current += (target - entranceProgress.current) * 0.02;

        const p = entranceProgress.current;
        const isAnimating = Math.abs(target - p) > 0.001;

        if (bgMaterialRef.current && isAnimating) {
            bgMaterialRef.current.uTime = time;
            bgMaterialRef.current.uProgress = entranceProgress.current;
        }

        prevCamZ.current = state.camera.position.z;
    });

    return (
        <group position={[0, 0, 0]}>
            <mesh ref={bgMeshRef}>
                <planeGeometry args={[1, 1]} />
                <bgMaterial
                    ref={bgMaterialRef}
                    uTexture={bgTexture}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
});

export default FloatingBg;