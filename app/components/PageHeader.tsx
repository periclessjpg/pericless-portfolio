import type { ReactNode } from "react";
import BlurText from "./BlurText";
import Reveal from "./motion/Reveal";
import { eyebrow, titleLarge } from "./styles";

type Props = {
  /** Petit sur-titre au-dessus du titre (facultatif). */
  label?: string;
  title: string;
  children?: ReactNode;
};

/** En-tête commun des pages : sur-titre, grand titre, courte introduction. */
export default function PageHeader({ label, title, children }: Props) {
  return (
    <header className="mb-16 max-w-4xl md:mb-24">
      {label && (
        <Reveal>
          <p className={`mb-6 ${eyebrow}`}>{label}</p>
        </Reveal>
      )}
      <BlurText
        as="h1"
        delay={0.1}
        className={`${titleLarge} text-neutral-100`}
      >
        {title}
      </BlurText>
      {children && (
        <Reveal delay={0.3} className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
          {children}
        </Reveal>
      )}
    </header>
  );
}
