import { DoubleSide } from 'three'
import LinkZone from '../../ui/LinkZone'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { WorkLinks } from '../../const'
import ThreeText from '../ThreeText/ThreeText'

export default function Map() {

  return (
    <>

      {/* FLOOR */}
      <RigidBody
        type="fixed"
        colliders={false}
      >

        <mesh
          scale={128}
          rotation-x={-Math.PI / 2}
          position-y={-0.03}
          receiveShadow
        >

          <planeGeometry/>

          <meshStandardMaterial
            color="#63b31d"
            // transparent
            side={DoubleSide}
          />

        </mesh>

        <CuboidCollider
          args={[64, 0.05, 64]}
          position={[0, -0.05, 0]}
        />

      </RigidBody>

      {/* LINKS */}

      <ThreeText text="HTML" letterSize={8} position={[21, 0.01, 44]} color={'#e96227'} rotation={ Math.PI * 1.25 }/>
      <ThreeText text="AITOOLS" letterSize={7} position={[-11, 0.01, 64]} color={'#e96227'} rotation={ Math.PI / 1.11}/>
      <ThreeText text="ALEX GORODOV" letterSize={3} position={[10, 0.01, 4]} color={'#1db0a3'} rotation={ Math.PI }/>
      <ThreeText text="CSS" position={[-41, 0.01, 12]} color={'#2762ea'}/>
      <ThreeText text="REDUX" position={[47, 0.01, -34]} color={'#61caff'} rotation={ Math.PI * 1.5 }/>
      <ThreeText text="TYPE SCRIPT" letterSize={7} position={[-37, 0.01, -54]} color={'#82a0ad'} rotation={ Math.PI * 2 }/>
      <ThreeText text="THREE" letterSize={4} position={[31, 0.01, 15]} color={'#f9f9f9'} rotation={ Math.PI * 1.13 }/>
      <ThreeText text="JS" letterSize={4} position={[13.5, 0.01, 23]} color={'#e32121'} rotation={ Math.PI * 1.13 }/>
      <ThreeText text="R3F" letterSize={2.4} position={[28, 0.01, 12]} color={'#e32121'} rotation={ Math.PI * 1.13 }/>
      <ThreeText text="REACT NATIVE" letterSize={5} position={[-7, 0.01, 39]} color={'#45b8f1'} rotation={ Math.PI / 1.12 }/>
      <ThreeText text="EXPO" letterSize={2} position={[-32, 0.01, 24]} color={'#009ae7'} rotation={ Math.PI / 1.4 }/>
      <ThreeText text="REACT" letterSize={8} position={[-60, 0.01, -7]} color={'#c308cd'} rotation={ 1.2 }/>
      <ThreeText text="FIREBASE" position={[1, 0.01, -34]} color={'#f1be04'} rotation={ Math.PI * 2 }/>

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
