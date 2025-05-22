import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, Suspense, useRef } from 'react'
import { VRgirl } from './components/models/VRgirl'
import { MovementControls } from './components/controls/MovementControls'

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
  // Referencia al modelo para controlar su movimiento
  const vrgirlRef = useRef()
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        {/* Wrap the model in a Suspense component to handle loading */}
        <Suspense fallback={null}>
          <VRgirl 
            ref={vrgirlRef}
            position={[0, -3.0, 0]} 
            scale={2} 
            rotation={[0, Math.PI / 4, 0]} 
          />
        </Suspense>
        
        {/* Añadimos el componente de control de movimiento */}
        <MovementControls target={vrgirlRef} />
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}