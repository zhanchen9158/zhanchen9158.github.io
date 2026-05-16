import React, { useEffect, useRef, useMemo, memo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

const SequenceMaterial = shaderMaterial(
    {
        uTime: 0,
        uTextures: new THREE.DataArrayTexture(),
        uFrameCount: 1.0,
        uDuration: 10.0,
        uYTravel: new THREE.Vector2(0.8, 0.5), // x: speed, y: range
        uRotX: new THREE.Vector2(0, 0.2),     // x: start, y: amp
        uRotY: new THREE.Vector2(0, 0),       // x: start, y: amp
        uRotZ: new THREE.Vector2(0, 0),       // x: start, y: amp
    },
    // Vertex Shader
    `
    uniform float uTime;
    uniform vec2 uYTravel;
    uniform vec2 uRotX;
    uniform vec2 uRotY;
    uniform vec2 uRotZ;

    out vec2 vUv;

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

        // 1. Calculate dynamic angles
        float angleX = uRotX.x + (cos(uTime * uYTravel.x) * uRotX.y);
        float angleY = uRotY.x + (sin(uTime * 0.15) * uRotY.y);
        float angleZ = uRotZ.x + (sin(uTime * 0.15) * uRotZ.y);

        // 2. Apply Rotations (Order: XYZ)
        pos = rotationMatrix(vec3(1, 0, 0), angleX) * pos;
        pos = rotationMatrix(vec3(0, 1, 0), angleY) * pos;
        pos = rotationMatrix(vec3(0, 0, 1), angleZ) * pos;

        // 3. Apply Vertical Float
        pos.y += sin(uTime * uYTravel.x) * uYTravel.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);      
    }
    `,
    // Fragment Shader
    `
    precision highp float;
    precision highp sampler2DArray;

    uniform sampler2DArray uTextures;
    uniform float uTime;
    uniform float uFrameCount;
    uniform float uDuration;

    in vec2 vUv;
    out vec4 pc_fragColor;

    void main() {
        float numFrames = uFrameCount;
        float totalDuration = uDuration;
        float t = mod(uTime / totalDuration, 1.0);
        
        float progress = t * numFrames;
        float currentFrame = progress * (numFrames - 1.0);
        
        float indexA = floor(mod(progress, numFrames));
        float indexB = floor(mod(progress + 1.0, numFrames));
        float fade = fract(progress);

        vec4 texA = texture(uTextures, vec3(vUv, indexA));
        vec4 texB = texture(uTextures, vec3(vUv, indexB));

        vec4 finalColor = mix(texA, texB, fade);

        pc_fragColor = finalColor;
    }
    `
);

extend({ SequenceMaterial });

const TARGET_FPS = 1 / 30;

const FloatingSequence = memo(function FloatingSequence({ position = [0, 0, 0],
    size = { width: 0.75, aspectratio: 1 / 1 },
    rotate = { xStart: 0, xAmp: 0, yStart: 0, yAmp: 0, zStart: 0, zAmp: 0 },
    ytravel = { speed: 0.2, range: 0.2 },
    imageUrls, duration = 10
}) {

    const materialRef = useRef();
    const accumulator = useRef(0);

    const width = size.width;
    const height = size.width * (1 / size.aspectratio);

    const textures = useTexture(imageUrls);
    const dataArrayTexture = useMemo(() => {
        if (!textures || textures.length === 0) {
            return null;
        }

        const width = textures[0].image.width;
        const height = textures[0].image.height;
        const depth = textures.length;
        const data = new Uint8Array(width * height * 4 * depth);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        textures.forEach((tex, i) => {
            const img = tex.image;

            context.clearRect(0, 0, width, height);
            context.drawImage(img, 0, 0, width, height);

            const imageData = context.getImageData(0, 0, width, height).data;

            data.set(imageData, i * width * height * 4);
        });

        const tex = new THREE.DataArrayTexture(data, width, height, depth);
        tex.format = THREE.RGBAFormat;
        tex.type = THREE.UnsignedByteType;
        tex.anisotropy = 8;
        tex.needsUpdate = true;

        return tex;
    }, [textures]);
    useEffect(() => {
        if (materialRef.current && dataArrayTexture) {
            materialRef.current.uTextures = dataArrayTexture;
            materialRef.current.uniforms.uTextures.value = dataArrayTexture;
            materialRef.current.needsUpdate = true;
        }
    }, [dataArrayTexture]);

    const r = useMemo(() => ({
        x: [THREE.MathUtils.degToRad(rotate.xStart), THREE.MathUtils.degToRad(rotate.xAmp)],
        y: [THREE.MathUtils.degToRad(rotate.yStart), THREE.MathUtils.degToRad(rotate.yAmp)],
        z: [THREE.MathUtils.degToRad(rotate.zStart), THREE.MathUtils.degToRad(rotate.zAmp)],
    }), [rotate]);

    useFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        if (materialRef.current) {
            materialRef.current.uTime = state.clock.getElapsedTime();
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <mesh position={position}>
            <planeGeometry args={[width, height]} />
            <sequenceMaterial
                glslVersion={THREE.GLSL3}
                ref={materialRef}
                uTexture={dataArrayTexture}
                uFrameCount={imageUrls.length}
                uDuration={duration}
                uYTravel={[ytravel.speed, ytravel.range]}
                uRotX={r.x}
                uRotY={r.y}
                uRotZ={r.z}
                transparent
                alphaTest={0.5}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    )
});

export default FloatingSequence;