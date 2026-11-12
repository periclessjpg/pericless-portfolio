"use client";

// Rend les textes du site disponibles dans les composants qui tournent dans le
// navigateur (menu, bouton Back…). Les textes viennent de app/layout.tsx.

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_TEXTS, type Texts } from "../lib/texts-defaults";

const TextsContext = createContext<Texts>(DEFAULT_TEXTS);

export function TextsProvider({ texts, children }: { texts: Texts; children: ReactNode }) {
  return <TextsContext.Provider value={texts}>{children}</TextsContext.Provider>;
}

/** Textes du site (dans un composant "use client"). */
export function useTexts() {
  return useContext(TextsContext);
}
