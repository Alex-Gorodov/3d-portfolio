import { CuboidCollider } from "@react-three/rapier";
import Fox from "../Fox/Fox";

interface CharacterProps {
  moving: boolean;
  running: boolean;
}

export default function Character({
  moving,
  running
}: CharacterProps) {

  return (
    <>
      <CuboidCollider
        args={[1, 0.7, 1]}
      />

      <Fox
        moving={moving}
        running={running}
      />
    </>

  )
}
