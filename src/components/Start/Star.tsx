import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Star() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta;
  });

  return (
    <mesh
      ref={ref}
      position={[0, 1, 0]}
    >
      <torusGeometry args={[0.3, 0.2, 30, 20]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
