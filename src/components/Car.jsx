import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

const Car = () => {
  const { scene } = useGLTF("/models/Car.gltf");
  const [hovered, setHovered] = useState(false);
  const carRef = useRef();

  useFrame(() => {
    if (carRef?.current && !hovered) {
      carRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <primitive
        ref={carRef}
        object={scene}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </>
  );
};

export default Car;
