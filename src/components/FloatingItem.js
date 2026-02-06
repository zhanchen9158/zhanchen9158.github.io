import { useRef, useMemo, memo, useEffect } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const FloatingMaterial = shaderMaterial(
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
)

extend({ FloatingMaterial })

const FloatingItem = memo(function FloatingItem({ url, position,
    size = { width: 0.75, aspectratio: 1 / 1 },
    rotate = { xStart: 0, xAmp: 0, yStart: 0, yAmp: 0, zStart: 0, zAmp: 0 },
    ytravel = { speed: 0.8, range: 0.5 }, }) {

    const materialRef = useRef()

    // Memoize geometry and texture as before
    const width = size.width;
    const height = size.width * (1 / size.aspectratio);

    const texture = useMemo(() => {
        const tex = new THREE.TextureLoader().load(url)
        tex.anisotropy = 8
        return tex
    }, [url])

    useEffect(() => () => texture.dispose(), [texture])

    // Convert degrees to radians once
    const r = useMemo(() => ({
        x: [THREE.MathUtils.degToRad(rotate.xStart), THREE.MathUtils.degToRad(rotate.xAmp)],
        y: [THREE.MathUtils.degToRad(rotate.yStart), THREE.MathUtils.degToRad(rotate.yAmp)],
        z: [THREE.MathUtils.degToRad(rotate.zStart), THREE.MathUtils.degToRad(rotate.zAmp)],
    }), [rotate])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.getElapsedTime()
        }
    })

    return (
        <mesh position={position}>
            <planeGeometry args={[width, height]} />
            <floatingMaterial
                ref={materialRef}
                uTexture={texture}
                uYTravel={[ytravel.speed, ytravel.range]}
                uRotX={r.x}
                uRotY={r.y}
                uRotZ={r.z}
                transparent
                alphaTest={0.5}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
});

export default FloatingItem;