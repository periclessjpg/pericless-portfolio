import Image from "next/image";
import Link from "next/link";
import type { ConceptArtSection } from "../data/concept-art";
import { isSvg } from "../data/projects";
import BlurText from "./BlurText";
import { StaggerItem, StaggerList } from "./motion/Stagger";

type Props = {
  sections: ConceptArtSection[];
};

/**
 * Grandes cartes cliquables (page Concept Art) : une image au format 4:5,
 * avec le titre en bas. Chaque carte mène à sa sous-page.
 */
export default function SectionCards({ sections }: Props) {
  return (
    <StaggerList className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {sections.map((section, index) => (
        <StaggerItem key={section.slug}>
          <Link
            href={`/concept-art/${section.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-neutral-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100"
          >
            <Image
              src={section.image.src}
              alt={section.image.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              preload={index === 0}
              unoptimized={isSvg(section.image.src)}
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />

            {/* Dégradé sombre en bas, pour que le titre reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <BlurText
                as="h2"
                className="font-display text-4xl font-medium uppercase leading-none tracking-tight text-neutral-100 sm:text-5xl"
              >
                {section.title}
              </BlurText>
              <span
                aria-hidden="true"
                className="pb-1 text-neutral-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-neutral-100 motion-reduce:translate-none!"
              >
                →
              </span>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
