import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Velocidad de movimiento y rotación
const SPEED = 0.1
const ROTATION_SPEED = 0.05

export function MovementControls({ target }) {
  // Referencia al objeto que queremos controlar
  const keys = useRef({ 
    forward: false, 
    backward: false, 
    left: false, 
    right: false,
    shift: false  // Para movimiento más rápido
  })
  
  // Establece los listeners de eventos del teclado
  useEffect(() => {
    // Handler para cuando se presiona una tecla
    const handleKeyDown = (e) => {
      // Evita el comportamiento predeterminado solo para las teclas de flecha
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(e.key)) {
        e.preventDefault()
      }
      
      // Actualiza el estado de las teclas (solo flechas)
      if (e.key === 'ArrowUp') keys.current.forward = true
      if (e.key === 'ArrowDown') keys.current.backward = true
      if (e.key === 'ArrowLeft') keys.current.left = true
      if (e.key === 'ArrowRight') keys.current.right = true
      if (e.key === 'Shift') keys.current.shift = true
    }
    
    // Handler para cuando se suelta una tecla
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') keys.current.forward = false
      if (e.key === 'ArrowDown') keys.current.backward = false
      if (e.key === 'ArrowLeft') keys.current.left = false
      if (e.key === 'ArrowRight') keys.current.right = false
      if (e.key === 'Shift') keys.current.shift = false
    }
    
    // Añade los event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    // Limpia los event listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  // En cada frame, actualiza la posición basada en las teclas presionadas
  useFrame(() => {
    // Comprobación de seguridad - asegurarse de que target y target.current existen
    if (!target || !target.current || !target.current.position) return
    
    // Velocidad base, multiplicada si Shift está presionado
    const currentSpeed = keys.current.shift ? SPEED * 2 : SPEED
    const rotationSpeed = keys.current.shift ? ROTATION_SPEED * 2 : ROTATION_SPEED
    
    // Rotación para izquierda/derecha
    if (keys.current.left) target.current.rotation.y += rotationSpeed
    if (keys.current.right) target.current.rotation.y -= rotationSpeed
    
    // Calcular dirección adelante/atrás basada en la rotación actual
    if (keys.current.forward) {
      // Usar trigonometría para moverse en la dirección a la que apunta
      target.current.position.x -= Math.sin(target.current.rotation.y) * currentSpeed
      target.current.position.z -= Math.cos(target.current.rotation.y) * currentSpeed
    }
    if (keys.current.backward) {
      // Lo mismo pero en dirección contraria
      target.current.position.x += Math.sin(target.current.rotation.y) * currentSpeed
      target.current.position.z += Math.cos(target.current.rotation.y) * currentSpeed
    }
  })
  
}