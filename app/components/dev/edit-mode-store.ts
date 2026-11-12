// MODE ÉDITION LOCAL : retient si les outils d'édition sont affichés ou masqués
// (interrupteur de la bannière "Local edit mode"). Mémorisé dans le navigateur.

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "dev-edit-tools-hidden";
const CHANGE_EVENT = "dev-edit-tools-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getVisible() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

export function setToolsVisible(visible: boolean) {
  try {
    if (visible) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Stockage indisponible : l'interrupteur fonctionne quand même jusqu'au rechargement.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** true si les outils d'édition doivent être affichés. */
export function useToolsVisible() {
  return useSyncExternalStore(subscribe, getVisible, () => true);
}
