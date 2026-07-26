import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import Character from "../Character/Character";
import { useRef } from "react";
import { Group, Vector3 } from 'three'
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../../utils/angleUtils";

import { useJoystickStore } from 'ecctrl/input'

export default function CharacterController() {
  const { NORMAL_SPEED, HIGH_SPEED, ROTATION_SPEED } = useControls("Character Control", {
    NORMAL_SPEED: { value: 3.2, min: 0.2, max: 4, step: 0.1 },
    HIGH_SPEED: { value: 6.4, min: 0.4, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  })

  const joystick = useJoystickStore((state) => state.joysticks.default)

  const rb = useRef<RapierRigidBody | null>(null)
  const containerRef = useRef<Group | null>(null)
  const characterRef = useRef<Group | null>(null)

  const characterRotationTarget = useRef(0)
  const rotationTarget = useRef(0)
  const cameraTarget = useRef<Group | null>(null)
  const cameraPosition = useRef<Group | null>(null)
  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())

  const [ , get ] = useKeyboardControls()

  useFrame(({camera}) => {

    if (rb.current) {
      const velocity = rb.current.linvel()

      const movement = {
        x: 0,
        z: 0,
      }

      if (get().forward) {
        movement.z = 1
      }

      if (get().backward) {
        movement.z = -1
      }

      const keyboard = get()

      movement.x =
        joystick.active
          ? - joystick.x
          : (keyboard.left ? 1 : keyboard.right ? -1 : 0)

      movement.z =
        joystick.active
          ? joystick.y
          : (keyboard.forward ? 1 : keyboard.backward ? -1 : 0)

          // console.log(joystick);


      let speed = get().run || Math.abs(joystick.x) > 0.82 || Math.abs(joystick.y) > 0.82 ? HIGH_SPEED : NORMAL_SPEED

      if (get().left) {
        movement.x = 1
      }
      if (get().right) {
        movement.x = -1
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z)
        velocity.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed
        velocity.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed
      } else {
        velocity.x = 0
        velocity.z = 0
      }

      if (characterRef.current) {
        characterRef.current.rotation.y = lerpAngle(
          characterRef.current.rotation.y,
          characterRotationTarget.current,
          0.1
        )
      }
      rb.current.setLinvel(velocity, true)
    }

    // Camera
    if (containerRef.current) {
      containerRef.current.rotation.y = lerpAngle(
        containerRef.current.rotation.y,
        rotationTarget.current,
        0.1
      )
    }

    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current)
    camera.position.lerp(cameraWorldPosition.current, 0.1)

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1)

      camera.lookAt(cameraLookAt.current)
    }

  })

  return (
    <RigidBody colliders={false} lockRotations ref={rb} >
      <group ref={containerRef}>
        <group ref={cameraTarget} position-z={1.5}/>
        <group ref={cameraPosition} position-y={8} position-z={-16}/>
        <group ref={characterRef}>
          <Character/>
        </group>
      </group>
    </RigidBody>
  )
}
