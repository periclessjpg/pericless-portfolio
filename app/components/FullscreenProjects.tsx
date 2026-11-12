import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "../lib/artworks";
import BlurText from "./BlurText";
import { DevFramingSlot } from "./dev/DevSlots";
import Reveal from "./motion/Reveal";
import { container, titleMedium } from "./styles";

type Props = {
  artworks: Artwork[];
};

/**
 * Œuvres affichées en plein écran, les unes sous les autres (accueil,
 * images du dossier public/artworks/home/). Chaque image remplit toute la
 * fenêtre : elle est recadrée (au centre, ou selon le cadrage de infos.json).
 * Si l'image a un lien ("link" dans infos.json), toute l'image est cliquable.
 */
export default function FullscreenProjects({ artworks }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {artworks.map((artwork) => {
        const boxClass =
          "group relative block h-[85svh] w-full overflow-hidden bg-neutral-900 md:h-svh focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100";

        const content = (
          <>
            <Image
              src={artwork.src}
              alt={artwork.alt}
              fill
              sizes="100vw"
              style={{ objectPosition: artwork.position }}
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />

            {/* Dégradé sombre en bas, pour que la légende reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent transition-opacity duration-700 group-hover:opacity-100 md:opacity-80"
            />

            {/* Légende sur l'image : titre (et année si indiquée dans infos.json) */}
            <div
              className={`${container} absolute inset-x-0 bottom-0 flex flex-col gap-2 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:pb-12`}
            >
              <div className="flex items-end gap-4">
                <BlurText as="h3" className={`${titleMedium} text-neutral-100`}>
                  {artwork.title}
                </BlurText>
                {artwork.link && (
                  <span
                    aria-hidden="true"
                    className="pb-0.5 text-neutral-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-neutral-100 motion-reduce:translate-none!"
                  >
                    →
                  </span>
                )}
              </div>
              {artwork.year && (
                <Reveal delay={0.3} className="shrink-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-500 group-hover:text-neutral-100 sm:text-sm sm:tracking-[0.3em]">
                    {artwork.year}
                  </p>
                </Reveal>
              )}
            </div>
          </>
        );

        return (
          <li key={artwork.id} className="relative">
            {artwork.link ? (
              <Link href={artwork.link} className={boxClass}>
                {content}
              </Link>
            ) : (
              <div className={boxClass}>{content}</div>
            )}
            {/* Mode édition local : réglage du cadrage (posé à côté du lien, jamais dedans) */}
            <DevFramingSlot id={artwork.id} src={artwork.src} position={artwork.position} />
          </li>
        );
      })}
    </ul>
  );
}
