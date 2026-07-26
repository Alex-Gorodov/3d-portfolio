interface TowerProps {
  height: number;
  position: [x: number, z: number];
}

export default function Tower({height, position}: TowerProps) {
  return (
    <mesh position-x={ position[0] } position-z={ position[1] } position-y={ height / 2 + 0.001 } scale={ [1, height, 1] }>
      <boxGeometry />
      <meshStandardMaterial color="#acacac"/>
    </mesh>
  )
}
