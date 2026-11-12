import Image from "next/image";
import Link from "next/link";
import BlurText from "./BlurText";
import { StaggerItem, StaggerList } from "./motion/Stagger";
import { label, titleMedium } from "./styles";

/** Une carte : un titre, une adresse et une image (facultative). */
export type SectionCard = {
  key: string;
  href: string;
  title: string;
  /** Image de la carte ; si absente (dossier vide), la carte affiche "Coming soon". */
  image?: { src: string; alt: string; width: number; height: number };
};

type Props = {
  cards: SectionCard[];
};

/**
 * Grandes cartes cliquables (pages Concept Art et Illustration) : une image
 * au format 4:5, avec le titre en bas. Chaque carte mène à sa sous-page.
 */
export default function SectionCards({ cards }: Props) {
  return (
    <StaggerList className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {cards.map((card, index) => (
        <StaggerItem key={card.key}>
          <Link
            href={card.href}
            className="group relative block aspect-[4/5] overflow-hidden bg-neutral-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-neutral-100"
          >
            {card.image ? (
              <Image
                src={card.image.src}
                alt={card.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                preload={index === 0}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
              />
            ) : (
              <p className={`${label} absolute inset-0 flex items-center justify-center text-neutral-600`}>
                Coming soon
              </p>
            )}

            {/* Dégradé sombre en bas, pour que le titre reste lisible sur toutes les images */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <BlurText as="h2" className={`${titleMedium} text-neutral-100`}>
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
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
