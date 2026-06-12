import React, { createContext, useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const CanvasContext = createContext({ isActive: true });

export function CanvasSection({ isActive, children }) {
  return (
    <CanvasContext.Provider value={{ isActive }}>
      <group visible={isActive}>
        {children}
      </group>
    </CanvasContext.Provider>
  );
}

export function useCanvasSectionFrame(callback) {
  const { isActive } = useContext(CanvasContext);

  useFrame((state, delta) => {
    if (!isActive) return;
    
    callback(state, delta);
  });
}