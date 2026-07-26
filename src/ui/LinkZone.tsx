import { Html } from "@react-three/drei";
import { DoubleSide } from "three";

interface LinkProps {
  color: string;
  name: string;
  position?: [x: number, z: number];
  url: string;
}

export default function LinkZone({color, name, position, url}: LinkProps) {
  const redirect = () => {
    navigation.navigate(url)
  }

  return (
    <mesh scale={2} rotation-x={Math.PI / 2} position-y={-0.001} onClick={() => redirect()}>
      <circleGeometry/>
      <meshStandardMaterial
        color={color}
        side={DoubleSide}
      />
      <Html>
        <p>{name}</p>
      </Html>
    </mesh>
  )
}
