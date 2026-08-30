import CharacterController from './components/CharacterController/CharacterController'
import { ToneMapping, EffectComposer, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Physics } from '@react-three/rapier'
import Map from './components/Map/Map'
import { OrbitControls, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect, useRef } from "react";

function App() {

  const isTouchDevice = navigator.maxTouchPoints > 0;

  const [freeCamera, setFreeCamera] = useState(false);


  useEffect(()=>{

    const key = (e:KeyboardEvent)=>{

      if(e.code === "KeyC"){
        setFreeCamera(prev=>!prev);
      }

    }

    window.addEventListener("keydown",key);

    return ()=>window.removeEventListener("keydown",key);

  },[]);


  const lightRef = useRef<THREE.DirectionalLight>(null!);

  return (
    <>

      <EffectComposer>
        <Vignette darkness={0.6}/>
        <ToneMapping mode={ToneMappingMode.NEUTRAL}/>
      </EffectComposer>

      {
        !isTouchDevice &&
        freeCamera &&
        <OrbitControls />
      }


      <ambientLight intensity={0.8}/>

      <directionalLight
        ref={lightRef}
        position={[13,15.038,-0.95]}
        intensity={5}
        color={'#faa722'}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0002}
      />

      <Physics gravity={[0,-9.81,0]} >
        <Map/>
        <CharacterController freeCamera={freeCamera}/>
        <Sky turbidity={24} inclination={30} sunPosition={[13,15.038,-0.95]}/>
      </Physics>


    </>
  )
}

export default App
