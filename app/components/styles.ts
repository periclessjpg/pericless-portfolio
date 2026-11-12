// Classes Tailwind réutilisées partout, pour garder un style cohérent.

/** Largeur maximale et marges latérales des pages. */
export const container = "mx-auto w-full max-w-[96rem] px-6 sm:px-8 md:px-16";

/** Contour bien visible quand on navigue au clavier (touche Tab). */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100";

/**
 * Style sobre du haut de page ("Concept Artist & Illustrator", "Menu") :
 * petites capitales espacées, en Geist. Réutilisé pour les titres des bandes de projets.
 */
export const label =
  "text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.3em]";

/**
 * Titres, dans le même style sobre que `label` (Geist, capitales espacées), en plus gros.
 * titleLarge : grand titre principal de chaque page.
 * titleMedium : titres secondaires (sections, cartes, bandes, légendes de l'accueil).
 */
export const titleLarge =
  "font-semibold uppercase leading-tight tracking-[0.12em] text-3xl sm:text-5xl md:text-6xl";
export const titleMedium =
  "font-semibold uppercase leading-snug tracking-[0.2em] text-base sm:text-lg md:text-xl";

/** Petit texte en capitales espacées (sur-titres, catégories). */
export const eyebrow = "text-xs uppercase tracking-[0.3em] text-neutral-500";
