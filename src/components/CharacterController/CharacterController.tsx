import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import Character from "../Character/Character";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from 'three'
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../../utils/angleUtils";
import { useJoystickStore } from 'ecctrl/input'
import { usePlayerStore } from "../../stores/playerStore";
import { useLinkStore } from "../../stores/linkStore";
import { useInputStore } from "../../stores/inputState";
import { playPlayerFall } from "../../utils/sounds";

interface CharacterControllerProps {
  freeCamera: boolean
}

export default function CharacterController({freeCamera}: CharacterControllerProps) {
  const { NORMAL_SPEED, ROTATION_SPEED } = useControls("Character Control", {
    NORMAL_SPEED: { value: 10, min: 0.2, max: 10, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(1.0),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  })

  const zones = useLinkStore(
    state => state.zones
  );

  const setActiveZone = useLinkStore(
    state => state.setActiveZone
  );

  const joystick = useJoystickStore((state) => state.joysticks.default)

  const rb = useRef<RapierRigidBody | null>(null)
  const containerRef = useRef<Group | null>(null)
  const characterRef = useRef<Group | null>(null)

  const spawnPosition = useRef({
    x: 0,
    y: 20,
    z: 0
  });

  const characterRotationTarget = useRef(0)
  const rotationTarget = useRef(0)
  const cameraTarget = useRef<Group | null>(null)
  const cameraPosition = useRef<Group | null>(null)
  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())
  const jumpCooldown = useRef(false);


  const [moving, setMoving] = useState(false)
  const [jumping, setJumping] = useState(false)

  const mobileJump = useInputStore(
    state => state.jump
  );

  const [ , get ] = useKeyboardControls()

  const setPosition = usePlayerStore(
    state => state.setPosition
  );

  const setRotation = usePlayerStore(
    state => state.setRotation
  );

  useFrame(({camera}) => {

    if (rb.current) {
      const velocity = {
        x: rb.current.linvel().x,
        y: rb.current.linvel().y,
        z: rb.current.linvel().z
      }

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

      if (
        (keyboard.jump || mobileJump) &&
        !jumpCooldown.current
      ) {

        jumpCooldown.current = true;
        setJumping(true);

        rb.current.applyImpulse(
          {
            x: 0,
            y: 64,
            z: 0
          },
          true
        );


        setTimeout(() => {
          jumpCooldown.current = false;
          setJumping(false);
        }, 1000);
      }

      movement.x =
        joystick.active
          ? - joystick.x
          : (keyboard.left ? 1 : keyboard.right ? -1 : 0)

      movement.z =
        joystick.active
          ? joystick.y
          : (keyboard.forward ? 1 : keyboard.backward ? -1 : 0)

      const speed = NORMAL_SPEED


      if (get().left) {
        movement.x = 1
      }
      if (get().right) {
        movement.x = -1
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x
      }

      const isMoving =
        movement.x !== 0 ||
        movement.z !== 0;


      setMoving(isMoving);


      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z)
        velocity.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed
        velocity.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed
      } else {
        velocity.x = 0
        velocity.z = 0
      }

      // keep gravity + jump velocity
      velocity.y = rb.current.linvel().y;

      if (characterRef.current) {
        characterRef.current.rotation.y = lerpAngle(
          characterRef.current.rotation.y,
          characterRotationTarget.current,
          0.1
        )
      }
      rb.current.setLinvel(
        {
          x: velocity.x,
          y: rb.current.linvel().y,
          z: velocity.z
        },
        true
        );

      const playerPosition = rb.current.translation();

      let closestZone = null;

      for (const zone of zones) {

        const distance =
          Math.sqrt(
            Math.pow(playerPosition.x - zone.position.x, 2) +
            Math.pow(playerPosition.z - zone.position.z, 2)
          );


        if(distance < zone.radius) {
          closestZone = zone;
          break;
        }

      }
      setActiveZone(closestZone);
      const position = rb.current.translation();

      setPosition({
        x: position.x,
        z: position.z
      });



      // fell outside the map
    if(playerPosition.y < -10) {
      playPlayerFall()

      rb.current.setTranslation(
        {
          x: spawnPosition.current.x,
          y: spawnPosition.current.y,
          z: spawnPosition.current.z
        },
        true

      );


      // stop falling velocity
      rb.current.setLinvel(
        {
          x:0,
          y:0,
          z:0
        },
        true
      );

    }

    }

    // Camera
    if (containerRef.current) {
      containerRef.current.rotation.y = lerpAngle(
        containerRef.current.rotation.y,
        rotationTarget.current,
        1.1
      )
    }

    if(containerRef.current){

      setRotation({
        y: containerRef.current.rotation.y
      });

    }

    if (!freeCamera) {
        cameraPosition.current?.getWorldPosition(cameraWorldPosition.current)
        camera.position.lerp(cameraWorldPosition.current, 0.1)

        if (cameraTarget.current) {
          cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)
          cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1)

          camera.lookAt(cameraLookAt.current)
        }
    }

  })

  useEffect(() => {

    const handleKey = (e: KeyboardEvent) => {

      if(
        e.code === "KeyE"
        &&
        useLinkStore.getState().activeZone
      ){

        window.open(
          useLinkStore.getState().activeZone!.url,
          "_blank"
        );

      }

    }

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );


  },[]);

  return (
    <RigidBody colliders={false} type="dynamic" lockRotations ref={rb}>
      <group ref={containerRef}>
        <group ref={cameraTarget} position-z={1.5}/>
        <group ref={cameraPosition} position-x={0} position-y={12} position-z={-16}/>
        <group ref={characterRef}>
          <Character moving={moving} jumping={jumping}/>
        </group>
      </group>
    </RigidBody>
  )
}
