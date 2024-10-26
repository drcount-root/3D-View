import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Bounds,
} from "@react-three/drei";
import { Suspense } from "react";
import { Engine } from "./components/Engine";

export default function App() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 2, 10],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={null}>
        {/* Hemisphere Light for natural ambient light */}
        <hemisphereLight color="white" groundColor="gray" intensity={2} />

        {/* Spotlight for directional lighting and shadows */}
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Additional lighting for balance */}
        <ambientLight intensity={0.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.1} />

        {/* Engine model with bounds */}
        <Bounds fit clip margin={1.2}>
          <Engine rotation={[Math.PI / 2, 0, 0]} />
        </Bounds>

        {/* Ground shadows */}
        <ContactShadows
          position={[0, -0.8, 0]}
          scale={10}
          blur={5}
          far={10}
          opacity={1}
          frames={1}
        />

        {/* Environment for better reflections */}
        <Environment preset="studio" />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}
