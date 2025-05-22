import { useGLTF, useAnimations } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'

export function VRgirl(props) {
  const group = useRef()
  // También necesitamos extraer animations, no solo scene
  const { scene, animations } = useGLTF('/models/WarriorGirlDance.glb')
  // Usamos useAnimations para manejar las animaciones
  const { actions, names } = useAnimations(animations, group)
  
  // Estado para seguir qué animación está activa
  const [animationIndex, setAnimationIndex] = useState(0)
  
  // Cambiar a la siguiente animación al hacer clic
  const handleClick = () => {
    // Avanzar al siguiente índice o volver al inicio si llegamos al final
    const nextIndex = (animationIndex + 1) % names.length
    setAnimationIndex(nextIndex)
  }
  
  // Efecto para reproducir la animación actual
  useEffect(() => {
    // Detener todas las animaciones
    names.forEach(name => actions[name]?.stop())
    
    // Si hay animaciones disponibles, reproducir la actual
    if (names.length > 0) {
      const currentAnim = names[animationIndex]
      console.log(`Reproduciendo animación: ${currentAnim}`)
      actions[currentAnim]?.play()
    }
  }, [actions, names, animationIndex])
  
  return (
    <group ref={group} onClick={handleClick} {...props}>
      <primitive object={scene} />
    </group>
  )
}

// Corregimos también la ruta en preload (faltaba la 's' en el original)
useGLTF.preload('/models/WarriorGirlDance.glb')