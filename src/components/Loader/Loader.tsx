import { Html, useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";


export default function Loader() {

  const { progress } = useProgress();

  const overlay = useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    console.log("loading:", progress);


    if(progress >= 100 && overlay.current) {

      gsap.to(
        overlay.current,
        {
          opacity: 0,
          duration: 1,
          delay: 0.5,
          onComplete: () => {

            if(overlay.current) {
              overlay.current.style.display = "none";
            }

          }
        }
      );

    }

  }, [progress]);


  return (
    <Html fullscreen>

      <div
        ref={overlay}
        className="loader"
      >

        <div className="loader__title">
          Loading...
        </div>


        <div className="loader__bar">

          <div
            className="loader__progress"
            style={{
              width: `${progress}%`
            }}
          />

        </div>


        <div className="loader__percent">
          {Math.floor(progress)}%
        </div>


      </div>

    </Html>
  );
}
