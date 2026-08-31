import { Quaternion, Vector3 } from "three";
import { Text3D } from "@react-three/drei";
import {
  RigidBody,
  type RapierRigidBody
} from "@react-three/rapier";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { playWoodFall, playWoodScrape } from "../../utils/sounds";

interface ThreeTextProps {
  text: string;
  rotation?: number;
  position: [number, number, number];
  color?: string;
  letterSize?: number;
}


interface LetterProps {
  char: string;
  position: [number, number, number];
  color?: string;
  size?: number;
}


function Letter({
  char,
  position,
  color,
  size
}: LetterProps) {

  const rb = useRef<RapierRigidBody | null>(null);

  const lastHit = useRef(0);

  const hasFallen = useRef(false);

  const quaternion = new Quaternion();
  const up = new Vector3(0, 1, 0);

  useFrame(() => {

    if (!rb.current) return;


    const rotation = rb.current.rotation();

    quaternion.set(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );


    const currentUp = up.clone()
      .applyQuaternion(quaternion);


    // 0 = standing
    // 90 degrees = lying
    const angle = Math.acos(currentUp.y);


    const degrees = angle * 180 / Math.PI;

    if (
      degrees > 80 &&
      !hasFallen.current
    ) {

      hasFallen.current = true;

      playWoodFall(
        Math.min((size || 1) * 0.1, 1)
      );
    }


    // reset
    if (degrees < 20) {
      hasFallen.current = false;
    }

  });

  const playHitSound = (strength: number) => {

    const now = performance.now();


    // cooldown
    if (now - lastHit.current < 150)
      return;


    lastHit.current = now;

    // playWoodScrape(
    //   Math.min(strength / 8, 1)
    // );
  };



  const onCollision = (
    // event: CollisionEnterPayload
  ) => {


    if (!rb.current)
      return;


    const velocity =
      rb.current.linvel();


    const speed =
      Math.sqrt(
        velocity.x ** 2 +
        velocity.y ** 2 +
        velocity.z ** 2
      );


    /*
      Ignore tiny contacts.
      This prevents constant sounds
      while lying on the floor.
    */
    if (speed < 2)
      return;

    /*
      If falling vertically,
      make floor hits louder.
    */
    const verticalImpact =
      Math.abs(velocity.y);



    playHitSound(
      Math.max(
        speed,
        verticalImpact * 1.5
      )
    );

  };


  return (
    <RigidBody
      ref={rb}
      position={position}
      type="dynamic"
      mass={(size || 1) * 0.2}
      restitution={0.25}
      friction={1}
      colliders="hull"
      linearDamping={0.4}
      angularDamping={0.8}
      onCollisionEnter={onCollision}
    >

      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={size || 3}
        height={0.5}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.13 * (size || 3)}
        bevelSize={0.12}
        bevelSegments={8}
        castShadow
        receiveShadow
      >

        {char}

        <meshStandardMaterial
          color={color ?? "#70c1ff"}
        />

      </Text3D>

    </RigidBody>
  );
}



export default function ThreeText({
  text,
  position,
  color,
  rotation,
  letterSize
}: ThreeTextProps) {

  const chars = [...text];

  const [randomRotation] = useState(
    () => Math.PI * Math.random()
  );

  const wordRotation =
    rotation ?? randomRotation;

  return (

    <group
      position={position}
      rotation-y={ wordRotation }
    >

      {chars.map((char, i) => {

        if (char === " ")
          return null;



        return (
          <Letter
            key={`${char}-${i}`}
            char={char}
            size={letterSize}
            position={[
              i * (letterSize || 3.5),
              3,
              0
            ]}
            color={color}
          />
        );

      })}

    </group>
  );
}
