import { Billboard, Float, Text } from "@react-three/drei";
import { DoubleSide, Mesh, Object3D, Vector3 } from "three";
import { useEffect, useRef } from "react";
import { useLinkStore } from "../stores/linkStore";
import { easing } from "maath"
import { useFrame } from "@react-three/fiber";

interface LinkProps {
  color: string;
  name: string;
  position: [x: number, z: number];
  url: string;
}

export default function LinkZone({color, name, position, url}: LinkProps) {

  const circleRef = useRef<Mesh>(null!);

  const registerZone = useLinkStore(
    state => state.registerZone
  );

  const activeZone = useLinkStore(
    state => state.activeZone
  );

  const active =
    activeZone?.name === name;

  // Text animation
  const textRef = useRef<Object3D | null>(null);

  useFrame((_, delta) => {
    if (!circleRef.current || !textRef.current) return;

    const radius =
      name.includes("projects")
        ? active ? 9 : 6
        : active ? 6 : 3;

    easing.damp3(
      circleRef.current.scale,
      [radius, radius, radius],
      0.2,
      delta
    );

    easing.damp3(
      textRef.current.position,
      [
        0,
        active ? 2.2 : 1,
        0
      ],
      0.2,
      delta
    );
  });

  // Redirect
  const redirect = () => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isTouchDevice = navigator.maxTouchPoints > 0

  useEffect(() => {

    const radius = name.includes("projects") ? 9 : 6;

    registerZone({
      name,
      url,
      radius,
      position: new Vector3(
        position[0],
        0,
        position[1]
      )
    });

  }, [name, position, registerZone, url]);

  return (
    <>

      <mesh
        ref={circleRef}
        rotation-x={Math.PI / 2}

        position={[position[0], 0.01, position[1]]}

        onPointerDown={(e) => {
          e.stopPropagation();
          redirect();
        }}
      >
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial
          color={active ? "#00ff88" : color}
          side={DoubleSide}
        />
      </mesh>

      <Billboard position={[position[0], 1, position[1]]}>
        <Float
          speed={5}
          floatIntensity={2}
          rotationIntensity={0}
        >
          <Text
            ref={textRef}
            maxWidth={5}
            font="./fonts/bangers-v20-latin-regular.woff"
            color="cyan"
            fontSize={1.5}
            textAlign="center"
          >
            {active && !isTouchDevice
              ? `${name} Press e`
              : `${name}`
            }
          </Text>
        </Float>
      </Billboard>
    </>
  )
}
