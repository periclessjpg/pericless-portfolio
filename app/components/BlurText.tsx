"use client";

import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { blurText, easeOut } from "./motion/easing";

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
};

const word: Variants = {
  hidden: { opacity: 0, filter: `blur(${blurText.blur}px)`, y: blurText.offsetY },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: blurText.duration, ease: easeOut },
  },
};

/**
 * Titre qui apparaît mot par mot, du flou vers le net.
 *
 * - Le texte complet reste lisible par Google et les lecteurs d'écran
 *   (span invisible) ; les mots animés sont cachés pour eux (aria-hidden).
 * - Chaque mot est un bloc insécable : les retours à la ligne sont identiques
 *   à ceux d'un titre normal.
 * - Se déclenche quand le titre entre dans l'écran (donc dès le chargement
 *   pour un titre en haut de page).
 * - "Réduire les animations" activé : le texte s'affiche net immédiatement.
 */
export default function BlurText({
  children,
  as = "h2",
  className,
  delay = 0,
  stagger = blurText.stagger,
  once = true,
  id,
}: Props) {
  const Tag = motion[as];
  // will-change seulement pendant l'animation (meilleures performances ensuite).
  const [animating, setAnimating] = useState(true);
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      onAnimationComplete={() => setAnimating(false)}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((text, index) => (
          <span key={index}>
            <motion.span
              variants={word}
              className="inline-block motion-reduce:transform-none! motion-reduce:opacity-100! motion-reduce:filter-none!"
              style={{ willChange: animating ? "transform, opacity, filter" : "auto" }}
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
