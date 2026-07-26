import { CuboidCollider } from "@react-three/rapier";

export default function Character() {
  return (
    <mesh position-x={ 0 } position-y={ 0.501 }  scale={ 1 }>
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple"/>
      <CuboidCollider mass={5} args={[0.5, 0.5, 0.5]} position={[0, 0, 0]}/>
    </mesh>
  )
}
