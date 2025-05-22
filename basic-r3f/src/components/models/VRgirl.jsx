import { useGLTF, useAnimations } from '@react-three/drei'
import { useState, useEffect, useRef, forwardRef } from 'react'

export const VRgirl = forwardRef((props, ref) => {
  const group = useRef()
  // Combinamos la referencia externa con la nuestra
  const combinedRef = useCombinedRefs(ref, group)
  
  // También necesitamos extraer animations, no solo scene
  const { scene, animations } = useGLTF('/models/WarriorGirlDance.glb')
  // Usamos useAnimations para manejar las animaciones
  const { actions, names } = useAnimations(animations, group)
  
  // Estado para seguir qué animación está activa
  const [animationIndex, setAnimationIndex] = useState(0)
  
  // Cambiar a la siguiente animación al hacer clic
  const handleClick = (e) => {
    // Importante: detener la propagación del evento
    e.stopPropagation()
    
    // Avanzar al siguiente índice o volver al inicio si llegamos al final
    const nextIndex = (animationIndex + 1) % names.length
    setAnimationIndex(nextIndex)
    
    console.log(`Cambiando a animación: ${names[nextIndex]}`)
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
    <group ref={combinedRef} onClick={handleClick} {...props}>
      <primitive object={scene} />
    </group>
  )
})

// Utilidad para combinar refs (externa e interna)
function useCombinedRefs(...refs) {
  const targetRef = useRef()
  
  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return
      
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])
  
  return targetRef
}

useGLTF.preload('/models/WarriorGirlDance.glb')