"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useId, useRef, useState } from "react";
import { editable, type TextKey } from "../lib/texts-defaults";
import { easeOut, titleReveal } from "./motion/easing";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

type Props = {
  /** Le texte à afficher (texte simple uniquement). */
  children: string;
  /** Balise HTML utilisée : h1, h2, h3, p ou span. */
  as?: Tag;
  className?: string;
  /** Délai avant le début de l'animation (en secondes). */
  delay?: number;
  /** Écart entre deux mots (en secondes). */
  stagger?: number;
  /** true : l'animation ne se joue qu'une seule fois. */
  once?: boolean;
  id?: string;
  /** Identifiant du texte : le rend modifiable en mode édition local. */
  textKey?: TextKey;
  /** Durée du fondu de chaque mot, en secondes (par défaut : réglage titleReveal). */
  duration?: number;
};

/** Fondu d'un mot ; durée réglable par titre. */
const wordVariants = (duration: number): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration, ease: easeOut } },
});

/**
 * Titre qui apparaît mot par mot, en fondu, traversé d'un léger bruit (grain)
 * qui se dissipe jusqu'au texte net. Réglages dans motion/easing.ts (titleReveal).
 *
 * - Le texte complet reste lisible par Google et les lecteurs d'écran
 *   (span invisible) ; les mots animés sont cachés pour eux (aria-hidden).
 * - Chaque mot est un bloc insécable : les retours à la ligne sont identiques
 *   à ceux d'un titre normal.
 * - Se déclenche quand le titre entre dans l'écran (donc dès le chargement
 *   pour un titre en haut de page).
 * - Le bruit est un filtre SVG retiré dès la fin de l'animation.
 * - "Réduire les animations" activé : le texte s'affiche net immédiatement.
 */
export default function BlurText({
  children,
  as = "h2",
  className,
  delay = 0,
  stagger = titleReveal.stagger,
  once = true,
  id,
  textKey,
  duration = titleReveal.duration,
}: Props) {
  const Tag = motion[as];
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -10% 0px" });
  // Le filtre de bruit n'est actif que pendant l'animation (meilleures performances ensuite).
  const [animating, setAnimating] = useState(true);
  const filterId = `noise-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const found = children.split(/\s+/).filter(Boolean);
  // Texte vide : rien sur le site publié ; en mode édition local, un repère cliquable.
  if (found.length === 0 && !(process.env.NODE_ENV === "development" && textKey)) return null;
  const words = found.length > 0 ? found : ["(empty)"];

  return (
    <Tag
      ref={ref}
      id={id}
      {...(textKey ? editable(textKey) : {})}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      <span className="sr-only">{children}</span>

      {/* Filtre de bruit : déforme légèrement le texte, puis s'efface */}
      {animating && (
        <svg aria-hidden="true" width="0" height="0" className="absolute">
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={titleReveal.grain}
              numOctaves={2}
              result="noise"
            />
            <motion.feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              xChannelSelector="R"
              yChannelSelector="G"
              initial={{ attrScale: titleReveal.noise }}
              animate={{ attrScale: inView ? 0 : titleReveal.noise }}
              transition={{
                duration: titleReveal.noiseDuration * (duration / titleReveal.duration) + stagger * words.length,
                delay,
                ease: easeOut,
              }}
              // Bruit entièrement dissipé : on retire le filtre.
              onAnimationComplete={() => {
                if (inView) setAnimating(false);
              }}
            />
          </filter>
        </svg>
      )}

      <span
        aria-hidden="true"
        className="motion-reduce:filter-none!"
        style={animating ? { filter: `url(#${filterId})` } : undefined}
      >
        {words.map((text, index) => (
          <span key={index}>
            <motion.span
              variants={wordVariants(duration)}
              className="inline-block motion-reduce:opacity-100!"
              style={{ willChange: animating ? "opacity" : "auto" }}
            >
              {text}
            </motion.span>
            {/* Vrai espace entre les mots : les lignes se coupent normalement */}
            {index < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
