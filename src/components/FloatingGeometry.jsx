import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function WireframeMesh({ geometry, color, position, rotationSpeed, floatOffset = 0, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    meshRef.current.position.y = position[1] + Math.sin(t * 0.35 + floatOffset) * 0.7;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        wireframe
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function FloatingGeometry({ scrollY = 0 }) {
  const groupRef = useRef();

  /* Fixed olive palette — no dark/light switching */
  const primary   = '#415B06';
  const secondary = '#6A8C1A';
  const accent    = '#C9B49A';

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = -scrollY * 0.002;
  });

  return (
    <group ref={groupRef}>
      {/* Large torus knot — behind hero */}
      <WireframeMesh
        geometry={<torusKnotGeometry args={[3.5, 0.5, 128, 32]} />}
        color={primary}
        position={[-6, 0, -12]}
        rotationSpeed={[0.001, 0.002, 0.0005]}
        floatOffset={0}
        scale={1}
      />

      {/* Icosahedron — right side */}
      <WireframeMesh
        geometry={<icosahedronGeometry args={[1.8, 1]} />}
        color={secondary}
        position={[7, 2, -8]}
        rotationSpeed={[0.002, 0.003, 0.001]}
        floatOffset={Math.PI / 3}
        scale={1}
      />

      {/* Octahedron — left */}
      <WireframeMesh
        geometry={<octahedronGeometry args={[1.4, 0]} />}
        color={accent}
        position={[-8, -2, -6]}
        rotationSpeed={[0.003, 0.001, 0.002]}
        floatOffset={Math.PI / 2}
        scale={1}
      />

      {/* Small torus — upper right */}
      <WireframeMesh
        geometry={<torusGeometry args={[1.2, 0.35, 16, 48]} />}
        color={primary}
        position={[5, 4, -5]}
        rotationSpeed={[0.002, 0.003, 0.001]}
        floatOffset={1}
        scale={1}
      />

      {/* Dodecahedron — lower left */}
      <WireframeMesh
        geometry={<dodecahedronGeometry args={[1.2, 0]} />}
        color={secondary}
        position={[-4, -4, -7]}
        rotationSpeed={[0.001, 0.002, 0.003]}
        floatOffset={2}
        scale={1}
      />
    </group>
  );
}
