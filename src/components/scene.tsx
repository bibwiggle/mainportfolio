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

    // Traverse and modify material
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = new THREE.MeshPhysicalMaterial({
          metalness: 1.000,
          roughness: 0.0,
          clearcoat: 1.0, // Extra shiny finish
          reflectivity: 1.0, // Full reflectivity
        })
      }
    })

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
