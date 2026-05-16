import { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


const TARGET_FPS = 1 / 30;
const outerSize = 0.6;
const innerSize = 0.3;
const connectorColor = [1.5, 4, 10];
const cubeColors = {
    outerEdge: [2, 10, 20], // Neon Blue
    outerFace: "#0055ff",
    innerEdge: [10, 2, 5],  // Neon Pink/Red
    innerFace: "#ff0055",
};

const corners = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const connectorPositions = new Float32Array(corners.length * 6);
for (let i = 0; i < corners.length; i++) {
    const c = corners[i];
    const i6 = i * 6;
    connectorPositions[i6] = c[0] * (outerSize / 2);
    connectorPositions[i6 + 1] = c[1] * (outerSize / 2);
    connectorPositions[i6 + 2] = c[2] * (outerSize / 2);
    connectorPositions[i6 + 3] = c[0] * (innerSize / 2);
    connectorPositions[i6 + 4] = c[1] * (innerSize / 2);
    connectorPositions[i6 + 5] = c[2] * (innerSize / 2);
};

export default function FloatingTesseract() {
    const groupRef = useRef();
    const lineRef = useRef();
    const accumulator = useRef(0);

    useFrame((state, delta) => {
        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.2;
            groupRef.current.rotation.x = t * 0.1;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group ref={groupRef} position={[2, 1, 0]}>
            <Cube
                size={outerSize}
                faceColor={cubeColors.outerFace}
                edgeColor={cubeColors.outerEdge}
                opacity={0.2}
                depthWrite={false}
            />
            <Cube
                size={innerSize}
                faceColor={cubeColors.innerFace}
                edgeColor={cubeColors.innerEdge}
                opacity={0.4}
            />
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={connectorPositions.length / 3}
                        array={connectorPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={connectorColor} toneMapped={false} transparent opacity={0.4} />
            </lineSegments>
        </group>
    );
}

const Cube = memo(function Cube({ size, faceColor, edgeColor, opacity = 0.2, depthWrite }) {
    return (
        <group>
            <mesh>
                <boxGeometry args={[size, size, size]} />
                <meshBasicMaterial
                    color={faceColor}
                    transparent
                    opacity={opacity}
                    metalness={0.5}
                    roughness={0.2}
                    depthWrite={depthWrite}
                />
            </mesh>
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
                <lineBasicMaterial color={edgeColor} toneMapped={false} linewidth={2} />
            </lineSegments>
        </group>
    );
});