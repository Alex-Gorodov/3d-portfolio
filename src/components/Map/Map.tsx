import { Grid } from '@react-three/drei'
import { DoubleSide } from 'three'
import LinkZone from '../../ui/LinkZone'

export default function Map() {
  return (
    <>
      <mesh scale={100} rotation-x={Math.PI / 2} position-y={-0.01}>
        <planeGeometry/>
        <meshStandardMaterial
          color={'#2e2e2e'}
          side={DoubleSide}
        />
      </mesh>

      <Grid infiniteGrid position={[0, -0.001, 0]} side={DoubleSide} fadeStrength={1} cellColor={'#7b7c7b'} sectionColor={'#575757'} />

      <LinkZone position={[2, 2]} name="Waves" color="#b05c5c" url="ahttps://alexgorodov.vercel.app"/>

    </>
  )
}
