"use client";

// Rend les textes du site et la langue de la page disponibles dans les composants
// qui tournent dans le navigateur (menu, bouton Back…). Ils viennent de app/[lang]/layout.tsx.

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, localizeHref, type Locale } from "../lib/i18n";
import { DEFAULT_TEXTS, type Texts } from "../lib/texts-defaults";

const TextsContext = createContext<{ texts: Texts; locale: Locale }>({
  texts: DEFAULT_TEXTS,
  locale: DEFAULT_LOCALE,
});

export function TextsProvider({
  texts,
  locale,
  children,
}: {
  texts: Texts;
  locale: Locale;
  children: ReactNode;
}) {
  return <TextsContext.Provider value={{ texts, locale }}>{children}</TextsContext.Provider>;
}

/** Textes du site (dans un composant "use client"). */
export function useTexts() {
  return useContext(TextsContext).texts;
}

/** Langue de la page (dans un composant "use client"). */
export function useLocale() {
  return useContext(TextsContext).locale;
}

/** Adresse d'une page dans la langue en cours : href("/about") -> "/fr/about" en français. */
export function useLocalizedHref() {
  const locale = useLocale();
  return (href: string) => localizeHref(href, locale);
}
