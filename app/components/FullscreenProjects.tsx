import Image from "next/image";
import Link from "next/link";
import { isSvg, type Project } from "../data/projects";
import BlurText from "./BlurText";
import Reveal from "./motion/Reveal";
import { container, titleMedium } from "./styles";

type Props = {
  projects: Project[];
};

/**
 * Projets affichés en plein écran, les uns sous les autres (accueil).
 * Chaque image remplit toute la fenêtre : elle est recadrée au centre.
 * L'image entière reste visible sur la page du projet.
 */
export default function FullscreenProjects({ projects }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className="group relative block h-[85svh] w-full overflow-hidden bg-neutral-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100 md:h-svh"
          >
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="100vw"
              unoptimized={isSvg(project.cover.src)}
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />

            {/* Dégradé sombre en bas, pour que la légende reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-700 group-hover:opacity-100 md:opacity-80"
            />

            {/* Légende sur l'image : titre, catégorie et année, dans le style sobre du menu */}
            <div
              className={`${container} absolute inset-x-0 bottom-0 flex flex-col gap-2 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:pb-12`}
            >
              <BlurText as="h3" className={`${titleMedium} text-neutral-100`}>
                {project.title}
              </BlurText>
              <Reveal delay={0.3} className="shrink-0">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-500 group-hover:text-neutral-100 sm:text-sm sm:tracking-[0.3em]">
                  {project.category} · {project.year}
                </p>
              </Reveal>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
