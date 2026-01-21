import { useRef, useMemo, useEffect } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const PageMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uFrequency: 1.4,
    uAmplitude: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;

    void main() {
      vUv = uv;
      vec3 newPos = position;

      // Adding (newPos.y * 0.5) inside the first sin makes the wave move diagonally
      float wave = sin(newPos.x * uFrequency + (newPos.y * 0.5) + uTime) * uAmplitude;
      wave += sin(newPos.y * (uFrequency * 2.0) + uTime * 1.5) * (uAmplitude * 0.4);
      
      newPos.z += wave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
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

extend({ PageMaterial })

// Pre-calculate constants outside the component to save memory
const BASE_BEND = 0.35;

export default function FloatingPage({ url, position, width = 0.75,
  rotate = { xCenter: 0, yCenter: 45, yAmp: 15, z: 0 }, ytravel = { speed: 0.8, range: 0.5 },
  bend = { number: 1.4, amp: 0 } }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const height = width * (4 / 3);
  const X_CENTER_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.xCenter), [rotate.xCenter]);
  const Y_CENTER_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.yCenter), [rotate.yCenter]);
  const Z_START_RAD = useMemo(() => THREE.MathUtils.degToRad(rotate.z), [rotate.z]);
  const ROT_AMPLITUDE = useMemo(() => THREE.MathUtils.degToRad(rotate.yAmp), [rotate.yAmp]);

  // useMemo ensures we don't re-create this geometry on every frame/render
  const geometry = useMemo(() =>
    new THREE.PlaneGeometry(width, height, 32, 32),
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
    const targetInterval = 1 / 30

    if (accumulator.current >= targetInterval) {
      // --- ALL CALCULATIONS GO HERE ---
      const time = state.clock.getElapsedTime()
      const moveSpeed = ytravel.speed

      const sinTime = Math.sin(time * moveSpeed)
      const cosTime = Math.cos(time * moveSpeed)
      const turbulence = Math.sin(time * 4) * 0.02

      if (meshRef.current) {
        const baseY = position[1]
        meshRef.current.position.y = baseY + sinTime * ytravel.range

        // The target is now your base X + the dynamic cosTime tilt
        const targetX = X_CENTER_RAD + (cosTime * 0.2);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetX,
          0.1
        )
        meshRef.current.rotation.y = Y_CENTER_RAD + Math.sin(time * 0.5) * ROT_AMPLITUDE
        meshRef.current.rotation.z = Z_START_RAD + (sinTime * 0.05);
      }

      if (materialRef.current) {
        // Multiply time by 0.5 to make the ripples move at half speed
        materialRef.current.uTime = time * 0.25;

        // Also reduce turbulence frequency so it doesn't "shiver" too fast
        materialRef.current.uAmplitude = BASE_BEND + (cosTime * 0.15) + turbulence;
      }

      // 4. Reset the accumulator
      accumulator.current %= targetInterval
    }
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <pageMaterial
        ref={materialRef}
        uTexture={texture}
        transparent={true}
        alphaTest={0.5}
        side={THREE.DoubleSide}
        premultipliedAlpha={true}
        depthWrite={true}
        uFrequency={bend.number}
      />
    </mesh>
  )
}