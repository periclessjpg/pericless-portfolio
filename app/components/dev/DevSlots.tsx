// MODE ÉDITION LOCAL : points d'entrée des outils d'édition dans les pages.
//
// En développement (`npm run dev`), ces composants chargent et affichent la tuile
// de dépôt et la bannière. Sur le site publié (production), ils renvoient null :
// le code de l'interface d'édition n'est ni rendu ni chargé.

import type { DevDropZoneProps } from "./DevDropZone";
import type { DevFramingProps } from "./DevFraming";
import type { DevHeroPanelProps } from "./DevHeroPanel";

/** Tuile "Drop images here" (développement uniquement). */
export async function DevDropZoneSlot(props: DevDropZoneProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevDropZone } = await import("./DevDropZone");
    return <DevDropZone {...props} />;
  }
  return null;
}

/** Bouton "Adjust framing" sur une image recadrée (développement uniquement). */
export async function DevFramingSlot(props: DevFramingProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevFraming } = await import("./DevFraming");
    return <DevFraming {...props} />;
  }
  return null;
}

/** Panneau "Customize hero" de l'accueil (développement uniquement). */
export async function DevHeroPanelSlot(props: DevHeroPanelProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevHeroPanel } = await import("./DevHeroPanel");
    return <DevHeroPanel {...props} />;
  }
  return null;
}

/** Bannière "Local edit mode" (développement uniquement). */
export async function DevEditBannerSlot() {
  if (process.env.NODE_ENV === "development") {
    const { default: DevEditBanner } = await import("./DevEditBanner");
    return <DevEditBanner />;
  }
  return null;
}
