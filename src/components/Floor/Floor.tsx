import { useGLTF, useTexture } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

type FloorGLTF = GLTF & {
  nodes: {
    Plane: THREE.Mesh
  }
}

export default function Floor() {
  const { nodes } = useGLTF(
    '/textures/floor/Tile.glb'
  ) as unknown as FloorGLTF

  const textures = useTexture({
    map: '/textures/floor/Tile_Diffuse.jpg',
    normalMap: '/textures/floor/Tile_Normal.jpg',
    roughnessMap: '/textures/floor/Tile_Roughness.jpg',
  })

  useLayoutEffect(() => {
    const repeatX = 12
    const repeatY = 12

    Object.values(textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeatX, repeatY)
      texture.needsUpdate = true
    })
  }, [textures])

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Plane.geometry}
        scale={16}
        position-y={-0.02}
        receiveShadow
      >
        <meshStandardMaterial
          {...textures}
          normalScale={new THREE.Vector2(0.4, 0.4)}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/textures/floor/Tile.glb')
