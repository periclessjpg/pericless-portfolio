import Image from "next/image";
import Link from "next/link";
import { isSvg, type Project } from "../data/projects";
import { focusRing } from "./styles";

type Props = {
  project: Project;
  /** Indique au navigateur la largeur affichée de l'image, pour charger la bonne taille. */
  sizes: string;
  /** Niveau de titre selon la page (h2 ou h3), pour une structure accessible. */
  headingLevel?: "h2" | "h3";
  /** true seulement pour la première image visible en haut de la page. */
  preload?: boolean;
};

/**
 * Vignette d'un projet : image au format 4:3 (recadrée au centre),
 * puis titre, catégorie et année. Sur la page du projet, l'image s'affiche en entier.
 */
export default function ProjectCard({
  project,
  sizes,
  headingLevel: Heading = "h3",
  preload = false,
}: Props) {
  return (
    <article>
      <Link href={`/projects/${project.slug}`} className={`group block ${focusRing}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={sizes}
            preload={preload}
            unoptimized={isSvg(project.cover.src)}
            // Léger zoom au survol (1.03), long et doux ; désactivé si "réduire les animations".
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
          />
        </div>

        <div className="mt-4 flex items-start justify-between gap-6 border-t border-neutral-800 pt-4 transition-colors duration-500 group-hover:border-neutral-400 group-focus-visible:border-neutral-400">
          <div>
            <Heading className="font-display text-2xl leading-tight text-neutral-300 transition-colors duration-500 group-hover:text-neutral-100 group-focus-visible:text-neutral-100 md:text-3xl">
              {project.title}
            </Heading>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors duration-500 group-hover:text-neutral-300">
              {project.category}
            </p>
          </div>
          <p className="shrink-0 pt-1 text-sm tabular-nums text-neutral-500 transition-colors duration-500 group-hover:text-neutral-300">
            {project.year}
          </p>
        </div>
      </Link>
    </article>
  );
}
