import { useEffect, useRef, useMemo, memo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { useCanvasSectionFrame } from './CanvasContext';
import useConfigureTextures from '../functions/useConfigureTextures';

const maincubeimport = import.meta.glob('../pics/cube*.webp', {
    eager: true,
    query: '?url'
});
const maincubearray = Object.values(maincubeimport).map((v, _) => (v.default));


const CubeFaceMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uYTravel: new THREE.Vector2(0.2, 0.2), // x: speed, y: range
        uZTravel: new THREE.Vector2(0.2, 0.2), // x: speed, y: range
        uRotX: new THREE.Vector2(0, 0.2),     // x: start, y: amp
        uRotY: new THREE.Vector2(0, 0),       // x: start, y: amp
        uRotZ: new THREE.Vector2(0, 0),       // x: start, y: amp
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uYTravel;
    uniform vec2 uZTravel;
    uniform vec2 uRotX;
    uniform vec2 uRotY;
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

      float angleX = uRotX.x + uTime * uRotX.y;
      float angleY = uRotY.x + uTime * uRotY.y;
      float angleZ = uRotZ.x + uTime * uRotZ.y;

      pos = rotationMatrix(vec3(1, 0, 0), angleX) * pos;
      pos = rotationMatrix(vec3(0, 1, 0), angleY) * pos;
      pos = rotationMatrix(vec3(0, 0, 1), angleZ) * pos;

      pos.y += sin(uTime * uYTravel.x) * uYTravel.y;
      pos.z += -uZTravel.y + abs(sin(uTime * uZTravel.x)) * uZTravel.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment Shader
    `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `
);

extend({ CubeFaceMaterial });

const CUBE_DATA = {
    id: 'cube1',
    position: [4.0, 1, 0],
    scale: 0.75,
    rotate: { xStart: 0, xAmp: -6, yStart: 0, yAmp: 3, zStart: 0, zAmp: 0 },
    ytravel: { speed: 0.1, range: 0.1 },
    ztravel: { speed: 0.1, range: 4.0 },
};

const CUBE_CONFIG = {
    position: CUBE_DATA.position, scale: CUBE_DATA.scale,
    x: [
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.xStart),
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.xAmp)
    ],
    y: [
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.yStart),
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.yAmp)
    ],
    z: [
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.zStart),
        THREE.MathUtils.degToRad(CUBE_DATA.rotate.zAmp)
    ],
    ytravel: [CUBE_DATA.ytravel.speed, CUBE_DATA.ytravel.range],
    ztravel: [CUBE_DATA.ztravel.speed, CUBE_DATA.ztravel.range]
};

const TARGET_FPS = 1 / 30;

const FloatingTesseract = memo(function FloatingTesseract() {
    const cubeRef = useRef();
    const accumulator = useRef(0);

    const maincubeTextures = useTexture(
        maincubearray
    );

    useCanvasSectionFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        const t = state.clock.getElapsedTime();
        if (cubeRef.current) {
            cubeRef.current.material.forEach((mat) => {
                if (mat.uniforms) {
                    mat.uniforms.uTime.value = t;
                }
            });
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <mesh ref={cubeRef} position={CUBE_CONFIG.position} scale={CUBE_CONFIG.scale}>
            <boxGeometry args={[1, 1, 1]} />
            {maincubeTextures.map((texture, index) => (
                <cubeFaceMaterial
                    key={index}
                    attach={`material-${index}`}
                    uTexture={texture}
                    uRotX={CUBE_CONFIG.x}
                    uRotY={CUBE_CONFIG.y}
                    uRotZ={CUBE_CONFIG.z}
                    uYTravel={CUBE_CONFIG.ytravel}
                    uZTravel={CUBE_CONFIG.ztravel}
                    transparent
                    depthWrite={false}
                />
            ))}
        </mesh>
    );
});

export default FloatingTesseract;