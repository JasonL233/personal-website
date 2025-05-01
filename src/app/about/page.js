"use client";
import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmailSection from "../components/EmailSection";

export default function AboutPage() {
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
    <main className="flex min-h-screen flex-col bg-white relative">
      <div className="fixed inset-0 w-full h-full z-0">
        <div id="particles-js" className="absolute inset-0 w-full h-full"></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="container mt-10 mx-auto px-12 py-4">
          <h1 className="text-5xl text-center font-bold text-black mb-8">
            About Me
          </h1>
          <HeroSection />
          <AboutSection />
          <EmailSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
