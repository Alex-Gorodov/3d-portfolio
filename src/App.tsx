import { KeyboardControls, useProgress } from "@react-three/drei";
import { KeyboardMap } from "./const";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Experience from "./Experience";
import UI from "./components/UI/UI";
import Placeholder from "./components/Placeholder/Placeholder";

function AppContent() {

  const { progress } = useProgress();

  const isMobile = navigator.maxTouchPoints > 0;

  return (
    <>
      <Canvas
        shadows
        gl={{ alpha: false }}
        camera={{
          fov: isMobile ? 75 : 45,
          near: 0.1,
          far: 300,
          position: [3, 3, 3]
        }}
      >

        {progress < 100 && (
          <Placeholder />
        )}

        <Suspense>
          <Experience />
        </Suspense>

      </Canvas>

      {progress >= 100 && <UI />}
    </>
  );
}

export default function App() {
  return (
    <KeyboardControls map={KeyboardMap}>

      <Leva hidden />

      <AppContent />

    </KeyboardControls>
  );
}
