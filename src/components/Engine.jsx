import { useRef, useState, useEffect } from "react";
import { useGLTF, Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Engine(props) {
  const group = useRef();
  const { nodes } = useGLTF("/models/machine.glb");
  const [hoveredPart, setHoveredPart] = useState(null);
  const [clickedPart, setClickedPart] = useState(null);

  useFrame(() => {
    if (group.current && !hoveredPart && !clickedPart) {
      group.current.rotation.z += 0.007;
    }
  });

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setClickedPart(null);
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const partName = e.object.userData.groupName || "Unnamed Part";
    e.object.material.emissive = new THREE.Color(0xbc00ff);
    setHoveredPart({ node: e.object.geometry, name: partName });
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    e.object.material.emissive = new THREE.Color(0x000000);
    setHoveredPart(null);
  };

  const handleClick = (e, name, node) => {
    e.stopPropagation();
    setClickedPart({ node, name });
  };

  const getLabelPosition = (meshes) => {
    const groupCenter = new THREE.Vector3();
    let totalPoints = 0;

    meshes.forEach(({ node }) => {
      const boundingBox = new THREE.Box3().setFromBufferAttribute(
        node.geometry.attributes.position
      );
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      groupCenter.add(center);
      totalPoints++;
    });

    groupCenter.divideScalar(totalPoints);

    let maxRadius = 0;
    meshes.forEach(({ node }) => {
      const boundingBox = new THREE.Box3().setFromBufferAttribute(
        node.geometry.attributes.position
      );
      const size = boundingBox.getSize(new THREE.Vector3());
      const radius = size.length();
      maxRadius = Math.max(maxRadius, radius);
    });

    const angle = Math.random() * Math.PI * 2;
    const labelDistance = maxRadius * 3;

    const labelPos = [
      Math.cos(angle) * labelDistance + groupCenter.x,
      Math.sin(angle) * labelDistance + groupCenter.y,
      groupCenter.z,
    ];

    return {
      labelPos,
      center: [groupCenter.x, groupCenter.y, groupCenter.z],
    };
  };

  const parts = {
    gear: {
      meshes: [
        { node: nodes.mesh_0 },
        { node: nodes.mesh_1 },
        { node: nodes.mesh_2 },
        { node: nodes.mesh_3 },
        { node: nodes.mesh_4 },
        { node: nodes.mesh_5 },
        { node: nodes.mesh_6 },
        { node: nodes.mesh_7 },
        { node: nodes.mesh_8 },
        { node: nodes.mesh_9 },
        { node: nodes.mesh_10 },
        { node: nodes.mesh_13 },
      ],
      name: "Gear",
    },

    shaft: {
      meshes: [
        { node: nodes.mesh_29 },
        { node: nodes.mesh_30 },
        { node: nodes.mesh_31 },
        { node: nodes.mesh_32 },
        { node: nodes.mesh_33 },
      ],
      name: "Shaft",
    },

    cylinder: {
      meshes: [
        { node: nodes.mesh_11 },
        { node: nodes.mesh_12 },
        { node: nodes.mesh_14 },
        { node: nodes.mesh_19 },
        { node: nodes.mesh_34 },
        { node: nodes.mesh_39 },
        { node: nodes.mesh_47 },
        { node: nodes.mesh_52 },
      ],
      name: "Cylinder",
    },

    piston1: {
      meshes: [
        { node: nodes.mesh_15 },
        { node: nodes.mesh_16 },
        { node: nodes.mesh_17 },
        { node: nodes.mesh_18 },
        { node: nodes.mesh_20 },
        { node: nodes.mesh_21 },
        { node: nodes.mesh_22 },
        { node: nodes.mesh_23 },
        { node: nodes.mesh_24 },
        { node: nodes.mesh_25 },
        { node: nodes.mesh_26 },
        { node: nodes.mesh_27 },
        { node: nodes.mesh_28 },
      ],
      name: "Piston 1",
    },

    piston2: {
      meshes: [
        { node: nodes.mesh_35 },
        { node: nodes.mesh_36 },
        { node: nodes.mesh_37 },
        { node: nodes.mesh_38 },
        { node: nodes.mesh_40 },
        { node: nodes.mesh_41 },
        { node: nodes.mesh_42 },
        { node: nodes.mesh_43 },
        { node: nodes.mesh_44 },
        { node: nodes.mesh_45 },
        { node: nodes.mesh_46 },
      ],
      name: "Piston 2",
    },

    piston3: {
      meshes: [
        { node: nodes.mesh_48 },
        { node: nodes.mesh_49 },
        { node: nodes.mesh_50 },
        { node: nodes.mesh_51 },
        { node: nodes.mesh_53 },
        { node: nodes.mesh_54 },
        { node: nodes.mesh_55 },
        { node: nodes.mesh_56 },
        { node: nodes.mesh_57 },
        { node: nodes.mesh_58 },
        { node: nodes.mesh_59 },
      ],
      name: "Piston 3",
    },
  };

  return (
    <group ref={group} {...props} dispose={null}>
      {clickedPart && (
        <group>
          <mesh
            geometry={clickedPart.node.geometry}
            material={
              new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: new THREE.Color(0xff0000),
              })
            }
            position={[100, 100, -50]}
          />
        </group>
      )}

      {Object.entries(parts).map(([partType, data]) => {
        const { meshes, name } = data;
        const { labelPos, center } = getLabelPosition(meshes);

        return (
          <group key={partType} name={partType}>
            {meshes.map(({ node }, index) => (
              <mesh
                key={`${partType}-${index}`}
                geometry={node.geometry}
                material={
                  new THREE.MeshStandardMaterial({
                    color: node.material.color,
                    emissive: new THREE.Color(0x000000),
                  })
                }
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={(e) => handleClick(e, name, node)}
                castShadow
                receiveShadow
                userData={{ groupName: name }}
              />
            ))}

            <Line points={[center, labelPos]} color="yellowgreen" lineWidth={1} />
            <Html position={labelPos} center>
              <div className="text-white text-base bg-[#00000057] p-2 rounded-md whitespace-nowrap">
                {name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload("/models/machine.glb");