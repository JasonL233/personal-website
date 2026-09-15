"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/**
 * Same mouse-follow technique as the reference project's Usagi model: track the cursor
 * position globally, then each frame smoothly rotate the model toward an angle derived
 * from it (lerp, so it eases rather than snapping). The asymmetric left/right turn amount
 * and the Z-position shift (the model leans toward the camera as it turns) are what make it
 * read as the body "twisting" rather than just spinning in place - a stronger, more visible
 * version of the simple X/Y-only rotation this had before.
 */
function DuolingoModel() {
  const { scene } = useGLTF("/duolingo.glb");
  const modelRef = useRef();
  const mouse = useRef([0, 0]);

  useEffect(() => {
    const updateMouse = (event) => {
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const targetX = -mouse.current[1] * 0.32;

    let rotationOffset;
    let zOffset;
    if (mouse.current[0] < 0) {
      rotationOffset = Math.abs(mouse.current[0]) * -1.3;
      zOffset = Math.abs(mouse.current[0]) * 0.55;
    } else {
      rotationOffset = mouse.current[0] * 0.95;
      zOffset = mouse.current[0] * 0.55;
    }

    const targetY = rotationOffset;

    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetX, delta * 2);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetY, delta * 2);
    modelRef.current.position.z = THREE.MathUtils.lerp(modelRef.current.position.z, zOffset, delta * 2);
  });

  return <primitive ref={modelRef} object={scene} scale={2.8} position={[0, -0.7, 0]} />;
}

export default function DuoOwlModel() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 3]} />
      <ambientLight intensity={0.8} />
      <spotLight position={[5, 5, 5]} angle={0.4} penumbra={0.5} intensity={1.5} />
      <pointLight position={[-5, 0, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <DuolingoModel />
      </Suspense>
    </Canvas>
  );
}
