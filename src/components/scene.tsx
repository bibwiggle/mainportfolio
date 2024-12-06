"use client"

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF, CubeCamera } from '@react-three/drei'
import * as THREE from 'three'

function ReflectiveSphere() {
  return (
    <CubeCamera resolution={256*2} frames={1}>
      {(texture) => (
        <mesh>
          <sphereGeometry args={[5, 64, 64]} />
          <meshStandardMaterial envMap={texture} metalness={1} roughness={0} />
        </mesh>
      )}
    </CubeCamera>
  );
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
                  <meshStandardMaterial envMap={texture}/>
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
      <ReflectiveSphere/>
        <Model url="/DCA.gltf"  />
        <OrbitControls />
      </React.Suspense>
    </Canvas>
  )
}

export default Scene

useGLTF.preload('/DCA.gltf');

// // Type guard for Light
// function isLight(object: THREE.Object3D): object is THREE.Light {
//   return 'isLight' in object; // Check if the object has an `isLight` property
// }



// function Model({ url }: { url: string }) {
//   const { scene } = useGLTF(url);

//   // Edit light properties after loading the model
//   useEffect(() => {
//     scene.traverse((child) => {
//       if (isLight(child)) {
//         (child as THREE.Light).intensity = 2; // Adjust light intensity
//         (child as THREE.Light).color.set('white'); // Change light color
//         console.log('Editing light:', child);
//       }
//     });
//   }, [scene]);

//   return <primitive object={scene} />;
// }

// export default function Scene() {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//         <Suspense fallback={null}>
//           {/* Ambient Light */}
//           <ambientLight intensity={0.5} />

//           {/* Directional Light */}
//           <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

//           <Model url="/DCA.gltf" />
//           <ReflectiveSphere/>
//           <OrbitControls />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }