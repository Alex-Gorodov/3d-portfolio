import { CuboidCollider } from "@react-three/rapier";
import Fox from "../Fox/Fox";

interface CharacterProps {
  moving: boolean;
  jumping: boolean;
}

export default function Character({
  moving,
  jumping
}: CharacterProps) {

  return (
    <>
        <CuboidCollider
          args={[0.4, 0.7, 1.2]}
        />
        <Fox
          moving={moving}
          jumping={jumping}
        />

    </>

  )
}
