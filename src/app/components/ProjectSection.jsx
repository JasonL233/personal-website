"use client";
import React, { useState } from "react";
import Image from "next/image";
import ProjectGallery from "./ProjectGallery";
import styles from "./ProjectSection.module.css";
import eventHubCover from "../../../public/images/projects/project1/1.png";
import researchCover from "../../../public/images/projects/project2/cover.png";
import potatoesCover from "../../../public/images/projects/CouchPotatoes/image.png";
import overseaCover from "../../../public/images/projects/Oversea/oversea-earth-cover.webp";
import overseaHome from "../../../public/images/projects/Oversea/Screenshot 2026-09-18 at 2.37.45 PM.png";
import overseaItinerary from "../../../public/images/projects/Oversea/Screenshot 2026-09-18 at 2.39.32 PM.png";
import overseaChatroom from "../../../public/images/projects/Oversea/Screenshot 2026-09-18 at 2.38.03 PM.png";
import overseaLogin from "../../../public/images/projects/Oversea/Screenshot 2026-09-18 at 2.36.29 PM.png";
import fintrackCover from "../../../public/images/projects/FinTrack/fintrack-cover.webp";
import fintrackDashboard from "../../../public/images/projects/FinTrack/Screenshot 2026-09-18 at 6.07.53 PM.png";
import fintrackRenewals from "../../../public/images/projects/FinTrack/Screenshot 2026-09-18 at 6.07.59 PM.png";
import fintrackExpenses from "../../../public/images/projects/FinTrack/Screenshot 2026-09-18 at 6.08.09 PM.png";
import fintrackSubscriptions from "../../../public/images/projects/FinTrack/Screenshot 2026-09-18 at 6.08.18 PM.png";
import fintrackBudgets from "../../../public/images/projects/FinTrack/Screenshot 2026-09-18 at 6.08.25 PM.png";
import fintrackAssistant from "../../../public/images/projects/FinTrack/Screenshot 2026-09-19 at 12.49.43 AM.png";

const projectsData = [
  {
    id: 5,
    title: "FinTrack",
    category: "Personal finance app",
    period: "MAR-JUN 2026",
    caption: "FinTrack / A clearer picture of your spending",
    coverAlt: "A muted green wallet and a single brass coin on a warm ivory background",
    linkLabel: "Explore the code",
    // Latest repository activity is March 2026; keep the display date at year precision.
    date: 202603,
    shortDescription: "A personal finance dashboard for everyday expenses, recurring subscriptions, and monthly budgets, with an AI assistant to help make sense of it all.",
    description: "Built as a team project for CS 130, FinTrack brings expense tracking, subscription management, and category budgets into one workspace. A React and TypeScript interface visualizes spending with Recharts, while an Express API and PostgreSQL database power the financial records. A Gemini-powered assistant answers questions using the user's current spending and budget context.",
    highlights: [
      {
        title: "Typed API & data access",
        description: "Connected React and TypeScript to modular Express endpoints with Zod request validation and JWT authentication. PostgreSQL queries are parameterized and scoped to the signed-in user, supporting expense filtering, sorting, and pagination.",
      },
      {
        title: "Recurring expense tracking",
        description: "A daily renewal job advances subscription dates across five billing cycles and records each renewal as an expense. Monetary amounts are stored in integer cents, with category budgets and spending summaries feeding the dashboard.",
      },
      {
        title: "Context-aware AI assistant",
        description: "The Gemini chat endpoint fetches spending totals, category breakdowns, budgets, upcoming renewals, and recent expense records in parallel. This financial context is combined with conversation history to produce personalized answers about spending and budget usage.",
      },
    ],
    previewTechStack: ["React", "TypeScript", "Express", "PostgreSQL", "Gemini"],
    techStack: ["React", "TypeScript", "Vite", "Node.js", "Express", "PostgreSQL", "Recharts", "Zod", "JWT", "bcrypt", "Google Gemini API", "Docker", "GitHub Actions", "Vitest", "Jest", "Supertest"],
    cover_image: fintrackDashboard,
    images: [fintrackDashboard, fintrackExpenses, fintrackSubscriptions, fintrackBudgets, fintrackRenewals, fintrackAssistant],
    imageDescriptions: [
      "Spending dashboard with a category breakdown and monthly budget progress.",
      "Expense history with dates, categories, amounts, and editing controls.",
      "Subscription management with billing cycles, renewal dates, and status.",
      "Monthly category budgets showing spending, remaining balances, and progress.",
      "Upcoming subscription renewals with amounts and time until the next payment.",
      "The AI assistant analyzing spending and budget usage alongside the dashboard.",
    ],
    tag: ["All", "Web", "AI/ML"],
    gitUrl: "https://github.com/anushachatterjee/CS130Project",
  },
  {
    id: 1,
    title: "EventHub",
    category: "Web development",
    period: "JAN-MAR 2025",
    caption: "EventHub / Discover events",
    coverAlt: "EventHub interface with a search bar and feed of community events",
    linkLabel: "Explore the code",
    date: 202501,
    shortDescription: "Connecting people through shared experiences, from music festivals to local meetups.",
    description:
      "EventHub is a social event-sharing platform designed for event organizers and users to connect. Organizers can post and promote events, while users can explore various gatherings, such as music festivals, gaming meetups, anime conventions, flea markets, and dance parties. The goal of EventHub is to foster a community where people can discover events that align with their interests and connect with like-minded people.",
    highlights: [
      {
        title: "Full-stack architecture",
        description: "Connected a React frontend to Node.js and Express APIs, using MongoDB and Mongoose to store events, users, and notifications. Zustand manages shared event and user state, updating the interface after publishing posts, liking events, and editing profiles.",
      },
      {
        title: "Event discovery",
        description: "Implemented case-insensitive search across event titles, organizer usernames, and tags. Combined search merges MongoDB query results by event ID to remove duplicates and records which fields matched each result.",
      },
      {
        title: "Publishing & social interactions",
        description: "Supported image and video event posts, likes, comments, and threaded replies through Express endpoints. MongoDB stores the relationships between posts and users, while notification records keep organizers and commenters informed about new interactions.",
      },
    ],
    techStack: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Javascript",
      "Zustand",
      "Chakra UI",
    ],
    cover_image: eventHubCover,
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
    displayTitle: "Cardiac Image Analysis",
    category: "AI / ML research",
    period: "JUN-AUG 2024",
    caption: "HMRI / Image segmentation research",
    coverAlt: "Heart tissue images alongside the model’s colored segmentation masks",
    linkLabel: "Read the research poster",
    title:
      "Deep learning-based Image Analysis for measurements of myocardial risk zone, infarct size, and no-reflow",
    date: 202406,
    shortDescription:
      "Using deep learning to help researchers measure affected areas in heart images.",
    description:
      "At HMRI, I developed a machine learning tool that automatically analyzes heart images to calculate the ratio between affected and total heart areas—streamlining what was previously a time-consuming manual process using ImageJ. My project focused on segmenting three key regions: the risk zone, infarction size, and no-reflow zone. I designed a web-based tool for mask generation and data augmentation, trained segmentation models on original and augmented datasets, and achieved high accuracy, with predictions deviating less than 6% from actual values (R² = 0.98). This work aims to support cardiovascular researchers with faster, more scalable image analysis—and will eventually evolve into a deployable tool for the entire research team.",
    techStack: ["Python", "PyTorch", "MaskRCNN", "Computer Vision"],
    cover_image: researchCover,
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
    category: "AI travel assistant",
    period: "Mar–Jun 2025",
    caption: "Oversea / Your AI travel companion",
    coverAlt: "A simple blue and sage green Earth on a warm ivory background",
    linkLabel: "Explore the code",
    date: 202506,
    shortDescription:
      "An AI travel assistant that turns your plans into personalized itineraries, taking weather, nearby activities, and real-time flight data into account.",
    description:
      "I developed Oversea as a full-stack AI travel assistant with a React interface, a Node.js and Express API, and a Python FastAPI service. GPT-4o and LangGraph coordinate multiple agents to personalize itineraries and optimize routes and activities around weather, proximity, and real-time flight data. The app brings trip planning, saved conversations, and real-time chat together in one place.",
    highlights: [
      {
        title: "Authentication",
        description: "Implemented stateless JWT authentication with 30-minute access tokens and refresh tokens backed by MongoDB and cookies, including automatic token rotation, logout revocation, and CSRF-resistant refresh flows.",
      },
      {
        title: "Data & performance",
        description: "Combined MongoDB for 100+ user records and chat histories with Redis caching using a one-hour TTL, reducing query latency by 80% and supporting 100+ concurrent secure sessions.",
      },
      {
        title: "Deployment & testing",
        description: "Containerized services with Docker and deployed to Google Kubernetes Engine. Automated CI/CD with GitHub Actions, ESLint, Pytest, and Jest to support 20+ weekly deployments.",
      },
    ],
    previewTechStack: ["React", "Node.js", "Python", "LangGraph", "FastAPI", "Redis"],
    techStack: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Python", "GPT-4o", "LangGraph", "FastAPI", "Socket.io", "JWT", "Redis", "Axios", "Docker", "Google Kubernetes Engine", "GitHub Actions", "ESLint", "Pytest", "Jest"],
    cover_image: overseaHome,
    images: [overseaHome, overseaItinerary, overseaChatroom, overseaLogin],
    imageDescriptions: [
      "Travel assistant home with saved conversations and the user profile menu.",
      "A conversation with the AI assistant generating a sample Paris itinerary.",
      "A real-time chatroom with room controls and a message composer.",
      "The sign-in screen with username and password fields and a sign-up link.",
    ],
    tag: ["All", "Web", "AI/ML"],
    gitUrl: "https://github.com/JasonL233/Oversea",
  },
  {
    id: 4,
    title: "CouchPotatoes",
    category: "Game development",
    period: "FEB-MAY 2025",
    caption: "CouchPotatoes / Meet the characters",
    coverAlt: "Six pixel-art potato characters from CouchPotatoes",
    linkLabel: "Watch the game",
    date: 202502,
    shortDescription:
      "A couch co-op party game full of potato-themed challenges and friendly competition.",
    description:
      "CouchPotatoes is an exciting couch co-op party game that brings friends and family together for endless fun and laughter. Players take on the role of energetic potatoes competing in various mini-games and challenges. The game features vibrant graphics, intuitive controls, and multiplayer gameplay perfect for parties and gatherings. With multiple game modes and increasingly difficult levels, CouchPotatoes offers hours of entertainment for players of all ages.",
    techStack: [
      "Unity",
      "C#",
      "Game Development",
      "Multiplayer",
      "2D Graphics",
    ],
    cover_image: potatoesCover,
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

function ProjectRow({ project, number }) {
  const [expanded, setExpanded] = useState(false);
  const title = project.displayTitle || project.title;

  return (
    <article className={styles.project} aria-labelledby={`project-${project.id}`}>
      <figure className={styles.figure}>
        <Image
          src={project.cover_image}
          alt={project.coverAlt}
          sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 50vw, 580px"
          className={styles.cover}
          priority={number === 1}
          placeholder="blur"
        />
        <figcaption>{project.caption}</figcaption>
      </figure>

      <div className={styles.copy}>
        <p className={styles.metadata}>
          <span className={styles.number}>{String(number).padStart(2, "0")}</span>
          {project.category} <span aria-hidden="true">·</span> {project.period}
        </p>
        <h2 id={`project-${project.id}`}>{title}</h2>
        <p className={styles.description}>{project.shortDescription}</p>
        <p className={styles.tech}>{(project.previewTechStack || project.techStack).join(" / ")}</p>
        <a className={styles.link} href={project.gitUrl} target="_blank" rel="noopener noreferrer">
          {project.linkLabel} <span aria-hidden="true">↗</span>
        </a>
      </div>

      <details className={styles.details} onToggle={(event) => setExpanded(event.currentTarget.open)}>
        <summary>
          <span className={styles.detailIndicator} aria-hidden="true" />
          {expanded ? "Close project details" : "About this project & gallery"}
          <span className="sr-only"> — {title}</span>
        </summary>
        {expanded && (
          <div className={styles.detailContent}>
            <div className={styles.story}>
              {project.displayTitle && <h3>{project.title}</h3>}
              <p>{project.description}</p>
              {project.highlights && (
                <ul className={styles.highlights}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight.title}>
                      <strong>{highlight.title}.</strong> {highlight.description}
                    </li>
                  ))}
                </ul>
              )}
              {project.previewTechStack && (
                <p className={styles.fullStack}><strong>Built with</strong><br />{project.techStack.join(" / ")}</p>
              )}
            </div>
            {project.images.length > 0 && (
              <ProjectGallery title={title} images={project.images} descriptions={project.imageDescriptions} />
            )}
          </div>
        )}
      </details>
    </article>
  );
}

export default function ProjectSection() {
  const [tag, setTag] = useState("All");
  const datedProjects = [...projectsData].sort((a, b) => b.date - a.date);
  const availableProjects = datedProjects.filter((project) => project.cover_image);
  const filteredProjects = availableProjects.filter((project) => project.tag.includes(tag));
  const upcomingProjects = datedProjects.filter((project) => !project.cover_image);

  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <h1 id="projects-heading" className="sr-only">Projects</h1>
      <div className={styles.filters} role="group" aria-label="Filter projects by category">
        {["All", "Web", "AI/ML", "Game Development"].map((category) => (
          <button key={category} type="button" aria-pressed={tag === category} onClick={() => setTag(category)}>
            {category === "All" ? "All projects" : category}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}{tag === "All" ? "" : ` in ${tag}`}
      </p>

      {filteredProjects.map((project) => (
        <ProjectRow key={project.id} project={project} number={availableProjects.indexOf(project) + 1} />
      ))}

      {tag === "All" && upcomingProjects.map((project) => (
        <div key={project.id} className={styles.upcoming}>
          <h2>{project.title}</h2>
          <p>{project.period} / Details to come</p>
        </div>
      ))}
    </section>
  );
}
