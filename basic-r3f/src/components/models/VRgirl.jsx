import { useGLTF, useAnimations } from '@react-three/drei'
import { useState, useEffect, useRef, forwardRef } from 'react'

export const VRgirl = forwardRef((props, ref) => {
  const group = useRef()
  // Combinamos la referencia externa con la nuestra
  const combinedRef = useCombinedRefs(ref, group)
  
  // También necesitamos extraer animations, no solo scene
  const { scene, animations } = useGLTF('/models/wGirl_run.glb')
  // Usamos useAnimations para manejar las animaciones
  const { actions, names } = useAnimations(animations, group)
  
  // Estado para la animación actual y para rastrear movimiento
  const [animationState, setAnimationState] = useState('idle')
  const [customAnimationIndex, setCustomAnimationIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  
  // Para rastrear qué teclas están presionadas
  const pressedKeys = useRef(new Set())
  
  // Función para encontrar la mejor animación por nombre
  const findAnimation = (keywords) => {
    if (!names || names.length === 0) return null;
    
    // Buscar una animación que contenga alguna de las palabras clave
    for (const keyword of keywords) {
      const found = names.find(name => 
        name.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found) return found;
    }
    
    // Si no encontramos ninguna, devolvemos la primera
    return names[0];
  };
  
  // Detectar teclas presionadas para animaciones
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Añadir la tecla al conjunto de teclas presionadas
      pressedKeys.current.add(e.key)
      
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        setAnimationState('walking');
        setIsMoving(true);
      } else if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setAnimationState('turning');
        setIsMoving(true);
      }
    };
    
    const handleKeyUp = (e) => {
      // Quitar la tecla del conjunto de teclas presionadas
      pressedKeys.current.delete(e.key)
      
      // Verificar si alguna tecla de movimiento sigue presionada
      const movementKeysPressed = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        .some(key => pressedKeys.current.has(key))
      
      if (!movementKeysPressed) {
        setAnimationState('idle');
        setIsMoving(false);
      } else if (pressedKeys.current.has('ArrowLeft') || pressedKeys.current.has('ArrowRight')) {
        setAnimationState('turning'); // Prioritize turning animation
      } else {
        setAnimationState('walking'); // Fall back to walking animation
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Cambiar a la siguiente animación personalizada al hacer clic
  const handleClick = (e) => {
    // Solo cambiamos la animación personalizada si no nos estamos moviendo
    if (!isMoving) {
      e.stopPropagation();
      
      const nextIndex = (customAnimationIndex + 1) % names.length;
      setCustomAnimationIndex(nextIndex);
      
      console.log(`Cambiando a animación: ${names[nextIndex]}`);
    }
  };
  
  // Efecto para reproducir la animación basada en el estado de movimiento
  useEffect(() => {
    // Detener todas las animaciones
    names.forEach(name => actions[name]?.stop());
    
    // Seleccionar la animación según el estado
    let animationName;
    
    switch (animationState) {
      case 'walking':
        animationName = findAnimation(['walk', 'run', 'move', 'forward']);
        break;
      case 'turning':
        animationName = findAnimation(['turn', 'rotate', 'spin']);
        break;
      case 'idle':
      default:
        // En idle usamos la animación personalizada seleccionada por clic
        animationName = names[customAnimationIndex];
    }
    
    // Reproducir la animación seleccionada
    if (animationName && actions[animationName]) {
      console.log(`Reproduciendo animación: ${animationName}`);
      actions[animationName].reset().play();
    }
  }, [actions, names, animationState, customAnimationIndex]);
  
  // Corregimos la orientación del modelo para que mire hacia el frente
  const baseRotation = props.baseRotation || [0, Math.PI, 0]
  
  return (
    <group ref={combinedRef} onClick={handleClick} {...props}>
      {/* Grupo adicional para aplicar la rotación base */}
      <group rotation={baseRotation}>
        <primitive object={scene} />
      </group>
    </group>
  )
});

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

useGLTF.preload('/models/wGirl_run.glb')