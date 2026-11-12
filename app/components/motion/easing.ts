// Réglages des animations, à un seul endroit.

/** Courbe douce : démarre vite, ralentit longuement à la fin. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Durée standard des apparitions (en secondes). */
export const duration = 0.8;

/** Distance du léger glissement vers le haut (en pixels). */
export const offsetY = 24;

/**
 * Effet "flou vers net" des titres (composant BlurText).
 * Change ces valeurs ici : tous les titres du site suivent.
 */
export const blurText = {
  /** Durée d'apparition de chaque mot (en secondes). */
  duration: 0.8,
  /** Flou de départ (en pixels). */
  blur: 12,
  /** Décalage vertical de départ (en pixels, vers le bas). */
  offsetY: 14,
  /** Écart par défaut entre deux mots (en secondes). */
  stagger: 0.06,
};
