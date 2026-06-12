import React, { useRef, useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import particle from '../pics/spaceparticle.webp';
import { useCanvasSectionFrame } from './CanvasContext';


const maxParticles = 10;
const TARGET_FPS = 1 / 30;

const getRandomPointOnCylinder = (radius, depth) => {
    const theta = Math.random() * Math.PI * 2;

    const z = (Math.random() - 0.5) * depth;
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
};

const generateVibrantColor = () => `hsl(${Math.random() * 360}, 100%, 70%)`;

const SpaceRingParticles = memo(function SpaceRingParticles({ radius = 1.8, depth = 0.5 }) {
    const instancedMeshRef = useRef();
    const trailMeshRef = useRef();
    const particlesRef = useRef([]);
    const accumulator = useRef(0);

    const tempObject = new THREE.Object3D();
    const tempTrailObj = new THREE.Object3D();
    const tempPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    const tempColor = new THREE.Color();

    const glowTexture = useTexture(particle);

    useEffect(() => {
        const interval = setInterval(() => {
            if (particlesRef.current.length >= maxParticles) return;

            const start = getRandomPointOnCylinder(radius, depth);
            const end = getRandomPointOnCylinder(radius, depth);

            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            mid.y += (Math.random() - 0.5) * 2;
            mid.x += (Math.random() - 0.5) * 2;

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const colorStr = generateVibrantColor();

            particlesRef.current.push({
                curve,
                progress: 0,
                speed: 0.1 + Math.random() * 0.2,
                color: new THREE.Color(colorStr),
                spinX: (Math.random() - 0.5) * 2.0,
                spinY: (Math.random() - 0.5) * 2.0,
                rotX: Math.random() * Math.PI,
                rotY: Math.random() * Math.PI,
                trails: []
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [radius, depth, maxParticles]);

    useCanvasSectionFrame((state, delta) => {
        if (!instancedMeshRef.current || !trailMeshRef.current) return;

        accumulator.current += delta;
        if (accumulator.current < TARGET_FPS) return;

        const time = state.clock.getElapsedTime();

        const activeParticles = particlesRef.current;
        let totalTrailCount = 0;

        for (let i = activeParticles.length - 1; i >= 0; i--) {
            const p = activeParticles[i];
            p.progress += delta * p.speed;

            if (p.progress >= 1.0) {
                activeParticles.splice(i, 1);
                continue;
            }

            p.curve.getPointAt(p.progress, tempPos);
            tempObject.position.copy(tempPos);

            p.rotX += p.spinX * delta;
            p.rotY += p.spinY * delta;
            tempObject.rotation.set(p.rotX, p.rotY, 0);

            tempObject.updateMatrix();
            instancedMeshRef.current.setMatrixAt(i, tempObject.matrix);
            instancedMeshRef.current.setColorAt(i, p.color);

            p.trails.push({
                position: tempPos.clone(),
                age: 1.0
            });

            for (let j = p.trails.length - 1; j >= 0; j--) {
                const trail = p.trails[j];
                trail.age -= delta * 4.5;

                if (trail.age <= 0) {
                    p.trails.splice(j, 1);
                    continue;
                }

                tempTrailObj.position.copy(trail.position);

                const trailScale = trail.age;
                tempTrailObj.scale.set(trailScale, trailScale, trailScale);
                tempTrailObj.updateMatrix();

                trailMeshRef.current.setMatrixAt(totalTrailCount, tempTrailObj.matrix);

                const fadedColor = p.color.clone().multiplyScalar(trail.age);
                trailMeshRef.current.setColorAt(totalTrailCount, fadedColor);

                totalTrailCount++;
            }
        }

        instancedMeshRef.current.count = activeParticles.length;
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        if (instancedMeshRef.current.instanceColor) {
            instancedMeshRef.current.instanceColor.needsUpdate = true;
        }

        trailMeshRef.current.count = totalTrailCount;
        trailMeshRef.current.instanceMatrix.needsUpdate = true;
        if (trailMeshRef.current.instanceColor) {
            trailMeshRef.current.instanceColor.needsUpdate = true;
        }

        accumulator.current %= TARGET_FPS;
    });

    return (
        <group>
            <instancedMesh
                ref={instancedMeshRef}
                args={[null, null, maxParticles]}
                frustumCulled={false}
            >
                <octahedronGeometry args={[0.02, 0]} />
                <meshBasicMaterial
                    map={glowTexture}
                    transparent
                    depthWrite={false}
                //blending={THREE.AdditiveBlending}
                />
            </instancedMesh>
            <instancedMesh ref={trailMeshRef} args={[null, null, maxParticles * 20]} frustumCulled={false}>
                <tetrahedronGeometry args={[0.01, 0]} />
                <meshBasicMaterial
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </instancedMesh>
        </group>
    );
});

export default SpaceRingParticles;