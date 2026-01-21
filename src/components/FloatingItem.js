import { useRef, useMemo, useEffect } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const FloatingMaterial = shaderMaterial(
    {
        uTime: 0,
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

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      if (color.a < 0.1) discard; // Optimization: don't render transparent pixels
      gl_FragColor = color;
    }
  `
)

extend({ FloatingMaterial })

export default function FloatingItem({ url, position,
    size = { width: 0.75, aspectratio: 1 / 1 },
    rotate = { xStart: 0, xAmp: 0, yStart: 0, yAmp: 0, zStart: 0, zAmp: 0 },
    ytravel = { speed: 0.8, range: 0.5 }, }) {
    const meshRef = useRef()
    const materialRef = useRef()

    const width = size.width;
    const height = size.width * (1 / size.aspectratio);

    const X_START_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.xStart), [rotate.xStart]);
    const X_ROT_AMP = useMemo(() => THREE.MathUtils.degToRad(rotate.xAmp), [rotate.xAmp]);

    const Y_START_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.yStart), [rotate.yStart]);
    const Y_ROT_AMP = useMemo(() => THREE.MathUtils.degToRad(rotate.yAmp), [rotate.yAmp]);

    const Z_START_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.zStart), [rotate.zStart]);
    const Z_ROT_AMP = useMemo(() => THREE.MathUtils.degToRad(rotate.zAmp), [rotate.zAmp]);

    console.log(height)
    // useMemo ensures we don't re-create this geometry on every frame/render
    const geometry = useMemo(() =>
        new THREE.PlaneGeometry(width, height, 1, 1),
        [width, height])

    // 1. Optimized Texture Loading & Cleanup
    const texture = useMemo(() => {
        const loader = new THREE.TextureLoader()
        const tex = loader.load(url)
        tex.anisotropy = 16
        return tex
    }, [url])

    // Cleanup texture on unmount to prevent memory leaks
    useEffect(() => {
        return () => texture.dispose()
    }, [texture])

    const accumulator = useRef(0)

    useFrame((state, delta) => {
        // 2. Add the time since the last frame to our bucket
        accumulator.current += delta

        // 3. Set your desired tick rate (e.g., 1/30 = 30fps)
        const targetInterval = 1 / 10

        if (accumulator.current >= targetInterval) {
            // --- ALL CALCULATIONS GO HERE ---
            const time = state.clock.getElapsedTime()
            const moveSpeed = ytravel.speed

            const sinTime = Math.sin(time * moveSpeed)
            const cosTime = Math.cos(time * moveSpeed)

            if (meshRef.current) {
                const baseY = position[1]
                meshRef.current.position.y = baseY + sinTime * ytravel.range

                // The target is now your base X + the dynamic cosTime tilt
                const targetX = X_START_RAD + (cosTime * 0.2);
                meshRef.current.rotation.x = THREE.MathUtils.lerp(
                    meshRef.current.rotation.x,
                    targetX,
                    0.1
                )
                meshRef.current.rotation.y = Y_START_RAD + Math.sin(time * 0.15) * Y_ROT_AMP
                meshRef.current.rotation.z = Z_START_RAD + Math.sin(time * 0.15) * Z_ROT_AMP;
            }

            // 4. Reset the accumulator
            accumulator.current %= targetInterval
        }
    })

    return (
        <mesh ref={meshRef} position={position} geometry={geometry}>
            <floatingMaterial
                ref={materialRef}
                uTexture={texture}
                transparent={true}
                alphaTest={0.5}
                side={THREE.DoubleSide}
                premultipliedAlpha={true}
                depthWrite={true}
            />
        </mesh>
    )
}