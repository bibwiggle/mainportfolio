"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, CubeCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Import your project images
const projectImages = [
  "/dancheong.png",
  "/dancheong.png",
  "/dancheong.png",
  "/dancheong.png",
  "/dancheong.png",
]


function ReflectiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const cubeRenderTarget = useMemo(() => new THREE.WebGLCubeRenderTarget(256), [])
  const textures = useLoader(THREE.TextureLoader, projectImages)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 1
    }
  })

  return (
    <CubeCamera frames={Infinity}>
      {(texture) => (
        <mesh>
          <sphereGeometry args={[250, 50, 50]} />
          <meshStandardMaterial metalness={1} roughness={0} />
        </mesh>
      )}
    </CubeCamera>
  );
}

function EnvironmentCube() {
  const textures = useLoader(THREE.TextureLoader, projectImages)
  const envMap = useMemo(() => {
    const cubeTexture = new THREE.CubeTexture(textures)
    cubeTexture.needsUpdate = true
    return cubeTexture
  }, [textures])

  return <Environment files='/HDR_blue_nebulae-1.hdr' background={false} />
}

export function Scene() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', pointerEvents: 'none'}}>
      <Canvas camera={{ position: [0, 0, 500], fov: 75 }} gl={{ alpha: true }}>
        <React.Suspense fallback={null}>
          <EnvironmentCube />
          <ReflectiveSphere />
          <OrbitControls enableZoom={false} enablePan={true} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
 