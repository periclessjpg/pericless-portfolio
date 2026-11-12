// Réglages des animations, à un seul endroit.

/** Courbe douce : démarre vite, ralentit longuement à la fin. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Durée standard des apparitions (en secondes). */
export const duration = 0.8;

/** Distance du léger glissement vers le haut (en pixels). */
export const offsetY = 24;

/**
 * Effet d'apparition des titres (composant BlurText) : fondu avec un léger
 * bruit (grain) qui se dissipe jusqu'au texte net.
 * Change ces valeurs ici : tous les titres du site suivent.
 */
export const titleReveal = {
  /** Durée du fondu de chaque mot (en secondes). */
  duration: 0.9,
  /** Intensité du bruit au départ (0 = aucun bruit ; 8 à 20 = sobre). */
  noise: 14,
  /** Durée pendant laquelle le bruit se dissipe (en secondes). */
  noiseDuration: 1.2,
  /** Finesse du grain (plus grand = grain plus fin). */
  grain: 0.9,
  /** Écart par défaut entre deux mots (en secondes). */
  stagger: 0.06,
};
