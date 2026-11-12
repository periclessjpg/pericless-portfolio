// MODE ÉDITION LOCAL : points d'entrée des outils d'édition dans les pages.
//
// En développement (`npm run dev`), ces composants chargent et affichent la tuile
// de dépôt et la bannière. Sur le site publié (production), ils renvoient null :
// le code de l'interface d'édition n'est ni rendu ni chargé.

import type { DevDropZoneProps } from "./DevDropZone";

/** Tuile "Drop images here" (développement uniquement). */
export async function DevDropZoneSlot(props: DevDropZoneProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevDropZone } = await import("./DevDropZone");
    return <DevDropZone {...props} />;
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
