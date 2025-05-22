import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei' // Importa Text desde drei
import { Suspense, useRef } from 'react'
import { VRgirl } from './components/models/VRgirl'
import { MovementControls } from './components/controls/MovementControls'

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
            baseRotation={[0, Math.PI, 0]} // Para que mire hacia adelante
          />
        </Suspense>
        
        {/* Añadimos el componente de control de movimiento */}
        <MovementControls target={vrgirlRef} />

        {/* Reemplazamos a-text por Text de drei */}
        <Text
          position={[-5, 3, 0]}
          color="#000000"
          fontSize={0.3}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          ↑↓ Flechas: avanzar/retroceder | ←→ Flechas: rotar | Clic: cambiar animación
        </Text>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}