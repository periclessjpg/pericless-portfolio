// MODE ÉDITION LOCAL : retient si les outils d'édition sont affichés ou masqués
// (interrupteur de la bannière "Local edit mode"). Mémorisé dans le navigateur.

import { useSyncExternalStore } from "react";
import { PHONE_MAX_WIDTH } from "../../lib/framing";

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

// ───────────── Mode téléphone ─────────────
// Les outils (cadrage, hero) enregistrent les réglages "téléphone" quand la page est affichée
// sur un écran étroit : dans l'aperçu téléphone de la bannière, ou sur un vrai téléphone.


const PHONE_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)`;

function subscribePhone(callback: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** true si la page est affichée à la taille d'un téléphone (moins de 768 px de large). */
export function useIsPhone() {
  return useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);
}

/** true si cette page est affichée dans l'aperçu téléphone (cadre de la bannière). */
export function useInPhonePreview() {
  return useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top,
    () => false,
  );
}
