// MODE ÉDITION LOCAL : points d'entrée des outils d'édition dans les pages.
//
// En développement (`npm run dev`), ces composants chargent et affichent la tuile
// de dépôt et la bannière. Sur le site publié (production), ils renvoient null :
// le code de l'interface d'édition n'est ni rendu ni chargé.

import type { DevCardPickerProps } from "./DevCardPicker";
import type { DevDropZoneProps } from "./DevDropZone";
import type { DevFramingProps } from "./DevFraming";
import type { DevHeroPanelProps } from "./DevHeroPanel";
import type { DevReorderProps } from "./DevReorder";
import type { DevTextEditorProps } from "./DevTextEditor";
import type { DevTypographyPanelProps } from "./DevTypographyPanel";

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

/** Bouton "Reorder" et panneau de vignettes à glisser (développement uniquement). */
export async function DevReorderSlot(props: DevReorderProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevReorder } = await import("./DevReorder");
    return <DevReorder {...props} />;
  }
  return null;
}

/** Modification des textes sur la page (développement uniquement). */
export async function DevTextEditorSlot(props: DevTextEditorProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevTextEditor } = await import("./DevTextEditor");
    return <DevTextEditor {...props} />;
  }
  return null;
}

/** Panneau "Typography" (développement uniquement). */
export async function DevTypographyPanelSlot(props: DevTypographyPanelProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevTypographyPanel } = await import("./DevTypographyPanel");
    return <DevTypographyPanel {...props} />;
  }
  return null;
}

/** Bouton "Choose image" sur une carte (développement uniquement). */
export async function DevCardPickerSlot(props: DevCardPickerProps) {
  if (process.env.NODE_ENV === "development") {
    const { default: DevCardPicker } = await import("./DevCardPicker");
    return <DevCardPicker {...props} />;
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
