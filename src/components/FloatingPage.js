import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'


const IrregularMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uFrequency: 1.4,
    uAmplitude: 0.2
  },
  // Vertex Shader: This handles the "bending"
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;

    void main() {
      vUv = uv;
      vec3 newPos = position;

      // Create irregular waves by layering two different frequencies
      // The "1.5 - uv.y" ensures the top bends more than the bottom
      //float wave = sin(newPos.x * uFrequency + uTime) * uAmplitude;
      //wave += sin(newPos.y * (uFrequency * 2.1) + uTime * 1.5) * (uAmplitude * 0.5);
      float wave = sin(newPos.x * uFrequency + uTime) * uAmplitude;
      wave += sin(newPos.y * (uFrequency * 2.1) + uTime * 1.5) * (uAmplitude * 0.5);
      
      newPos.z += wave * (1.5 - uv.y);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // Fragment Shader: This handles the "look"
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `
)

// Register the material so it can be used as a JSX element
extend({ IrregularMaterial })

export default function FloatingPage({ url, position }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])

  const center = THREE.MathUtils.degToRad(45);
  const amplitude = THREE.MathUtils.degToRad(15);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    materialRef.current.uTime = time;

    meshRef.current.rotation.y = center + Math.sin(time) * amplitude;

    meshRef.current.position.y = Math.sin(time * 0.15) * 0.5;
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.75, 1, 32, 32]} />
      <irregularMaterial
        ref={materialRef}
        uTexture={texture}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}