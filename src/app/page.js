"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  useEffect(() => {
    import("particles.js").then(() => {
      if (window.particlesJS) {
        window.particlesJS.load(
          "particles-js",
          "/particles.json", // Place your config in public/particles.json
          function () {
            console.log("callback - particles.js config loaded");
          }
        );
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-white relative flex flex-col">
      <div
        id="particles-js"
        className="absolute inset-0 w-full h-full z-0"
      ></div>
      <div className="z-10">
        <Navbar />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl font-bold text-black mb-4">
              Hello! I&apos;m Jason
            </div>
            <p className="text-lg text-black mb-4">
              Take a look around my website.
            </p>
            <div className="flex gap-4 mb-4 justify-center z-10">
              <Link
                href="/about"
                className="px-6 py-2 border-2 border-black text-black font-bold rounded hover:bg-gray-600 hover:text-white transition"
              >
                About Me
              </Link>
              <Link
                href="/projects"
                className="px-6 py-2 border-2 border-black text-black font-bold rounded hover:bg-gray-600 hover:text-white transition"
              >
                Projects
              </Link>
            </div>
            <div className="flex flex-row gap-6 mb-6 justify-center z-10">
              <a
                href="mailto:Lin1jason8@outlook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/email.svg"
                  alt="Email"
                  width={48}
                  height={48}
                  className="hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://github.com/JasonL233"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={48}
                  height={48}
                  className="hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/jason-lin-b66b77226"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={48}
                  height={48}
                  className="hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </motion.h1>
        </div>
      </div>
    </main>
  );
}
