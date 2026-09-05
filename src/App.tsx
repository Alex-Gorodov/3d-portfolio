import { KeyboardControls, useProgress } from "@react-three/drei";
import { KeyboardMap } from "./const";
import { Leva } from "leva";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Experience from "./Experience";
import UI from "./components/UI/UI";
import Placeholder from "./components/Placeholder/Placeholder";

function AppContent() {

  const { progress } = useProgress();

  const isMobile = navigator.maxTouchPoints > 0;

  const [canvasLoaded, setCanvasLoaded] = useState(false);

  const isReady = canvasLoaded && progress >= 100;

  return (
    <>
      <Canvas
        shadows
        onCreated={() => setCanvasLoaded(true)}
        gl={{ alpha: false }}
        camera={{
          fov: isMobile ? 75 : 45,
          near: 0.1,
          far: 300,
          position: [3, 3, 3]
        }}
      >

        <Suspense fallback={<Placeholder/>}>
          <Experience />
        </Suspense>

      </Canvas>

      {isReady && <UI />}
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
