"use client";
import React, { useEffect } from "react";
import ProjectSection from "../components/ProjectSection";
import EmailSection from "../components/EmailSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProjectsPage() {
  useEffect(() => {
    import("particles.js").then(() => {
      if (window.particlesJS) {
        window.particlesJS.load(
          "particles-js",
          "/snowParticles.json", // Place your config in public/particles.json
          function () {
            console.log("callback - particles.js config loaded");
          }
        );
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="fixed inset-0 w-full h-full z-0">
        <div id="particles-js" className="absolute inset-0 w-full h-full"></div>
      </div>
      <div className="z-10">
        <Navbar />
      </div>
      <div className="container mt-10 mx-auto px-12 py-4 z-10">
        <ProjectSection />
        <EmailSection />
      </div>
      <Footer />
    </main>
  );
}
