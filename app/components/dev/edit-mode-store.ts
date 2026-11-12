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

// ───────────── Mode "Edit texts" : un clic sur un texte l'ouvre pour le modifier ─────────────

const TEXT_MODE_KEY = "dev-edit-texts-on";

function getTextMode() {
  try {
    return localStorage.getItem(TEXT_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTextMode(on: boolean) {
  try {
    if (on) localStorage.setItem(TEXT_MODE_KEY, "1");
    else localStorage.removeItem(TEXT_MODE_KEY);
  } catch {
    // Stockage indisponible : l'interrupteur fonctionne quand même jusqu'au rechargement.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** true si le mode "Edit texts" est activé (désactivé par défaut, pour pouvoir naviguer). */
export function useTextMode() {
  return useSyncExternalStore(subscribe, getTextMode, () => false);
}
