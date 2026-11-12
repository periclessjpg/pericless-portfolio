import Image from "next/image";
import Link from "next/link";
import BlurText from "./BlurText";
import { LightboxProvider, LightboxTrigger } from "./Lightbox";
import { DevFramingSlot } from "./dev/DevSlots";
import { StaggerItem, StaggerList } from "./motion/Stagger";
import { titleMedium } from "./styles";

/** Une bande de la liste : une image, un titre et un type. */
export type BannerItem = {
  key: string;
  title: string;
  /** Texte en petit sous le titre (ex. nom du filtre). */
  kind: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Cadrage de l'image recadrée (ex. "50% 20%"), centre par défaut. */
  position?: string;
  /** Chemin de l'image dans public/artworks, pour le réglage du cadrage en mode édition local. */
  framingId?: string;
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
 * Grille d'images (pages Concept Art et Illustration) : deux par ligne sur
 * ordinateur, une sur mobile, au format 4:3 (recadrées selon leur cadrage),
 * avec le titre et le type écrits par-dessus, dans le style sobre du haut de page.
 *
 * Survol ou focus clavier : les autres bandes s'estompent, l'image zoome
 * légèrement et le texte glisse vers la droite (écrans avec souris uniquement).
 */
export default function ProjectBannerList({ items, preloadFirst = false }: Props) {
  // Visionneuse plein écran : toutes les images de la grille, dans le même ordre.
  const lightboxItems = items.map((item) => ({ ...item.image, title: item.title, kind: item.kind }));

  return (
    <LightboxProvider items={lightboxItems}>
      {/* Deux images par ligne sur ordinateur (une sur mobile), qui prennent ensemble toute la largeur. */}
      <StaggerList className="group/list grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((item, index) => {
          // La bande s'estompe quand une autre bande est survolée ou sélectionnée.
          const rowClass = `group/row relative block aspect-[4/3] overflow-hidden bg-neutral-900 transition-opacity duration-500 ${ease} group-hover/list:opacity-40 hover:opacity-100! group-has-[:focus-visible]/list:opacity-40 focus-visible:opacity-100!`;

          const content = (
            <>
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1536px) 704px, (min-width: 768px) 50vw, 100vw"
                preload={preloadFirst && index === 0}
                style={{ objectPosition: item.position }}
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
            <StaggerItem key={item.key} className="relative">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`${rowClass} focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100`}
                >
                  {content}
                </Link>
              ) : (
                // Clic : ouvre l'image en grand dans la visionneuse.
                <LightboxTrigger
                  index={index}
                  href={item.image.src}
                  className={`${rowClass} cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100`}
                >
                  {content}
                </LightboxTrigger>
              )}
              {/* Mode édition local : réglage du cadrage (posé à côté du lien, jamais dedans) */}
              {item.framingId && (
                <DevFramingSlot id={item.framingId} src={item.image.src} position={item.position} />
              )}
            </StaggerItem>
          );
        })}
      </StaggerList>
    </LightboxProvider>
  );
}
