import { DocumentTextIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Experience.module.css";

export const metadata = { title: "Experience | Jason Lin", description: "Jason Lin’s software engineering experience at IBM, APEX, and Newegg." };

const resumeRequestUrl = "https://drive.google.com/file/d/1i4zfDj7kvlandPR8rSnnhjqb0RzQC18a/view?usp=sharing";

const experiences = [
  {
    company: "IBM",
    startDate: "2026-06",
    period: "Jun–Sep 2026",
    location: "Poughkeepsie, NY",
    description: "I built AI developer tools for the IBM Z ecosystem, including Go-based MCP servers for retrieving verified documentation and agent skills for COBOL–Python interoperability. The work combined knowledge retrieval, automated binding compilation, and compiler diagnostics to help developers resolve build errors.",
    skills: ["Go", "Python", "COBOL", "Agent Skills", "MCP", "RAG", "llama.cpp", "SQLite", "z/OS", "Github"],
  },
  {
    company: "APEX",
    startDate: "2025-06",
    period: "Jun–Aug 2025",
    location: "Tokyo, Japan",
    description: "I built an AI quotation system that extracted business data from emails and images, validated it against MoneyForward, and generated quotes. I developed the FastAPI backend and React interface, with background image processing, session caching, and deployment on AWS.",
    skills: ["Python", "FastAPI", "React", "TypeScript", "GPT-4o", "PostgreSQL", "Redis", "AWS", "Docker"],
  },
  {
    company: "Newegg",
    startDate: "2022-07",
    period: "Jul–Aug 2022",
    location: "City of Industry, CA",
    description: "I built a Python analytics tool that turned more than 600 support tickets into charts, reducing weekly report preparation from five minutes to five seconds. A Tkinter desktop interface gave IT staff zoomable charts, filterable tables, and PDF exports, packaged as a Windows executable for easy deployment.",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Tkinter", "PyInstaller"],
  },
].sort((a, b) => b.startDate.localeCompare(a.startDate));

export default function ExperiencePage() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-14 sm:py-20">
        <div className={styles.heading}>
          <h1 className="text-5xl sm:text-6xl font-serif tracking-tight text-[var(--foreground)]">Experience</h1>
          <a href={resumeRequestUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeButton} aria-label="Request résumé access on Google Drive (opens in a new tab)">
            <DocumentTextIcon aria-hidden="true" />
            Request résumé
            <ArrowUpRightIcon aria-hidden="true" />
          </a>
        </div>
        <div className={styles.entries}>
          {experiences.map(experience => (
            <article key={experience.company} aria-label={`${experience.company} experience`} className="border-t border-[var(--border)] pt-8 grid sm:grid-cols-[130px_1fr] gap-6">
              <div className="text-sm text-[var(--muted)]">{experience.period}<span className="block text-xs mt-2 tracking-widest">INTERNSHIP</span></div>
              <div>
                <h2 className="font-serif text-3xl text-[var(--foreground)] mb-3">{experience.company}</h2>
                <p className="font-medium text-[var(--muted)] mb-1">Software Engineering Intern</p>
                <p className="text-sm text-[var(--muted)] mb-5">{experience.location}</p>
                <p className="text-[var(--muted)] leading-relaxed">{experience.description}</p>
                <ul className="flex flex-wrap gap-2 mt-6 text-xs text-[var(--muted)]" aria-label={`${experience.company} skills`}>
                  {experience.skills.map(skill => <li key={skill} className="px-3 py-2 rounded-full bg-[var(--soft)]">{skill}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
