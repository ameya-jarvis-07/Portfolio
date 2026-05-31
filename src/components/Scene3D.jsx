import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import StarField from './StarField';
import FloatingGeometry from './FloatingGeometry';

function ScrollCamera({ scrollY }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.y = -scrollY * 0.005;
  });
  return null;
}

export default function Scene3D({ scrollY }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        {/* Warm, diffuse lighting for the oat/olive palette */}
        <ambientLight intensity={1.6} />
        <pointLight position={[5, 5, 5]} intensity={2.2} color="#415B06" />
        <pointLight position={[-5, -5, 5]} intensity={1.5} color="#6A8C1A" />
        
        <StarField />
        <FloatingGeometry scrollY={scrollY} />
        <ScrollCamera scrollY={scrollY} />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.3} />
          <Noise opacity={0.012} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
