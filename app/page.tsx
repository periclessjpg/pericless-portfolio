import Link from "next/link";
import Reveal from "./components/motion/Reveal";
import FullscreenProjects from "./components/FullscreenProjects";
import ScrollIndicator from "./components/ScrollIndicator";
import { container, eyebrow, focusRing } from "./components/styles";
import { getFeaturedProjects } from "./data/projects";
import { site } from "./data/site";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      {/* HERO : accroche (ton nom est affiché en haut à gauche) */}
      <section
        aria-labelledby="hero-title"
        className={`${container} flex min-h-svh flex-col justify-end pb-12 pt-32 md:pb-16`}
      >
        <div className="flex flex-1 flex-col justify-center">
          {/* Titre invisible à l'écran, lu par Google et les lecteurs d'écran */}
          <h1 id="hero-title" className="sr-only">
            {site.name}, {site.title}
          </h1>
          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg text-neutral-400">{site.tagline}</p>
          </Reveal>
        </div>
        <Reveal delay={0.5}>
          <ScrollIndicator targetId="selected-works" />
        </Reveal>
      </section>

      {/* SELECTED WORKS : 6 projets mis en avant (featured: true), en plein écran */}
      <section
        id="selected-works"
        aria-labelledby="selected-works-title"
        className="scroll-mt-24 pt-24 md:pt-32"
      >
        <Reveal className={`${container} mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16`}>
          <div>
            <p className={eyebrow}>Portfolio</p>
            <h2
              id="selected-works-title"
              className="mt-4 font-display text-5xl font-medium tracking-tight md:text-7xl"
            >
              Selected Works
            </h2>
          </div>
          <Link
            href="/projects"
            className={`text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
          >
            View all projects
          </Link>
        </Reveal>
        <FullscreenProjects projects={featured} />
      </section>

      {/* VISION : court texte + lien vers About */}
      <section
        aria-labelledby="vision-title"
        className={`${container} pt-32 md:pt-48`}
      >
        <Reveal className="grid gap-8 md:grid-cols-12">
          <h2
            id="vision-title"
            className="font-display text-5xl font-medium tracking-tight md:col-span-4 md:text-7xl"
          >
            Vision
          </h2>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-xl leading-relaxed text-neutral-300 md:text-2xl md:leading-relaxed">
              {site.vision}
            </p>
            <Link
              href="/about"
              className={`mt-10 inline-block text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
            >
              More about me
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
