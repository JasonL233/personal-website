import Image from "next/image";
import Navbar from "./components/Navbar";
import LineBackground from "./components/LineBackground";
import NavigationTree from "./components/NavigationTree";
import VisitorTracker from "./components/VisitorTracker";
import VisitorStats from "./components/VisitorStats";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.home}>
      <VisitorTracker />
      <div className={styles.lines}><LineBackground /></div>
      <div className={styles.header}><Navbar /></div>
      <div className={styles.hero}>
        <div className={styles.intro}>
          <h1>Hello,{" "}<br />I’m Jason<span>.</span></h1>
          <p className={styles.welcome}>Welcome to my portfolio!</p>
          <div className={styles.socials}>
            <a href="mailto:Lin1jason8@outlook.com" aria-label="Email Jason"><Image src="/email.svg" alt="" width={28} height={28} /></a>
            <a href="https://github.com/JasonL233" target="_blank" rel="noopener noreferrer" aria-label="Jason on GitHub"><Image src="/github.svg" alt="" width={28} height={28} /></a>
            <a href="https://www.linkedin.com/in/jason-lin-b66b77226" target="_blank" rel="noopener noreferrer" aria-label="Jason on LinkedIn"><Image src="/linkedin.svg" alt="" width={28} height={28} /></a>
          </div>
        </div>
        <NavigationTree />
      </div>
      <div id="maple-tree-controls" className={styles.controls} />
      <div className={styles.visitors}><VisitorStats /></div>
    </main>
  );
}
