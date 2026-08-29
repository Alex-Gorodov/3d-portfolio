import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";


export default function Loader(){

  const { progress } = useProgress();

  const [visible,setVisible] = useState(true);


  useEffect(()=>{

    if(progress === 100){

      const timer = setTimeout(()=>{
        setVisible(false);
      },50);


      return ()=>clearTimeout(timer);
    }

  },[progress]);



  if(!visible) return null;



  return (

    <Html fullscreen>

      <div className="loader">

        <div className="loader__title">
          Loading...
        </div>


        <div className="loader__bar">

          <div
            className="loader__progress"
            style={{
              width:`${progress}%`
            }}
          />

        </div>


        <div className="loader__percent">
          {Math.floor(progress)}%
        </div>


      </div>

    </Html>

  )

}
