import Image from "next/image";
import type { ReactNode } from "react";
import type { Artwork } from "../lib/artworks";
import BlurText from "./BlurText";
import { StaggerItem, StaggerList } from "./motion/Stagger";
import { titleMedium } from "./styles";

type Props = {
  artworks: Artwork[];
  /** Précharge la première image (grille en haut de page). */
  preloadFirst?: boolean;
  /** Affiche le titre et le type sous chaque image. */
  captions?: boolean;
  /** Éléments posés sur chaque image (outils du mode édition local, page About). */
  tools?: (artwork: Artwork) => ReactNode;
};

/**
 * Grille simple d'œuvres : chaque image garde son format réel (jamais recadrée),
 * disposée en colonnes (1 sur mobile, 2 puis 3 sur grand écran).
 */
export default function ArtworkGrid({ artworks, preloadFirst = false, captions = true, tools }: Props) {
  return (
    <StaggerList className="columns-1 gap-8 sm:columns-2 lg:columns-3">
      {artworks.map((artwork, index) => (
        <StaggerItem key={artwork.id} className="mb-12 break-inside-avoid">
          <figure>
            <div className="relative">
              <Image
                src={artwork.src}
                alt={artwork.alt}
                width={artwork.width}
                height={artwork.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                preload={preloadFirst && index === 0}
                className="h-auto w-full bg-neutral-900"
              />
              {tools?.(artwork)}
            </div>
            {captions && (
              <figcaption className="mt-4">
                <BlurText as="h3" className={`${titleMedium} text-neutral-100`}>
                  {artwork.title}
                </BlurText>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {artwork.kind}
                  {artwork.year ? ` · ${artwork.year}` : ""}
                </p>
              </figcaption>
            )}
          </figure>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
