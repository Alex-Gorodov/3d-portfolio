import { KeyboardControls, Loader } from "@react-three/drei";
import { KeyboardMap } from "./const";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Experience from "./Experience";
import UI from "./components/UI/UI";

export default function App() {

  const isMobile = navigator.maxTouchPoints > 0

  return (
    <>
      <KeyboardControls map={KeyboardMap}>

        <Leva hidden />

        <Canvas
          shadows
          gl={{ alpha: false }}
          camera={{
            fov: isMobile ? 75 : 55,
            near:0.1,
            far:300,
            position:[3,3,3]
          }}
        >

          <Suspense fallback={ null }>
            <Experience />
          </Suspense>

        </Canvas>

        <Loader/>

      </KeyboardControls>

      <UI/>

    </>
  )
}
