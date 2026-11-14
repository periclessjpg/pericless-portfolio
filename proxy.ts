// Choix de la langue, avant l'affichage de chaque page.
//
// - /fr/… : version française, affichée telle quelle.
// - /en/… : redirigé vers la même adresse sans /en (l'anglais n'a pas de préfixe).
// - toute autre adresse (/about…) : version anglaise (dossier app/[lang]/ avec lang = "en"),
//   SAUF si le visiteur préfère le français : il est alors envoyé vers /fr/….
//   Préférence : le choix fait avec le sélecteur de langue (cookie "lang"),
//   sinon la langue de son navigateur.
// Les images, polices, fichiers (cv.pdf…) et adresses /api ne passent pas par ici.

import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./app/lib/i18n";

/** Langue préférée du navigateur parmi celles du site (en-tête Accept-Language). */
function browserLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const languages = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { lang } of languages) {
    if (isLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // /en/about -> /about
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url);
  }

  // /fr/… : rien à faire.
  if (isLocale(first)) return NextResponse.next();

  // Adresse sans langue : langue choisie (cookie), sinon celle du navigateur.
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred = isLocale(cookie) ? cookie : browserLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  if (preferred !== DEFAULT_LOCALE) {
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Toutes les adresses sauf /api, les fichiers internes de Next.js et les fichiers
  // avec une extension (images, polices, cv.pdf, favicon.ico…).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
