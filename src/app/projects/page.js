import ProjectSection from "../components/ProjectSection";
import EmailSection from "../components/EmailSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-transparent">
      <div className="ambient-background" aria-hidden="true" />
      <div className="z-10">
        <Navbar />
      </div>
      <div className="container mt-10 mx-auto px-5 sm:px-12 py-4 z-10">
        <ProjectSection />
        <EmailSection />
      </div>
      <Footer />
    </main>
  );
}
