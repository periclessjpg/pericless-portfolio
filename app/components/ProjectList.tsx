import Image from "next/image";
import Link from "next/link";
import { isPublished, isSvg, type Project } from "../data/projects";
import BlurText from "./BlurText";
import { StaggerItem, StaggerList } from "./motion/Stagger";
import { focusRing, titleMedium } from "./styles";

type Props = {
  projects: Project[];
  /** Précharge la première vignette (liste en haut de page). */
  preloadFirst?: boolean;
};

// Courbe douce commune aux effets de survol.
const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Liste verticale de projets (pages Concept Art et Illustration).
 * Chaque rangée : petite vignette (jamais recadrée), titre en majuscules,
 * type de réalisation en dessous. Toute la rangée est un lien, sauf pour
 * un projet "wip" (travail en cours).
 *
 * Survol ou focus clavier d'une rangée : les autres s'estompent, la vignette
 * grossit et le titre glisse vers la droite. Ces effets de survol ne
 * s'appliquent que sur les écrans avec souris (pas sur mobile).
 */
export default function ProjectList({ projects, preloadFirst = false }: Props) {
  if (projects.length === 0) {
    return <p className="text-neutral-500">No projects yet.</p>;
  }

  return (
    <StaggerList className="group/list border-t border-neutral-800">
      {projects.map((project, index) => {
        const published = isPublished(project);

        // Classes de la rangée : s'estompe quand une autre rangée est survolée ou sélectionnée.
        const rowClass = `group/row flex items-center gap-5 py-6 sm:gap-8 md:py-8 transition-opacity duration-500 ${ease} group-hover/list:opacity-40 hover:opacity-100! group-has-[:focus-visible]/list:opacity-40 focus-visible:opacity-100!`;

        const content = (
          <>
            {/* Vignette : largeur fixe, hauteur selon le format de l'image */}
            <div className="w-[70px] shrink-0 sm:w-[100px] md:w-[140px]">
              <Image
                src={project.thumb.src}
                alt={project.thumb.alt}
                width={project.thumb.width}
                height={project.thumb.height}
                sizes="(min-width: 768px) 140px, (min-width: 640px) 100px, 70px"
                preload={preloadFirst && index === 0}
                unoptimized={isSvg(project.thumb.src)}
                className={`h-auto w-full bg-neutral-900 transition-transform duration-500 ${ease} group-hover/row:scale-110 group-focus-visible/row:scale-110 motion-reduce:scale-100!`}
              />
            </div>

            {/* Titre et type de réalisation */}
            <div
              className={`min-w-0 transition-transform duration-500 ${ease} group-hover/row:translate-x-2.5 group-focus-visible/row:translate-x-2.5 motion-reduce:translate-none!`}
            >
              <BlurText
                as="h2"
                className={`${titleMedium} text-neutral-100`}
              >
                {project.title}
              </BlurText>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:text-sm">
                {published ? project.kind : "Work in progress"}
              </p>
            </div>
          </>
        );

        return (
          <StaggerItem key={project.slug} className="border-b border-neutral-800">
            {published ? (
              <Link href={`/projects/${project.slug}`} className={`${rowClass} ${focusRing}`}>
                {content}
              </Link>
            ) : (
              <div className={rowClass}>{content}</div>
            )}
          </StaggerItem>
        );
      })}
    </StaggerList>
  );
}
