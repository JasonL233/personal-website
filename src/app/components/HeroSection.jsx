import React from 'react'
import Image from "next/image"
import Link from "next/link"

const HeroSection = () => {
  return (
    <section className="lg:py-8 mb-10">
        <div className="grid gap-8 md:grid-cols-[280px_1fr] md:items-start">
            {/* Sticky within the grid row: the photo rides along as you scroll, stopping once
                it reaches the bottom of the text column beside it (same as the reference). */}
            <div className="mx-auto md:mx-0 md:sticky md:top-24 md:self-start relative w-[240px] h-[360px] sm:w-[280px] sm:h-[420px] shrink-0 overflow-hidden rounded-2xl">
                <Image
                    src="/images/Me.jpg"
                    alt="Jason Lin"
                    priority
                    fill
                    sizes="(min-width: 768px) 280px, 240px"
                    className="scale-[1.6] object-cover origin-[32%_38%]"
                />
            </div>

            <div>
                <p className="text-xs tracking-[.2em] text-[var(--muted)] mb-4">GET TO KNOW ME</p>
                <h1 className="text-5xl sm:text-6xl font-serif tracking-tight text-[var(--foreground)] mb-6">
                    About Me
                </h1>

                <div className="max-w-2xl space-y-5 text-lg font-medium font-[Poppins] text-[var(--foreground)]">
                    <p>
                        Hello, I&apos;m Jason Lin! I&apos;m currently a{" "}
                        <span className="font-semibold text-[var(--accent)]">computer science undergraduate at UCLA&apos;s Henry Samueli School of Engineering and Applied Science</span>.
                        {" "}I&apos;m originally from <span className="font-semibold text-[var(--accent)]">Guangzhou, China</span>, and I speak{" "}
                        <mark className="bg-[var(--highlight)] text-[var(--highlight-ink)] px-1.5 py-0.5 rounded-md font-semibold">Cantonese, Mandarin, and English</mark>.
                    </p>

                    <p>
                        I&apos;m passionate about building{" "}
                        <span className="font-semibold text-[var(--accent)]">end-to-end full-stack projects</span>, especially products where I can see how my work directly interacts with users and improves their experience. Check them out in the{" "}
                        <Link href="/projects" className="font-semibold text-[var(--accent)] underline underline-offset-4 decoration-1 hover:text-[var(--accent)]">
                            Projects section
                        </Link>! I&apos;m also fascinated by the potential of{" "}
                        <span className="font-semibold text-[var(--accent)]">AI</span>—not only for building robust and intelligent products, but also as a tool for expressing my inner world, just like{" "}
                        <mark className="bg-[var(--highlight)] text-[var(--highlight-ink)] px-1.5 py-0.5 rounded-md font-semibold">this portfolio!</mark>
                    </p>

                    <p>
                        Outside of coding, I enjoy playing <span className="font-semibold text-[var(--accent)]">video games and piano</span>, and I love exploring{" "}
                        <span className="font-semibold text-[var(--accent)]">fashion</span>. Recently, I&apos;ve picked up{" "}
                        <span className="font-semibold text-[var(--accent)]">snowboarding and indoor rock climbing</span>. I also love traveling—I&apos;ve visited{" "}
                        <mark className="bg-[var(--highlight)] text-[var(--highlight-ink)] px-1.5 py-0.5 rounded-md font-semibold">nine countries</mark>{" "}
                        and enjoy both experiencing city life and exploring nature.
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
