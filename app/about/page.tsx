import Image from "next/image";
import Reveal from "../components/motion/Reveal";
import PageHeader from "../components/PageHeader";
import { container, eyebrow, focusRing } from "../components/styles";
import { isSvg } from "../data/projects";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "About Rayan Houstti: background, skills, software and experience.",
  path: "/about",
});

// ───────────── Contenu de la page (à remplacer) ─────────────

// Ton portrait : mets ta photo dans public/artworks/about/portrait.jpg,
// puis remplace src, alt, width et height ci-dessous.
const portrait = {
  src: "/placeholders/portrait-4x5.svg",
  alt: "[À REMPLACER] Portrait of Rayan Houstti",
  width: 1200,
  height: 1500,
};

const bio = [
  "[À REMPLACER] Paragraph 1: who you are, where you are based and what you do (concept art, illustration, graphic design).",
  "[À REMPLACER] Paragraph 2: your background, training and the projects or studios that shaped you.",
  "[À REMPLACER] Paragraph 3: what you are looking for now (studios, types of projects) and how to reach you.",
];

const skills = [
  "[À REMPLACER] Character design",
  "[À REMPLACER] Environment design",
  "[À REMPLACER] Illustration",
  "[À REMPLACER] Visual development",
];

const software = [
  "[À REMPLACER] Photoshop",
  "[À REMPLACER] Procreate",
  "[À REMPLACER] Blender",
];

const experience = [
  { role: "[À REMPLACER] Concept Artist", studio: "[À REMPLACER] Studio name", period: "[À REMPLACER] 2024 – Present" },
  { role: "[À REMPLACER] Illustrator", studio: "[À REMPLACER] Studio name", period: "[À REMPLACER] 2022 – 2024" },
];

// ─────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="About" title="[À REMPLACER] Hello, I'm Rayan Houstti." />

      <div className="grid gap-16 md:grid-cols-12 md:gap-12">
        {/* Portrait */}
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              unoptimized={isSvg(portrait.src)}
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Texte */}
        <Reveal delay={0.15} className="flex flex-col gap-16 md:col-span-6 md:col-start-7">
          <section aria-labelledby="bio-title">
            <h2 id="bio-title" className="sr-only">
              Biography
            </h2>
            <div className="flex flex-col gap-6 text-lg leading-relaxed text-neutral-300">
              {bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <a
              href="/cv.pdf"
              download
              className={`mt-10 inline-flex items-center gap-3 border border-neutral-700 px-6 py-3 text-sm text-neutral-100 transition-colors duration-300 hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 ${focusRing}`}
            >
              Download CV
              <span className="sr-only"> (PDF)</span>
            </a>
          </section>

          <div className="grid gap-12 sm:grid-cols-2">
            <ListSection id="skills" title="Skills" items={skills} />
            <ListSection id="software" title="Software" items={software} />
          </div>

          <section aria-labelledby="experience-title">
            <h2 id="experience-title" className="font-display text-3xl font-medium md:text-4xl">
              Experience
            </h2>
            <ul className="mt-6 border-t border-neutral-800">
              {experience.map((item) => (
                <li
                  key={`${item.role}-${item.studio}-${item.period}`}
                  className="flex flex-col gap-1 border-b border-neutral-800 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="text-neutral-100">{item.role}</p>
                    <p className="text-sm text-neutral-400">{item.studio}</p>
                  </div>
                  <p className={`${eyebrow} shrink-0`}>{item.period}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

function ListSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="font-display text-3xl font-medium md:text-4xl">
        {title}
      </h2>
      <ul className="mt-6 flex flex-col gap-2 text-neutral-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
