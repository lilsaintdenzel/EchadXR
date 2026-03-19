import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'

export default function SceneWrapper({ children }) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 1.6, 4], fov: 75 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          {children}
          <OrbitControls
            enablePan={false}
            minDistance={1}
            maxDistance={20}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}
