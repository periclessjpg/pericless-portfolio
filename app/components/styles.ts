// Classes Tailwind réutilisées partout, pour garder un style cohérent.
// (Les classes sont écrites en entier : Tailwind ne génère que celles qu'il trouve telles quelles.)

/** Largeur maximale et marges latérales des pages. */
export const container = "mx-auto w-full max-w-[96rem] px-6 sm:px-8 md:px-16";

/** Contour bien visible quand on navigue au clavier (touche Tab). */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100";

// ───────────── Typographie par rôle ─────────────
// Police, graisse, taille, espacement et capitales viennent des variables CSS --type-<rôle>-…
// (réglages de content/typography.json, panneau "Typography" en mode édition local).
// Les valeurs de secours reproduisent le style d'origine (Geist, capitales espacées).

/**
 * Rôle "Header & menu" (ui) : haut de page ("Concept Artist & Illustrator", "Menu"),
 * liens du menu, "Back", légendes des bandes. Petites capitales espacées par défaut.
 */
export const label =
  "[font-family:var(--type-ui-family,var(--font-geist-sans))] [font-weight:var(--type-ui-weight,600)] [text-transform:var(--type-ui-transform,uppercase)] [letter-spacing:var(--type-ui-tracking,0.2em)] sm:[letter-spacing:calc(var(--type-ui-tracking,0.2em)*1.5)] text-[length:calc(0.75rem*var(--type-ui-scale,1))] sm:text-[length:calc(0.875rem*var(--type-ui-scale,1))] leading-[1.4]";

/**
 * Rôle "Page titles" (display) : grand titre principal de chaque page.
 * Même style sobre que `label` par défaut, en plus gros.
 */
export const titleLarge =
  "[font-family:var(--type-display-family,var(--font-geist-sans))] [font-weight:var(--type-display-weight,600)] [text-transform:var(--type-display-transform,uppercase)] [letter-spacing:var(--type-display-tracking,0.12em)] text-[length:calc(1.875rem*var(--type-display-scale,1))] sm:text-[length:calc(3rem*var(--type-display-scale,1))] md:text-[length:calc(3.75rem*var(--type-display-scale,1))] leading-tight";

/** Rôle "Secondary titles" (heading) : sections, cartes, bandes, légendes de l'accueil. */
export const titleMedium =
  "[font-family:var(--type-heading-family,var(--font-geist-sans))] [font-weight:var(--type-heading-weight,600)] [text-transform:var(--type-heading-transform,uppercase)] [letter-spacing:var(--type-heading-tracking,0.2em)] text-[length:calc(1rem*var(--type-heading-scale,1))] sm:text-[length:calc(1.125rem*var(--type-heading-scale,1))] md:text-[length:calc(1.25rem*var(--type-heading-scale,1))] leading-snug";

/** Petit texte en capitales espacées (sur-titres, catégories). */
export const eyebrow = "text-xs uppercase tracking-[0.3em] text-neutral-500";
