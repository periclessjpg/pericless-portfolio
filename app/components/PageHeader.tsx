import type { ReactNode } from "react";
import Reveal from "./motion/Reveal";
import { eyebrow } from "./styles";

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
      <Reveal>
        {label && <p className={`mb-6 ${eyebrow}`}>{label}</p>}
        <h1 className="font-display text-5xl font-medium leading-none tracking-tight sm:text-6xl md:text-8xl">
          {title}
        </h1>
      </Reveal>
      {children && (
        <Reveal delay={0.15} className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
          {children}
        </Reveal>
      )}
    </header>
  );
}
