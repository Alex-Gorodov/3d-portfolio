import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import * as THREE from 'three'

interface FoxProps {
  moving:boolean;
  jumping: boolean;
}


export default function Fox({
  moving,
  jumping
}:FoxProps){

  const group = useRef<Group>(null);


  const { scene, animations } = useGLTF(
    "/cat.glb"
  );


  const { actions } = useAnimations(
    animations,
    group
  );

  useEffect(()=>{

    if(!actions) return;

    if (actions.Run) {
      actions.Run.timeScale = 3.0;
    }

    if (jumping && actions.Run) {
      actions.Run.timeScale = 0.05;
    }

    const nextAction =
      jumping
          ? actions.Run
          : moving
            ? actions.Run
            : actions.Rest;


    if(!nextAction) return;


    Object.values(actions).forEach(action=>{
      action?.fadeOut(0.3);
    });


    nextAction
      .reset()
      .fadeIn(0.3)
      .play();


  },[
    moving,
    jumping,
    actions
  ]);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group
      ref={group}
      scale={1.2}
      receiveShadow={true}
      castShadow={true}
      position-y={-1.4}
    >
      <primitive object={scene} />
    </group>
  )
}
