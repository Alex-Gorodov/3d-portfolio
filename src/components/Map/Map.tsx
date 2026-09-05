import LinkZone from '../../ui/LinkZone'
import { WorkLinks } from '../../const'
import ThreeText from '../ThreeText/ThreeText'
import { useMemo } from "react";
import { generateGrassIslands } from "../../utils/grassUtils";
import InstancedGrass from '../Grass/Grass'
import Floor from '../Floor/Floor';
import { RigidBody } from '@react-three/rapier';

export default function Map() {

  const grassIslands = useMemo(() => {
    return generateGrassIslands({
      count: 20,
      areaSize: 100,
      minSize: 4,
      maxSize: 10,
      minGrassCount: 300,
      maxGrassCount: 1200,
      minDistance: 8,
    });
  }, []);

  return (
    <>

      <Floor />

      {/* GRASS */}
      {grassIslands.map((island, index) => (
        <InstancedGrass
          key={index}
          count={island.count}
          fieldSize={island.fieldSize}
          position={island.position}
          grassScale={island.grassScale}
        />
      ))}

    <RigidBody colliders="ball" restitution={0.6}>

      <mesh castShadow position={ [ 2, 14, -20 ] }>
          <sphereGeometry args={[1.2,64]}/>
          <meshStandardMaterial color="red" />
      </mesh>

    </RigidBody>


      {/* LINKS */}
      <ThreeText text="HTML" letterSize={8} position={[58, 0.01, 51]} color={'#e96227'} rotation={ Math.PI * 1.09 }/>
      <ThreeText text="AITOOLS" letterSize={2} position={[-11, 0.01, 44]} color={'#e96227'} rotation={ Math.PI / 1.11}/>
      <ThreeText text="ALEX GORODOV" letterSize={3.2} position={[10, 0.01, 4]} color={'#1db0a3'} rotation={ Math.PI }/>
      <ThreeText text="CSS" position={[-41, 0.01, 12]} color={'#2762ea'}/>
      <ThreeText text="REDUX" position={[47, 0.01, 32]} color={'#61caff'} rotation={ Math.PI * 1.1 }/>
      <ThreeText text="TYPE SCRIPT" letterSize={5.4} position={[52, 0.01, 44]} color={'#82a0ad'} rotation={ Math.PI * 1.04 }/>
      <ThreeText text="THREE" letterSize={4} position={[41, 0.01, 25]} color={'#f9f9f9'} rotation={ Math.PI * 1.04 }/>
      <ThreeText text="JS" letterSize={4} position={[21, 0.01, 27]} color={'#e32121'} rotation={ Math.PI * 1.04 }/>
      <ThreeText text="R3F" letterSize={2.4} position={[36, 0.01, 20]} color={'#e32121'} rotation={ Math.PI * 1.13 }/>
      <ThreeText text="NATIVE" letterSize={5} position={[-29, 0.01, 48]} color={'#45b8f1'} rotation={ Math.PI / 1.12 }/>
      <ThreeText text="EXPO" letterSize={2.6} position={[-32, 0.01, 24]} color={'#009ae7'} rotation={ Math.PI / 1.4 }/>
      <ThreeText text="REACT" letterSize={8} position={[-20, 0.01, 54]} color={'#c308cd'} rotation={ Math.PI * 0.9 }/>
      <ThreeText text="FIREBASE" position={[21, 0.01, 40]} color={'#f1be04'} rotation={ Math.PI }/>

      {
        WorkLinks.map((link) => (
          <LinkZone
            key={link.name}
            position={[link.position[0], link.position[1]]}
            name={link.name}
            color={link.color}
            url={link.url}
          />
        ))
      }
    </>
  )
}
