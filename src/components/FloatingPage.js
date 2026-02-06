import { useRef, useMemo, useEffect, memo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';


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

const PAGE_GEOM = new THREE.PlaneGeometry(0.5, 2 / 3, 32, 32);
const BASE_BEND = 0.35;
const TARGET_FPS = 1 / 30;

const FloatingPage = memo(function FloatingPage({ url, position,
  rotate = { xCenter: 0, yCenter: 45, yAmp: 15, z: 0 }, ytravel = { speed: 0.8, range: 0.5 },
  bend = { number: 1.4, amp: 0 } }) {

  const meshRef = useRef();
  const materialRef = useRef();
  const accumulator = useRef(0);

  const baseY = position[1];
  const { speed, range } = ytravel;
  const { xStartRot, yStartRot, zStartRot, yRotAmp } = useMemo(() => ({
    xStartRot: THREE.MathUtils.degToRad(rotate.xCenter),
    yStartRot: THREE.MathUtils.degToRad(rotate.yCenter),
    zStartRot: THREE.MathUtils.degToRad(rotate.z),
    yRotAmp: THREE.MathUtils.degToRad(rotate.yAmp),
  }), [rotate.xCenter, rotate.yCenter, rotate.z, rotate.yAmp]);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [url]);

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  useFrame((state, delta) => {
    accumulator.current += delta;
    if (accumulator.current < TARGET_FPS) return;

    const time = state.clock.getElapsedTime();

    const sinTime = Math.sin(time * speed);
    const cosTime = Math.cos(time * speed);
    const turbulence = Math.sin(time * 4) * 0.02;

    if (meshRef.current) {
      const mesh = meshRef.current;
      mesh.position.y = baseY + sinTime * range;

      // The target is base X + the dynamic cosTime tilt
      const targetX = xStartRot + (cosTime * 0.2);
      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        targetX,
        0.1
      );
      mesh.rotation.y = yStartRot + Math.sin(time * 0.5) * yRotAmp;
      mesh.rotation.z = zStartRot + (sinTime * 0.05);
    }

    if (materialRef.current) {
      // make the ripples move at half speed
      materialRef.current.uTime = time * 0.25;

      // reduce turbulence frequency so it doesn't "shiver" too fast
      materialRef.current.uAmplitude = BASE_BEND + (cosTime * 0.15) + turbulence;
    }

    accumulator.current %= TARGET_FPS;
  })

  return (
    <mesh ref={meshRef} position={position} geometry={PAGE_GEOM}>
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
});

export default FloatingPage;