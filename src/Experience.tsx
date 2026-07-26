import CharacterController from './components/CharacterController/CharacterController'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Map from './components/Map/Map'
import './App.css'

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
      <Physics debug>
        <Map/>
        <CharacterController/>
      </Physics>
    </>
  )
}

export default App
