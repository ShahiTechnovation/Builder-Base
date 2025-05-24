
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedAvatarProps {
  level: number;
  isFloating?: boolean;
}

const AnimatedAvatar = ({ level, isFloating = true }: AnimatedAvatarProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      if (isFloating) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      }
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.01;
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const getAvatarColor = () => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#8B5CF6', // Purple
      '#F59E0B', // Orange
      '#EF4444', // Red
      '#EC4899', // Pink
    ];
    return colors[level % colors.length];
  };

  const getLevelAccessories = () => {
    const accessories = [];
    
    if (level >= 2) {
      // Add floating rings for level 2+
      for (let i = 0; i < level; i++) {
        accessories.push(
          <Torus
            key={`ring-${i}`}
            args={[1.5 + i * 0.2, 0.05, 16, 100]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, i * 0.5, 0]}
          >
            <meshStandardMaterial color={getAvatarColor()} transparent opacity={0.6} />
          </Torus>
        );
      }
    }
    
    return accessories;
  };

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main avatar body */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={getAvatarColor()} 
          metalness={0.3} 
          roughness={0.4}
          emissive={getAvatarColor()}
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.1, 16, 16]} position={[-0.2, 0.2, 0.7]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.2, 0.2, 0.7]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      
      {/* Pupils */}
      <Sphere args={[0.05, 16, 16]} position={[-0.2, 0.2, 0.75]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.05, 16, 16]} position={[0.2, 0.2, 0.75]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Level crown for high levels */}
      {level >= 5 && (
        <Box args={[0.3, 0.2, 0.1]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Box>
      )}
      
      {/* Level accessories */}
      {getLevelAccessories()}
    </group>
  );
};

interface Avatar3DProps {
  level: number;
  className?: string;
}

export const Avatar3D = ({ level, className = "" }: Avatar3DProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`bg-gradient-to-br from-purple-100 to-blue-100 rounded-full animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-purple-600 font-bold">
          L{level}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8B5CF6" />
        
        <AnimatedAvatar level={level} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Level indicator overlay */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-purple-600">
        L{level}
      </div>
    </div>
  );
};
