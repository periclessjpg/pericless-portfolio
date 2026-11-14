"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, localizeHref, stripLocale, type Locale } from "../lib/i18n";
import { useLocale, useTexts } from "./TextsProvider";
import { focusRing } from "./styles";

/** Retient la langue choisie pendant un an (sinon la langue du navigateur est utilisée). */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * Sélecteur de langue (barre du haut) : seulement l'autre langue,
 * police des textes courants, en capitales et en gris clair (« FR » sur le site anglais, « EN » sur le site français).
 * Reste sur la même page, dans l'autre langue (/about <-> /fr/about).
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTexts();
  const { path } = stripLocale(pathname);
  const other = LOCALES.find((l) => l !== locale) ?? locale;

  return (
    <Link
      href={localizeHref(path, other)}
      // Pas de préchargement : la langue doit être retenue avant d'ouvrir la page.
      prefetch={false}
      hrefLang={other}
      lang={other}
      aria-label={LOCALE_LABELS[other].name}
      title={t["nav.language"]}
      onClick={() => rememberLocale(other)}
      // Police des textes courants (rôle « body » du panneau Typography), en capitales espacées.
      className={`[font-family:var(--type-body-family,var(--font-geist-sans))] [font-weight:var(--type-body-weight,400)] text-xs uppercase tracking-[0.2em] sm:text-base text-neutral-300 transition-colors duration-300 hover:text-neutral-100 ${focusRing} ${className}`}
    >
      {LOCALE_LABELS[other].short}
    </Link>
  );
}
