"use client";

// Protection des images contre l'enregistrement facile par les visiteurs :
// - clic droit sur une image : pas de menu ("Enregistrer l'image sous…") ;
// - glisser une image vers le bureau : bloqué.
// L'appui long sur téléphone et la sélection sont bloqués en CSS (app/globals.css).
// Limite : une capture d'écran ou les outils de développement du navigateur restent
// toujours possibles ; c'est une protection contre les gestes courants, pas absolue.

import { useEffect } from "react";

/** true si l'élément visé est une image (ou un aperçu d'image). */
function isImage(target: EventTarget | null) {
  return target instanceof Element && target.closest("img, picture, video, [data-protect-image]") !== null;
}

export default function ImageGuard() {
  useEffect(() => {
    const block = (event: Event) => {
      if (isImage(event.target)) event.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}
