import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Bounds,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Engine } from "./components/Engine";

export default function App() {
  const [showInstructions, setShowInstructions] = useState(false);
  const featuresRef = useRef();

  const handleClickOutside = (event) => {
    if (!featuresRef.current.contains(event.target)) {
      setShowInstructions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
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
          <hemisphereLight color="white" groundColor="gray" intensity={1} />

          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={0.5}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          <ambientLight intensity={0.3} />
          <pointLight position={[-10, -10, -10]} intensity={0.1} />

          <Bounds fit clip margin={1}>
            <Engine rotation={[Math.PI / 2, 0, 0]} />
          </Bounds>

          <ContactShadows
            position={[0, -0.8, 0]}
            scale={10}
            blur={5}
            far={10}
            opacity={1}
            frames={1}
          />

          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          zIndex: 1000,
        }}
        ref={featuresRef}
      >
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          style={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Instructions ▼
        </button>
        {showInstructions && (
          <div className="mt-[5px] bg-slate-900 p-1 rounded-md flex flex-col gap-1">
            <p className="bg-white rounded-md text-black p-1">
              Supports zoom-in & zoom-out, and 360 view
            </p>

            <p className="bg-white rounded-md text-black p-1">
              Click on the parts to visualize individually.
            </p>
            <p className="bg-white rounded-md text-black p-1">
              Press Escape to unselect any part.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
