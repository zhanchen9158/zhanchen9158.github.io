import React, { useRef, useMemo, memo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { MeshDistortMaterial, shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import hourglass from '../pics/hourglass.webp';
import sandstream from '../pics/sandstream.webp';
import sandpile from '../pics/sandpile.webp';
import nebula from '../pics/nebula.webp';


const FloatingSandMaterial = shaderMaterial(
    {
        uTime: 0,
        uCeiling: 2.5,
        uFloor: 0.0,
        uGlintZone: 1.2,
        uZoneRadius: 0.15,
        uRotZ: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    layout(location = 0) in vec3 aInitialPosition;
    layout(location = 1) in float aSpeed;
    layout(location = 2) in vec3 aBaseColor;

    out vec3 vFinalColor;
    out float vOpacity;

    uniform float uTime;
    uniform float uCeiling;
    uniform float uFloor;
    uniform float uGlintZone;
    uniform float uZoneRadius;
    uniform vec2 uRotZ;

    void main() {
        float height = uCeiling - uFloor;
        float currentY = aInitialPosition.y + (uTime * aSpeed);
        
        currentY = mod(currentY - uFloor, height) + uFloor;

        float dist = abs(currentY - uGlintZone);
        float strength = max(0.0, 1.0 - (dist / uZoneRadius));
        strength = pow(strength, 2.0);

        float currentScale = 0.02 + (0.015 * strength);
        vec3 pos = position * currentScale; 

        float totalHeight = 1.075;
        float topYLocal = totalHeight / 2.0; 
        float angleZ = uRotZ.x + (sin(uTime * 0.15) * uRotZ.y);
        float xOffset = topYLocal * sin(angleZ);

        vec3 instancePosition = vec3(aInitialPosition.x + xOffset, currentY, aInitialPosition.z);
        
        vec4 worldPosition = instanceMatrix * vec4(pos + instancePosition, 1.0);       

        vec3 glintColor = vec3(5.0, 1.0, 1.0); 
        vFinalColor = mix(aBaseColor, glintColor, strength);

        float totalDuration = 10.0;
        float transitionInDuration = 2.0;
        float transitionOutDuration = 3.0;
        
        float t = mod(uTime / totalDuration, 1.0);

        float transitionInEnd = transitionInDuration / totalDuration;
        float transitionOutStart = (totalDuration - transitionOutDuration) / totalDuration;

        float opacity = 1.0;

        if (t < transitionInEnd) {
            float transitionInProgress = t / transitionInEnd;
            float fadeInProgress = smoothstep(0.0, 0.6, transitionInProgress);
            opacity = fadeInProgress;
        } 
        else if (t > transitionOutStart) {
            float transitionOutProgress = (t - transitionOutStart) / (1.0 - transitionOutStart);
            float fadeOutProgress = smoothstep(0.0, 0.4, transitionOutProgress);
            opacity = 1.0 - fadeOutProgress;
        }
        
        vOpacity = opacity;

        gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
    }
    `,
    // Fragment Shader
    `
    in vec3 vFinalColor;
    in float vOpacity;

    void main() {
        // Premultiplied alpha logic for Additive Blending
        gl_FragColor = vec4(vFinalColor * vOpacity, vOpacity);
    }
    `
);

const HourglassMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uYTravel: new THREE.Vector2(0.8, 0.5),
        uRotZ: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uYTravel;
    uniform vec2 uRotZ;

    // Helper function to rotate a vector
    mat3 rotationMatrix(vec3 axis, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    float getHourglassRotation(float time) {
        float cycleLength = 10.0;
        float transitionTime = 2.0;
        
        float cycle = floor(time / cycleLength);
        
        float progress = mod(time, cycleLength);
        
        float rotationTrigger = smoothstep(cycleLength - transitionTime, cycleLength, progress);
        
        return (cycle + rotationTrigger) * 3.14159265;
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      float hourglassFlip = getHourglassRotation(uTime);

      float angleZ = hourglassFlip + uRotZ.x + (sin(uTime * 0.15) * uRotZ.y);
      pos = rotationMatrix(vec3(0, 0, 1), angleZ) * pos;

      pos.y += sin(uTime * uYTravel.x) * uYTravel.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      if (color.a < 0.1) discard;
      gl_FragColor = color;
    }
    `
);

const SandStreamMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uYTravel: new THREE.Vector2(0.8, 0.5),
        uRotZ: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uYTravel;
    uniform vec2 uRotZ;

    // Helper function to rotate a vector
    mat3 rotationMatrix(vec3 axis, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        float verticalOffset = 0.1;
        pos.y += verticalOffset;

        float angleZ = uRotZ.x + (sin(uTime * 0.15) * uRotZ.y);
        pos = rotationMatrix(vec3(0, 0, 1), angleZ) * pos;

        pos.y += sin(uTime * uYTravel.x) * uYTravel.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;

    void main() {
        float totalDuration = 10.0;
        float transitionInDuration = 2.0;
        float transitionOutDuration = 3.0;
        
        float t = mod(uTime / totalDuration, 1.0);

        float transitionInEnd = transitionInDuration / totalDuration;
        float transitionOutStart = (totalDuration - transitionOutDuration) / totalDuration;

        vec4 color = texture2D(uTexture, vUv);
        float opacity = 1.0;

        if (t < transitionInEnd) {
            float transitionInProgress = t / transitionInEnd;
            float fadeInProgress = smoothstep(0.0, 0.6, transitionInProgress);
            opacity = fadeInProgress;
        } 
        else if (t > transitionOutStart) {
            float transitionOutProgress = (t - transitionOutStart) / (1.0 - transitionOutStart);
            float fadeOutProgress = smoothstep(0.0, 0.4, transitionOutProgress);
            opacity = 1.0 - fadeOutProgress;
        }

        vec4 finalColor = color * opacity;
        if (finalColor.a < 0.1) discard;
        gl_FragColor = finalColor;
    }
    `
);

const SandPileMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uYTravel: new THREE.Vector2(0.8, 0.5),
        uRotZ: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uYTravel;
    uniform vec2 uRotZ;

    // Helper function to rotate a vector
    mat3 rotationMatrix(vec3 axis, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      float angleZ = uRotZ.x + (sin(uTime * 0.15) * uRotZ.y);
      pos = rotationMatrix(vec3(0, 0, 1), angleZ) * pos;

      pos.y += sin(uTime * uYTravel.x) * uYTravel.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;

    void main() {
        float numFrames = 9.0;
        float totalDuration = 10.0;
        float resetDuration = 2.0;
        
        float t = mod(uTime / totalDuration, 1.0);
        float resetStart = (totalDuration - resetDuration) / totalDuration;
        
        float indexA, indexB, fade;
        vec4 finalColor;

        float xOffsets[9];
        xOffsets[0] = 0.012;
        xOffsets[1] = 0.010;
        xOffsets[2] = 0.009;
        xOffsets[3] = 0.007;
        xOffsets[4] = 0.005;
        xOffsets[5] = 0.002;
        xOffsets[6] = 0.0;
        xOffsets[7] = -0.003;
        xOffsets[8] = -0.005;

        if (t < resetStart) {
            float progress = 1.0 - (t / resetStart);
            float currentFrame = progress * (numFrames - 1.0);
            
            indexA = floor(currentFrame);
            indexB = min(indexA + 1.0, numFrames - 1.0);
            fade = fract(currentFrame);
            int iA = int(indexA);
            int iB = int(indexB);

            vec2 uvA = vUv;
            uvA.x = (uvA.x / numFrames) + (indexA / numFrames) + xOffsets[iA];
            vec4 texA = texture2D(uTexture, uvA);

            vec2 uvB = vUv;
            uvB.x = (uvB.x / numFrames) + (indexB / numFrames) + xOffsets[iB];
            vec4 texB = texture2D(uTexture, uvB);

            finalColor = mix(texA, texB, fade);
        } else {
            indexA = 0.0;               
            indexB = numFrames - 1.0;
            int iA = int(indexA);
            int iB = int(indexB);
            
            float resetProgress = (t - resetStart) / (1.0 - resetStart);

            float slamOutFrame0 = smoothstep(0.0, 0.1, resetProgress); 
            float slamInFrame8  = smoothstep(0.9, 1.0, resetProgress);

            vec2 uvA = vUv;
            uvA.x = (uvA.x / numFrames) + (indexA / numFrames) + xOffsets[iA];
            vec4 texA = texture2D(uTexture, uvA);

            vec2 uvB = vUv;
            uvB.x = (uvB.x / numFrames) + (indexB / numFrames) + xOffsets[iB];
            vec4 texB = texture2D(uTexture, uvB);

            finalColor = (texA * (1.0 - slamOutFrame0)) + (texB * slamInFrame8);
        }

        gl_FragColor = finalColor;
    }
    `
);

extend({ FloatingSandMaterial });
extend({ HourglassMaterial });
extend({ SandStreamMaterial });
extend({ SandPileMaterial });

const groupPos = [-2.5, -1.0, 0];
const SAND_COUNT = 25;
const FLOOR = 0.0;
const CEILING = 2.5;
const tempObject = new THREE.Object3D();

const generateSandData = (count = 20) => {
    return Array.from({ length: count }, () => {
        const h = 0.55 + Math.random() * 0.07;
        const s = 0.8 + Math.random() * 0.2;
        const l = 0.4 + Math.random() * 0.3;
        return {
            speed: 0.1 + Math.random() * 0.1,
            x: Math.random() * 0.1,
            y: Math.random() * CEILING + FLOOR,
            z: (Math.random() - 0.5) * 2,
            baseColor: new THREE.Color().setHSL(h, s, l),
            //baseColor: new THREE.Color('blue')
        };
    })
};

const SAND_DATA = generateSandData(SAND_COUNT);

const initialPositions = new Float32Array(SAND_COUNT * 3);
const speeds = new Float32Array(SAND_COUNT);
const baseColorArray = new Float32Array(SAND_COUNT * 3);

for (let i = 0; i < SAND_COUNT; i++) {
    const p = SAND_DATA[i];
    const i3 = i * 3;

    baseColorArray[i3] = p.baseColor.r;
    baseColorArray[i3 + 1] = p.baseColor.g;
    baseColorArray[i3 + 2] = p.baseColor.b;

    initialPositions[i3] = p.x;
    initialPositions[i3 + 1] = p.y;
    initialPositions[i3 + 2] = p.z;

    speeds[i] = p.speed;
};

const HOURGLASS_DATA = {
    position: [0, -0.5, 0], size: [0.5, 0.5 / 0.465],
    rotate: { xStart: 0, xAmp: 0, yStart: 0, yAmp: 0, zStart: 10, zAmp: 15 },
    ytravel: { speed: 0.2, range: 0.1 },
};

const SANDSTREAM_DATA = {
    ...HOURGLASS_DATA, size: [0.5, 0.5 / 0.465],
};

const TARGET_FPS = 1 / 30;

const HOURGLASS_CONFIG = {
    position: HOURGLASS_DATA.position, size: HOURGLASS_DATA.size,
    x: [
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.xStart),
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.xAmp)
    ],
    y: [
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.yStart),
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.yAmp)
    ],
    z: [
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.zStart),
        THREE.MathUtils.degToRad(HOURGLASS_DATA.rotate.zAmp)
    ],
    ytravel: [HOURGLASS_DATA.ytravel.speed, HOURGLASS_DATA.ytravel.range]
};

const FloatingHourglass = memo(function FloatingHourglass() {
    const hourglassRef = useRef();
    const sandstreamRef = useRef();
    const sandpileRef = useRef();
    const instancedMeshRef = useRef();
    const nebulaRef = useRef();
    const accumulator = useRef(0);

    const hourglassTextures = useTexture(hourglass);
    const sandstreamTextures = useTexture(sandstream);
    const sandpileTextures = useTexture(sandpile);
    const nebulaTextures = useTexture(nebula);
    useEffect(() => {
        const textures = [hourglassTextures, sandstreamTextures, sandpileTextures, nebulaTextures];

        textures.forEach(texture => {
            if (texture) {
                texture.anisotropy = 8;
                texture.needsUpdate = true;
            }
        });
    }, [hourglassTextures, sandstreamTextures, sandpileTextures, nebulaTextures]);

    useFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        const t = state.clock.getElapsedTime();

        if (nebulaRef.current) {
            //nebulaRef.current.rotation.y = t * 0.5;
            //nebulaRef.current.rotation.z = t * 0.5;
            //nebulaRef.current.rotation.x = t * 0.1;
        }
        if (instancedMeshRef.current) {
            instancedMeshRef.current.material.uTime = t;
        }
        if (hourglassRef.current) {
            hourglassRef.current.uTime = t;
        }
        if (sandstreamRef.current) {
            sandstreamRef.current.uTime = t;
        }
        if (sandpileRef.current) {
            sandpileRef.current.uTime = t;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group position={groupPos}>
            {/*<mesh ref={nebulaRef} position={[0, 2.5, 0]}>
                <planeGeometry args={[1.5, 1.0]} />
                <meshStandardMaterial
                    map={nebulaTextures}
                    side={THREE.DoubleSide}
                    transparent
                    depthWrite={false}
                />
            </mesh>*/}
            <instancedMesh ref={instancedMeshRef} args={[null, null, SAND_COUNT]}>
                <sphereGeometry args={[0.5, 4, 4]}>
                    <instancedBufferAttribute
                        attach="attributes-aInitialPosition"
                        args={[initialPositions, 3]}
                    />
                    <instancedBufferAttribute
                        attach="attributes-aSpeed"
                        args={[speeds, 1]}
                    />
                    <instancedBufferAttribute
                        attach="attributes-aBaseColor"
                        args={[baseColorArray, 3]}
                    />
                </sphereGeometry>
                <floatingSandMaterial
                    uFloor={FLOOR}
                    uCeiling={CEILING}
                    uRotZ={HOURGLASS_CONFIG.z}
                    side={THREE.DoubleSide}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </instancedMesh>
            <mesh position={HOURGLASS_DATA.position}>
                <planeGeometry args={HOURGLASS_CONFIG.size} />
                <sandStreamMaterial
                    ref={sandstreamRef}
                    uTexture={sandstreamTextures}
                    uYTravel={HOURGLASS_CONFIG.ytravel}
                    uRotZ={HOURGLASS_CONFIG.z}
                    transparent
                    alphaTest={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={HOURGLASS_DATA.position}>
                <planeGeometry args={HOURGLASS_CONFIG.size} />
                <sandPileMaterial
                    ref={sandpileRef}
                    uTexture={sandpileTextures}
                    uYTravel={HOURGLASS_CONFIG.ytravel}
                    uRotZ={HOURGLASS_CONFIG.z}
                    transparent
                    alphaTest={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={HOURGLASS_DATA.position}>
                <planeGeometry args={HOURGLASS_CONFIG.size} />
                <hourglassMaterial
                    ref={hourglassRef}
                    uTexture={hourglassTextures}
                    uYTravel={HOURGLASS_CONFIG.ytravel}
                    uRotZ={HOURGLASS_CONFIG.z}
                    transparent
                    alphaTest={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
});

export default FloatingHourglass;