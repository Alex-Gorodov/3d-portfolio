import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

import grassVertexShader from "../../shaders/grass/vertex.glsl";
import grassFragmentShader from "../../shaders/grass/fragment.glsl";

interface InstancedGrassProps {
  count?: number;
  fieldSize?: number;
  grassScale?: number;
  position?: [number, number, number];
}

interface GrassBlade {
  x: number;
  z: number;
  rotation: number;
}

export default function InstancedGrass({
  count = 300,
  fieldSize = 10,
  grassScale = 1,
  position = [0, 0, 0],
}: InstancedGrassProps) {

  const { camera, clock } = useThree();

  const highDetailRef = useRef<THREE.InstancedMesh>(null);
  const lowDetailRef = useRef<THREE.InstancedMesh>(null);

  const halfWidth = 0.16;
  const height = 1.2;

  const {
    tipColor,
    baseColor,
    fogColor
  } = useControls("Grass", {
    tipColor: "#5c7354",
    baseColor: "#7e8d10",
    fogColor: "#e6ebef",
  });

  /*
   * Grass blade geometry
   */
  const createGrassGeometry = (segments: number) => {

    const taper = 0.005;
    const positions: number[] = [];

    for (let i = 0; i < segments - 1; i++) {

      const y0 = (i / segments) * height;
      const y1 = ((i + 1) / segments) * height;

      positions.push(
        -halfWidth + taper * i, y0, 0,
         halfWidth - taper * i, y0, 0,
        -halfWidth + taper * (i + 1), y1, 0,

        -halfWidth + taper * (i + 1), y1, 0,
         halfWidth - taper * i, y0, 0,
         halfWidth - taper * (i + 1), y1, 0
      );
    }

    positions.push(
      -halfWidth + taper * (segments - 1),
      ((segments - 1) / segments) * height,
      0,

       halfWidth - taper * (segments - 1),
      ((segments - 1) / segments) * height,
      0,

      0,
      height,
      0
    );

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        3
      )
    );

    geometry.computeVertexNormals();

    return geometry;
  };

  const highDetailGeo = useMemo(
    () => createGrassGeometry(3),
    []
  );

  const lowDetailGeo = useMemo(
    () => createGrassGeometry(1),
    []
  );

  /*
   * Material
   */
  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,

      uniforms: {

        uFrequency: {
          value: new THREE.Vector2(5, 5)
        },

        uTime: {
          value: 0
        },

        uSpeed: {
          value: 2
        },

        uTipColor: {
          value: new THREE.Color(tipColor)
        },

        uBaseColor: {
          value: new THREE.Color(baseColor)
        },

        uFogColor: {
          value: new THREE.Color(fogColor)
        },

        uHalfWidth: {
          value: halfWidth
        },

        uBladeHeight: {
          value: height
        }

      },

      side: THREE.DoubleSide
    });

  }, [tipColor, baseColor, fogColor]);


  /*
   * Generate island
   */
  const grassData = useMemo<GrassBlade[]>(() => {

    const blades: GrassBlade[] = [];

    const radius = fieldSize / 2;

    for (let i = 0; i < count; i++) {

      const angle = Math.random() * Math.PI * 2;

      const distance =
        Math.sqrt(Math.random()) * radius;

      // Organic edge
      const edge =
        0.85 +
        Math.sin(angle * 3) * 0.08 +
        Math.sin(angle * 5) * 0.05 +
        Math.sin(angle * 8) * 0.03;

      const r = distance * edge;

      blades.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        rotation: Math.random() * Math.PI * 2
      });

    }

    return blades;

  }, [count, fieldSize]);

  useEffect(() => {

    if (highDetailRef.current) {
      highDetailRef.current.frustumCulled = false;
    }

    if (lowDetailRef.current) {
      lowDetailRef.current.frustumCulled = false;
    }

  }, []);


  /*
   * Animation + instance positions
   */
  useFrame(() => {

    material.uniforms.uTime.value =
      clock.getElapsedTime();

    const high = highDetailRef.current;
    const low = lowDetailRef.current;

    if (!high || !low) return;

    const dummy = new THREE.Object3D();

    let highIndex = 0;
    let lowIndex = 0;

    for (const blade of grassData) {

      /*
       * IMPORTANT:
       * Add the island position here.
       */
      dummy.position.set(
        blade.x + position[0],
        position[1],
        blade.z + position[2]
      );

      dummy.scale.setScalar(grassScale);

      dummy.rotation.y = blade.rotation;

      dummy.updateMatrix();

      /*
       * Distance from CAMERA to island blade
       */
      const distance = dummy.position.distanceTo(camera.position);

      if (distance < 20) {

        high.setMatrixAt(
          highIndex++,
          dummy.matrix
        );

      } else {

        low.setMatrixAt(
          lowIndex++,
          dummy.matrix
        );

      }
    }

    high.count = highIndex;
    low.count = lowIndex;

    high.instanceMatrix.needsUpdate = true;
    low.instanceMatrix.needsUpdate = true;

  });

  const createIslandGeometry = useMemo(() => {
    const segments = 64;
    const radius = fieldSize / 2;

    const positions: number[] = [];

    // center
    positions.push(0, 0, 0);

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      const edge =
        0.85 +
        Math.sin(angle * 3) * 0.08 +
        Math.sin(angle * 5) * 0.05 +
        Math.sin(angle * 8) * 0.03;

      const r = radius * edge;

      positions.push(
        Math.cos(angle) * r,
        0,
        Math.sin(angle) * r
      );
    }

    const indices: number[] = [];

    for (let i = 0; i < segments; i++) {
      indices.push(
        0,
        i + 1,
        i + 2
      );
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        positions,
        3
      )
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    return geometry;

  }, [fieldSize]);


  return (
    <>
      <mesh
        geometry={createIslandGeometry}
        position={[
          position[0],
          0,
          position[2]
        ]}
        scale={1.1}
        rotation-x={-Math.PI}
        rotation-y={1}
      >
        <meshBasicMaterial color="#96792f" />
      </mesh>

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
