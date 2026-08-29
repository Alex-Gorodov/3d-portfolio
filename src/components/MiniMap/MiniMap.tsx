import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import {
  Group,
  OrthographicCamera as ThreeOrthographicCamera
} from "three";
import { useRef } from "react";
import { usePlayerStore } from "../../stores/playerStore";
import { WorkLinks } from "../../const";

// Player
function PlayerMarker() {

  const isTouchDevice = navigator.maxTouchPoints > 0

  return (
    <group>

      {/* player */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[isTouchDevice ? 1 : 2, isTouchDevice ? 16 : 32]} />
        <meshBasicMaterial color="red" />
      </mesh>

    </group>
  );
}


// Item on the map
function ItemMarker({
  position,
  color
}: {
  position:[number, number],
  color:string
}) {

  const isTouchDevice = navigator.maxTouchPoints > 0;


  const ref = useRef<Group>(null);


  const player = usePlayerStore(
    state => state.position
  );


  const rotation = usePlayerStore(
    state => state.rotation
  );

  const running = usePlayerStore(
    state => state.running
  );

  const maxDistanceRef = useRef(isTouchDevice ? 11 : 21.2)

  useFrame(()=>{

    if(!ref.current) return;


    // distance from player
    const dx = position[0] - player.x;
    const dz = position[1] - player.z;

    // rotate according to player direction
    const angle = rotation.y;

    const x =
      dx * Math.cos(angle) -
      dz * Math.sin(angle);

    const z =
      dx * Math.sin(angle) +
      dz * Math.cos(angle);

    const distance = Math.sqrt(
      x*x + z*z
    );

    // visible minimap radius
    // const maxDistance = running ? 21.2 * 1.25 : 21.2
    const targetDistance = running
      ?
      21.2 * 1.33
        :
        21.2;


    maxDistanceRef.current +=
      (targetDistance - maxDistanceRef.current) * 0.05;


    const maxDistance = maxDistanceRef.current;

    let markerX = x;
    let markerZ = z;


    // clamp marker to border
    if (distance > maxDistance) {

      const ratio = maxDistance / distance;

      markerX *= ratio;
      markerZ *= ratio;

    }

    ref.current.position.x = markerX;
    ref.current.position.z = markerZ;


    // optional: smaller when outside
    const scale =
      distance > maxDistance
      ? 0.75
      : 1;


    ref.current.scale.setScalar(scale);

  });

  return (
    <group ref={ref}>

      <mesh rotation-x={-Math.PI / 2}>

        <circleGeometry args={[isTouchDevice ? 1 : 2, isTouchDevice ? 8 : 16]} />

        <meshBasicMaterial color={color}/>

      </mesh>

    </group>
  )
}






// Map
function MiniMapWorld(){

  const group = useRef<Group>(null);

  const player = usePlayerStore(
    state => state.position
  );

  const rotation = usePlayerStore(
    state => state.rotation
  );

  useFrame(()=>{

    if(!group.current) return;

    group.current.position.x = -player.x;
    group.current.position.z = -player.z;


    group.current.rotation.y =
      -rotation.y;
  });



  return (

    <group ref={group}>

      <mesh rotation-x={-Math.PI / 2}>

        <circleGeometry args={[128,64]} />

        <meshBasicMaterial color="#a3a3a3"/>

      </mesh>


    </group>

  )
}





// Camera
function MiniMapCamera(){

  const camera =
    useRef<ThreeOrthographicCamera>(null);

  const running = usePlayerStore(
    state => state.running
  );

  useFrame(()=>{

    if(!camera.current) return;

    const targetZoom =
      running ? 3 : 4;

    camera.current.zoom +=
      (targetZoom - camera.current.zoom) * 0.05;

    camera.current.updateProjectionMatrix();
  });

  return (

    <OrthographicCamera

      ref={camera}

      makeDefault

      zoom={4}

      position={[0,1,0]}

      rotation={[
        -Math.PI / 2,
        0,
        Math.PI
      ]}

    />

  )
}

// Map
export default function MiniMap(){


  return (

    <div className="mini-map">


      <Canvas orthographic>


        <MiniMapCamera />

        <MiniMapWorld />

        {
          WorkLinks.map(link => (

            <ItemMarker

              key={link.name}

              position={[
                link.position[0],
                link.position[1]
              ]}

              color={link.color}

            />

          ))
        }


        <PlayerMarker />


      </Canvas>


    </div>

  )
}
