"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF, CubeCamera } from '@react-three/drei'
import * as THREE from 'three'

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
    
    
  )
  }
  

function Model({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations, cameras } = useGLTF(url)
  const { actions } = useAnimations(animations, group)
  const { gl, camera } = useThree()

  useEffect(() => {
    // Play all animations
    Object.values(actions).forEach(action => action?.play())

    // Set up the camera from the GLB file
    if (cameras.length > 0) {
      const glbCamera = cameras[0]
      camera.position.copy(glbCamera.position)
      camera.rotation.copy(glbCamera.rotation)
      camera.updateProjectionMatrix()
    }

    // Traverse and modify material
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const newMaterial = new THREE.MeshPhysicalMaterial({
            metalness: 1.000,
            roughness: 0.0,
            clearcoat: 1.0,
            reflectivity: 1.0,
            envMapIntensity: 1.0,
          })
          mesh.material = newMaterial
        }
      }
    })

  }, [scene, actions, cameras, camera, gl])

  useFrame((state, delta) => {
    // Update animations
    Object.values(actions).forEach(action => {
      if (action) action.time += delta;
    })
  })

  return (
    <CubeCamera resolution={256} frames={1}>
      {(texture) => (
        <primitive object={scene} ref={group}>
          {scene.children.map((child, index) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              return (
                <mesh key={index} geometry={mesh.geometry}>
                </mesh>
              )
            }
            return null
          })}
        </primitive>
      )}
    </CubeCamera>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5000], fov: 75 }}>
      <React.Suspense fallback={null}>
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
        <Model url="/DCA.gltf"  />
        <OrbitControls />
      </React.Suspense>
    </Canvas>
  )
}

export default Scene