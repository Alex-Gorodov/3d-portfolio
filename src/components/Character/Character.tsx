import { CuboidCollider } from "@react-three/rapier";
import Fox from "../Fox/Fox";
import { useRef } from "react";
import { Quaternion, Euler } from "three";

interface CharacterProps {
  moving: boolean;
  jumping: boolean;
  rotation: number;
}

export default function Character({
  moving,
  jumping,
  rotation
}: CharacterProps) {

  const colliderRef = useRef(null);

  const quaternion = new Quaternion();

  quaternion.setFromEuler(
    new Euler(0, rotation, 0)
  );

  return (
    <group>
      <CuboidCollider
        ref={colliderRef}
        args={[0.6, 1.4, 2]}
        rotation={[0, rotation, 0]}
      />

      <Fox
        moving={moving}
        jumping={jumping}
      />
    </group>
  );
}
