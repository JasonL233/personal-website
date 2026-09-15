import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = { title: "Experience | Jason Lin", description: "Jason Lin’s research and development experience." };

export default function ExperiencePage() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-14 sm:py-20">
        <p className="text-xs tracking-[.2em] text-[var(--muted)] mb-4">LEARNING BY BUILDING</p>
        <h1 className="text-5xl sm:text-6xl font-serif tracking-tight text-[var(--foreground)] mb-5">Experience</h1>
        <p className="text-[var(--muted)] text-lg mb-14">Putting curiosity into practice.</p>
        <article className="border-t border-[var(--border)] pt-8 grid sm:grid-cols-[130px_1fr] gap-6">
          <div className="text-sm text-[var(--muted)]">2024<span className="block text-xs mt-2 tracking-widest">RESEARCH</span></div>
          <div>
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-4">Huntington Medical Research Institutes</h2>
            <p className="font-medium text-[var(--muted)] mb-5">Deep learning for cardiac image analysis</p>
            <div className="text-[var(--muted)] leading-relaxed space-y-4">
              <p>I developed a machine learning tool to analyze heart images and measure affected tissue, streamlining a process previously performed manually in ImageJ.</p>
              <p>The work covered risk-zone, infarct, and no-reflow segmentation. I built a web tool for mask generation and data augmentation, then trained segmentation models on the original and augmented datasets.</p>
            </div>
            <ul className="flex flex-wrap gap-2 mt-6 text-xs text-[var(--muted)]" aria-label="Technologies used">
              {["Python", "PyTorch", "Mask R-CNN", "Computer Vision"].map(technology => <li key={technology} className="px-3 py-2 rounded-full bg-[var(--soft)]">{technology}</li>)}
            </ul>
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-[var(--accent)]">
              <a href="/images/projects/project2/poster.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[var(--accent)]">View research poster ↗</a>
              <Link href="/projects" className="underline underline-offset-4 hover:text-[var(--accent)]">Explore my projects →</Link>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}
