import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";

interface FoxProps {
  moving: boolean;
  running: boolean;
}


export default function Fox({
  moving,
  running
}: FoxProps) {

  const group = useRef<Group>(null);

  const model = useGLTF(
    "/Fox/glTF/Fox.gltf"
  );


  const { actions } = useAnimations(
    model.animations,
    group
  );


  useEffect(() => {

    const fadeDuration = 0.3;

    const currentActions = Object.values(actions);

    currentActions.forEach(action => {
      action?.fadeOut(fadeDuration);
    });


    let nextAction;

    if (running) {
      nextAction = actions.Run;
    }
    else if (moving) {
      nextAction = actions.Walk;
    }
    else {
      nextAction = actions.Survey;
    }


    nextAction
      ?.reset()
      .fadeIn(fadeDuration)
      .play();


    return () => {
      nextAction?.fadeOut(fadeDuration);
    };


  }, [moving, running, actions]);


  return (
    <group
      ref={group}
      scale={0.02}
      position-y={-0.7}
    >
      <primitive object={model.scene}/>
    </group>
  )
}
