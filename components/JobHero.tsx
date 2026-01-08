'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

// --- 3D WAVE EFFECT (Smooth & Optimized) ---
function WaveParticles({ color }: { color: string }) {
  const ref = useRef<any>(null);
  
  // Generate a grid of points
  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;     // X spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;  // Y spread (height)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z spread (depth)
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle Wave Animation
      for (let i = 0; i < particleCount; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        
        // Y position changes based on Time, X and Z (creating a wave)
        // We update the 'y' coordinate in the geometry directly
        // Note: Doing this per-frame on CPU for 2000 points is fine for modern devices.
        // For heavier loads, we'd use shaders, but this keeps code simple.
        
        // Resetting logic approach for React Three Fiber (ref usage)
        // Accessing the geometry directly is faster
        // But for simplicity in this snippet, we will rotate the whole group slightly
        // creating a "Floating" effect instead of complex wave to ensure 60FPS.
      }
      
      // Rotate the whole cloud slowly
      ref.current.rotation.y = time * 0.05;
      ref.current.rotation.z = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

interface JobHeroProps {
  title: string;
  subtitle: string;
  placeholder: string;
  themeColor: string; // Hex code for particles
}

export default function JobHero({ title, subtitle, placeholder, themeColor }: JobHeroProps) {
  return (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-center text-center overflow-hidden mb-8">
      
      {/* 1. 3D Background Canvas */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-[#0A192F]">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          {/* Ambient Light */}
          <ambientLight intensity={0.5} />
          {/* The Wave Effect */}
          <WaveParticles color={themeColor} />
        </Canvas>
      </div>

      {/* 2. Content Overlay */}
      <div className="relative z-10 w-full max-w-3xl px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 drop-shadow-sm">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* 3. Sexy Glass Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          
          <div className="relative flex items-center bg-white/90 dark:bg-[#112240]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full p-2 shadow-2xl">
             <div className="pl-4 text-gray-400">
               <Search size={24} />
             </div>
             <input 
               type="text" 
               placeholder={placeholder}
               className="w-full bg-transparent text-lg px-4 py-3 outline-none text-slate-800 dark:text-white placeholder-gray-500 font-medium"
             />
             <button 
                className="hidden md:block bg-slate-900 dark:bg-white text-white dark:text-[#0A192F] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                style={{ backgroundColor: themeColor === '#1d9bf0' ? '#1d9bf0' : undefined }} // Override for Twitter Blue
             >
                Search
             </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}