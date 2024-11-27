"use client"

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

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

    // Set up renderer to work with the chrome texture
    // if ('useLegacyLights' in gl) {
    //   (gl as any).useLegacyLights = false
    // } else if ('physicallyCorrectLights' in gl) {
    //   (gl as any).physicallyCorrectLights = true
    // }

    // if ('outputColorSpace' in gl) {
    //   gl.outputColorSpace = THREE.SRGBColorSpace
    // } else if ('outputEncoding' in gl) {
    //   (gl as any).outputEncoding = THREE.SRGBColorSpace
    // }

    // gl.toneMapping = THREE.ACESFilmicToneMapping
    // gl.toneMappingExposure = 1

     // Traverse and modify material
     scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          metalness: 1.0005,
          roughness: 0.0,
          clearcoat: 1.0, // Extra shiny finish
          reflectivity: 1.0, // Full reflectivity
        });
      }
    });

  }, [scene, actions, cameras, camera, gl])

  useFrame((state, delta) => {
    // Update animations
    Object.values(actions).forEach(action => {
      if (action) action.time += delta;
    })
  })

  return <primitive object={scene} ref={group} />
}

function Scene() {
  return (
    <Canvas>
      <React.Suspense fallback={null}>
        <Model url="/decimated.glb" />
        <OrbitControls />
      </React.Suspense>
    </Canvas>
  )
}

export default Scene