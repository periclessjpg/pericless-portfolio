import Image from "next/image";
import Link from "next/link";
import { getTexts } from "../lib/texts";
import type { TextKey } from "../lib/texts-defaults";
import BlurText from "./BlurText";
import type { DevCardPickerProps } from "./dev/DevCardPicker";
import { DevCardPickerSlot, DevFramingSlot } from "./dev/DevSlots";
import { DealtItem, DealtList } from "./motion/Deal";
import { label, titleMedium } from "./styles";

/** Une carte : un titre, une adresse et une image (facultative). */
export type SectionCard = {
  key: string;
  href: string;
  title: string;
  /** Identifiant du titre, s'il est modifiable en mode édition local (carte "All"). */
  titleKey?: TextKey;
  /** Image de la carte ; si absente (dossier vide), la carte affiche "Coming soon". */
  image?: { src: string; alt: string; width: number; height: number };
  /** Cadrage de l'image recadrée (ex. "50% 20%"), centre par défaut. */
  position?: string;
  /** Chemin de l'image dans public/artworks, pour le réglage du cadrage en mode édition local. */
  framingId?: string;
  /** Choix de l'image de la carte (mode édition local). */
  picker?: DevCardPickerProps;
};

type Props = {
  cards: SectionCard[];
  /** true : cartes centrées, à une taille qui tient entièrement dans la hauteur de la fenêtre. */
  fitScreen?: boolean;
};

/**
 * Grandes cartes cliquables (pages Concept Art et Illustration) : image pleine au
 * format 4:5, coins arrondis, fine bordure, ombre ; elles arrivent comme des cartes
 * distribuées et se soulèvent au survol. Chaque carte mène à sa sous-page.
 */
export default function SectionCards({ cards, fitScreen = false }: Props) {
  const t = getTexts();
  return (
    <DealtList
      className={
        fitScreen
          ? // Cartes centrées ; sur ordinateur, largeur limitée pour que leur hauteur (format 4:5) tienne dans la fenêtre.
            "flex w-full flex-wrap justify-center gap-6 md:gap-8"
          : "grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
      }
    >
      {cards.map((card, index) => (
        <DealtItem
          key={card.key}
          index={index}
          className={
            fitScreen
              ? "relative w-full md:w-[min(calc((100%_-_4rem)/3),calc((100svh_-_15rem)*0.8))]"
              : "relative"
          }
        >
          <Link
            href={card.href}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.85)] transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-white/25 hover:shadow-[0_40px_70px_-24px_rgba(0,0,0,0.95)] focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
          >
            {card.image ? (
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                preload={index === 0}
                style={{ objectPosition: card.position }}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
              />
            ) : (
              <p className={`${label} absolute inset-0 flex items-center justify-center text-neutral-600`}>
                {t["common.comingSoon"]}
              </p>
            )}

            {/* Dégradé sombre en bas, pour que le titre reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <BlurText as="h2" textKey={card.titleKey} className={`${titleMedium} text-neutral-100`}>
                {card.title}
              </BlurText>
              <span
                aria-hidden="true"
                className="pb-1 text-neutral-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-neutral-100 motion-reduce:translate-none!"
              >
                →
              </span>
            </div>
          </Link>
          {/* Mode édition local : choix de l'image et cadrage (posés à côté du lien, jamais dedans) */}
          {card.picker && <DevCardPickerSlot {...card.picker} />}
          {card.image && card.framingId && (
            <DevFramingSlot id={card.framingId} src={card.image.src} position={card.position} />
          )}
        </DealtItem>
      ))}
    </DealtList>
  );
}
