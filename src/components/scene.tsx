// "use client"

// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls, CubeCamera, Environment } from '@react-three/drei'
// import * as THREE from 'three'

// function ReflectiveSphere() {
//   const meshRef = useRef<THREE.Mesh>(null)

//   return (
//     <CubeCamera resolution={256} frames={Infinity}>
//       {(texture) => (
//         <mesh ref={meshRef}>
//           <Environment
//             background={true} // can be true, false or "only" (which only sets the background) (default: false)
//             backgroundBlurriness={0} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
//             backgroundIntensity={1} // optional intensity factor (default: 1, only works with three 0.163 and up)
           
//             environmentIntensity={0} // optional intensity factor (default: 1, only works with three 0.163 and up)
//             files='/DSC_4608.jpg'
//             />

//           <sphereGeometry args={[250, 64, 64]} />
//           <meshPhysicalMaterial
//             envMap={texture}
//             metalness={1}
//             roughness={0}
//             transmission={0.1}
//             thickness={10}
//             envMapIntensity={1}
//           />
//         </mesh>
//       )}
//     </CubeCamera>
//   )
// }




// export function Scene() {
//   return (
//     <div style={{ width: '100%', height: '100vh', position: 'relative'}}>
//       <Canvas camera={{ position: [0, 0, 500], fov: 75 }} gl={{ alpha: true }}>
//         <React.Suspense fallback={null}>
//         <ReflectiveSphere />
//           <OrbitControls enableZoom={false} enablePan={true} />
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[10, 10, 5]} intensity={1.5} />
//         </React.Suspense>
//       </Canvas>
//     </div>
//   )
// }

"use client"

import React, { useRef, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Scene() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative'}}>
      <Canvas camera={{ position: [0, 0, 500], fov: 75 }}>
        <Suspense fallback={null}>
        <ReflectiveSphere />
        {/* <SelectEnv/> */}
          <OrbitControls enableZoom={false} enablePan={true} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}

function SelectEnv(){


    return(
    <Environment
    backgroundIntensity={0} // optional intensity factor (default: 1, only works with three 0.163 and up)
  backgroundRotation={[0, Math.PI / 2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
  environmentIntensity={10} // optional intensity factor (default: 1, only works with three 0.163 and up)
  environmentRotation={[0, Math.PI / 2, 0]} // optional rotation (default: 0, only works with three 0.163 and up)
    background = {true}
    files='/HDR_blue_nebulae-1.hdr'
        />
  )
}

function ReflectiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture('/HDR_blue_nebulae-1.hdr')


  return (
        <mesh ref={meshRef}>
          <sphereGeometry args={[250, 64, 64]} />
          <meshStandardMaterial

            metalness={1}
            roughness={0}
            envMap={texture}
            
          />
        </mesh>
  )
}

