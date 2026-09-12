import Image from "next/image";
import Navbar from "./components/Navbar";
import LineBackground from "./components/LineBackground";
import NavigationTree from "./components/NavigationTree";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.lines}><LineBackground /></div>
      <div className={styles.header}><Navbar /></div>
      <div className={styles.hero}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>WELCOME TO MY LITTLE CORNER</p>
          <h1>Hello,{" "}<br />I’m Jason<span>.</span></h1>
          <p className={styles.description}>A little curiosity.{" "}<br />A few ideas taking root.</p>
          <p className={styles.hint}>Drag the globe to rotate · Drag the tree to move <span aria-hidden="true">↗</span></p>
          <div className={styles.socials}>
            <a href="mailto:Lin1jason8@outlook.com" aria-label="Email Jason"><Image src="/email.svg" alt="" width={28} height={28} /></a>
            <a href="https://github.com/JasonL233" target="_blank" rel="noopener noreferrer" aria-label="Jason on GitHub"><Image src="/github.svg" alt="" width={28} height={28} /></a>
            <a href="https://www.linkedin.com/in/jason-lin-b66b77226" target="_blank" rel="noopener noreferrer" aria-label="Jason on LinkedIn"><Image src="/linkedin.svg" alt="" width={28} height={28} /></a>
          </div>
        </div>
        <NavigationTree />
      </div>
    </main>
  );
}
