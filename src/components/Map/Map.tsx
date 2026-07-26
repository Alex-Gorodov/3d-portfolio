import { Grid } from '@react-three/drei'
import { DoubleSide } from 'three'
import LinkZone from '../../ui/LinkZone'
import Tower from '../Tower/Tower'
import { RigidBody } from '@react-three/rapier'

export default function Map() {
  return (
    <>
      <RigidBody type="fixed">
        <mesh
          scale={100}
          rotation-x={Math.PI / 2}
          position-y={-0.01}
        >
          <planeGeometry />
          <meshStandardMaterial
            color="#2e2e2e"
          />
        </mesh>

        <boxGeometry />
      </RigidBody>

      <Tower height={7} position={[-5,3]} color='red'/>
      <Tower height={4} position={[7,3.2]} color='pink'/>
      <Tower height={2.4} position={[1,-13]} color='blue'/>
      <Tower height={3.5} position={[3,6]} color='green'/>
      <Tower height={9} position={[10,5]}/>

      <Grid infiniteGrid position={[0, -0.001, 0]} side={DoubleSide} fadeStrength={1} cellColor={'#7b7c7b'} sectionColor={'#575757'} />

      <LinkZone position={[2, 10]} name="Old portfolio" color="#b05c5c" url="https://alex-gorodov.github.io/portfolio-2026"/>
      <LinkZone position={[20, 4]} name="Intel security" color="#2e8fff" url="https://alex-gorodov.github.io/amishav-intel-haifa-admin"/>

    </>
  )
}
