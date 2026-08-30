import { useFrame } from '@react-three/fiber'
import { useRef, type JSX } from 'react'
import * as THREE from 'three'

type PlaceholderProps = JSX.IntrinsicElements['mesh']

export default function Placeholder(props: PlaceholderProps) {

  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return

    mesh.current.scale.y =
      1 + Math.sin(clock.elapsedTime * 3) * 0.5
  })

  return (
    <mesh ref={mesh} {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial
        wireframe
        color="red"
      />
    </mesh>
  )
}
