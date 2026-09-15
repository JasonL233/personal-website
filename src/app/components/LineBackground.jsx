"use client";

import { useEffect, useRef } from "react";

export default function LineBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, visible = true;
    const pointer = { x: -1000, y: -1000 };
    let particles = [];
    let ink = document.documentElement.dataset.theme === "dark" ? "189,201,211" : "0,0,0";
    const makeParticle = (x = Math.random() * width, y = Math.random() * height) => ({ x, y, vx: (Math.random() - .5) * 100, vy: (Math.random() - .5) * 100, radius: .6 + Math.random() * 2.4 });
    function draw(delta = 0) {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const dx = particle.x - pointer.x, dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (delta && distance < 180 && distance > 0) {
          const force = (1 - distance / 180) * 160 * delta;
          particle.x += dx / distance * force;
          particle.y += dy / distance * force;
        }
        particle.x = (particle.x + particle.vx * delta + width) % width;
        particle.y = (particle.y + particle.vy * delta + height) % height;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= 150) continue;
          context.strokeStyle = `rgba(${ink},${.4 * (1 - distance / 150)})`;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        }
        context.fillStyle = `rgba(${ink},.5)`;
        context.beginPath(); context.arc(a.x, a.y, a.radius, 0, Math.PI * 2); context.fill();
      }
    }
    function tick(time) {
      frame = 0;
      if (document.hidden || !visible || reducedMotion.matches) return;
      if (time - last >= 1000 / 30) { draw(last ? Math.min((time - last) / 1000, .06) : 0); last = time; }
      frame = requestAnimationFrame(tick);
    }
    function resume() {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (document.hidden || !visible) return;
      draw();
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
    }
    function resize() {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(80, Math.max(24, Math.round(width * height / 10000))) }, () => makeParticle());
      resume();
    }
    function move(event) { pointer.x = event.clientX; pointer.y = event.clientY; }
    function leave() { pointer.x = -1000; pointer.y = -1000; }
    function push(event) {
      if (event.target.closest("a, button, input, textarea")) return;
      particles.push(...Array.from({ length: 4 }, () => makeParticle(event.clientX, event.clientY)));
      particles = particles.slice(-90);
      if (reducedMotion.matches) draw();
    }
    const themeObserver = new MutationObserver(() => {
      ink = document.documentElement.dataset.theme === "dark" ? "189,201,211" : "0,0,0";
      resume();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("click", push);
    document.addEventListener("visibilitychange", resume);
    reducedMotion.addEventListener("change", resume);
    return () => {
      cancelAnimationFrame(frame); themeObserver.disconnect(); resizeObserver.disconnect(); observer.disconnect();
      window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave);
      window.removeEventListener("click", push); document.removeEventListener("visibilitychange", resume);
      reducedMotion.removeEventListener("change", resume);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 w-full h-full pointer-events-none" />;
}
