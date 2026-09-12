"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NavigationTree.module.css";

const destinations = [
  { name: "About Me", path: "/about", color: "#b84a32", position: [28, 44] },
  { name: "Projects", path: "/projects", color: "#cf7a32", position: [73, 43] },
  { name: "Experience", path: "/experience", color: "#ad802c", position: [50, 25] },
];

export default function NavigationTree() {
  const host = useRef(null);
  const tree = useRef(null);
  const links = useRef([]);
  const active = useRef(null);
  const prefetched = useRef(new Set());
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let disposed = false;
    const element = host.current;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const { createNavigationTree } = await import(/* webpackIgnore: true */ "/scripts/navigation-tree.js?v=movable-planet-1");
        if (disposed) return;
        tree.current = createNavigationTree(element, {
          colors: destinations.map(destination => destination.color),
          onHover: index => {
            active.current = index;
            setHovered(index);
            if (index !== null && !prefetched.current.has(index)) {
              prefetched.current.add(index);
              router.prefetch(destinations[index].path);
            }
          },
          onNavigate: index => router.push(destinations[index].path),
          onProject: positions => positions.forEach(([x, y, shown], index) => {
            const link = links.current[index];
            if (link) { link.style.left = `${x}px`; link.style.top = `${y}px`; link.hidden = !shown; }
          }),
          onError: () => setStatus("unavailable"),
        });
        if (active.current !== null) tree.current.highlight(active.current);
        setStatus("ready");
      } catch {
        if (!disposed) setStatus("unavailable");
      }
    }, { rootMargin: "150px" });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); tree.current?.dispose(); tree.current = null; };
  }, [router]);

  function highlight(index) {
    active.current = index;
    setHovered(index);
    tree.current?.highlight(index);
  }

  function handleKey(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      tree.current?.rotate(event.key === "ArrowLeft" ? -.08 : event.key === "ArrowRight" ? .08 : 0, event.key === "ArrowUp" ? -.08 : event.key === "ArrowDown" ? .08 : 0, event.shiftKey);
    } else if (event.key === "Escape" || event.key === "Home") {
      event.preventDefault();
      tree.current?.reset();
    }
  }

  return (
    <nav className={styles.tree} data-status={status} aria-label="Interactive maple planet. Drag the globe to rotate; drag the tree to move it." tabIndex={0} onKeyDown={handleKey} onPointerLeave={() => highlight(null)}>
      <div ref={host} className={styles.canvas} aria-hidden="true" />
      {destinations.map((destination, index) => (
        <Link key={destination.path} href={destination.path} ref={element => { links.current[index] = element; }}
          className={styles.branchLink} data-tree-link data-active={hovered === index}
          style={{ left: `${destination.position[0]}%`, top: `${destination.position[1]}%`, "--leaf-color": destination.color }}
          onFocus={() => highlight(index)} onBlur={() => highlight(null)} onPointerEnter={() => highlight(index)}>
          <span className={styles.branchName}>{destination.name}</span>
          <svg className={styles.flourish} width="108" height="18" viewBox="0 0 108 18" aria-hidden="true"><path d="M4 13Q38 1 84 9M84 9l16-4m-16 4 13 4" /></svg>
        </Link>
      ))}
      <p className="sr-only">Drag the globe to rotate it, or drag the tree to move it along the surface. Arrow keys rotate the globe; Shift and arrow keys move the tree. Escape resets the scene. Select a branch to visit its page.</p>
      {status === "ready" && <button type="button" className={styles.reset} onClick={() => tree.current?.reset()}>Reset view <span aria-hidden="true">↺</span></button>}
      {status === "loading" && <p className={styles.status} role="status">A little maple is taking root…</p>}
      {status === "unavailable" && <p className={styles.status} role="status">Choose a branch to explore.</p>}
    </nav>
  );
}
