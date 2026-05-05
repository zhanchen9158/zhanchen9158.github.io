import { useState, useRef, useCallback, useMemo, useEffect, memo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useAnimateContext } from './AnimateContext';

const inkblotimport = import.meta.glob('../pics/inkblot*.webp', {
  eager: true,
  query: '?url'
});
const inkblotobject = Object.entries(inkblotimport).reduce((acc, [path, module], index) => {
  const key = `inkblot${index + 1}`;
  acc[key] = module.default;

  return acc;
}, {});


const getRandomInkblotKey = () => {
  const keys = Object.keys(inkblotobject);
  const randomIndex = Math.floor(Math.random() * keys.length);

  return keys[randomIndex];
};

const InkMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color('#080808'),
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
    uniform float uTime;
    uniform float uHover;
    uniform vec3 uColor;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 n) {
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }

    void main() {
      float bigNoise = noise(vUv * 3.0 + uTime * 0.2);
      float smallNoise = noise(vUv * 15.0 - uTime * 0.5);
      float combinedNoise = (bigNoise * 0.8 + smallNoise * 0.2) * 2.0 - 1.0;
      
      float distortionStrength = 0.5 * smoothstep(0.0, 0.4, uHover); 
      
      vec2 displacement = (vUv - 0.5) * combinedNoise * distortionStrength;
      vec2 distortedUv = vUv + displacement;

      vec4 texColor = texture2D(uTexture, distortedUv);

      float growth = smoothstep(0.1, 0.9, texColor.a + uHover - 1.0);
      float finalAlpha = growth * uHover;

      gl_FragColor = vec4(texColor.rgb, finalAlpha);
    }
  `
);

extend({ InkMaterial });

const PageMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uTexture: new THREE.Texture(),
    uFrequency: 1.4,
    uAmplitude: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;
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
    uniform float uTime;
    uniform float uHover;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      if (color.a < 0.1) discard; // Optimization: don't render transparent pixels
      
      float noise = sin(vUv.x * 10.0 + uTime) * cos(vUv.y * 10.0 + uTime) * 0.02;
      float thickness = 0.04 + noise; 
      
      float borderMask = step(1.0 - thickness, vUv.x) + 
                        step(vUv.x, thickness) + 
                        step(1.0 - thickness, vUv.y) + 
                        step(vUv.y, thickness);
      borderMask = clamp(borderMask, 0.0, 1.0);

      vec3 borderColor = vec3(0.4, 0.7, 1.0);

      float pulse = (sin(uTime * 8.0) * 0.5 + 0.5) * borderMask * uHover;
      vec3 finalRGB = mix(color.rgb, borderColor + (pulse * 0.2), borderMask * uHover);

      gl_FragColor = vec4(finalRGB, color.a);

      //gl_FragColor = color;
    }
  `
);

extend({ PageMaterial });

const PAGE_GEOM = new THREE.PlaneGeometry(0.6, 0.9, 32, 32);
const BASE_BEND = 0.35;
const TARGET_FPS = 1 / 30;

const CertIcon = styled(motion.div)(({ theme }) => ({
  width: 24, height: 24,
  borderRadius: '50%',
  backfaceVisibility: "hidden",
}));

const SvgIcon = styled('img')(({ theme }) => ({
  width: '100%', height: '100%',
  borderRadius: 'inherit',
  backfaceVisibility: "hidden",
}));

const iconVars = {
  initial: {
    filter: 'grayscale(100%)',
    transition: {
      duration: 1
    },
  },
  animate: {
    filter: 'grayscale(0%)',
    transition: {
      duration: 1
    },
  },
  static: { filter: 'grayscale(100%)' },
};

const FloatingPage = memo(function FloatingPage({ id, url, position,
  rotate = { xCenter: 0, yCenter: 45, yAmp: 15, z: 0 }, ytravel = { speed: 0.8, range: 0.5 },
  bend = { number: 1.4, amp: 0 },
  svgIcon, coordRef, handleSelect
}) {
  const [hovered, setHovered] = useState(false);
  const [currentInkblotKey, setCurrentInkblotKey] = useState('none');

  const pageMeshRef = useRef();
  const pageMaterialRef = useRef();
  const inkMeshRef = useRef();
  const inkMaterialRef = useRef();
  const { windowDimRef } = useAnimateContext();

  const accumulator = useRef(0);
  const { camera, size } = useThree();

  const hoverProgress = useRef(0);
  const scaleProgress = useRef(0);
  const seedRef = useRef(0);

  const inkTextures = useTexture(inkblotobject);
  const activeInkTexture = inkTextures[currentInkblotKey];
  useEffect(() => {
    if (inkTextures) {
      Object.values(inkTextures).forEach((tex) => {
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      });
    }
  }, []);

  const baseY = position[1];
  const { speed, range } = ytravel;
  const { xStartRot, yStartRot, zStartRot, yRotAmp } = useMemo(() => ({
    xStartRot: THREE.MathUtils.degToRad(rotate.xCenter),
    yStartRot: THREE.MathUtils.degToRad(rotate.yCenter),
    zStartRot: THREE.MathUtils.degToRad(rotate.z),
    yRotAmp: THREE.MathUtils.degToRad(rotate.yAmp),
  }), [rotate.xCenter, rotate.yCenter, rotate.z, rotate.yAmp]);

  const pageTexture = useTexture(url);
  useEffect(() => {
    if (pageTexture) {
      pageTexture.anisotropy = 8;
      pageTexture.minFilter = THREE.LinearFilter;
      pageTexture.needsUpdate = true;
    }
  }, [pageTexture]);

  useFrame((state, delta) => {
    accumulator.current += delta;
    if (accumulator.current < TARGET_FPS) return;

    const time = state.clock.getElapsedTime();

    const target = hovered ? 1 : 0;
    hoverProgress.current += (target - hoverProgress.current) * 0.05;
    scaleProgress.current += (target - scaleProgress.current) * 0.02;

    const p = hoverProgress.current;
    const influence = hovered ? p : Math.sqrt(p);
    const isAnimating = Math.abs(target - p) > 0.0001;

    const sinTime = Math.sin(time * speed);
    const cosTime = Math.cos(time * speed);
    const floatY = sinTime * range;
    const turbulence = Math.sin(time * 4) * 0.02;

    if (pageMeshRef.current) {
      const mesh = pageMeshRef.current;
      mesh.position.y = floatY;

      const targetX = xStartRot + (cosTime * 0.2);
      mesh.rotation.x = THREE.MathUtils.lerp(
        mesh.rotation.x,
        targetX,
        0.1
      );
      mesh.rotation.y = yStartRot + Math.sin(time * 0.5) * yRotAmp;
      mesh.rotation.z = zStartRot + (sinTime * 0.05);
    }

    if (pageMaterialRef.current) {
      pageMaterialRef.current.uTime = time * 0.25;
      pageMaterialRef.current.uHover = hoverProgress.current;
      pageMaterialRef.current.uAmplitude = BASE_BEND + (cosTime * 0.15) + turbulence;
    }

    if (inkMeshRef.current) {
      inkMeshRef.current.position.y = floatY;

      const s = 0.4 + (scaleProgress.current * 0.8);
      inkMeshRef.current.scale.set(s, s, s);
    }

    if (inkMaterialRef.current && isAnimating) {
      inkMaterialRef.current.uTime = time;
      inkMaterialRef.current.uHover = hoverProgress.current;
    }

    accumulator.current %= TARGET_FPS;
  });

  const handleClick = useCallback((e) => {
    e.stopPropagation();

    if (!pageMeshRef.current || !coordRef) return;

    const vector = new THREE.Vector3();
    pageMeshRef.current.getWorldPosition(vector);
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * windowDimRef.current.w;
    const y = (-vector.y * 0.5 + 0.5) * windowDimRef.current.h;

    coordRef.current = { x: x, y: y };

    handleSelect(id);
  }, [id, camera, size]);

  const handleHover = useCallback((e, v = 'auto') => {
    e.stopPropagation();
    if (v === 'pointer') {
      hoverProgress.current = 0;
      scaleProgress.current = 0;
      seedRef.current = Math.floor(Math.random() * 100);
      setHovered(true);
      setCurrentInkblotKey(getRandomInkblotKey());
    } else {
      setHovered(false);
    }
    document.body.style.cursor = v;
  }, []);

  return (
    <group position={position}>
      <mesh ref={inkMeshRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[1.2, 1.2]} />
        <inkMaterial
          ref={inkMaterialRef}
          uTexture={activeInkTexture}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={pageMeshRef} geometry={PAGE_GEOM}>
        <pageMaterial
          ref={pageMaterialRef}
          uTexture={pageTexture}
          transparent={true}
          alphaTest={0.5}
          side={THREE.DoubleSide}
          premultipliedAlpha={true}
          depthWrite={true}
          uFrequency={bend.number}
        />
      </mesh>
      <mesh
        visible={false}
        onPointerEnter={(e) => handleHover(e, 'pointer')}
        onPointerLeave={(e) => handleHover(e, 'auto')}
        onClick={handleClick}
      >
        <planeGeometry args={[0.6, 0.9]} />
        <meshBasicMaterial />
        <Html position={[-0.4, -0.2, 0]} pointerEvents='none'>
          <CertIcon
            variants={iconVars}
            initial='initial'
            animate={hovered ? 'animate' : 'initial'}
          >
            <SvgIcon
              src={svgIcon}
            />
          </CertIcon>
        </Html>
      </mesh>
    </group>
  )
});

export default FloatingPage;