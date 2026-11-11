"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { duration, easeOut, offsetY } from "./easing";

type Props = {
  children: ReactNode;
  /** Délai avant l'apparition, en secondes (ex. 0.1). */
  delay?: number;
  className?: string;
};

/**
 * Fait apparaître son contenu en fondu, avec un léger glissement vers le haut,
 * quand il entre dans l'écran. L'animation ne se joue qu'une seule fois.
 */
export default function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}
