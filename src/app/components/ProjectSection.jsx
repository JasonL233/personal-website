"use client";
import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectTag from './ProjectTag';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const projectsData = [
    {
        id: 1,
        title: "EventHub",
        date: "Jan 2025 - March 2025",
        shortDescription: "An event-sharing social platform.",
        description: "EventHub is a social event-sharing platform designed for event organizers and users to connect. Organizers can post and promote events, while users can explore various gatherings, such as music festivals, gaming meetups, anime conventions, flea markets, and dance parties. The goal of EventHub is to foster a community where people can discover events that align with their interests and connect with like-minded people.",
        techStack: ["React", "Node.js", "MongoDB", "Express", "Javascript", "Zustand", "Chakra UI"],
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
        title: "Deep learning-based Image Analysis for measurements of myocardial risk zone, infarct size, and no-reflow",
        shortDescription: "My research project at Huntington Medical Research Institutes 2024",
        description: "At HMRI, I developed a machine learning tool that automatically analyzes heart images to calculate the ratio between affected and total heart areas—streamlining what was previously a time-consuming manual process using ImageJ. My project focused on segmenting three key regions: the risk zone, infarction size, and no-reflow zone. I designed a web-based tool for mask generation and data augmentation, trained segmentation models on original and augmented datasets, and achieved high accuracy, with predictions deviating less than 6% from actual values (R² = 0.98). This work aims to support cardiovascular researchers with faster, more scalable image analysis—and will eventually evolve into a deployable tool for the entire research team.",
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
        title: "More projects to be added...",
        shortDescription: "",
        description: "",
        techStack: [],
        images: [
        ],
        tag: ["All"],
        gitUrl: "/",
    }
]

const ProjectSection = () => {
    const [tag, setTag] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleTagChange = (newTag) => {
        setTag(newTag)
    }

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0); // Reset to first image when opening modal
    }

    const handleCloseModal = () => {
        setSelectedProject(null);
    }

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
        <h2 className="text-center text-4xl font-bold text-black mt-4 mb-8 md:mb-12">
            My Projects
        </h2>
        <div className="text-black flex flex-row justify-center items-center gap-2 py-6">
            <ProjectTag onClick={handleTagChange} name="All" isSelected={tag === "All"}/>
            <ProjectTag onClick={handleTagChange} name="Web" isSelected={tag === "Web"}/>
            <ProjectTag onClick={handleTagChange} name="AI/ML" isSelected={tag === "AI/ML"}/>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {filteredProjects.map((project) => 
                <ProjectCard 
                    key={project.id} 
                    title={project.title} 
                    description={project.shortDescription} 
                    imgUrl={project.cover_image} 
                    tags={project}
                    gitUrl={project.gitUrl}
                    preview={() => handleProjectClick(project)}
                />
            )}
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
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 mr-10">{selectedProject.title}</h3>
                            <p className="text-gray-600 mb-6">{selectedProject.description}</p>
                            
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack.map((tech, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-black px-3 py-1 rounded-full text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-gray-300 bg-white p-4">
                                    <Image
                                        src={selectedProject.images[currentImageIndex]}
                                        alt={`${selectedProject.title} screenshot ${currentImageIndex + 1}`}
                                        layout="responsive"
                                        width={800}
                                        height={600}
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                                
                                {/* Navigation Arrows */}
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  )
}

export default ProjectSection
