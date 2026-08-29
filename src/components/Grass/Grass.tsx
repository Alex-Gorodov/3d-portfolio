import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

import grassVertexShader from "../../shaders/grass/vertex.glsl";
import grassFragmentShader from "../../shaders/grass/fragment.glsl";


interface InstancedGrassProps {
  count?: number;
  fieldSize?: number;
  grassScale?: number;
  LODDistance?: number;
}


interface GrassBlade {
  x: number;
  z: number;
  rotation: number;
}


export default function InstancedGrass({
  // count = 60000,
  fieldSize = 128,
  grassScale = 0.6,
  LODDistance = 40,
}: InstancedGrassProps) {

  const isMobile = navigator.maxTouchPoints > 0

  const count = isMobile ? 60000 : 200000

  const highDetailRef = useRef<THREE.InstancedMesh>(null);
  const lowDetailRef = useRef<THREE.InstancedMesh>(null);

  const { camera, clock } = useThree();


  const halfWidth = 0.06;
  const height = 1.4;


  const {
    tipColor,
    baseColor,
    fogColor
  } = useControls({
    tipColor: "#a6c89c",
    baseColor: "#404709",
    fogColor: "#e6ebef",
  });



  const createGrassGeometry = (segments:number) => {

    const taper = 0.005;
    const positions:number[] = [];


    for(let i = 0; i < segments - 1; i++){

      const y0 = (i / segments) * height;
      const y1 = ((i + 1) / segments) * height;


      positions.push(
        -halfWidth + taper*i, y0, 0,
        halfWidth - taper*i, y0, 0,
        -halfWidth + taper*(i+1), y1,0,


        -halfWidth + taper*(i+1),y1,0,
        halfWidth - taper*i,y0,0,
        halfWidth - taper*(i+1),y1,0
      );

    }


    positions.push(
      -halfWidth + taper*(segments-1),
      ((segments-1)/segments)*height,
      0,

      halfWidth - taper*(segments-1),
      ((segments-1)/segments)*height,
      0,

      0,
      height,
      0
    );


    const geo = new THREE.BufferGeometry();

    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        3
      )
    );


    geo.computeVertexNormals();


    return geo;
  };



  const highDetailGeo = useMemo(
    ()=>createGrassGeometry(7),
    []
  );


  const lowDetailGeo = useMemo(
    ()=>createGrassGeometry(1),
    []
  );



  const material = useMemo(()=>{

    return new THREE.ShaderMaterial({

      vertexShader:grassVertexShader,
      fragmentShader:grassFragmentShader,

      uniforms:{

        uFrequency:{
          value:new THREE.Vector2(5,5)
        },

        uTime:{
          value:0
        },

        uSpeed:{
          value:3
        },

        uTipColor:{
          value:new THREE.Color(tipColor)
        },

        uBaseColor:{
          value:new THREE.Color(baseColor)
        },

        uFogColor:{
          value:new THREE.Color(fogColor)
        },

        uHalfWidth:{
          value:halfWidth
        },

        uBladeHeight:{
          value:height
        }

      },

      side:THREE.DoubleSide

    });

  },[baseColor, fogColor, tipColor]);

  useFrame(()=>{
    material.uniforms.uTime.value =
      clock.getElapsedTime();
  });


  useEffect(()=>{

    material.uniforms.uTipColor.value.set(tipColor);
    material.uniforms.uBaseColor.value.set(baseColor);
    material.uniforms.uFogColor.value.set(fogColor);


  },[ tipColor, baseColor, fogColor, material.uniforms.uBaseColor.value, material.uniforms.uFogColor.value, material.uniforms.uTipColor.value ]);





  const grassData = useMemo<GrassBlade[]>(()=>{

    const blades:GrassBlade[]=[];


    for(let i=0;i<count;i++){

      blades.push({

        x:(Math.random()-0.5)*fieldSize,

        z:(Math.random()-0.5)*fieldSize,

        rotation:Math.random()*Math.PI*2

      });

    }


    return blades;


  },[
    count,
    fieldSize
  ]);

  useFrame(()=>{


    if(
      !highDetailRef.current ||
      !lowDetailRef.current
    ) return;



    const dummy = new THREE.Object3D();


    let highIndex = 0;
    let lowIndex = 0;



    for (const blade of grassData) {


      const distance =
        new THREE.Vector3(
          blade.x,
          0,
          blade.z
        )
        .distanceTo(camera.position);



      dummy.position.set(
        blade.x,
        0,
        blade.z
      );


      dummy.scale.setScalar(
        grassScale
      );


      dummy.rotation.y =
        blade.rotation;


      dummy.updateMatrix();

      if(distance < LODDistance){

        highDetailRef.current.setMatrixAt(
          highIndex++,
          dummy.matrix
        );

      }else{

        lowDetailRef.current.setMatrixAt(
          lowIndex++,
          dummy.matrix
        );

      }


    }



    highDetailRef.current.count =
      highIndex;

    lowDetailRef.current.count =
      lowIndex;


    highDetailRef.current.instanceMatrix.needsUpdate=true;
    lowDetailRef.current.instanceMatrix.needsUpdate=true;


  });





  return (

    <>

      <instancedMesh
        ref={highDetailRef}
        args={[
          highDetailGeo,
          material,
          count
        ]}
      />


      <instancedMesh
        ref={lowDetailRef}
        args={[
          lowDetailGeo,
          material,
          count
        ]}
      />


    </>

  );

}
