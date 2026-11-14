// Cadrage des images recadrées : un cadrage pour ordinateur ("position" de infos.json)
// et, si tu l'as réglé, un cadrage propre aux téléphones ("positionMobile").
// Les téléphones = écrans de moins de 768 px de large (même limite que la mise en page, "md").
// (Aucun accès aux fichiers ici : ce module sert aussi dans le navigateur.)

import type { CSSProperties } from "react";

/** Largeur d'écran (px) en dessous de laquelle on est "sur téléphone". */
export const PHONE_MAX_WIDTH = 767;

/** Classe à ajouter à l'image : cadrage téléphone, puis cadrage ordinateur à partir de 768 px. */
export const framingClass = "[object-position:var(--pos-m)] md:[object-position:var(--pos)]";

/** Variables CSS du cadrage ; sans cadrage téléphone, le téléphone reprend celui de l'ordinateur. */
export function framingStyle(position?: string, positionMobile?: string): CSSProperties {
  const desktop = position ?? "50% 50%";
  return { "--pos": desktop, "--pos-m": positionMobile ?? desktop } as CSSProperties;
}
