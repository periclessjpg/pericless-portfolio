"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Réglages communs à toutes les animations du site.
 * reducedMotion="user" : si le visiteur a activé "réduire les animations"
 * dans son système, les mouvements sont supprimés (seuls les fondus restent).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
