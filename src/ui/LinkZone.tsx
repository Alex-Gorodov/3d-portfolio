import { Float, Text } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { useLinkStore } from "./LinkStore";
import { useEffect } from "react";

interface LinkProps {
  color: string;
  name: string;
  position: [x: number, z: number];
  url: string;
}

export default function LinkZone({color, name, position, url}: LinkProps) {
  const redirect = () => {
    navigation.navigate(url)
  }

  const registerZone = useLinkStore(
    state => state.registerZone
  );

  const activeZone = useLinkStore(
    state => state.activeZone
  );

  useEffect(() => {

    registerZone({
      name,
      url,
      radius: 3,
      position: new Vector3(
        position[0],
        0,
        position[1]
      )
    });

  }, []);

  const active =
    activeZone?.name === name;

  return (
    <mesh
      scale={active ? 2.4 : 2}
      rotation-x={Math.PI / 2}
      position={[position[0], -0.002, position[1]]}
      onClick={() => redirect()}
    >
      <circleGeometry/>
      <meshStandardMaterial
        color={
          active
            ? "#00ff88"
            : color
        }
        side={DoubleSide}
      />
      <Float
        speed={5}
        floatIntensity={ 2 }
        rotationIntensity={ 1 }
        rotation-x={ - Math.PI / 2}
        rotation-y={ Math.PI }
      >
        <Text
            position={[ 0, active ? 1.4 : 1, 0 ]}
            maxWidth={2}
            font="./bangers-v20-latin-regular.woff"
            color={'salmon'}
            fontSize={ 0.5 }
            textAlign='center'
        >{active ? name + '\nPress space' : name}</Text>
      </Float>
    </mesh>
  )
}
