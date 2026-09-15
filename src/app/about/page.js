import HeroSection from "../components/HeroSection";
import GitHubStats from "../components/GitHubStats";
import PersonalActivity from "../components/PersonalActivity";
import AboutTabs from "../components/AboutTabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGithubStats } from "@/lib/githubStats.mjs";
import { getActivity } from "@/lib/getActivity.mjs";

export const metadata = { title: "About | Jason Lin", description: "About Jason Lin." };

// Regenerate this page (and therefore the numbers baked into its HTML) hourly, in the
// background - no visitor ever waits for it.
export const revalidate = 3600;

/**
 * Fetched here, on the server, rather than from the browser after hydration: the data is
 * already cached server-side, so reading it during render costs almost nothing and means the
 * cards arrive with real numbers in the HTML instead of flashing a loading state.
 *
 * Nothing here is allowed to break the page - a failing provider resolves to null/an error
 * status, and the client components fall back to fetching it themselves as they did before.
 */
async function loadInitialData() {
  const [github, leetcode, duolingo, league] = await Promise.all([
    getGithubStats().then((r) => (r.ok ? r.data : null)).catch(() => null),
    getActivity("leetcode").catch(() => null),
    getActivity("duolingo").catch(() => null),
    getActivity("league").catch(() => null),
  ]);

  return { github, activity: { leetcode, duolingo, league } };
}

export default async function AboutPage() {
  const { github, activity } = await loadInitialData();

  return (
    <main className="flex min-h-screen flex-col bg-transparent relative">
      <div className="ambient-background" aria-hidden="true" />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-14 sm:py-20">
          <HeroSection />

          <AboutTabs />

          <GitHubStats initialData={github} />

          <PersonalActivity initialData={activity} />
        </div>
        <Footer />
      </div>
    </main>
  );
}
