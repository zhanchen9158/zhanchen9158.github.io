import React, { useRef, useMemo, memo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { MeshDistortMaterial, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import floatinginkbottle from '../pics/floatinginkbottle.webp';


const InkBottleMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uYTravel: new THREE.Vector2(0.8, 0.5), // x: speed, y: range
        uRotX: new THREE.Vector2(0, 0.2),     // x: start, y: amp
        uRotY: new THREE.Vector2(0, 0),       // x: start, y: amp
        uRotZ: new THREE.Vector2(0, 0),       // x: start, y: amp
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uYTravel;
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
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      if (color.a < 0.1) discard;
      gl_FragColor = color;
    }
  `
);

extend({ InkBottleMaterial });

const INK_COUNT = 12;
const tempObject = new THREE.Object3D();

const generateInkData = (count = 5) => {
    return Array.from({ length: count }, (_, i) => {
        const posX = 1.4 + Math.random() * 1.2;
        const posY = -1.25 + Math.random() * 1;
        const posZ = (Math.random() - 0.5) * 0.2;

        const travelX = -0.05 + Math.random() * 0.1;
        const travelY = -0.1 + Math.random() * 0.2;
        const travelZ = (Math.random() - 0.5) * 0.1;

        const s = 0.01 + Math.random() * 0.01;

        return {
            id: `droplet-${i}`,
            position: [posX, posY, posZ],
            scale: 0.01 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2,
            travel: { x: travelX, y: travelY, z: travelZ },
        };
    });
};

const INK_DATA = generateInkData(INK_COUNT);

const BOTTLE_DATA = {
    position: [2.25, -1, 0], size: [1.5, 1.5 / (4 / 3)],
    rotate: { xStart: 0, xAmp: 0, yStart: 0, yAmp: 0, zStart: 10, zAmp: 15 },
    ytravel: { speed: 0.2, range: 0.1 },
};

const TARGET_FPS = 1 / 30;

const BOTTLE_CONFIG = {
    position: BOTTLE_DATA.position, size: BOTTLE_DATA.size,
    x: [
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.xStart),
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.xAmp)
    ],
    y: [
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.yStart),
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.yAmp)
    ],
    z: [
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.zStart),
        THREE.MathUtils.degToRad(BOTTLE_DATA.rotate.zAmp)
    ],
    ytravel: [BOTTLE_DATA.ytravel.speed, BOTTLE_DATA.ytravel.range]
};

const FloatingInk = memo(function FloatingInk() {
    const bottleRef = useRef();
    const instancedMeshRef = useRef();
    const accumulator = useRef(0);

    const texture = useMemo(() => {
        const tex = new THREE.TextureLoader().load(floatinginkbottle);
        tex.anisotropy = 8;
        return tex;
    }, []);

    useEffect(() => () => texture.dispose(), [texture]);

    useFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        const t = state.clock.getElapsedTime();

        if (instancedMeshRef.current) {
            INK_DATA.forEach((data, i) => {
                const { position, travel, scale, phase } = data;

                tempObject.position.set(
                    position[0] + Math.sin(t * 0.5 + phase) * travel.x,
                    position[1] + Math.cos(t * 0.3 + phase) * travel.y,
                    position[2] + Math.sin(t * 0.4 + phase) * travel.z
                );

                tempObject.rotation.z = Math.sin(t * 0.2 + phase) * 0.1;
                tempObject.scale.setScalar(scale);
                tempObject.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, tempObject.matrix);
            });
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        if (bottleRef.current) {
            bottleRef.current.uTime = state.clock.getElapsedTime();
        }

        accumulator.current %= TARGET_FPS;
    })

    return (
        <group>
            <mesh position={BOTTLE_CONFIG.position}>
                <planeGeometry args={BOTTLE_CONFIG.size} />
                <inkBottleMaterial
                    ref={bottleRef}
                    uTexture={texture}
                    uYTravel={BOTTLE_CONFIG.ytravel}
                    uRotX={BOTTLE_CONFIG.x}
                    uRotY={BOTTLE_CONFIG.y}
                    uRotZ={BOTTLE_CONFIG.z}
                    transparent
                    alphaTest={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <instancedMesh
                ref={instancedMeshRef}
                args={[null, null, INK_COUNT]}
            >
                <sphereGeometry args={[1, 12, 12]} />
                <MeshDistortMaterial
                    color="#080808"
                    speed={5}
                    distort={0.7}
                    radius={1}
                    metalness={1}
                    roughness={0.15}
                    transparent={true}
                    emissive="#000000"
                    side={THREE.DoubleSide}
                />
            </instancedMesh>
        </group>
    );
});

export default FloatingInk;