import React, { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture, useKTX2 } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimateContext } from './AnimateContext';
import { useStateContext } from './StateContext';
import canvas3bg from '../pics/bg2.ktx2';
import canvas3bgentrance from '../pics/entrancebg2.ktx2';
import useConfigureTextures from '../functions/useConfigureTextures';
import { PROJECT_HIGHLIGHTS } from "../pics/assets";


const WaterRipples = memo(function WaterRipples({ isInView = false }) {
    const groupRef = useRef();

    const wasInView = useRef(false);
    const entranceProgress = useRef(0);
    const accumulator = useRef(0);

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            wasInView.current = false;
            return;
        }
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;
        accumulator.current %= TARGET_FPS;

        const time = state.clock.getElapsedTime();

        if (!wasInView.current && isInView) {
            wasInView.current = true;
        }

        const target = isInView ? 1.0 : 0.0;
        const p = entranceProgress.current;
        entranceProgress.current += (target - p) * 0.009;
        const isAnimating = Math.abs(target - p) > 0.001;

        if (!isAnimating && entranceProgress.current !== target) {
            entranceProgress.current = target;
        }
    });

    return (
        <group ref={groupRef}>
            <WaterRipplesBg
                isInView={isInView}
                wasInView={wasInView}
                entranceProgress={entranceProgress}
            />
            <BokehParticles
                isInView={isInView}
                entranceProgress={entranceProgress}
            />
        </group>
    );
});

const HIGHTLIGHT_PATHS = Object.values(PROJECT_HIGHLIGHTS).flatMap(project => Object.values(project));
const BOKEH_COUNT = HIGHTLIGHT_PATHS.length / 3;

const MESH_Z = -5;
const CANVAS_SIZE = 256;
const RIPPLE_SIZE = 15;
const SCRATCH_VECTOR = new THREE.Vector3();
const TARGET_FPS = 1 / 30;

const BokehDriftMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0,
        uActiveImage: 0,
        uColor: new THREE.Color("#ffffff"),
    },
    // Vertex Shader
    `
    uniform float uTime;
    
    attribute vec3 aRandoms; // x: angle, y: speed, z: startTime/offset
    
    varying float vAlpha;
    varying vec2 vUv;
    varying vec3 vDriftDir;

    // A classic high-precision pseudo-random generator for GLSL
    float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        vUv = uv;
        float lifeDuration = 24.0;
        
        float totalTime = uTime + aRandoms.z * lifeDuration;
        float loopCycle = floor(totalTime / lifeDuration);
        float progress = mod(totalTime, lifeDuration) / lifeDuration;
        
        float seedX = rand(vec2(aRandoms.x, loopCycle));
        float seedY = rand(vec2(loopCycle, aRandoms.y));

        float seedScale = rand(vec2(seedX, seedY));
        float dynamicScale = 0.1 + seedScale * 0.2;
        
        float innerRadius = 1.5;
        float outerRadius = 3.0;
        
        float spawnAngle = seedX * 6.28318530718; 
        float spawnRadius = innerRadius + seedY * (outerRadius - innerRadius);
        
        vec3 dynamicStartPos = vec3(cos(spawnAngle) * spawnRadius, sin(spawnAngle) * spawnRadius, 0.0);
        
        vec3 driftDir = normalize(dynamicStartPos);
        vDriftDir = driftDir;
        
        float speed = aRandoms.y * 0.6;
        
        vec3 driftOffset = dynamicStartPos + (driftDir * speed * progress);
        vec3 scaledPosition = position * dynamicScale;
        vec3 finalLocalPosition = scaledPosition + driftOffset;
        
        vec4 mvPosition = modelViewMatrix * vec4(finalLocalPosition, 1.0);
        
        vAlpha = smoothstep(0.0, 0.2, progress) * smoothstep(1.0, 0.7, progress);
        gl_Position = projectionMatrix * mvPosition;
    }
    `,
    // Fragment Shader
    `
    varying float vAlpha;
    varying vec2 vUv;
    varying vec3 vDriftDir;

    uniform float uProgress;
    uniform float uActiveImage;
    uniform vec3 uColor;

    void main() {
        vec2 aberrationOffset = normalize(vDriftDir.xy) * 0.10; 

        float distR = length((vUv - aberrationOffset) - vec2(0.5));
        float distG = length(vUv - vec2(0.5));
        float distB = length((vUv + aberrationOffset) - vec2(0.5));

        float circleR = smoothstep(0.5, 0.3, distR);
        float circleG = smoothstep(0.5, 0.3, distG);
        float circleB = smoothstep(0.5, 0.3, distB);

        vec3 finalColor = uColor * vec3(circleR, circleG, circleB);

        float progressAlpha = smoothstep(0.0, 1.0, uProgress);
        float masterCircle = max(circleR, max(circleG, circleB));
        
        float finalAlpha = masterCircle * vAlpha * 0.2 * progressAlpha * (1.0 - uActiveImage);
        
        gl_FragColor = vec4(finalColor, finalAlpha);
    }
    `
);
extend({ BokehDriftMaterial });

const BokehParticles = memo(function BokehParticles({ isInView = false, entranceProgress }) {
    const { highlightImage } = useStateContext();

    const meshRef = useRef();
    const accumulator = useRef(0);

    const randomsArray = useMemo(() => {
        const randoms = new Float32Array(BOKEH_COUNT * 3);
        for (let i = 0; i < BOKEH_COUNT; i++) {
            randoms[i * 3 + 0] = Math.random() * Math.PI * 2;
            randoms[i * 3 + 1] = Math.random();
            randoms[i * 3 + 2] = Math.random();
        }
        return randoms;
    }, [BOKEH_COUNT]);

    const activeImage = useMemo(() => {
        return highlightImage ? 1.0 : 0.0;
    }, [highlightImage]);

    useFrame((state, delta) => {
        if (!isInView) return;
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;
        accumulator.current %= TARGET_FPS;

        const time = state.clock.getElapsedTime();

        if (meshRef.current && meshRef.current.material) {
            meshRef.current.material.uTime = time;
            meshRef.current.material.uProgress = entranceProgress.current;
            meshRef.current.material.uActiveImage = activeImage;
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, BOKEH_COUNT]}
        >
            <planeGeometry args={[1, 1]}>
                <instancedBufferAttribute
                    attach="attributes-aRandoms"
                    args={[randomsArray, 3]}
                />
            </planeGeometry>
            <bokehDriftMaterial
                attach="material"
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
});

const WaterRipplesBgEntranceMaterial = shaderMaterial(
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

        vec3 finalColor = color.rgb;

        finalColor = pow(finalColor, vec3(1.0 / 2.2));

        float alpha = smoothstep(0.0, 1.0, invertedProgress);

        gl_FragColor = vec4(finalColor, alpha);
    }
    `
);
extend({ WaterRipplesBgEntranceMaterial });

const WaterRipplesBgMaterial = shaderMaterial(
    {
        uTime: 0,
        uProgress: 0,
        uBgTexture: new THREE.Texture(),
        uActiveTexture: new THREE.Texture(),
        uTransitionProgress: 0,
        uRippleCenter: new THREE.Vector2(0.5, 0.5),
        uRippleDir: 1.0,
        uDuration: 6.0,
        uStartTime: 0.0,
        uWaveFrequency: 40.0,
        uWaveStrength: 0.09,
        uRipplesTexture: new THREE.Texture(),
        uCanvasSize: 256.0,
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
    uniform sampler2D uBgTexture;
    uniform sampler2D uActiveTexture;
    uniform float uTransitionProgress;
    uniform sampler2D uRipplesTexture;
    uniform vec2 uRippleCenter;
    uniform float uRippleDir;
    uniform float uDuration;
    uniform float uStartTime;
    uniform float uWaveFrequency;
    uniform float uWaveStrength;
    uniform float uCanvasSize;

    void main() {
        float elapsedTime = uTime - uStartTime;
        
        float postEntranceMask = step(uDuration, elapsedTime); 
        float entranceMask = 1.0 - postEntranceMask;

        const float waveSpeed = 4.0;

        vec2 totalDistortion = vec2(0.0);


        vec2 toCenterA = vUv - uRippleCenter;
        float distA = length(toCenterA);
        float safeDistA = max(distA, 0.0001);

        float entranceLife = clamp(elapsedTime / uDuration, 0.0, 1.0);
        float entranceRadius = elapsedTime * (waveSpeed / uWaveFrequency);
        float entranceWave = uRippleDir * sin(distA * uWaveFrequency - elapsedTime * waveSpeed);
        
        float entranceOuter = smoothstep(entranceRadius + 0.1, entranceRadius, distA);
        float entranceInner = smoothstep(entranceRadius - 0.15, entranceRadius, distA);
        
        float startMask = step(0.0001, elapsedTime);
        float entranceFinalStrength = uWaveStrength * (1.0 - entranceLife) * (entranceOuter * entranceInner) * startMask * entranceMask;

        totalDistortion += (toCenterA / safeDistA) * entranceWave * entranceFinalStrength;


        float texelSize = 1.0 / uCanvasSize;

        vec2 offsetH = vec2(texelSize * postEntranceMask, 0.0);
        vec2 offsetV = vec2(0.0, texelSize * postEntranceMask);

        float rLeft  = texture2D(uRipplesTexture, vUv - offsetH).r;
        float rRight = texture2D(uRipplesTexture, vUv + offsetH).r;
        float rDown  = texture2D(uRipplesTexture, vUv - offsetV).r;
        float rUp    = texture2D(uRipplesTexture, vUv + offsetV).r;
        float currentR = texture2D(uRipplesTexture, vUv).r;

        vec2 mouseNormal = vec2(rRight - rLeft, rUp - rDown);
        
        float mouseWave = sin(currentR * 30.0 - uTime * 10.0) * currentR * postEntranceMask;

        totalDistortion += mouseNormal * mouseWave * (uWaveStrength * 2.5);


        vec2 distortedUv = vUv + totalDistortion;
        vec4 texBg = texture2D(uBgTexture, distortedUv);
        vec4 texActive = texture2D(uActiveTexture, distortedUv);

        vec4 color = mix(texBg, texActive, uTransitionProgress);
        if (color.a < 0.1) discard; 

        vec3 finalColor = color.rgb;

        finalColor = pow(finalColor, vec3(1.0 / 2.2));

        float alpha = smoothstep(0.0, 1.0, uProgress);
        gl_FragColor = vec4(finalColor, alpha);
    }
    `
);
extend({ WaterRipplesBgMaterial });

const WaterRipplesBg = memo(function WaterRipplesBg({ isInView = false, wasInView, entranceProgress }) {
    const { highlightImage } = useStateContext();

    const groupRef = useRef();
    const bgentranceMaterialRef = useRef();
    const bgMaterialRef = useRef();

    const lastHighlightImageRef = useRef(null);
    const lastActiveTextureRef = useRef(null);
    const activeimageProgress = useRef(0);

    const accumulator = useRef(0);

    const { viewport, camera } = useThree();

    const [
        bgEntranceTexture,
        bgTexture
    ] = useKTX2(
        [canvas3bgentrance, canvas3bg]
    );

    const highlightTextures = useKTX2(HIGHTLIGHT_PATHS);
    useConfigureTextures(highlightTextures);

    const activeTexture = useMemo(() => {
    if (!highlightImage) return null;

    const imageIndex = HIGHTLIGHT_PATHS.findIndex(path => 
        path.endsWith(highlightImage.image)
    );

    if (imageIndex !== -1 && highlightTextures[imageIndex]) {
        return highlightTextures[imageIndex];
    }

    return null;
}, [highlightImage, highlightTextures]);

    if (activeTexture) {
        lastActiveTextureRef.current = activeTexture;
    }

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

    const { mousePosRef } = useAnimateContext();
    const lastMouse = useRef({ x: 0, y: 0 });
    const trailLifetime = useRef(0.0);

    const [canvas, ctx, canvasTexture] = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = c.height = CANVAS_SIZE;
        const context = c.getContext('2d', { alpha: false });

        context.fillStyle = 'black';
        context.fillRect(0, 0, c.width, c.height);

        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;

        return [c, context, tex];
    }, []);

    useFrame((state, delta) => {
        if (!isInView) {
            entranceProgress.current = 0;
            wasInView.current = false;
            return;
        }
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;
        accumulator.current %= TARGET_FPS;

        const time = state.clock.getElapsedTime();
        const matRef = bgMaterialRef.current;

        if (!wasInView.current && isInView) {
            if (matRef) {
                matRef.uStartTime = time;
                matRef.uWaveFrequency = 40.0;
                matRef.uWaveStrength = 0.09;
                matRef.uRippleCenter.set(0.5, 0.5);
                matRef.uRippleDir = 1.0;
            }
        }

        if (matRef) {
            matRef.uTime = time;

            const elapsedTime = time - matRef.uStartTime;
            const duration = matRef.uDuration || 6.0;

            if (elapsedTime > duration) {
                const mX = (mousePosRef.current.x + 1.0) * 0.5 * canvas.width;
                const mY = (mousePosRef.current.y + 1.0) * 0.5 * canvas.height;

                const hasMoved = mX !== lastMouse.current.x || mY !== lastMouse.current.y;

                if (hasMoved) {
                    trailLifetime.current = 1.0;

                    ctx.save();
                    ctx.globalCompositeOperation = 'screen';

                    const gradient = ctx.createRadialGradient(mX, mY, 0, mX, mY, RIPPLE_SIZE);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
                    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(mX, mY, RIPPLE_SIZE, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    lastMouse.current = { x: mX, y: mY };
                }

                if (trailLifetime.current > 0.0) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    canvasTexture.needsUpdate = true;

                    if (!hasMoved) {
                        trailLifetime.current -= 0.03;

                        if (trailLifetime.current <= 0.0) {
                            ctx.fillStyle = 'black';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            canvasTexture.needsUpdate = true;
                        }
                    }
                }
            }
        }

        const p = entranceProgress.current;

        if (bgentranceMaterialRef.current) {
            bgentranceMaterialRef.current.uTime = time;
            bgentranceMaterialRef.current.uProgress = p;
        }
        if (matRef) matRef.uProgress = p;

        const activeimageTarget = activeTexture ? 1.0 : 0.0;
        matRef.uTransitionProgress = THREE.MathUtils.lerp(
            matRef.uTransitionProgress,
            activeimageTarget,
            0.1
        );
        if (!lastHighlightImageRef.current && highlightImage) {
            if (matRef) {
                matRef.uStartTime = time;
                matRef.uWaveFrequency = 20.0;
                matRef.uWaveStrength = 0.02;

                const u = (mousePosRef.current.x + 1) / 2;
                const v = (-mousePosRef.current.y + 1) / 2;
                matRef.uRippleCenter.set(u, v);
                matRef.uRippleDir = -1.0;
            }
        }
        lastHighlightImageRef.current = highlightImage;
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <planeGeometry args={[1, 1]} />
                <waterRipplesBgEntranceMaterial
                    ref={bgentranceMaterialRef}
                    uTexture={bgEntranceTexture}
                    uScale={1.5}
                    transparent
                    depthWrite={false}
                />
            </mesh>
            <mesh>
                <planeGeometry args={[1, 1]} />
                <waterRipplesBgMaterial
                    ref={bgMaterialRef}
                    uBgTexture={bgTexture}
                    uActiveTexture={activeTexture || lastActiveTextureRef.current || bgTexture}
                    uRipplesTexture={canvasTexture}
                    uCanvasSize={CANVAS_SIZE}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
});

export default WaterRipples;