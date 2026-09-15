"use client";
import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const projectsData = [
  {
    id: 1,
    title: "EventHub",
    date: 202501,
    shortDescription: "An event-sharing social platform.",
    description:
      "EventHub is a social event-sharing platform designed for event organizers and users to connect. Organizers can post and promote events, while users can explore various gatherings, such as music festivals, gaming meetups, anime conventions, flea markets, and dance parties. The goal of EventHub is to foster a community where people can discover events that align with their interests and connect with like-minded people.",
    techStack: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Javascript",
      "Zustand",
      "Chakra UI",
    ],
    cover_image: "/images/projects/project1/1.png",
    images: [
      "/images/projects/project1/1.png",
      "/images/projects/project1/EventHub_logo.png",
      "/images/projects/project1/2.png",
      "/images/projects/project1/3.png",
      "/images/projects/project1/4.png",
      "/images/projects/project1/5.png",
      "/images/projects/project1/6.png",
    ],
    tag: ["All", "Web"],
    gitUrl: "https://github.com/JasonL233/EventHub",
  },
  {
    id: 2,
    title:
      "Deep learning-based Image Analysis for measurements of myocardial risk zone, infarct size, and no-reflow",
    date: 202406,
    shortDescription:
      "My research project at Huntington Medical Research Institutes 2024",
    description:
      "At HMRI, I developed a machine learning tool that automatically analyzes heart images to calculate the ratio between affected and total heart areas—streamlining what was previously a time-consuming manual process using ImageJ. My project focused on segmenting three key regions: the risk zone, infarction size, and no-reflow zone. I designed a web-based tool for mask generation and data augmentation, trained segmentation models on original and augmented datasets, and achieved high accuracy, with predictions deviating less than 6% from actual values (R² = 0.98). This work aims to support cardiovascular researchers with faster, more scalable image analysis—and will eventually evolve into a deployable tool for the entire research team.",
    techStack: ["Python", "PyTorch", "MaskRCNN", "Computer Vision"],
    cover_image: "/images/projects/project2/cover.png",
    images: [
      "/images/projects/project2/1.png",
      "/images/projects/project2/2.png",
      "/images/projects/project2/3.png",
      "/images/projects/project2/4.png",
      "/images/projects/project2/5.png",
      "/images/projects/project2/6.png",
      "/images/projects/project2/7.png",
      "/images/projects/project2/8.png",
      "/images/projects/project2/8_5.png",
      "/images/projects/project2/9.png",
      "/images/projects/project2/10.png",
      "/images/projects/project2/11.png",
      "/images/projects/project2/12.png",
      "/images/projects/project2/13.png",
      "/images/projects/project2/14.png",
    ],
    tag: ["All", "AI/ML"],
    gitUrl: "/images/projects/project2/poster.pdf",
  },
  {
    id: 3,
    title: "Oversea",
    date: 202506,
    shortDescription: "",
    description: "",
    techStack: [],
    images: [],
    tag: ["All"],
    gitUrl: "/",
  },
  {
    id: 4,
    title: "CouchPotatoes",
    date: "Oct 2024 - Present",
    shortDescription:
      "A couch co-op party game where players compete in hilarious potato-themed challenges.",
    description:
      "CouchPotatoes is an exciting couch co-op party game that brings friends and family together for endless fun and laughter. Players take on the role of energetic potatoes competing in various mini-games and challenges. The game features vibrant graphics, intuitive controls, and multiplayer gameplay perfect for parties and gatherings. With multiple game modes and increasingly difficult levels, CouchPotatoes offers hours of entertainment for players of all ages.",
    techStack: [
      "Unity",
      "C#",
      "Game Development",
      "Multiplayer",
      "2D Graphics",
    ],
    cover_image: "/images/projects/CouchPotatoes/image.png",
    images: [
      "/images/projects/CouchPotatoes/image.png",
      "/images/projects/CouchPotatoes/IMG_0145.png",
      "/images/projects/CouchPotatoes/IMG_0146.png",
      "/images/projects/CouchPotatoes/1.png",
      "/images/projects/CouchPotatoes/2.png",
    ],
    tag: ["All", "Game Development"],
    gitUrl: "https://www.instagram.com/reel/DKKrq3xyrW8/",
  },
];

const ProjectSection = () => {
  const [tag, setTag] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0); // Reset to first image when opening modal
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedProject.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProject.images.length - 1 : prevIndex - 1
    );
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[var(--foreground)] mb-6">
            My Projects
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Explore my portfolio of web applications, AI/ML research projects,
            and game development
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <ProjectTag
            onClick={handleTagChange}
            name="All"
            isSelected={tag === "All"}
          />
          <ProjectTag
            onClick={handleTagChange}
            name="Web"
            isSelected={tag === "Web"}
          />
          <ProjectTag
            onClick={handleTagChange}
            name="AI/ML"
            isSelected={tag === "AI/ML"}
          />
          <ProjectTag
            onClick={handleTagChange}
            name="Game Development"
            isSelected={tag === "Game Development"}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.shortDescription}
              imgUrl={project.cover_image}
              tags={project}
              gitUrl={project.gitUrl}
              preview={() => handleProjectClick(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="site-surface rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4 mr-10">
                  {selectedProject.title}
                </h3>
                <p className="text-[var(--muted)] mb-6">
                  {selectedProject.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="site-soft text-[var(--foreground)] px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 site-border site-surface p-4">
                    {/* Fixed size container for images */}
                    <div className="w-full h-96 md:h-[500px] flex items-center justify-center site-soft rounded-lg">
                      <Image
                        src={selectedProject.images[currentImageIndex]}
                        alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                        width={800}
                        height={600}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all duration-200 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all duration-200 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedProject.images.length}
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <a
                    href={selectedProject.gitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </div>

              <button
                className="absolute top-4 right-4 text-white bg-black rounded-full p-2 hover:bg-black/75 transition-all duration-200"
                onClick={handleCloseModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectSection;
