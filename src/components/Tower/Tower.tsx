import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { CollisionEnterPayload, RapierRigidBody } from "@react-three/rapier";
import { DoubleSide, Color, AdditiveBlending, ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";

import holographicFragmentShader from "../../shaders/holographic/fragment.glsl";
import holographicVertexShader from "../../shaders/holographic/vertex.glsl";
import { playTowerFall, playTowerHit } from "../../utils/sounds";

interface TowerProps {
  height: number;
  color?: string;
  mass?: number;
  position: [number, number];
}

export default function Tower({ height, position, mass }: TowerProps) {

  const rb = useRef<RapierRigidBody | null>(null);

  const materialRef = useRef<ShaderMaterial>(null!);

  const hasFallen = useRef(false);

  const hitSound = useRef<HTMLAudioElement | null>(null);



  const onCollision = (
    event: CollisionEnterPayload
  ) => {

    const velocity =
      event.other.rigidBody?.linvel();


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

    if(impact > 2){

      playTowerHit(
        Math.min(
          impact / 10,
          0.05
        )
      );

    }
  };

  useFrame((state) => {

    // Hologram animation
    if(materialRef.current){

      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime;

    }

    // Falling detection
    if(!rb.current) return;

    const towerY =
      rb.current.translation().y;

    if(
      towerY < -2 &&
      !hasFallen.current
    ){

      hasFallen.current = true;

      playTowerFall();

    }

  });

  return (

    <RigidBody
      ref={rb}
      colliders={false}
      position={[ position[0], height / 2, position[1] ]}
      type="dynamic"
      onCollisionEnter={onCollision}
      restitution={0.2}
      friction={2}
      mass={height / 2 || mass}
    >

        <mesh
          scale={[ 2, height, 2 ]}
          position-y={0.0001}
        >

          <boxGeometry />

          <shaderMaterial
            ref={materialRef}
            vertexShader={holographicVertexShader}
            fragmentShader={holographicFragmentShader}
            transparent
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
            uniforms={{
              uTime:{
                value:0
              },

              uColor:{
                value:new Color("#70c1ff")
              }
            }}

          />

        </mesh>

        <CuboidCollider
          args={[
            1,
            height / 2,
            1
          ]}
        />

    </RigidBody>
  );
}
