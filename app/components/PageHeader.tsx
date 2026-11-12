import type { ReactNode } from "react";
import { editable, shown, type TextKey } from "../lib/texts-defaults";
import BlurText from "./BlurText";
import Reveal from "./motion/Reveal";
import { eyebrow, titleLarge } from "./styles";

type Props = {
  /** Petit sur-titre au-dessus du titre (facultatif). */
  label?: string;
  title: string;
  /** Courte introduction (texte simple, retours à la ligne gardés). */
  intro?: string;
  /** Identifiants des textes, pour les modifier en mode édition local. */
  keys?: { label?: TextKey; title?: TextKey; intro?: TextKey };
  children?: ReactNode;
};

/** En-tête commun des pages : sur-titre, grand titre, courte introduction. */
export default function PageHeader({ label, title, intro, keys = {}, children }: Props) {
  const labelText = label !== undefined && keys.label ? shown(label) : label;
  const introText = intro !== undefined && keys.intro ? shown(intro) : intro;

  return (
    <header className="mb-16 max-w-4xl md:mb-24">
      {labelText && (
        <Reveal>
          <p className={`mb-6 ${eyebrow}`} {...(keys.label ? editable(keys.label) : {})}>
            {labelText}
          </p>
        </Reveal>
      )}
      <BlurText as="h1" delay={0.1} textKey={keys.title} className={`${titleLarge} text-neutral-100`}>
        {title}
      </BlurText>
      {introText && (
        <Reveal delay={0.3} className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
          <p className="whitespace-pre-line" {...(keys.intro ? editable(keys.intro) : {})}>
            {introText}
          </p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.3} className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
          {children}
        </Reveal>
      )}
    </header>
  );
}
