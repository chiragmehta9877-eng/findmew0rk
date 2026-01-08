'use client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function StarField(props: any) {
  const ref = useRef<any>(null);
  
  // 🔥 FIX: Manual Position Generation (No 'maath' dependency)
  // Hum 2000 particles bana rahe hain (2000 * 3 coordinates X, Y, Z)
  const [sphere] = useState(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Simple random spread in a box area (-1.5 to +1.5)
      positions[i3] = (Math.random() - 0.5) * 3;     // X
      positions[i3 + 1] = (Math.random() - 0.5) * 3; // Y
      positions[i3 + 2] = (Math.random() - 0.5) * 3; // Z
    }
    
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      // Rotation Animation
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#2dd4bf" // Teal color
          size={0.003}    // Particle size
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40 dark:opacity-80">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
}