import CharacterController from './components/CharacterController/CharacterController'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Map from './components/Map/Map'
import './App.css'
import Tower from './components/Tower/Tower'

function App() {

  return (
    <>
      <OrbitControls makeDefault/>
      <ambientLight/>
      <directionalLight>
        <OrthographicCamera
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics>
        <Map/>
        <Tower height={7} position={[2,3]}/>
        <CharacterController/>
      </Physics>
    </>
  )
}

export default App
