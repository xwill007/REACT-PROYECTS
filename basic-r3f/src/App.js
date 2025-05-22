import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, Suspense } from 'react'
import { VRgirl } from './components/models/VRgirl'

function Box(props) {
  // State for hover and active effects
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  return (
    <mesh
      {...props}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Box position={[-1.5, 0, 0]} />
        <Box position={[1.5, 0, 0]} />
        
        {/* Wrap the model in a Suspense component to handle loading */}
        <Suspense fallback={null}>
          <VRgirl position={[0, -3.0, 0]} scale={2} rotation={[0, Math.PI / 4, 0]} />
        </Suspense>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}