import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { CollisionEnterPayload, RapierRigidBody } from "@react-three/rapier";


interface TowerProps {
  height: number;
  color?: string;
  mass?: number;
  position: [number, number];
}


export default function Tower({height, position, color, mass}: TowerProps) {

  const rb = useRef<RapierRigidBody | null>(null);

  const sound = new Audio("./sounds/hit.mp3")

  const hitSound = useRef<HTMLAudioElement | null>(null);

  const onCollision = (event: CollisionEnterPayload) => {
    const velocity = event.other.rigidBody?.linvel();

    const impact =
      velocity
      ?
      Math.sqrt(
        velocity.x ** 2 +
        velocity.y ** 2 +
        velocity.z ** 2
      )
      :
      0;


      if (impact > 2 && hitSound.current) {

        const sound = hitSound.current;

        sound.volume = Math.min(impact / 10, 1);
        sound.currentTime = 0;
        sound.play();

      }
  }

  useEffect(() => {
    hitSound.current = sound;
  }, []);

  return (
    <RigidBody
      colliders={false}
      ref={rb}
      position={[
        position[0],
        0.01,
        position[1]
      ]}
      type="dynamic"

      onCollisionEnter={onCollision}

      restitution={0.2}
      friction={2}
      mass={ height / 2 || mass}

    >

      <mesh scale={[2, height, 2]} position-y={0.01}>
        <boxGeometry />
        <meshStandardMaterial color={ color || "#acacac"}/>
      </mesh>


      <CuboidCollider
        args={[
          1,
          height / 2,
          1
        ]}
      />


    </RigidBody>
  )
}
