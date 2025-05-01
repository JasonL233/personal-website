"use client";
import React, { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import TabButton from './TabButton';
import { motion, AnimatePresence } from 'framer-motion';

const TAB_DATA = [
    {
        title: "Skills",
        id: "skills",
        content: (
            <div className="grid grid-rows-2 sm:grid-rows-3 gap-4">
                <div className="p-4 border-1 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-black mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Python</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Java</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">C++</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Javascript</span>
                    </div>
                </div>
                <div className="p-4 border-1 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-black mb-2">Frontend</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">React</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">HTML/CSS</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Next.js</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Chakra UI</span>
                    </div>
                </div>
                <div className="p-4 border-1 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-black mb-2">Backend</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Node.js</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Express.js</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">MongoDB</span>
                    </div>
                </div>
                <div className="p-4 border-1 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-black mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Git</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">AzureOpenAI</span>
                        <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">Semantic Kernel</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Education",
        id: "education",
        content: (
            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/UCLA_logo.png" 
                            alt="UCLA Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">University of California, Los Angeles</h3>
                        <p className="text-gray-600">Bachelor of Science in Computer Science</p>
                        <p className="text-sm text-gray-500">2024 - Present</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/MTSAC_logo.png" 
                            alt="Mt. SAC Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Mt. San Antonio College</h3>
                        <p className="text-gray-600">Engineering Transfer</p>
                        <p className="text-sm text-gray-500">2022 - 2024</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Awards",
        id: "awards",
        content: (
            <div className="space-y-4">
                <div className=" border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/VEX_logo.png" 
                            alt="Vex Robotics Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">CSUN Championships Execellence Award</h3>
                            <p className="text-gray-600">Award Winner</p>
                            <p className="text-sm text-gray-500">2024</p>
                        </div>
                    </div>
                </div>

                <div className=" border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/VEX_logo.png" 
                            alt="Vex Robotics Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Cal Poly SLO Gear Slingers Open Invitational Judge's Award</h3>
                            <p className="text-gray-600">Award Winner</p>
                            <p className="text-sm text-gray-500">2023</p>
                        </div>
                    </div>
                </div>

                <div className=" border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/VEX_logo.png" 
                            alt="Vex Robotics Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Vex Robotics 2023 Socal Regional Championship</h3>
                            <p className="text-gray-600">First Place Winner</p>
                            <p className="text-sm text-gray-500">2023</p>
                        </div>
                    </div>
                </div>

                <div className=" border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                            src="/images/CongressionalAppChallenge.png" 
                            alt="Cong App Challenge Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Certificate of Congressional Recognition of Best App Functionality</h3>
                            <p className="text-gray-600">Award Winner</p>
                            <p className="text-sm text-gray-500">2021</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
]

const AboutSection = () => {
    const [tab, setTab] = useState("skills");
    const [isPending, startTransition] = useTransition();
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isResumeOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isResumeOpen]);

    const handleTabChange = (id) => {
        startTransition(() =>{
            setTab(id);
        });
    };

    return (
        <section className="text-black mb-15">
            <div className="md:grid md:grid-cols-2 gap-[10%] items-center py-8 xl:gap-[15%] sm:py-16">
                <div className="max-w-4xl ml-5 mx-auto p-5">
                    <div 
                        className="border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={() => setIsResumeOpen(true)}
                    >
                        <Image 
                            src="/Jason_Resume.png" 
                            width="595" 
                            height="842" 
                            alt="Resume"
                            className="border-none"
                        />
                    </div>
                    <a 
                        href="/Jason_Lin_Resume.pdf" 
                        download="Jason_Lin_Resume.pdf"
                        className="mt-4 inline-block px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-fit sm:text-xs md:text-[9px] lg:text-xs xl:text-base xl:mt-6 rounded-full bg-transparent hover:bg-gray-200 text-black font-bold border-2 border-black"
                    >
                        Download Resume
                    </a>
                </div>
                <div className="mt-4 ml-5 md:mt-0 text-left flex flex-col h-full">
                    <div className="flex flex-row justify-start mt-8">
                        <TabButton
                            selectTab={() => handleTabChange("skills")}
                            active={tab === "skills"}
                            content="Skills"
                        />
                        <TabButton
                            selectTab={() => handleTabChange("education")}
                            active={tab === "education"}
                            content="Education"
                        />
                        <TabButton
                            selectTab={() => handleTabChange("awards")}
                            active={tab === "awards"}
                            content="Awards"
                        />
                    </div>
                    <div className="mt-8">
                        {TAB_DATA.find((t) => tab === t.id).content}
                    </div>
                </div>
            </div>

            {/* Resume Modal */}
            <AnimatePresence>
                {isResumeOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
                        onClick={() => setIsResumeOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <iframe 
                                src="/Jason_Lin_Resume.pdf#toolbar=0&navpanes=0"
                                className="w-full h-[80vh] border-none"
                                title="Resume PDF"
                            />
                            <button
                                className="fixed top-20 right-5 text-white bg-black rounded-full p-2 hover:bg-black/75 transition-all duration-200"
                                onClick={() => setIsResumeOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default AboutSection
