import './index.sass'

import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from '@react-three/drei'
import { KeyboardMap } from './const.js'
import { Leva } from 'leva'
import { Joystick } from 'ecctrl/input'
import Loader from './components/Loader/Loader.js'
import { Suspense } from 'react'


const root = ReactDOM.createRoot(document.querySelector('#canvas')!)

const isTouchDevice = navigator.maxTouchPoints > 0

root.render(
  <>
    <KeyboardControls map={KeyboardMap}>
      <Leva hidden={true} />
      <Canvas
        shadows
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ 3, 3, 3 ]
        } }
      >
        <Loader/>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
        {
          !isTouchDevice
          &&
            <div className='controls'>
              <div className='arrows'>
                <span className='arrow arrow--up'>W</span>
                <span className='arrow arrow--left'>A</span>
                <span className='arrow arrow--down'>S</span>
                <span className='arrow arrow--right'>D</span>
              </div>
              <span className='arrow arrow--shift'>SHIFT</span>
            </div>
        }
    </KeyboardControls>

    { isTouchDevice && <Joystick/> }
  </>
)
