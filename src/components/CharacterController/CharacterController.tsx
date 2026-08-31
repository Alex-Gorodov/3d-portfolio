import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Group, Vector2, Vector3, Raycaster, Plane } from 'three'
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../../utils/angleUtils";
import { usePlayerStore } from "../../stores/playerStore";
import { useLinkStore } from "../../stores/linkStore";
import { useInputStore } from "../../stores/inputState";
import { playPlayerFall } from "../../utils/sounds";
import Fox from "../Fox/Fox";

interface CharacterControllerProps {
  freeCamera: boolean
}

export default function CharacterController({freeCamera}: CharacterControllerProps) {
  const { NORMAL_SPEED } = useControls("Character Control", {
    NORMAL_SPEED: { value: 17.5, min: 0.2, max: 17.5, step: 0.1 },
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

  // const joystick = useJoystickStore((state) => state.joysticks.default)

  const rb = useRef<RapierRigidBody | null>(null)
  const containerRef = useRef<Group | null>(null)
  const characterRef = useRef<Group | null>(null)

  const mouseDown = useRef(false);
  const rightMouseDown = useRef(false);

  const mouse = useRef(new Vector2());
  const raycaster = useRef(new Raycaster());
  const groundPlane = useRef(
    new Plane(new Vector3(0, 1, 0), 0)
  );

  const targetPoint = useRef(new Vector3());

  const mouseWorldPosition = useRef(new Vector3());

  const spawnPosition = useRef({
    x: 0,
    y: 20,
    z: 0
  });

  const characterRotationTarget = useRef(Math.PI / 2)
  const rotationTarget = useRef(0)
  const cameraTarget = useRef<Group | null>(null)
  const cameraPosition = useRef<Group | null>(null)
  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())
  const jumpCooldown = useRef(false);
  const jumpRequested = useRef(false);


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

      if (mouseDown.current) {

        raycaster.current.setFromCamera(
          mouse.current,
          camera
        );


        const hit = raycaster.current.ray.intersectPlane(
          groundPlane.current,
          mouseWorldPosition.current
        );

        if (hit) {

          const playerPosition =
            rb.current.translation();

          const dx =
            mouseWorldPosition.current.x -
            playerPosition.x;

          const dz =
            mouseWorldPosition.current.z -
            playerPosition.z;

          const length =
            Math.sqrt(dx * dx + dz * dz);

          if (length > 0.1) {

            movement.x = dx / length;
            movement.z = dz / length;

          }
        }
      }

      const keyboard = get()


      if (keyboard.forward) {
        movement.z = 1
      }

      if (keyboard.backward) {
        movement.z = -1
      }

      if (keyboard.jump || mobileJump || jumpRequested.current) {
        jumpRequested.current = false;

        if (!jumpCooldown.current) {
          jumpCooldown.current = true;
          setJumping(true);

          const velocity = rb.current.linvel();

          rb.current.setLinvel(
            {
              x: velocity.x,
              y: 8,
              z: velocity.z
            },
            true
          );

          setTimeout(() => {
            jumpCooldown.current = false;
            setJumping(false);
          }, 1760);
        }
      }

      movement.x = (keyboard.left ? 1 : keyboard.right ? -1 : 0)

      movement.z =
        mouseDown.current
          ? 1
          : keyboard.forward
            ? 1
            : keyboard.backward
              ? -1
              : 0;

      const speed = NORMAL_SPEED


      if (keyboard.left) {
        movement.x = 1
      }
      if (keyboard.right) {
        movement.x = -1
      }


      const isMoving =
        movement.x !== 0 ||
        movement.z !== 0;


      if (moving !== isMoving) {
        setMoving(isMoving);
      }

      if (mouseDown.current) {
        // Create ray from camera through mouse
        raycaster.current.setFromCamera(
          mouse.current,
          camera
        );

        // Ground plane at Y = 0
        const ground = new Plane(
          new Vector3(0, 1, 0),
          0
        );

        const hit = raycaster.current.ray.intersectPlane(
          ground,
          targetPoint.current
        );

        if (hit) {
          const playerPosition = rb.current.translation();

          const directionX =
            targetPoint.current.x - playerPosition.x;

          const directionZ =
            targetPoint.current.z - playerPosition.z;

          const length = Math.sqrt(
            directionX * directionX +
            directionZ * directionZ
          );

          if (length > 0.1) {
            const dirX = directionX / length;
            const dirZ = directionZ / length;

            velocity.x = dirX * speed;
            velocity.z = dirZ * speed;

            // Rotate model toward movement direction
            characterRotationTarget.current =
              Math.atan2(dirX, dirZ);
          } else {
            velocity.x = 0;
            velocity.z = 0;
          }
        }
      } else {

        // keyboard movement — camera/player rotation relative
        if (movement.x !== 0 || movement.z !== 0) {

          characterRotationTarget.current =
            Math.atan2(movement.x, movement.z);

          const angle =
            rotationTarget.current +
            characterRotationTarget.current;

          velocity.x =
            Math.sin(angle) * speed;

          velocity.z =
            Math.cos(angle) * speed;

        } else {

          velocity.x = 0;
          velocity.z = 0;

        }
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

    return () => window.removeEventListener("keydown", handleKey);


  },[]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      mouseDown.current = true;

      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerUp = () => {
      mouseDown.current = false;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);


    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <RigidBody colliders={false} type="dynamic" lockRotations ref={rb}>
      <group ref={containerRef}>
        <group ref={cameraTarget} position-z={1.5}/>
        <group ref={cameraPosition} position-x={20} position-y={20} position-z={-20}/>

        <group ref={characterRef}>
          <CuboidCollider
            args={[0.6, 1.4, 2]}
          />
          <Fox
            moving={moving}
            jumping={jumping}
          />
        </group>

      </group>
    </RigidBody>
  )
}
