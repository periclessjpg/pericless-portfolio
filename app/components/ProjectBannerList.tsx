import Image from "next/image";
import Link from "next/link";
import BlurText from "./BlurText";
import { StaggerItem, StaggerList } from "./motion/Stagger";
import { titleMedium } from "./styles";

/** Une bande de la liste : une image, un titre et un type. */
export type BannerItem = {
  key: string;
  title: string;
  /** Texte en petit sous le titre (ex. nom du filtre). */
  kind: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Si présent, toute la bande est un lien vers cette adresse. */
  href?: string;
};

type Props = {
  items: BannerItem[];
  /** Précharge la première image (liste en haut de page). */
  preloadFirst?: boolean;
};

// Courbe douce commune aux effets de survol.
const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Liste en bandes pleine largeur (pages Concept Art et Illustration).
 * Chaque bande : l'image remplit toute la largeur (format panoramique,
 * recadrée au centre), avec le titre et le type écrits par-dessus, dans le
 * style sobre du haut de page.
 *
 * Survol ou focus clavier : les autres bandes s'estompent, l'image zoome
 * légèrement et le texte glisse vers la droite (écrans avec souris uniquement).
 */
export default function ProjectBannerList({ items, preloadFirst = false }: Props) {
  return (
    <StaggerList className="group/list flex flex-col gap-2">
      {items.map((item, index) => {
        // La bande s'estompe quand une autre bande est survolée ou sélectionnée.
        const rowClass = `group/row relative block aspect-video overflow-hidden bg-neutral-900 md:aspect-[21/9] transition-opacity duration-500 ${ease} group-hover/list:opacity-40 hover:opacity-100! group-has-[:focus-visible]/list:opacity-40 focus-visible:opacity-100!`;

        const content = (
          <>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1536px) 1408px, 100vw"
              preload={preloadFirst && index === 0}
              className={`object-cover transition-transform duration-700 ${ease} group-hover/row:scale-[1.03] group-focus-visible/row:scale-[1.03] motion-reduce:scale-100!`}
            />

            {/* Dégradé sombre en bas, pour que le texte reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent"
            />

            {/* Titre et type, par-dessus l'image */}
            <div
              className={`absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ${ease} sm:p-8 group-hover/row:translate-x-2.5 group-focus-visible/row:translate-x-2.5 motion-reduce:translate-none!`}
            >
              <BlurText as="h2" className={`${titleMedium} text-neutral-100`}>
                {item.title}
              </BlurText>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-400 sm:text-sm sm:tracking-[0.3em]">
                {item.kind}
              </p>
            </div>
          </>
        );

        return (
          <StaggerItem key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className={`${rowClass} focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100`}
              >
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
