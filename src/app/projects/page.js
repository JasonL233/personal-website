import ProjectSection from "../components/ProjectSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-transparent">
      <div className="ambient-background" aria-hidden="true" />
      <div className="z-10">
        <Navbar />
      </div>
      <div className="w-full mx-auto px-5 sm:px-12 z-10 flex-1">
        <ProjectSection />
      </div>
      <Footer />
    </main>
  );
}
