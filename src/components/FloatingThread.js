import React, { useRef, useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Line, QuadraticBezierLine, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import threadhead from '../pics/threadhead.webp';


const generateVibrantColor = () => `hsl(${Math.random() * 360}, 100%, 70%)`;

const FloatingThread = memo(function FloatingThread({ objectsRef }) {
    const [connections, setConnections] = useState([]);
    const idCounter = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const keys = Object.keys(objectsRef.current);

            if (keys.length < 2) return;

            const idA = keys[Math.floor(Math.random() * keys.length)];
            const idB = keys[Math.floor(Math.random() * keys.length)];

            if (idA !== idB) {
                const posA = objectsRef.current[idA].position.toArray();
                const posB = objectsRef.current[idB].position.toArray();

                const newId = `thread-${idCounter.current++}`;
                const newConn = { id: newId, start: posA, end: posB, color: generateVibrantColor() };

                setConnections((prev) => [...prev.slice(-10), newConn]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const removeConnection = useCallback((id) => {
        setConnections(prev => prev.filter(c => c.id !== id));
    }, []);

    return (
        <group>
            {connections.map((conn) => (
                <AnimatedThread
                    key={conn.id}
                    id={conn.id}
                    start={conn.start}
                    end={conn.end}
                    color={conn.color}
                    onComplete={removeConnection}
                />
            ))}
        </group>
    );
});

const AnimatedThread = memo(function AnimatedThread({ id, start, end, color, onComplete }) {
    const lineRef = useRef();
    const stateRef = useRef({ progress: 0, hasCompleted: false });

    const { mid, lineLength, curve } = useMemo(() => {
        const s = new THREE.Vector3(...start);
        const e = new THREE.Vector3(...end);
        const c = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
        c.y += (Math.random() - 0.5) * 2;
        c.x += (Math.random() - 0.5) * 2;

        const curve = new THREE.QuadraticBezierCurve3(s, c, e);
        const length = curve.getLength();
        return { mid: [c.x, c.y, c.z], lineLength: curve.getLength(), curve: curve };
    }, [start, end]);

    useEffect(() => {
        if (lineRef.current) {
            const material = lineRef.current.material;
            material.gapSize = lineLength * 4;
        }
    }, []);

    const spriteRef = useRef();
    const glowTexture = useTexture(threadhead);
    const tempPos = new THREE.Vector3();

    useFrame((state, delta) => {
        if (!lineRef.current || stateRef.current.hasCompleted) return;

        const material = lineRef.current.material;
        stateRef.current.progress += delta * 0.3;
        const p = stateRef.current.progress;

        const dashRatio = 0.6;
        const maxDashSize = lineLength * dashRatio;
        const pEnd = 1 + dashRatio;

        if (p < dashRatio) {
            material.dashOffset = 0;
            material.dashSize = p * lineLength;
        }
        else if (p >= dashRatio && p <= 1.0) {
            material.dashSize = maxDashSize;
            material.dashOffset = -(p - dashRatio) * lineLength;
        }
        else if (p > 1.0 && p <= pEnd) {
            const tailPos = (p - dashRatio) * lineLength;
            material.dashOffset = -tailPos;
            material.dashSize = lineLength + material.dashOffset;
        }

        const maxOpacity = 0.5;

        if (p < 0.4) {
            material.opacity = (p / 0.4) * maxOpacity;
        }
        else if (p > pEnd - 0.8) {
            const remaining = pEnd - p;
            material.opacity = (remaining / 0.8) * maxOpacity;
        }
        else {
            material.opacity = maxOpacity;
        }

        if (p >= pEnd) {
            stateRef.current.hasCompleted = true;
            if (onComplete) onComplete(id);
        }

        if (spriteRef.current && !stateRef.current.hasCompleted) {
            const distanceProgress = Math.max(0, Math.min(p, 1.0));
            curve.getPointAt(distanceProgress, tempPos);
            spriteRef.current.position.copy(tempPos);

            let spriteOpacity = material.opacity * 2;
            if (p > 0.8) {
                const fadeProgress = (p - 0.8) / (1.0 - 0.8);
                const fadeFactor = Math.max(0, 1 - fadeProgress);
                spriteOpacity *= fadeFactor;
            }
            spriteRef.current.material.opacity = spriteOpacity;
            spriteRef.current.visible = p < 1.05;
        }
    });

    return (
        <>
            <QuadraticBezierLine
                ref={lineRef}
                start={start}
                end={end}
                mid={mid}
                color={color}
                lineWidth={2}
                transparent
                dashed
                dashScale={1}
                depthTest={false}
            />
            {/*<sprite ref={spriteRef} scale={[0.1, 0.1, 1]}>
                <spriteMaterial
                    map={glowTexture}
                    transparent
                    depthTest={false}
                    //blending={THREE.AdditiveBlending}
                    color={color}
                />
            </sprite>*/}
        </>
    );
});

export default FloatingThread;