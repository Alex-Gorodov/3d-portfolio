import { useTexture } from '@react-three/drei'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useLayoutEffect } from 'react'
import * as THREE from 'three'

export default function Floor() {

  const textures = useTexture({
    map: '/textures/floor/Tile_Diffuse.jpg',
    normalMap: '/textures/floor/Tile_Normal.jpg',
    roughnessMap: '/textures/floor/Tile_Roughness.jpg',
  })

  useLayoutEffect(() => {
    const repeat = 12

    Object.values(textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeat, repeat)
      texture.needsUpdate = true
    })
  }, [textures])

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      friction={1.2}
    >
      {/* Physics: very thin circular disk */}
      <CylinderCollider
        args={[0.04, 80]}
        position={[0, -0.55, 0]}
      />

      {/* Visual: completely flat circle */}
      <mesh
        position-y={-0.5}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <circleGeometry args={[80, 64]} />

        <meshStandardMaterial
          {...textures}
          normalScale={new THREE.Vector2(0.4, 0.4)}
        />
      </mesh>
    </RigidBody>
  )
}
