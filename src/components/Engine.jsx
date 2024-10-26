import { useRef, useState, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Engine(props) {
  const group = useRef();
  const { nodes } = useGLTF("/models/machine.glb");
  const [hoveredPart, setHoveredPart] = useState(null);

  // Rotation
  useFrame(() => {
    if (group.current && !hoveredPart) {
      group.current.rotation.z += 0.005;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const partName = e.object.name || "Unnamed Part";
    e.object.material.emissive = new THREE.Color(0xbc00ff);
    setHoveredPart({ node: e.object.geometry, name: partName });
    console.log(`Hovered part: ${partName}`);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    e.object.material.emissive = new THREE.Color(0x000000);
    setHoveredPart(null);
  };

  const parts = {
    gear: [
      { node: nodes.mesh_0, name: "Gear 1" },
      { node: nodes.mesh_1, name: "Gear 1" },
      { node: nodes.mesh_2, name: "Gear 1" },
      { node: nodes.mesh_3, name: "Gear 1" },
      { node: nodes.mesh_4, name: "Gear 1" },
      { node: nodes.mesh_5, name: "Gear 1" },
      { node: nodes.mesh_6, name: "Gear 1" },
      { node: nodes.mesh_7, name: "Gear 1" },
      { node: nodes.mesh_8, name: "Gear 1" },
      { node: nodes.mesh_9, name: "Gear 1" },
      { node: nodes.mesh_10, name: "Gear 1" },
      { node: nodes.mesh_13, name: "Gear 1" },
    ],
    shaft: [
      { node: nodes.mesh_29, name: "Shaft 1" },
      { node: nodes.mesh_30, name: "Shaft 1" },
      { node: nodes.mesh_31, name: "Shaft 1" },
      { node: nodes.mesh_32, name: "Shaft 1" },
      { node: nodes.mesh_33, name: "Shaft 1" },
    ],
    cylinder: [
      { node: nodes.mesh_11, name: "Cylinder 1" },
      { node: nodes.mesh_12, name: "Cylinder 1" },
      { node: nodes.mesh_14, name: "Cylinder 1" },
      { node: nodes.mesh_19, name: "Cylinder 1" },
      { node: nodes.mesh_34, name: "Cylinder 1" },
      { node: nodes.mesh_39, name: "Cylinder 1" },
      { node: nodes.mesh_47, name: "Cylinder 1" },
      { node: nodes.mesh_52, name: "Cylinder 1" },
    ],
    piston1: [
      { node: nodes.mesh_15, name: "Piston 1" },
      { node: nodes.mesh_16, name: "Piston 1" },
      { node: nodes.mesh_17, name: "Piston 1" },
      { node: nodes.mesh_18, name: "Piston 1" },
      { node: nodes.mesh_20, name: "Piston 1" },
      { node: nodes.mesh_21, name: "Piston 1" },
      { node: nodes.mesh_22, name: "Piston 1" },
      { node: nodes.mesh_23, name: "Piston 1" },
      { node: nodes.mesh_24, name: "Piston 1" },
      { node: nodes.mesh_25, name: "Piston 1" },
      { node: nodes.mesh_26, name: "Piston 1" },
      { node: nodes.mesh_27, name: "Piston 1" },
      { node: nodes.mesh_28, name: "Piston 1" },
    ],
    piston2: [
      { node: nodes.mesh_35, name: "Piston 2" },
      { node: nodes.mesh_36, name: "Piston 2" },
      { node: nodes.mesh_37, name: "Piston 2" },
      { node: nodes.mesh_38, name: "Piston 2" },
      { node: nodes.mesh_40, name: "Piston 2" },
      { node: nodes.mesh_41, name: "Piston 2" },
      { node: nodes.mesh_42, name: "Piston 2" },
      { node: nodes.mesh_43, name: "Piston 2" },
      { node: nodes.mesh_44, name: "Piston 2" },
      { node: nodes.mesh_45, name: "Piston 2" },
      { node: nodes.mesh_46, name: "Piston 2" },
    ],
    piston3: [
      { node: nodes.mesh_48, name: "Piston 3" },
      { node: nodes.mesh_49, name: "Piston 3" },
      { node: nodes.mesh_50, name: "Piston 3" },
      { node: nodes.mesh_51, name: "Piston 3" },
      { node: nodes.mesh_53, name: "Piston 3" },
      { node: nodes.mesh_54, name: "Piston 3" },
      { node: nodes.mesh_55, name: "Piston 3" },
      { node: nodes.mesh_56, name: "Piston 3" },
      { node: nodes.mesh_57, name: "Piston 3" },
      { node: nodes.mesh_58, name: "Piston 3" },
      { node: nodes.mesh_59, name: "Piston 3" },
    ],
  };

  return (
    <group ref={group} {...props} dispose={null}>
      {Object.entries(parts).map(([partName, meshes]) => (
        <group key={partName} name={partName}>
          {meshes.map(({ node, name }, index) => (
            <mesh
              key={`${partName}-${index}`}
              geometry={node.geometry}
              material={
                new THREE.MeshStandardMaterial({
                  color: node.material.color,
                  emissive: new THREE.Color(0x000000),
                })
              }
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
              castShadow
              receiveShadow
              name={name}
            />
          ))}
        </group>
      ))}
      {/* Render the hovered part on the side */}
      {hoveredPart && (
        <group position={[100, 0, 0]}>
          <mesh
            geometry={hoveredPart.node}
            material={
              new THREE.MeshStandardMaterial({
                color: 0x0000FF, // or whatever color you want for the side view
                emissive: new THREE.Color(0x0000FF), // Highlight color
              })
            }
          />
          <Html position={[0, 0.5, 0]} center>
            <div style={{ fontSize: "24px", color: "blue", backgroundColor: "0xfff" }}>
              {hoveredPart.name}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

useGLTF.preload("/models/machine.glb");