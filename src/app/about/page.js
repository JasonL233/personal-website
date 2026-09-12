import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmailSection from "../components/EmailSection";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-transparent relative">
      <div className="ambient-background" aria-hidden="true" />
      <div className="relative z-10">
        <Navbar />
        <div className="container mt-10 mx-auto px-5 sm:px-12 py-4">
          <h1 className="text-5xl text-center font-bold text-black mb-8">
            About Me
          </h1>
          <HeroSection />
          <EmailSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
