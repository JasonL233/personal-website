"use client";

import DuoOwlModel from "./DuoOwlModel";
import styles from "./PersonalActivity.module.css";

// Already only ever loaded client-side (PersonalActivity.jsx imports DuoOwl itself via
// next/dynamic with ssr:false), so Three.js/WebGL never has to run on the server.

export default function DuoOwl() {
  return (
    <figure className={styles.owlStage}>
      <DuoOwlModel />
      <figcaption className={styles.modelCredit}>
        3D model by{" "}
        <a href="https://sketchfab.com/CereProductions" target="_blank" rel="noopener noreferrer nofollow">
          Cëre Productions
        </a>
      </figcaption>
    </figure>
  );
}
